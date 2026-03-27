export function parseNumber(value) {
    if (value === null || value === undefined || value === "")
        return null;
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
}
export function parseDate(value) {
    if (typeof value !== "string" || !value.trim())
        return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
}
export function extractYearMonth(dateInput) {
    if (typeof dateInput !== "string" || !dateInput.trim())
        return { year: null, month: null };
    const text = dateInput.trim();
    const usDate = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const m = text.match(usDate);
    if (m) {
        const month = Number(m[1]);
        const year = Number(m[3]);
        if (month >= 1 && month <= 12 && Number.isFinite(year)) {
            return { year, month };
        }
    }
    const d = new Date(text);
    if (Number.isNaN(d.getTime()))
        return { year: null, month: null };
    return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 };
}
export function normalizeZip(value) {
    if (value === null || value === undefined)
        return "";
    return String(value).trim().slice(0, 5);
}
export function safeString(value) {
    return typeof value === "string" ? value.trim() : "";
}
export function isMortalityMeasure(measureName) {
    const text = measureName.toLowerCase();
    return text.includes("death") || text.includes("mortality") || text.includes("30-day death");
}
