import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function ZipBarChart({ data }: { data: { key: string; avgMortality: number }[] }) {
  const chartData = data.slice(0, 20).map((d) => ({ label: d.key, value: d.avgMortality }));
  return (
    <div className="bg-white rounded-2xl shadow p-4 chart-box">
      <h3 className="font-semibold mb-1">Mortality by ZIP Code</h3>
      <p className="text-sm text-slate-600 mb-3">Top 20 ZIP codes by average mortality rate.</p>
      <div className="chart-inner">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip
              formatter={(v: unknown) => [
                typeof v === "number" ? v.toFixed(4) : String(v ?? ""),
                "Average Mortality",
              ]}
            />
            <Bar dataKey="value" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}