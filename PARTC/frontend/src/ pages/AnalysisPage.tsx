import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import FilterBar from "../ components/FilterBar";
import DistributionChart from "../ components/charts/DistributionChart";
import MonthlyTrendChart from "../ components/charts/MonthlyTrendChart";
import StateBarChart from "../ components/charts/StateBarChart";
import ZipBarChart from "../ components/charts/ZipBarChart";
import { getAnalysis } from "../ api/mortality";
import { Filters } from "../types";

export default function AnalysisPage() {
  const [filters, setFilters] = useState<Filters>({});
  const { data } = useQuery({ queryKey: ["analysis", filters], queryFn: () => getAnalysis(filters) });

  return (
    <div className="space-y-6">
      <FilterBar
        filters={filters}
        onChange={(patch: Partial<Filters>) =>
            setFilters((prev) => ({ ...prev, ...patch }))
        }
      />
      <MonthlyTrendChart data={data?.monthlyTrend || []} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StateBarChart data={data?.byState || []} />
        <ZipBarChart data={data?.byZip || []} />
      </div>
      <DistributionChart data={data?.distribution || []} />
    </div>
  );
}