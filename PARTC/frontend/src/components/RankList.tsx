export default function RankList({ title, items }: { title: string; items: any[] }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h3 className="font-semibold mb-3">{title}</h3>
      <div className="space-y-2">
        {items?.map((item, idx) => (
          <div key={`${item.facilityId}-${idx}`} className="flex justify-between border-b pb-2 text-sm">
            <div>
              <div className="font-medium">{idx + 1}. {item.facilityName}</div>
              <div className="text-slate-500">{item.state} · {item.zipCode}</div>
            </div>
            <div className="font-semibold">{item.mortalityRate ?? "-"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}