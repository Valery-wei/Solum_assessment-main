import { FilterParams, MortalityRecord } from "../types.js";

export function applyFilters(data: MortalityRecord[], filters: FilterParams) {
  return data.filter((row) => {
    if (filters.year && row.year !== filters.year) return false;
    if (filters.month && row.month !== filters.month) return false;
    if (filters.state && row.state.toLowerCase() !== filters.state.toLowerCase()) return false;

    if (filters.states?.length) {
      const set = new Set(filters.states.map((s) => s.toLowerCase()));
      if (!set.has(row.state.toLowerCase())) return false;
    }

    if (filters.zipCode && !row.zipCode.startsWith(filters.zipCode)) return false;

    if (filters.facilityName) {
      const keyword = filters.facilityName.toLowerCase();
      if (!row.facilityName.toLowerCase().includes(keyword)) return false;
    }

    return true;
  });
}

export function paginate<T>(items: T[], page = 1, pageSize = 20) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    data: items.slice(start, end),
    page,
    pageSize,
    total: items.length
  };
}