import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function StateBarChart({ data }: { data: any[] }) {
  const chartData = data.slice(0, 20).map((d) => ({ label: d.key, value: d.avgMortality }));
  return (
    <div className="bg-white rounded-2xl shadow p-4 h-96">
      <h3 className="font-semibold mb-3">By State</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}