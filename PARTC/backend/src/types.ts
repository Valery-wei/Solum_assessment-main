export type RawCmsRow = {
  facility_id?: string;
  facility_name?: string;
  address?: string;
  city_town?: string;
  state?: string;
  zip_code?: string | number;
  county_parish?: string;
  telephone_number?: string;
  measure_id?: string;
  measure_name?: string;
  compared_to_national?: string;
  denominator?: string | number;
  score?: string | number;
  lower_estimate?: string | number;
  higher_estimate?: string | number;
  start_date?: string;
  end_date?: string;
};

export type MortalityRecord = {
  facilityId: string;
  facilityName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  county: string;
  phone: string;
  measureId: string;
  measureName: string;
  comparedToNational: string;
  denominator: number | null;
  mortalityRate: number | null;
  lowerEstimate: number | null;
  higherEstimate: number | null;
  startDate: string | null;
  endDate: string | null;
  year: number | null;
  month: number | null;
};

export type FilterParams = {
  year?: number;
  month?: number;
  state?: string;
  zipCode?: string;
  facilityName?: string;
  states?: string[];
  page?: number;
  pageSize?: number;
};