type HeroSectionProps = {
  summary: { totalRevenue: number; activeListings: number };
};

export default function HeroSection({ summary }: HeroSectionProps) {
  return (
    <section className="panel overflow-hidden rounded-[36px] border border-white/10 p-8 shadow-purple backdrop-blur-xl">
      <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Live digital asset marketplace</p>
          <h2 className="text-5xl font-semibold leading-tight text-white">Trade Websites with Live Market Intelligence</h2>
          <p className="max-w-2xl text-base text-slate-300">
            Discover profitable digital assets in real time with verified revenue, AI insights, dynamic deal flow, and buyer and seller trust built into every listing.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#" className="glow-button button-pulse rounded-full px-7 py-3 text-sm font-semibold">
              Explore Marketplace
            </a>
            <a href="#" className="text-sm font-semibold text-slate-200/80 transition hover:text-white">
              See latest deals
            </a>
          </div>
        </div>

        <div className="rounded-[28px] border border-cyan-300/10 bg-white/5 p-6">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">Market pulse</span>
            <span className="animate-pulse-slow rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">Live</span>
          </div>
          <div className="space-y-4">
            <div className="stat-pop rounded-3xl bg-slate-950/70 p-5">
              <p className="text-sm text-slate-400">Active listings</p>
              <p className="mt-3 text-4xl font-semibold text-white">{summary.activeListings}</p>
            </div>
            <div className="stat-pop rounded-3xl bg-slate-950/70 p-5">
              <p className="text-sm text-slate-400">Monthly revenue potential</p>
              <p className="mt-3 text-4xl font-semibold text-white">${summary.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
