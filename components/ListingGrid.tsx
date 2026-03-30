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

type RiskTone = { chip: string; text: string };

const riskMap: Record<Listing['riskLevel'], RiskTone> = {
  Low:      { chip: 'border-emerald-400/25 bg-emerald-500/10', text: 'text-emerald-300' },
  Moderate: { chip: 'border-amber-400/25  bg-amber-500/10',   text: 'text-amber-200'   },
  High:     { chip: 'border-rose-400/25   bg-rose-500/10',    text: 'text-rose-300'     },
};

const categoryColors: Record<string, string> = {
  SaaS:        'text-sky-300  border-sky-400/25  bg-sky-500/10',
  eCommerce:   'text-violet-300 border-violet-400/25 bg-violet-500/10',
  Content:     'text-amber-300 border-amber-400/25 bg-amber-500/10',
  Marketplace: 'text-emerald-300 border-emerald-400/25 bg-emerald-500/10',
};

function fmt(n: number) { return `$${n.toLocaleString()}`; }

function buildLinePath(values: number[], w: number, h: number) {
  if (values.length === 0) return '';
  const max = Math.max(...values), min = Math.min(...values), range = Math.max(1, max - min);
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1 || 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
}

function Sparkline({ values, color, label }: { values: number[]; color: string; label: string }) {
  const W = 280, H = 52;
  const path = buildLinePath(values, W, H);
  const max = Math.max(...values), min = Math.min(...values), range = Math.max(1, max - min);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-14 w-full overflow-visible" role="img" aria-label={label}>
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Area fill */}
      {values.length > 1 && (
        <path
          d={`${path} L ${((values.length - 1) / (values.length - 1)) * W} ${H} L 0 ${H} Z`}
          fill={`url(#sg-${color.replace('#','')})`}
        />
      )}
      <path d={path} fill="none" stroke={color} strokeWidth="2" className="chart-line" />
      {values.map((v, i) => {
        const x = (i / (values.length - 1 || 1)) * W;
        const y = H - ((v - min) / range) * H;
        return (
          <g key={`${i}-${v}`}>
            <circle cx={x} cy={y} r={i === values.length - 1 ? 3.5 : 2} fill={color} className="chart-dot" />
            <title>{`Point ${i + 1}: ${v.toLocaleString()}`}</title>
          </g>
        );
      })}
    </svg>
  );
}

