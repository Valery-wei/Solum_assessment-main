import { applyFilters, paginate } from "../utils/filters.js";
import { extractYearMonth, isMortalityMeasure, normalizeZip, parseDate, parseNumber, safeString, } from "../utils/parsers.js";
import { fetchCmsRows } from "./cms.service.js";
let cache = null;
let cacheAt = 0;
const TTL_MS = 1000 * 60 * 30;
const FILTER_CACHE_TTL_MS = 1000 * 60 * 5;
const filteredCache = new Map();
function mapRow(row) {
    const measureName = safeString(row.measure_name);
    if (!measureName || !isMortalityMeasure(measureName))
        return null;
    const startDate = parseDate(row.start_date);
    const { year, month } = extractYearMonth(row.start_date);
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
async function getAllMortalityRecords() {
    const now = Date.now();
    if (cache && now - cacheAt < TTL_MS)
        return cache;
    const rows = await fetchCmsRows();
    cache = rows.map(mapRow).filter((x) => Boolean(x));
    cacheAt = now;
    return cache;
}
function validRates(data) {
    return data.filter((d) => d.mortalityRate !== null);
}
function serializeFilters(filters) {
    const normalized = {
        ...filters,
        states: filters.states ? [...filters.states].sort() : undefined,
    };
    return JSON.stringify(normalized);
}
function getFilteredRecords(all, filters, scope = "default") {
    const now = Date.now();
    const key = `${cacheAt}:${scope}:${serializeFilters(filters)}`;
    const hit = filteredCache.get(key);
    if (hit && now - hit.at < FILTER_CACHE_TTL_MS)
        return hit.data;
    const data = applyFilters(all, filters);
    filteredCache.set(key, { at: now, data });
    return data;
}
function percentile(values, p) {
    if (!values.length)
        return null;
    const sorted = [...values].sort((a, b) => a - b);
    const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
    return sorted[idx];
}
function averageRate(data) {
    const rates = validRates(data).map((x) => x.mortalityRate);
    if (!rates.length)
        return null;
    return Number((rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(4));
}
export async function getSummary(filters) {
    const all = await getAllMortalityRecords();
    const filtered = getFilteredRecords(all, filters, "summary");
    const rated = validRates(filtered);
    const sorted = [...rated].sort((a, b) => (a.mortalityRate ?? Infinity) - (b.mortalityRate ?? Infinity));
    const rates = rated.map((r) => r.mortalityRate);
    const total = filtered.length;
    return {
        total,
        avgMortality: rates.length
            ? Number((rates.reduce((a, b) => a + b, 0) / rates.length).toFixed(4))
            : null,
        minMortality: rates.length ? Math.min(...rates) : null,
        maxMortality: rates.length ? Math.max(...rates) : null,
        anomalyThreshold: rates.length ? percentile(rates, 95) : null,
        top10Highest: [...sorted].reverse().slice(0, 10),
        top10Lowest: sorted.slice(0, 10),
    };
}
export async function getTable(filters) {
    const all = await getAllMortalityRecords();
    const filtered = getFilteredRecords(all, filters, "table").sort((a, b) => {
        const byRate = (b.mortalityRate ?? -Infinity) - (a.mortalityRate ?? -Infinity);
        if (byRate !== 0)
            return byRate;
        return a.facilityName.localeCompare(b.facilityName);
    });
    return paginate(filtered, filters.page || 1, filters.pageSize || 20);
}
function uniqueSortedNumbers(values) {
    return [...new Set(values.filter((v) => v !== null))].sort((a, b) => a - b);
}
function uniqueSortedStrings(values) {
    return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}
export async function getFilterOptions(filters) {
    const all = await getAllMortalityRecords();
    const forYear = getFilteredRecords(all, { ...filters, year: undefined, month: undefined }, "options-year");
    const forMonth = getFilteredRecords(all, { ...filters, month: undefined }, "options-month");
    const forState = getFilteredRecords(all, { ...filters, state: undefined, states: undefined }, "options-state");
    const current = getFilteredRecords(all, filters, "options-current");
    return {
        years: uniqueSortedNumbers(forYear.map((r) => r.year)),
        months: uniqueSortedNumbers(forMonth.map((r) => r.month)),
        states: uniqueSortedStrings(forState.map((r) => r.state)),
        currentTotal: current.length,
    };
}
function averageBy(data, keyGetter) {
    const map = new Map();
    for (const row of data) {
        const key = keyGetter(row);
        if (key === null || row.mortalityRate === null)
            continue;
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
export async function getAnalysis(filters) {
    const all = await getAllMortalityRecords();
    const filtered = getFilteredRecords(all, filters, "analysis");
    const monthlyTrend = averageBy(filtered, (r) => r.year && r.month ? `${r.year}-${String(r.month).padStart(2, "0")}` : null);
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
        count: filtered.filter((r) => r.mortalityRate !== null &&
            r.mortalityRate >= bin.min &&
            r.mortalityRate < bin.max).length,
    }));
    const ranking = filtered
        .filter((r) => r.mortalityRate !== null)
        .sort((a, b) => b.mortalityRate - a.mortalityRate)
        .slice(0, 100);
    const selectedStates = filters.states?.length
        ? filters.states
        : filters.state
            ? [filters.state]
            : [];
    /** When no state is chosen, default to top 5 states by avg mortality so the comparison UI is always populated. */
    let comparisonStates = selectedStates;
    if (comparisonStates.length === 0 && byState.length > 0) {
        comparisonStates = byState.slice(0, 5).map((b) => String(b.key));
    }
    const baseForComparison = getFilteredRecords(all, { ...filters, state: undefined, states: undefined }, "analysis-base-comparison");
    const nationalAvg = averageRate(baseForComparison);
    const stateComparisons = comparisonStates.map((state) => {
        const scoped = getFilteredRecords(baseForComparison, { state }, `analysis-compare-${state}`);
        const avgMortality = averageRate(scoped);
        return {
            state,
            avgMortality,
            count: validRates(scoped).length,
            deltaFromNational: avgMortality !== null && nationalAvg !== null
                ? Number((avgMortality - nationalAvg).toFixed(4))
                : null,
        };
    });
    return {
        monthlyTrend,
        byState,
        byZip,
        distribution,
        ranking,
        benchmarks: {
            nationalAvg,
            stateComparisons,
            comparisonSource: selectedStates.length ? "selected" : "default_top5",
        },
    };
}
function escapeCsv(value) {
    const text = value === null || value === undefined ? "" : String(value);
    if (text.includes(",") || text.includes("\"") || text.includes("\n")) {
        return `"${text.replace(/"/g, "\"\"")}"`;
    }
    return text;
}
export async function getExportCsv(filters) {
    const all = await getAllMortalityRecords();
    const rows = getFilteredRecords(all, filters, "export").sort((a, b) => {
        const byRate = (b.mortalityRate ?? -Infinity) - (a.mortalityRate ?? -Infinity);
        if (byRate !== 0)
            return byRate;
        return a.facilityName.localeCompare(b.facilityName);
    });
    const header = [
        "facilityId",
        "facilityName",
        "state",
        "zipCode",
        "measureId",
        "measureName",
        "mortalityRate",
        "year",
        "month",
        "startDate",
    ];
    const lines = [
        header.join(","),
        ...rows.map((r) => [
            r.facilityId,
            r.facilityName,
            r.state,
            r.zipCode,
            r.measureId,
            r.measureName,
            r.mortalityRate,
            r.year,
            r.month,
            r.startDate,
        ]
            .map(escapeCsv)
            .join(",")),
    ];
    return lines.join("\n");
}
