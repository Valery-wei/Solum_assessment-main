import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import FilterBar from "../components/FilterBar";
import RankingTable from "../components/RankingTable";
import StateComparisonPanel from "../components/StateComparisonPanel";
import DistributionChart from "../components/charts/DistributionChart";
import MonthlyTrendChart from "../components/charts/MonthlyTrendChart";
import StateBarChart from "../components/charts/StateBarChart";
import ZipBarChart from "../components/charts/ZipBarChart";
import { getAnalysis, getExportUrl } from "../api/mortality";
import { Filters } from "../types";

export default function AnalysisPage() {
  const [filters, setFilters] = useState<Filters>({});
  const { data } = useQuery({ queryKey: ["analysis", filters], queryFn: () => getAnalysis(filters) });

  const empty =
    data &&
    data.monthlyTrend.length === 0 &&
    data.byState.length === 0 &&
    data.byZip.length === 0 &&
    data.ranking.length === 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="section-title">Visual Analysis</h2>
        <p className="text-sm text-slate-600">
          Aggregated results for current filters: multi-state comparison, monthly trend, state/ZIP charts, distribution, and facility ranking.
        </p>
        <div className="mt-2">
          <a className="border rounded-xl px-3 py-2 text-sm" href={getExportUrl(filters)}>
            Export Filtered CSV
          </a>
        </div>
      </div>

      <FilterBar
        filters={filters}
        onChange={(patch: Partial<Filters>) => setFilters((prev) => ({ ...prev, ...patch }))}
      />

      {empty ? (
        <div className="bg-white rounded-2xl shadow p-4 text-sm text-slate-600">
          No analysis data for current filters. Try adjusting month, ZIP code, facility name, or state filters.
        </div>
      ) : null}

      {data && !empty && (
        <>
          <section className="space-y-3">
            <h3 className="section-title">1. Multi-State vs National</h3>
            <StateComparisonPanel
              nationalAvg={data.benchmarks.nationalAvg ?? null}
              items={data.benchmarks.stateComparisons ?? []}
              comparisonSource={data.benchmarks.comparisonSource ?? "default_top5"}
            />
          </section>

          <section className="space-y-3">
            <h3 className="section-title">2. Monthly Mortality Trend</h3>
            <MonthlyTrendChart data={data?.monthlyTrend ?? []} />
          </section>

          <section className="space-y-3">
            <h3 className="section-title">3. Mortality by State and ZIP Code</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StateBarChart data={data?.byState ?? []} />
              <ZipBarChart data={data?.byZip ?? []} />
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="section-title">4. Mortality Distribution (Bucketed Histogram)</h3>
            <DistributionChart data={data?.distribution ?? []} />
          </section>

          <section className="space-y-3">
            <h3 className="section-title">5. Facility Ranking Table</h3>
            <RankingTable
              rows={data?.ranking ?? []}
              anomalyThreshold={
                data?.benchmarks.nationalAvg !== null && data?.benchmarks.nationalAvg !== undefined
                  ? Number((data.benchmarks.nationalAvg * 1.25).toFixed(4))
                  : null
              }
            />
          </section>
        </>
      )}
    </div>
  );
}
