import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function MonthlyTrendChart({ data }: { data: any[] }) {
  const chartData = data.map((d) => ({ label: d.key, value: d.avgMortality }));
  return (
    <div className="bg-white rounded-2xl shadow p-4 h-96">
      <h3 className="font-semibold mb-3">Monthly Trend</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}