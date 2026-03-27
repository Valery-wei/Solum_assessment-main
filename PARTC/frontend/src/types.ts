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
  avgMortality: number;
  minMortality: number;
  maxMortality: number;
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

export type AnalysisResponse = {
  monthlyTrend: AnalysisBucket[];
  byState: AnalysisBucket[];
  byZip: AnalysisBucket[];
  distribution: DistributionBucket[];
};