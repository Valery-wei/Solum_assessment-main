export type Filters = {
  year?: number;
  month?: number;
  state?: string;
  zipCode?: string;
  facilityName?: string;
  page?: number;
  pageSize?: number;
  states?: string[];
};

export type RankedFacility = {
  facilityId: string;
  facilityName: string;
  state: string;
  zipCode: string;
  mortalityRate: number | null;
};

export type SummaryResponse = {
  total: number;
  avgMortality: number | null;
  minMortality: number | null;
  maxMortality: number | null;
  anomalyThreshold: number | null;
  top10Highest: RankedFacility[];
  top10Lowest: RankedFacility[];
};

export type AnalysisBucket = {
  key: string;
  avgMortality: number;
};

export type DistributionBucket = {
  label: string;
  count: number;
};

export type TableRow = RankedFacility & {
  measureId: string;
  measureName: string;
  startDate: string | null;
  year: number | null;
  month: number | null;
};

export type AnalysisResponse = {
  monthlyTrend: AnalysisBucket[];
  byState: AnalysisBucket[];
  byZip: AnalysisBucket[];
  distribution: DistributionBucket[];
  ranking: TableRow[];
  benchmarks: {
    nationalAvg: number | null;
    comparisonSource: "selected" | "default_top5";
    stateComparisons: Array<{
      state: string;
      avgMortality: number | null;
      count: number;
      deltaFromNational: number | null;
    }>;
  };
};

export type TableResponse = {
  data: TableRow[];
  page: number;
  pageSize: number;
  total: number;
};

export type FilterOptionsResponse = {
  years: number[];
  months: number[];
  states: string[];
  currentTotal: number;
};