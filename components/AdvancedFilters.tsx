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

export default function AdvancedFilters({ filters, niches, monetizations, techStacks, onChange, onReset }: AdvancedFiltersProps) {
  return (
    <section className="panel rounded-[32px] border border-white/10 p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.34em] text-cyan-300/80">Advanced filters</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Precision deal scanner</h3>
        </div>
        <button
          onClick={onReset}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200 transition hover:border-cyan-300/40"
        >
          Reset filters
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl bg-white/5 p-4">
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-slate-400">Revenue range</p>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <label className="block">
              Min: ${filters.revenueMin.toLocaleString()}
              <input
                type="range"
                min={2000}
                max={30000}
                step={500}
                value={filters.revenueMin}
                onChange={(event) => onChange({ ...filters, revenueMin: Number(event.target.value) })}
                className="mt-2 w-full"
              />
            </label>
            <label className="block">
              Max: ${filters.revenueMax.toLocaleString()}
              <input
                type="range"
                min={3000}
                max={32000}
                step={500}
                value={filters.revenueMax}
                onChange={(event) => onChange({ ...filters, revenueMax: Number(event.target.value) })}
                className="mt-2 w-full"
              />
            </label>
          </div>
        </div>

        <div className="rounded-3xl bg-white/5 p-4">
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-slate-400">Traffic range</p>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <label className="block">
              Min: {filters.trafficMin.toLocaleString()}
              <input
                type="range"
                min={5000}
                max={90000}
                step={1000}
                value={filters.trafficMin}
                onChange={(event) => onChange({ ...filters, trafficMin: Number(event.target.value) })}
                className="mt-2 w-full"
              />
            </label>
            <label className="block">
              Max: {filters.trafficMax.toLocaleString()}
              <input
                type="range"
                min={10000}
                max={110000}
                step={1000}
                value={filters.trafficMax}
                onChange={(event) => onChange({ ...filters, trafficMax: Number(event.target.value) })}
                className="mt-2 w-full"
              />
            </label>
          </div>
        </div>

        <div className="grid gap-3">
          <select
            value={filters.niche}
            onChange={(event) => onChange({ ...filters, niche: event.target.value })}
            className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100"
          >
            <option value="all">All niches</option>
            {niches.map((niche) => (
              <option key={niche} value={niche}>
                {niche}
              </option>
            ))}
          </select>

          <select
            value={filters.monetization}
            onChange={(event) => onChange({ ...filters, monetization: event.target.value })}
            className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100"
          >
            <option value="all">All monetization types</option>
            {monetizations.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>

          <select
            value={filters.techStack}
            onChange={(event) => onChange({ ...filters, techStack: event.target.value })}
            className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100"
          >
            <option value="all">All tech stacks</option>
            {techStacks.map((stack) => (
              <option key={stack} value={stack}>
                {stack}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
