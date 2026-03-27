import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import FilterBar from "../ components/FilterBar";
import MortalityTable from "../ components/MortalityTable";
import RankList from "../ components/RankList";
import SummaryCards from "../ components/SummaryCards";
import { getSummary, getTable } from "../ api/mortality";
import { Filters } from "../types";

export default function SummaryPage() {
  const [filters, setFilters] = useState<Filters>({ page: 1, pageSize: 20 });

  const { data: summary } = useQuery({ queryKey: ["summary", filters], queryFn: () => getSummary(filters) });
  const { data: table } = useQuery({ queryKey: ["table", filters], queryFn: () => getTable(filters) });

  return (
    <div className="space-y-6">
      <FilterBar filters={filters} onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch, page: 1 }))} />
      <SummaryCards summary={summary} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RankList title="Top 10 Highest Mortality" items={summary?.top10Highest || []} />
        <RankList title="Top 10 Lowest Mortality" items={summary?.top10Lowest || []} />
      </div>
      <MortalityTable table={table} page={filters.page || 1} onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))} />
    </div>
  );
}