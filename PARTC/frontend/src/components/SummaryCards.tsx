export default function SummaryCards({ summary }: { summary: any }) {
  const cards = [
    { label: "Facilities", value: summary?.total ?? "-" },
    { label: "Average Mortality", value: summary?.avgMortality ?? "-" },
    { label: "Min Mortality", value: summary?.minMortality ?? "-" },
    { label: "Max Mortality", value: summary?.maxMortality ?? "-" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-2xl shadow p-4">
          <div className="text-sm text-slate-500">{card.label}</div>
          <div className="text-2xl font-semibold mt-2">{card.value}</div>
        </div>
      ))}
    </div>
  );
}