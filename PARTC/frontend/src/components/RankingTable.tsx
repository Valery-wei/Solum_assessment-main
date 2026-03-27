import type { TableRow } from "../types";

type Props = {
  rows: TableRow[];
  title?: string;
  anomalyThreshold?: number | null;
};

export default function RankingTable({ rows, title = "Facility Ranking Table", anomalyThreshold }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 overflow-auto">
      <h3 className="font-semibold mb-3">{title}</h3>
      <p className="text-sm text-slate-600 mb-3">
        Sorted by mortality rate descending, showing up to 100 rows for current filters.
      </p>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2 w-10">#</th>
            <th className="p-2">Facility</th>
            <th className="p-2">State</th>
            <th className="p-2">ZIP</th>
            <th className="p-2">Measure</th>
            <th className="p-2">Mortality</th>
            <th className="p-2">Year</th>
            <th className="p-2">Month</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={8} className="p-4 text-slate-500">
                No data. Please adjust filters.
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr key={`${row.facilityId}-${row.measureId}-${row.startDate}-${idx}`} className="border-b">
                <td className="p-2 text-slate-500">{idx + 1}</td>
                <td className="p-2 font-medium">{row.facilityName}</td>
                <td className="p-2">{row.state}</td>
                <td className="p-2">{row.zipCode}</td>
                <td className="p-2 max-w-xs truncate" title={row.measureName}>
                  {row.measureName}
                </td>
                <td className={`p-2 font-semibold ${row.mortalityRate !== null && anomalyThreshold != null && row.mortalityRate >= anomalyThreshold ? "anomaly-cell" : ""}`}>
                  {row.mortalityRate ?? "-"}
                </td>
                <td className="p-2">{row.year ?? "-"}</td>
                <td className="p-2">{row.month ?? "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
