import pandas as pd
import numpy as np
import statsmodels.api as sm
import statsmodels.formula.api as smf

df = pd.read_csv("bmw_global_sales_2018_2025.csv")

df["Date"] = pd.to_datetime(dict(year=df["Year"], month=df["Month"], day=1))
df = df.sort_values(["Region", "Model", "Date"]).reset_index(drop=True)

num_cols = [
    "Units_Sold", "Avg_Price_EUR", "Revenue_EUR",
    "BEV_Share", "Premium_Share", "GDP_Growth", "Fuel_Price_Index"
]
for col in num_cols:
    df[col] = pd.to_numeric(df[col], errors="coerce")

df = df.dropna(subset=[
    "Date", "Year", "Month", "Region", "Model",
    "Units_Sold", "Avg_Price_EUR", "Revenue_EUR",
    "BEV_Share", "GDP_Growth", "Fuel_Price_Index"
])

region_month = (
    df.groupby(["Date", "Year", "Month", "Region"], as_index=False)
      .agg({
          "Units_Sold": "sum",
          "Revenue_EUR": "sum",
          "BEV_Share": "mean",
          "Premium_Share": "mean",
          "GDP_Growth": "mean",
          "Fuel_Price_Index": "mean"
      })
)

results_A = []
for region, g in region_month.groupby("Region"):
    g = g.sort_values("Date").copy()
    g["time_index"] = np.arange(len(g))
    corr_units = g["BEV_Share"].corr(g["Units_Sold"])
    corr_revenue = g["BEV_Share"].corr(g["Revenue_EUR"])
    trend_model = sm.OLS(g["BEV_Share"], sm.add_constant(g["time_index"])).fit()
    results_A.append({
        "Region": region,
        "Corr_BEV_Units": corr_units,
        "Corr_BEV_Revenue": corr_revenue,
        "BEV_Trend_Slope": trend_model.params["time_index"],
        "Latest_BEV_Share": g["BEV_Share"].iloc[-1]
    })

results_A = pd.DataFrame(results_A).sort_values(
    ["BEV_Trend_Slope", "Latest_BEV_Share"], ascending=False
)

print("QUESTION A")
print(results_A)
print("Strongest electrification transition region:", results_A.iloc[0]["Region"])

df_b = df[(df["Units_Sold"] > 0) & (df["Avg_Price_EUR"] > 0)].copy()
df_b["log_units"] = np.log(df_b["Units_Sold"])
df_b["log_price"] = np.log(df_b["Avg_Price_EUR"])
df_b["GDP_Group"] = pd.qcut(df_b["GDP_Growth"], q=3, labels=["Low", "Medium", "High"])

elasticity_rows = []
gdp_variation_rows = []

for model_name, g in df_b.groupby("Model"):
    if len(g) < 24:
        continue

    formula_all = "log_units ~ log_price + C(Region) + C(Month) + C(Year)"
    reg_all = smf.ols(formula_all, data=g).fit()

    elasticity_rows.append({
        "Model": model_name,
        "Elasticity": reg_all.params.get("log_price", np.nan),
        "P_Value": reg_all.pvalues.get("log_price", np.nan),
        "Adj_R2": reg_all.rsquared_adj,
        "Obs": len(g)
    })

    formula_gdp = "log_units ~ log_price * C(GDP_Group) + C(Region) + C(Month) + C(Year)"
    reg_gdp = smf.ols(formula_gdp, data=g).fit()

    base = reg_gdp.params.get("log_price", np.nan)
    base_p = reg_gdp.pvalues.get("log_price", np.nan)

    elasticity_low = base
    p_low = base_p

    elasticity_medium = base + reg_gdp.params.get("log_price:C(GDP_Group)[T.Medium]", 0.0)
    elasticity_high = base + reg_gdp.params.get("log_price:C(GDP_Group)[T.High]", 0.0)

    gdp_variation_rows.append({
        "Model": model_name,
        "Elasticity_LowGDP": elasticity_low,
        "P_LowGDP": p_low,
        "Elasticity_MediumGDP": elasticity_medium,
        "P_Interaction_Medium": reg_gdp.pvalues.get("log_price:C(GDP_Group)[T.Medium]", np.nan),
        "Elasticity_HighGDP": elasticity_high,
        "P_Interaction_High": reg_gdp.pvalues.get("log_price:C(GDP_Group)[T.High]", np.nan),
        "Adj_R2": reg_gdp.rsquared_adj,
        "Obs": len(g)
    })

overall_elasticity = pd.DataFrame(elasticity_rows).sort_values(
    by="Elasticity", key=lambda s: s.abs(), ascending=False
)
gdp_variation = pd.DataFrame(gdp_variation_rows)

print("\nQUESTION B")
print("Overall model-level price elasticity with controls")
print(overall_elasticity)

top_models = overall_elasticity.head(5)["Model"].tolist()
print("\nGDP regime variation for top models")
print(gdp_variation[gdp_variation["Model"].isin(top_models)].sort_values("Model"))

season_df = (
    df.groupby(["Region", "Month"], as_index=False)
      .agg({
          "Units_Sold": "mean",
          "Revenue_EUR": "mean",
          "GDP_Growth": "mean",
          "Fuel_Price_Index": "mean"
      })
)

panel_df = (
    df.groupby(["Date", "Year", "Month", "Region"], as_index=False)
      .agg({
          "Units_Sold": "sum",
          "Revenue_EUR": "sum",
          "GDP_Growth": "mean",
          "Fuel_Price_Index": "mean"
      })
)

units_formula = (
    "Units_Sold ~ C(Month) + C(Region) + C(Year) + GDP_Growth + Fuel_Price_Index "
    "+ C(Month):GDP_Growth + C(Month):Fuel_Price_Index"
)
units_model = smf.ols(units_formula, data=panel_df).fit()

revenue_formula = (
    "Revenue_EUR ~ C(Month) + C(Region) + C(Year) + GDP_Growth + Fuel_Price_Index "
    "+ C(Month):GDP_Growth + C(Month):Fuel_Price_Index"
)
revenue_model = smf.ols(revenue_formula, data=panel_df).fit()

season_summary = []
for region, g in panel_df.groupby("Region"):
    month_units = g.groupby("Month")["Units_Sold"].mean()
    month_revenue = g.groupby("Month")["Revenue_EUR"].mean()
    season_summary.append({
        "Region": region,
        "Peak_Month_Units": month_units.idxmax(),
        "Low_Month_Units": month_units.idxmin(),
        "Peak_Month_Revenue": month_revenue.idxmax(),
        "Low_Month_Revenue": month_revenue.idxmin()
    })

season_summary = pd.DataFrame(season_summary)

print("\nQUESTION C")
print("Monthly seasonal averages by region")
print(season_df.sort_values(["Region", "Month"]))

print("\nUnits model coefficients and p-values")
print(pd.DataFrame({
    "coef": units_model.params,
    "p_value": units_model.pvalues
}))

print("\nRevenue model coefficients and p-values")
print(pd.DataFrame({
    "coef": revenue_model.params,
    "p_value": revenue_model.pvalues
}))

print("\nSeason summary")
print(season_summary)
with open("units_summary.txt", "w") as f:
    f.write(units_model.summary().as_text())

with open("revenue_summary.txt", "w") as f:
    f.write(revenue_model.summary().as_text())