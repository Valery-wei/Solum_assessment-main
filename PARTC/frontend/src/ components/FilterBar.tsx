import { Filters } from "../types";

type Props = {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
};

const years = [2020, 2021, 2022, 2023, 2024, 2025];
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VT", "WA", "WI", "WV", "WY"];

export default function FilterBar({ filters, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 bg-white rounded-2xl shadow">
      <select className="border rounded-xl p-2" value={filters.year ?? ""} onChange={(e) => onChange({ year: e.target.value ? Number(e.target.value) : undefined })}>
        <option value="">All Years</option>
        {years.map((y) => <option key={y} value={y}>{y}</option>)}
      </select>

      <select className="border rounded-xl p-2" value={filters.month ?? ""} onChange={(e) => onChange({ month: e.target.value ? Number(e.target.value) : undefined })}>
        <option value="">All Months</option>
        {months.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>

      <select className="border rounded-xl p-2" value={filters.state ?? ""} onChange={(e) => onChange({ state: e.target.value || undefined })}>
        <option value="">All States</option>
        {states.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <input className="border rounded-xl p-2" placeholder="ZIP Code" value={filters.zipCode ?? ""} onChange={(e) => onChange({ zipCode: e.target.value })} />

      <input className="border rounded-xl p-2" placeholder="Facility Name" value={filters.facilityName ?? ""} onChange={(e) => onChange({ facilityName: e.target.value })} />
    </div>
  );
}