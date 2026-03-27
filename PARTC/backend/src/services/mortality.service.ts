import { FilterParams, MortalityRecord, RawCmsRow } from "../types.js";
import { applyFilters, paginate } from "../utils/filters.js";
import {
  extractYearMonth,
  isMortalityMeasure,
  normalizeZip,
  parseDate,
  parseNumber,
  safeString,
} from "../utils/parsers.js";
import { fetchCmsRows } from "./cms.service.js";

let cache: MortalityRecord[] | null = null;
let cacheAt = 0;
const TTL_MS = 1000 * 60 * 30;

function mapRow(row: RawCmsRow): MortalityRecord | null {
  const measureName = safeString(row.measure_name);
  if (!measureName || !isMortalityMeasure(measureName)) return null;

  const startDate = parseDate(row.start_date);
  const { year, month } = extractYearMonth(startDate);

  return {
    facilityId: safeString(row.facility_id),
    facilityName: safeString(row.facility_name),
    address: safeString(row.address),
    city: safeString(row.city_town),
    state: safeString(row.state),
    zipCode: normalizeZip(row.zip_code),
    county: safeString(row.county_parish),
    phone: safeString(row.telephone_number),
    measureId: safeString(row.measure_id),
    measureName,
    comparedToNational: safeString(row.compared_to_national),
    denominator: parseNumber(row.denominator),
    mortalityRate: parseNumber(row.score),
    lowerEstimate: parseNumber(row.lower_estimate),
    higherEstimate: parseNumber(row.higher_estimate),
    startDate,
    endDate: parseDate(row.end_date),
    year,
    month,
  };
}

async function getAllMortalityRecords(): Promise<MortalityRecord[]> {
  const now = Date.now();
  if (cache && now - cacheAt < TTL_MS) return cache;

  const rows = await fetchCmsRows();
  cache = rows.map(mapRow).filter((x): x is MortalityRecord => Boolean(x));
  cacheAt = now;
  return cache;
}

function validRates(data: MortalityRecord[]) {
  return data.filter((d) => d.mortalityRate !== null);
}

export async function getSummary(filters: FilterParams) {
  const all = await getAllMortalityRecords();
  const filtered = applyFilters(all, filters);
  const rated = validRates(filtered);

  const sorted = [...rated].sort(
    (a, b) => (a.mortalityRate ?? Infinity) - (b.mortalityRate ?? Infinity)
  );
  const rates = rated.map((r) => r.mortalityRate as number);
  const total = filtered.length;

  return {
    total,
    avgMortality: rates.length
      ? Number((rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(4))
      : null,
    minMortality: rates.length ? Math.min(...rates) : null,
    maxMortality: rates.length ? Math.max(...rates) : null,
    top10Highest: [...sorted].reverse().slice(0, 10),
    top10Lowest: sorted.slice(0, 10),
  };
}

export async function getTable(filters: FilterParams) {
  const all = await getAllMortalityRecords();
  const filtered = applyFilters(all, filters).sort((a, b) => {
    const byRate = (b.mortalityRate ?? -Infinity) - (a.mortalityRate ?? -Infinity);
    if (byRate !== 0) return byRate;
    return a.facilityName.localeCompare(b.facilityName);
  });

  return paginate(filtered, filters.page || 1, filters.pageSize || 20);
}

function averageBy<T extends string | number>(
  data: MortalityRecord[],
  keyGetter: (r: MortalityRecord) => T | null
) {
  const map = new Map<T, { sum: number; count: number }>();

  for (const row of data) {
    const key = keyGetter(row);
    if (key === null || row.mortalityRate === null) continue;

    const current = map.get(key) || { sum: 0, count: 0 };
    current.sum += row.mortalityRate;
    current.count += 1;
    map.set(key, current);
  }

  return [...map.entries()]
    .map(([key, value]) => ({
      key,
      avgMortality: Number((value.sum / value.count).toFixed(4)),
      count: value.count,
    }))
    .sort((a, b) => b.avgMortality - a.avgMortality);
}

export async function getAnalysis(filters: FilterParams) {
  const all = await getAllMortalityRecords();
  const filtered = applyFilters(all, filters);

  const monthlyTrend = averageBy(filtered, (r) =>
    r.year && r.month ? `${r.year}-${String(r.month).padStart(2, "0")}` : null
  );

  const byState = averageBy(filtered, (r) => (r.state ? r.state : null));
  const byZip = averageBy(filtered, (r) => (r.zipCode ? r.zipCode : null)).slice(0, 50);

  const bins = [
    { label: "< 8", min: -Infinity, max: 8 },
    { label: "8-10", min: 8, max: 10 },
    { label: "10-12", min: 10, max: 12 },
    { label: "12-14", min: 12, max: 14 },
    { label: ">= 14", min: 14, max: Infinity },
  ];

  const distribution = bins.map((bin) => ({
    label: bin.label,
    count: filtered.filter(
      (r) =>
        r.mortalityRate !== null &&
        r.mortalityRate >= bin.min &&
        r.mortalityRate < bin.max
    ).length,
  }));

  const ranking = filtered
    .filter((r) => r.mortalityRate !== null)
    .sort((a, b) => (b.mortalityRate as number) - (a.mortalityRate as number))
    .slice(0, 100);

  return {
    monthlyTrend,
    byState,
    byZip,
    distribution,
    ranking,
  };
}