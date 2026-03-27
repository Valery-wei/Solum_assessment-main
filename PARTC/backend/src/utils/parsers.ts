export function parseNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export function parseDate(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export function extractYearMonth(dateStr: string | null): { year: number | null; month: number | null } {
  if (!dateStr) return { year: null, month: null };
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return { year: null, month: null };
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 };
}

export function normalizeZip(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim().slice(0, 5);
}

export function safeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function isMortalityMeasure(measureName: string): boolean {
  const text = measureName.toLowerCase();
  return text.includes("death") || text.includes("mortality") || text.includes("30-day death");
}