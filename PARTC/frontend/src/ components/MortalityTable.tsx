export default function MortalityTable({ table, page, onPageChange }: { table: any; page: number; onPageChange: (page: number) => void }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 overflow-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
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
          {table?.data?.map((row: any) => (
            <tr key={`${row.facilityId}-${row.measureId}-${row.startDate}`} className="border-b">
              <td className="p-2">{row.facilityName}</td>
              <td className="p-2">{row.state}</td>
              <td className="p-2">{row.zipCode}</td>
              <td className="p-2">{row.measureName}</td>
              <td className="p-2">{row.mortalityRate ?? "-"}</td>
              <td className="p-2">{row.year ?? "-"}</td>
              <td className="p-2">{row.month ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between mt-4">
        <button className="border rounded-xl px-3 py-2" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>Prev</button>
        <div>Page {table?.page ?? page}</div>
        <button className="border rounded-xl px-3 py-2" disabled={(table?.page ?? 1) * (table?.pageSize ?? 20) >= (table?.total ?? 0)} onClick={() => onPageChange(page + 1)}>Next</button>
      </div>
    </div>
  );
}