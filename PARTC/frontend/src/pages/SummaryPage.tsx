import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import FilterBar from "../components/FilterBar";
import MortalityTable from "../components/MortalityTable";
import RankList from "../components/RankList";
import SummaryCards from "../components/SummaryCards";
import { getExportUrl, getSummary, getTable } from "../api/mortality";
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
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-slate-600">Total Rows: {table?.total ?? 0}</div>
        <a className="border rounded-xl px-3 py-2 text-sm" href={getExportUrl(filters)}>
          Export CSV
        </a>
        <label className="text-sm">
          Page Size{" "}
          <select
            className="border rounded-xl p-2 ml-2"
            value={filters.pageSize ?? 20}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                page: 1,
                pageSize: Number(e.target.value),
              }))
            }
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </label>
      </div>
      {table && table.total === 0 ? (
        <div className="bg-white rounded-2xl shadow p-4 text-sm text-slate-600">
          No rows found for current filters. Try clearing Month/ZIP/Facility Name or using fewer conditions.
        </div>
      ) : null}
      <MortalityTable
        table={table}
        page={filters.page || 1}
        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
        anomalyThreshold={summary?.anomalyThreshold}
      />
    </div>
  );
}