import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Item = {
  state: string;
  avgMortality: number | null;
  count: number;
  deltaFromNational: number | null;
};

type Props = {
  nationalAvg: number | null;
  items: Item[];
  comparisonSource: "selected" | "default_top5";
};

export default function StateComparisonPanel({ nationalAvg, items, comparisonSource }: Props) {
  const chartRows = [
    ...(nationalAvg !== null && nationalAvg !== undefined
      ? [{ name: "National", value: nationalAvg as number, kind: "national" as const }]
      : []),
    ...items
      .filter((item) => item.avgMortality !== null && item.avgMortality !== undefined)
      .map((item) => ({
        name: item.state,
        value: item.avgMortality as number,
        kind: "state" as const,
      })),
  ];

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h3 className="font-semibold mb-1">Multi-State vs National Average</h3>
      <p className="text-sm text-slate-600 mb-3">
        {comparisonSource === "default_top5"
          ? "No state filter is applied — showing the top 5 states by average mortality vs the national average (same year/month/ZIP/facility filters)."
          : "Selected state(s) vs the national average under the same non-state filters."}{" "}
        To compare specific states, use the <strong>Compare States</strong> field (e.g. CA,TX,FL) or pick one state in the State dropdown.
      </p>
      <div className="text-sm mb-3">
        National average: <span className="font-semibold">{nationalAvg ?? "-"}</span>
      </div>

      {chartRows.length > 0 ? (
        <div className="chart-inner mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartRows} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(v: unknown) => [typeof v === "number" ? v.toFixed(4) : String(v ?? ""), "Avg mortality"]}
              />
              <Legend />
              <Bar dataKey="value" name="Average mortality">
                {chartRows.map((entry) => (
                  <Cell key={entry.name} fill={entry.kind === "national" ? "#64748b" : "#2563eb"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className="text-sm text-slate-600">No state-level data for comparison.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {items.map((item) => (
            <div key={item.state} className="border rounded-xl p-3">
              <div className="font-semibold">{item.state}</div>
              <div className="text-sm text-slate-600 mt-1">Avg: {item.avgMortality ?? "-"}</div>
              <div className="text-sm text-slate-600">Records: {item.count}</div>
              <div
                className={`text-sm ${item.deltaFromNational !== null && item.deltaFromNational > 0 ? "delta-up" : "delta-down"}`}
              >
                Delta vs national: {item.deltaFromNational ?? "-"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
