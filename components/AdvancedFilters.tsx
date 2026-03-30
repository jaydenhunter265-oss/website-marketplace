'use client';

type FilterState = {
  revenueMin: number;
  revenueMax: number;
  trafficMin: number;
  trafficMax: number;
  niche: string;
  monetization: string;
  techStack: string;
};

type AdvancedFiltersProps = {
  filters: FilterState;
  niches: string[];
  monetizations: string[];
  techStacks: string[];
  onChange: (next: FilterState) => void;
  onReset: () => void;
};

export type { FilterState };

function SelectFilter({
  value, options, placeholder, onChange,
}: {
  value: string;
  options: string[];
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full rounded-xl border border-white/[0.08] bg-black/40 px-4 py-2.5 text-sm text-gray-200 outline-none transition focus:border-silver-500/40 focus:ring-1 focus:ring-silver-500/20 cursor-pointer"
    >
      <option value="all">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function RangeRow({
  label, minVal, maxVal, min, max, step, format, onMinChange, onMaxChange,
}: {
  label: string;
  minVal: number; maxVal: number;
  min: number; max: number; step: number;
  format: (v: number) => string;
  onMinChange: (v: number) => void;
  onMaxChange: (v: number) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="section-label">{label}</p>
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-semibold text-white tabular-nums">{format(minVal)}</span>
        <span className="text-xs font-semibold text-white tabular-nums">{format(maxVal)}</span>
      </div>
      <div className="space-y-2">
        <label className="block">
          <span className="sr-only">Min {label}</span>
          <input
            type="range" min={min} max={max} step={step} value={minVal}
            onChange={e => onMinChange(Number(e.target.value))}
            className="w-full"
          />
        </label>
        <label className="block">
          <span className="sr-only">Max {label}</span>
          <input
            type="range" min={min} max={max} step={step} value={maxVal}
            onChange={e => onMaxChange(Number(e.target.value))}
            className="w-full"
          />
        </label>
      </div>
    </div>
  );
}

export default function AdvancedFilters({
  filters, niches, monetizations, techStacks, onChange, onReset,
}: AdvancedFiltersProps) {
  return (
    <section className="panel rounded-[24px] border border-white/[0.07] p-6">
      {/* ── Header ── */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="section-label mb-1.5">Advanced Filters</p>
          <h3 className="text-lg font-bold tracking-tight text-white">Precision Deal Scanner</h3>
        </div>
        <button
          onClick={onReset}
          className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-300 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
        >
          Reset all
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue range */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
          <RangeRow
            label="Revenue Range"
            minVal={filters.revenueMin} maxVal={filters.revenueMax}
            min={2000} max={32000} step={500}
            format={v => `$${v.toLocaleString()}`}
            onMinChange={v => onChange({ ...filters, revenueMin: v })}
            onMaxChange={v => onChange({ ...filters, revenueMax: v })}
          />
        </div>

        {/* Traffic range */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
          <RangeRow
            label="Traffic Range"
            minVal={filters.trafficMin} maxVal={filters.trafficMax}
            min={5000} max={110000} step={1000}
            format={v => v.toLocaleString()}
            onMinChange={v => onChange({ ...filters, trafficMin: v })}
            onMaxChange={v => onChange({ ...filters, trafficMax: v })}
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-col gap-3">
          <SelectFilter
            value={filters.niche}
            options={niches}
            placeholder="All niches"
            onChange={v => onChange({ ...filters, niche: v })}
          />
          <SelectFilter
            value={filters.monetization}
            options={monetizations}
            placeholder="All monetization types"
            onChange={v => onChange({ ...filters, monetization: v })}
          />
          <SelectFilter
            value={filters.techStack}
            options={techStacks}
            placeholder="All tech stacks"
            onChange={v => onChange({ ...filters, techStack: v })}
          />
        </div>
      </div>
    </section>
  );
}