export default function ListingGrid({
  listings, justListedIds, matchScores, watchedIds, selectedId, onSelectListing, onToggleWatch,
}: ListingGridProps) {
  return (
    <section className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-label mb-2">Featured assets</p>
          <h2 className="text-2xl font-bold text-white tracking-tight">Live Listings</h2>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-gray-400 backdrop-blur-sm">
          <span className="live-dot scale-75" />
          Dynamic simulation every 3.6 s
        </div>
      </div>

      {/* ── Card grid ── */}
      <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 md:grid md:grid-cols-2 md:overflow-visible">
        {listings.map((asset) => {
          const trendDelta   = (asset.revenueHistory.at(-1) ?? 0) - (asset.revenueHistory.at(-2) ?? 0);
          const trafficDelta = (asset.trafficHistory.at(-1) ?? 0) - (asset.trafficHistory.at(-2) ?? 0);
          const trendUp      = trendDelta >= 0;
          const growthPct    = Math.min(100, Math.max(4, asset.growthScore));
          const undervalued  = asset.askingPrice < asset.aiValuation * 0.9;
          const riskTone     = riskMap[asset.riskLevel];
          const catColor     = categoryColors[asset.category] ?? 'text-gray-300 border-white/15 bg-white/5';
          const roi          = (asset.monthlyProfit * 12 * 100) / asset.askingPrice;
          const riskScore    = asset.riskLevel === 'Low' ? 22 : asset.riskLevel === 'Moderate' ? 48 : 76;
          const growthPred   = Math.round(4 + (asset.growthScore / 100) * 26);
          const isSelected   = selectedId === asset.id;
          const matchPct     = matchScores[asset.id] ?? 64;
          const isJustListed = justListedIds.includes(asset.id);

          return (
            <article
              key={asset.id}
              onClick={() => onSelectListing(asset.id)}
              className={`card min-w-[88vw] snap-start cursor-pointer rounded-[28px] p-6 md:min-w-0
                ${isJustListed ? 'just-listed-card' : ''}
                ${isSelected   ? 'ring-1 ring-silver-300/20' : ''}
              `}
            >
              {/* ── Card top row ── */}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] ${catColor}`}>
                    {asset.category}
                  </span>
                  <h3 className="mt-3 text-xl font-bold tracking-tight text-white">{asset.name}</h3>
                  <p className="mt-1.5 text-sm text-gray-400 leading-snug">{asset.tagline}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-gray-600">{asset.niche}</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {isJustListed && (
                    <span className="just-listed-badge rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.26em] text-white">
                      Just listed
                    </span>
                  )}
                  <span className="rounded-full border border-silver-400/20 bg-white/[0.05] px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gray-300">
                    {asset.status}
                  </span>
                  <span
                    className="rounded-full border px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.22em]"
                    style={{
                      background:   matchPct >= 80 ? 'rgba(192,192,192,0.10)' : 'rgba(255,255,255,0.04)',
                      borderColor:  matchPct >= 80 ? 'rgba(192,192,192,0.30)' : 'rgba(255,255,255,0.10)',
                      color:        matchPct >= 80 ? '#e5e5e5' : '#9ca3af',
                    }}
                  >
                    {matchPct}% match
                  </span>
                </div>
              </div>

              {/* ── Primary stats ── */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="stat-pop rounded-2xl bg-white/[0.04] border border-white/[0.06] p-4">
                  <p className="section-label mb-2">Asking Price</p>
                  <p className="text-2xl font-extrabold tracking-tight text-white">{fmt(asset.askingPrice)}</p>
                  {undervalued && (
                    <p className="mt-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-emerald-400">
                      ↓ Below AI valuation
                    </p>
                  )}
                </div>
                <div className="stat-pop rounded-2xl bg-white/[0.04] border border-white/[0.06] p-4">
                  <p className="section-label mb-2">Monthly Profit</p>
                  <p className={`text-2xl font-extrabold tracking-tight ${trendUp ? 'live-profit-up text-emerald-300' : 'live-profit-down text-rose-300'}`}>
                    {fmt(asset.monthlyProfit)}
                  </p>
                  <p className="mt-1.5 section-label">{asset.profitMargin.toFixed(1)}% margin</p>
                </div>
              </div>

              {/* ── Secondary stats row ── */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { label: 'Revenue', value: `${fmt(asset.monthlyRevenue)}/mo` },
                  { label: 'Traffic',  value: `${asset.traffic.toLocaleString()} visits` },
                  { label: 'Risk',     value: asset.riskLevel, extra: `${riskTone.chip} ${riskTone.text}` },
                ].map(({ label, value, extra }) => (
                  <div key={label} className="rounded-xl bg-white/[0.04] border border-white/[0.05] p-3">
                    <p className="section-label mb-1.5">{label}</p>
                    {extra ? (
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${extra}`}>
                        {value}
                      </span>
                    ) : (
                      <p className="text-sm font-semibold text-white">{value}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* ── AI metrics row ── */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { label: 'Risk Score', value: `${riskScore}/100`, color: 'text-white' },
                  { label: 'Growth 12m', value: `+${growthPred}%`,  color: 'text-emerald-300' },
                  { label: 'ROI Est.',   value: `${roi.toFixed(1)}%`, color: 'text-sky-300' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-xl bg-white/[0.04] border border-white/[0.05] p-3">
                    <p className="section-label mb-1.5">{label}</p>
                    <p className={`text-base font-bold ${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* ── AI valuation + growth bar ── */}
              <div className="mt-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <p className="section-label">AI Valuation Estimate</p>
                  <p className="text-sm font-bold text-white">{fmt(asset.aiValuation)}</p>
                </div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="section-label">Growth potential score</span>
                  <span className="font-semibold text-white">{growthPct}/100</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.07]">
                  <div
                    className="growth-bar h-full rounded-full"
                    style={{
                      width: `${growthPct}%`,
                      background: 'linear-gradient(90deg, #c0c0c0 0%, #888 100%)',
                    }}
                  />
                </div>
              </div>

              {/* ── Sparklines ── */}
              <div className="mt-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] p-4 space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="section-label">Revenue Momentum</p>
                    <span className={`text-xs font-semibold ${trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {trendUp ? '+' : ''}{trendDelta.toLocaleString()}
                    </span>
                  </div>
                  <Sparkline values={asset.revenueHistory} color="#4ade80" label={`${asset.name} revenue`} />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="section-label">Traffic Growth</p>
                    <span className={`text-xs font-semibold ${trafficDelta >= 0 ? 'text-sky-400' : 'text-rose-400'}`}>
                      {trafficDelta >= 0 ? '+' : ''}{trafficDelta.toLocaleString()}
                    </span>
                  </div>
                  <Sparkline values={asset.trafficHistory} color="#38bdf8" label={`${asset.name} traffic`} />
                </div>
              </div>

              {/* ── Growth potential text ── */}
              <div className="mt-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] p-4">
                <p className="section-label mb-1.5">Growth Potential</p>
                <p className="text-sm leading-relaxed text-gray-300">{asset.growthPotential}</p>
              </div>

              {/* ── Tags ── */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-gray-300">
                  {asset.monetization}
                </span>
                <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-gray-400">
                  {asset.techStack}
                </span>
                <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs text-gray-500">
                  {asset.location}
                </span>
              </div>

              {/* ── Actions ── */}
              <div className="mt-5 flex flex-wrap gap-3">
                <button className="chrome-btn px-5 py-2.5 text-sm">
                  Buy Now
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onToggleWatch(asset.id); }}
                  className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-200
                    ${watchedIds.includes(asset.id)
                      ? 'border-silver-300/30 bg-white/[0.07] text-white'
                      : 'border-white/10 bg-white/[0.03] text-gray-300 hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                >
                  {watchedIds.includes(asset.id) ? '✓ Watching' : 'Watch'}
                </button>
                <button className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm text-gray-300 transition hover:border-white/20 hover:bg-white/[0.06]">
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
