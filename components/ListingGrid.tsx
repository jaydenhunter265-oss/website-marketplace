'use client';

import { Listing } from '../lib/data';

type ListingGridProps = {
  listings: Listing[];
  justListedIds: string[];
  matchScores: Record<string, number>;
  watchedIds: string[];
  selectedId: string | null;
  onSelectListing: (id: string) => void;
  onToggleWatch: (id: string) => void;
};

type RiskTone = {
  chip: string;
  text: string;
};

const riskMap: Record<Listing['riskLevel'], RiskTone> = {
  Low: { chip: 'border-emerald-300/30 bg-emerald-500/10', text: 'text-emerald-200' },
  Moderate: { chip: 'border-amber-300/30 bg-amber-500/10', text: 'text-amber-100' },
  High: { chip: 'border-rose-300/30 bg-rose-500/10', text: 'text-rose-100' }
};

function formatCompactMoney(value: number): string {
  return `$${value.toLocaleString()}`;
}

function buildLinePath(values: number[], width: number, height: number): string {
  if (values.length === 0) {
    return '';
  }

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(1, max - min);

  return values
    .map((value, idx) => {
      const x = (idx / (values.length - 1 || 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
}

function Sparkline({ values, color, ariaLabel }: { values: number[]; color: string; ariaLabel: string }) {
  const width = 280;
  const height = 62;
  const path = buildLinePath(values, width, height);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-16 w-full overflow-visible" role="img" aria-label={ariaLabel}>
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" className="chart-line" />
      {values.map((value, idx) => {
        const max = Math.max(...values);
        const min = Math.min(...values);
        const range = Math.max(1, max - min);
        const x = (idx / (values.length - 1 || 1)) * width;
        const y = height - ((value - min) / range) * height;

        return (
          <g key={`${idx}-${value}`}>
            <circle cx={x} cy={y} r={2.5} fill={color} className="chart-dot" />
            <title>{`Point ${idx + 1}: ${value.toLocaleString()}`}</title>
          </g>
        );
      })}
    </svg>
  );
}

export default function ListingGrid({
  listings,
  justListedIds,
  matchScores,
  watchedIds,
  selectedId,
  onSelectListing,
  onToggleWatch
}: ListingGridProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Featured assets</p>
          <h3 className="text-2xl font-semibold text-white">Live listings</h3>
        </div>
        <div className="rounded-full border border-cyan-300/25 bg-slate-950/60 px-4 py-2 text-sm text-cyan-100">
          Dynamic market simulation every 3.6 seconds
        </div>
      </div>

      <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 md:grid md:grid-cols-2 md:overflow-visible">
        {listings.map((asset) => {
          const trendDelta = asset.revenueHistory.at(-1)! - asset.revenueHistory.at(-2)!;
          const trafficDelta = asset.trafficHistory.at(-1)! - asset.trafficHistory.at(-2)!;
          const trendUp = trendDelta >= 0;
          const growthPercent = Math.min(100, Math.max(4, asset.growthScore));
          const undervalued = asset.askingPrice < asset.aiValuation * 0.9;
          const riskTone = riskMap[asset.riskLevel];
          const roiEstimate = (asset.monthlyProfit * 12 * 100) / asset.askingPrice;
          const riskScore = asset.riskLevel === 'Low' ? 22 : asset.riskLevel === 'Moderate' ? 48 : 76;
          const growthPrediction = Math.round(4 + (asset.growthScore / 100) * 26);
          const isSelected = selectedId === asset.id;

          return (
            <article
              key={asset.id}
              onClick={() => onSelectListing(asset.id)}
              className={`card min-w-[88vw] snap-start rounded-[28px] p-6 transition-all duration-300 md:min-w-0 ${
                justListedIds.includes(asset.id) ? 'just-listed-card' : ''
              } ${isSelected ? 'ring-2 ring-cyan-300/35' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/70">{asset.category}</p>
                  <h4 className="mt-3 text-xl font-semibold text-white">{asset.name}</h4>
                  <p className="mt-2 text-sm text-slate-400">{asset.tagline}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-500">{asset.niche}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="rounded-3xl bg-slate-950/80 px-4 py-2 text-right text-xs uppercase tracking-[0.3em] text-slate-300">
                    {asset.status}
                  </div>
                  {justListedIds.includes(asset.id) && (
                    <span className="just-listed-badge rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-cyan-100">
                      Just listed
                    </span>
                  )}
                  <span className="rounded-full border border-cyan-300/30 bg-cyan-500/10 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-cyan-100">
                    {matchScores[asset.id] ?? 64}% buyer match
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="stat-pop rounded-3xl bg-white/5 p-4">
                  <p className="text-[0.7rem] uppercase tracking-[0.35em] text-slate-400">Asking price</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{formatCompactMoney(asset.askingPrice)}</p>
                  {undervalued && (
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-200">This business is undervalued</p>
                  )}
                </div>
                <div className="stat-pop rounded-3xl bg-white/5 p-4">
                  <p className="text-[0.7rem] uppercase tracking-[0.35em] text-slate-400">Profit</p>
                  <p
                    className={`mt-3 text-2xl font-semibold ${
                      trendUp ? 'live-profit-up text-emerald-200' : 'live-profit-down text-rose-200'
                    }`}
                  >
                    {formatCompactMoney(asset.monthlyProfit)}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-400">{asset.profitMargin.toFixed(1)}% margin</p>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="rounded-3xl bg-white/5 p-3">
                    <p className="text-[0.65rem] uppercase tracking-[0.25em] text-slate-500">Revenue</p>
                    <p className="mt-2 font-semibold text-white">{formatCompactMoney(asset.monthlyRevenue)}/mo</p>
                  </div>
                  <div className="rounded-3xl bg-white/5 p-3">
                    <p className="text-[0.65rem] uppercase tracking-[0.25em] text-slate-500">Traffic</p>
                    <p className="mt-2 font-semibold text-white">{asset.traffic.toLocaleString()} visits</p>
                  </div>
                  <div className="rounded-3xl bg-white/5 p-3">
                    <p className="text-[0.65rem] uppercase tracking-[0.25em] text-slate-500">Risk</p>
                    <p
                      className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${riskTone.chip} ${riskTone.text}`}
                    >
                      {asset.riskLevel}
                    </p>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="rounded-3xl bg-white/5 p-3">
                    <p className="text-[0.62rem] uppercase tracking-[0.22em] text-slate-500">Risk score</p>
                    <p className="mt-2 text-lg font-semibold text-white">{riskScore}/100</p>
                  </div>
                  <div className="rounded-3xl bg-white/5 p-3">
                    <p className="text-[0.62rem] uppercase tracking-[0.22em] text-slate-500">Growth prediction</p>
                    <p className="mt-2 text-lg font-semibold text-emerald-200">+{growthPrediction}% / 12m</p>
                  </div>
                  <div className="rounded-3xl bg-white/5 p-3">
                    <p className="text-[0.62rem] uppercase tracking-[0.22em] text-slate-500">ROI estimate</p>
                    <p className="mt-2 text-lg font-semibold text-cyan-100">{roiEstimate.toFixed(1)}%</p>
                  </div>
                </div>

                <div className="rounded-3xl bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">AI valuation estimate</p>
                    <p className="text-sm font-semibold text-cyan-100">{formatCompactMoney(asset.aiValuation)}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-400">
                    <span>Growth potential score</span>
                    <span className="text-cyan-100">{growthPercent}/100</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-900/85">
                    <div className="growth-bar h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-300" style={{ width: `${growthPercent}%` }} />
                  </div>
                </div>

                <div className="grid gap-3 rounded-3xl bg-white/5 p-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-[0.7rem] uppercase tracking-[0.3em] text-slate-400">Revenue momentum</p>
                      <span className={`text-xs font-semibold ${trendUp ? 'text-emerald-200' : 'text-rose-200'}`}>
                        {trendUp ? '+' : ''}
                        {trendDelta.toLocaleString()}
                      </span>
                    </div>
                    <Sparkline values={asset.revenueHistory} color="#34d399" ariaLabel={`${asset.name} revenue trend`} />
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-[0.7rem] uppercase tracking-[0.3em] text-slate-400">Traffic growth</p>
                      <span className={`text-xs font-semibold ${trafficDelta >= 0 ? 'text-emerald-200' : 'text-rose-200'}`}>
                        {trafficDelta >= 0 ? '+' : ''}
                        {trafficDelta.toLocaleString()}
                      </span>
                    </div>
                    <Sparkline values={asset.trafficHistory} color="#38bdf8" ariaLabel={`${asset.name} traffic trend`} />
                  </div>
                </div>

                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Growth potential</p>
                  <p className="mt-2 text-sm text-slate-200">{asset.growthPotential}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-cyan-400/20 px-4 py-2 text-xs text-cyan-200">{asset.monetization}</span>
                <span className="rounded-full border border-indigo-400/20 px-4 py-2 text-xs text-indigo-200">{asset.techStack}</span>
                <span className="rounded-full border border-slate-400/20 px-4 py-2 text-xs text-slate-300">{asset.location}</span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button className="glow-button button-pulse rounded-full px-5 py-3 text-sm font-semibold">Buy Now</button>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleWatch(asset.id);
                  }}
                  className={`rounded-full border px-5 py-3 text-sm transition ${
                    watchedIds.includes(asset.id)
                      ? 'border-cyan-300/45 bg-cyan-500/15 text-cyan-100'
                      : 'border-white/10 bg-white/5 text-slate-200 hover:border-cyan-400/30 hover:bg-cyan-500/10'
                  }`}
                >
                  {watchedIds.includes(asset.id) ? 'Watching' : 'Watch'}
                </button>
                <button className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200 transition hover:border-cyan-400/30 hover:bg-cyan-500/10">
                  Quick Offer
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
