import { useQuery } from "@tanstack/react-query";
import { getFilterOptions } from "../api/mortality";
import { Filters } from "../types";

type Props = {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
};

export default function FilterBar({ filters, onChange }: Props) {
  const statesText = filters.states?.join(", ") ?? "";
  const { data: options } = useQuery({
    queryKey: ["filter-options", filters],
    queryFn: () => getFilterOptions(filters),
  });

  const years = options?.years ?? [];
  const months = options?.months ?? [];
  const states = options?.states ?? [];

  return (
    <div className="space-y-2 bg-white rounded-2xl shadow p-4">
      <div className="text-sm text-slate-600">Current matched rows: {options?.currentTotal ?? "-"}</div>
      <p className="text-xs text-slate-500">
        <span className="font-medium">Multi-state comparison:</span> use <strong>Compare States</strong> (e.g. CA,TX,FL). This clears the single State dropdown. Leave empty on Analysis to auto-compare the top 5 states vs national.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
      <select className="border rounded-xl p-2" value={filters.year ?? ""} onChange={(e) => onChange({ year: e.target.value ? Number(e.target.value) : undefined })}>
        <option value="">All Years</option>
        {years.map((y) => <option key={y} value={y}>{y}</option>)}
      </select>

      <select className="border rounded-xl p-2" value={filters.month ?? ""} onChange={(e) => onChange({ month: e.target.value ? Number(e.target.value) : undefined })}>
        <option value="">All Months</option>
        {months.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>

      <select className="border rounded-xl p-2" value={filters.state ?? ""} onChange={(e) => onChange({ state: e.target.value || undefined, states: undefined })}>
        <option value="">All States</option>
        {states.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <input
        className="border rounded-xl p-2"
        placeholder="Compare States: CA,TX,FL"
        aria-label="Compare multiple states, comma separated"
        value={statesText}
        onChange={(e) =>
          onChange({
            state: undefined,
            states: e.target.value
              .split(",")
              .map((s) => s.trim().toUpperCase())
              .filter(Boolean),
          })
        }
      />

      <input className="border rounded-xl p-2" placeholder="ZIP Code" value={filters.zipCode ?? ""} onChange={(e) => onChange({ zipCode: e.target.value })} />

      <input className="border rounded-xl p-2" placeholder="Facility Name" value={filters.facilityName ?? ""} onChange={(e) => onChange({ facilityName: e.target.value })} />
      </div>
    </div>
  );
}