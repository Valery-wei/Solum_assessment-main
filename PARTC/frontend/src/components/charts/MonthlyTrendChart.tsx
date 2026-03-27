import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function MonthlyTrendChart({ data }: { data: { key: string; avgMortality: number }[] }) {
  const chartData = data.map((d) => ({ label: d.key, value: d.avgMortality }));
  return (
    <div className="bg-white rounded-2xl shadow p-4 chart-box">
      <h3 className="font-semibold mb-1">Monthly Mortality Trend</h3>
      <p className="text-sm text-slate-600 mb-3">X-axis: year-month (YYYY-MM), Y-axis: average mortality rate.</p>
      <div className="chart-inner">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip
              formatter={(v: unknown) => [
                typeof v === "number" ? v.toFixed(4) : String(v ?? ""),
                "Average Mortality",
              ]}
            />
            <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}