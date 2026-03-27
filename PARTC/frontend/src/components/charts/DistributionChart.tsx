import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function DistributionChart({ data }: { data: { label: string; count: number }[] }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 chart-box">
      <h3 className="font-semibold mb-1">Mortality Distribution (Buckets)</h3>
      <p className="text-sm text-slate-600 mb-3">X-axis: mortality-rate bucket, Y-axis: record count (histogram).</p>
      <div className="chart-inner">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip formatter={(v: unknown) => [typeof v === "number" ? v : String(v ?? ""), "Count"]} />
            <Bar dataKey="count" fill="#64748b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}