'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { sampleListings, Listing } from '../../lib/data';

const categories = ['All', 'SaaS', 'eCommerce', 'Content', 'Marketplace'];
const sortOptions = [
  { label: 'Highest Price', value: 'price-desc' },
  { label: 'Lowest Price', value: 'price-asc' },
  { label: 'Best Growth', value: 'growth-desc' },
  { label: 'Most Traffic', value: 'traffic-desc' },
  { label: 'Best Margin', value: 'margin-desc' },
];

const riskColors = {
  Low: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/8',
  Moderate: 'text-amber-300 border-amber-400/30 bg-amber-400/8',
  High: 'text-rose-300 border-rose-400/30 bg-rose-400/8',
};

function GrowthBar({ score }: { score: number }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-white/5">
      <div
        className="h-full rounded-full bg-gradient-to-r from-silver-400 to-white/60"
        style={{
          width: `${score}%`,
          background: 'linear-gradient(90deg, #888 0%, #d4d4d4 50%, #f0f0f0 100%)',
          boxShadow: '0 0 6px rgba(200,200,200,0.3)',
        }}
      />
    </div>
  );
}

function ListingCard({ listing }: { listing: Listing }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="listing-card group relative flex flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300"
      style={{
        background: hovered
          ? 'linear-gradient(145deg, rgba(22,22,22,0.98) 0%, rgba(14,14,14,0.99) 100%)'
          : 'linear-gradient(145deg, rgba(15,15,15,0.97) 0%, rgba(10,10,10,0.98) 100%)',
        borderColor: hovered ? 'rgba(180,180,180,0.25)' : 'rgba(120,120,120,0.12)',
        boxShadow: hovered
          ? '0 0 0 1px rgba(180,180,180,0.12), 0 24px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)'
          : '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
      }}
    >
      {/* Glossy top sheen */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(220,220,220,0.15), transparent)' }}
      />

      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span
              className="rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.22em]"
              style={{
                borderColor: 'rgba(160,160,160,0.2)',
                background: 'rgba(140,140,140,0.08)',
                color: 'rgba(200,200,200,0.8)',
              }}
            >
              {listing.category}
            </span>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.18em] ${riskColors[listing.riskLevel]}`}
            >
              {listing.riskLevel} risk
            </span>
          </div>
          <h3
            className="truncate text-base font-semibold"
            style={{
              background: 'linear-gradient(135deg, #e8e8e8 0%, #c0c0c0 50%, #a8a8a8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {listing.name}
          </h3>
          <p className="mt-0.5 truncate text-[0.72rem] text-zinc-500">{listing.tagline}</p>
        </div>

        {listing.demoModeAvailable && (
          <span
            className="shrink-0 rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-[0.2em]"
            style={{ borderColor: 'rgba(140,180,255,0.25)', color: 'rgba(140,180,255,0.75)', background: 'rgba(100,140,255,0.06)' }}
          >
            Demo
          </span>
        )}
      </div>

      {/* Price */}
      <div className="mb-5">
        <p className="text-[0.62rem] uppercase tracking-[0.28em] text-zinc-600">Asking price</p>
        <p
          className="mt-0.5 text-2xl font-bold tabular-nums"
          style={{
            background: 'linear-gradient(135deg, #f0f0f0 0%, #c8c8c8 40%, #989898 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          ${listing.askingPrice.toLocaleString()}
        </p>
        {listing.askingPrice < listing.aiValuation && (
          <p className="mt-0.5 text-[0.65rem] text-emerald-400/70">
            ↑ {Math.round(((listing.aiValuation - listing.askingPrice) / listing.aiValuation) * 100)}% below AI valuation
          </p>
        )}
      </div>

      {/* Metrics grid */}
      <div className="mb-5 grid grid-cols-3 gap-2">
        {[
          { label: 'Mo. Revenue', value: `$${(listing.monthlyRevenue / 1000).toFixed(1)}k` },
          { label: 'Margin', value: `${listing.profitMargin.toFixed(0)}%` },
          { label: 'Traffic', value: `${(listing.traffic / 1000).toFixed(0)}k` },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl p-2.5 text-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <p className="text-[0.6rem] uppercase tracking-[0.2em] text-zinc-600">{label}</p>
            <p className="mt-0.5 text-sm font-semibold text-zinc-200">{value}</p>
          </div>
        ))}
      </div>

      {/* Growth score */}
      <div className="mb-5">
        <div className="mb-1.5 flex items-center justify-between">
          <p className="text-[0.62rem] uppercase tracking-[0.24em] text-zinc-600">Growth score</p>
          <p className="text-[0.7rem] font-semibold text-zinc-300">{listing.growthScore}/100</p>
        </div>
        <GrowthBar score={listing.growthScore} />
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between gap-2">
        <div>
          <p className="text-[0.62rem] text-zinc-600">{listing.seller}</p>
          <p className="text-[0.62rem] text-zinc-600">{listing.techStack}</p>
        </div>
        <button
          className="silver-btn rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-200"
          style={{
            background: hovered
              ? 'linear-gradient(135deg, #d0d0d0 0%, #a0a0a0 50%, #787878 100%)'
              : 'linear-gradient(135deg, #b0b0b0 0%, #808080 50%, #606060 100%)',
            color: '#050505',
            boxShadow: hovered ? '0 0 20px rgba(180,180,180,0.25), 0 4px 12px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.4)',
          }}
        >
          View Asset
        </button>
      </div>
    </div>
  );
}

export default function BrowsePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('price-desc');
  const [maxPrice, setMaxPrice] = useState(300000);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = [...sampleListings];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (l) => l.name.toLowerCase().includes(q) || l.tagline.toLowerCase().includes(q) || l.niche.toLowerCase().includes(q)
      );
    }
    if (activeCategory !== 'All') {
      list = list.filter((l) => l.category === activeCategory);
    }
    list = list.filter((l) => l.askingPrice <= maxPrice);

    switch (sortBy) {
      case 'price-asc': list.sort((a, b) => a.askingPrice - b.askingPrice); break;
      case 'price-desc': list.sort((a, b) => b.askingPrice - a.askingPrice); break;
      case 'growth-desc': list.sort((a, b) => b.growthScore - a.growthScore); break;
      case 'traffic-desc': list.sort((a, b) => b.traffic - a.traffic); break;
      case 'margin-desc': list.sort((a, b) => b.profitMargin - a.profitMargin); break;
    }
    return list;
  }, [activeCategory, sortBy, maxPrice, search]);

  return (
    <main className="app-shell">
      <div className="mx-auto max-w-[1720px] space-y-8 pb-24">
        <Navbar />

        {/* Page Hero */}
        <section className="relative overflow-hidden rounded-[32px] border px-8 py-14 text-center"
          style={{
            background: 'linear-gradient(180deg, rgba(18,18,18,0.98) 0%, rgba(8,8,8,0.99) 100%)',
            borderColor: 'rgba(140,140,140,0.12)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* Subtle gloss */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(220,220,220,0.2), transparent)' }} />
          <div className="pointer-events-none absolute inset-0 rounded-[32px]"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(160,160,160,0.06) 0%, transparent 60%)' }} />

          <p className="mb-3 text-[0.65rem] uppercase tracking-[0.5em] text-zinc-500">Browse the exchange</p>
          <h1
            className="mb-4 text-4xl font-bold leading-tight md:text-5xl"
            style={{
              background: 'linear-gradient(180deg, #f5f5f5 0%, #c0c0c0 40%, #888 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Websites for Sale
          </h1>
          <p className="mx-auto max-w-xl text-sm text-zinc-500">
            Verified digital assets with live revenue, traffic data and AI-powered valuation.
          </p>

          {/* Stats strip */}
          <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-6">
            {[
              { label: 'Active Listings', value: `${sampleListings.length}` },
              { label: 'Total Value', value: `$${(sampleListings.reduce((s, l) => s + l.askingPrice, 0) / 1000).toFixed(0)}k` },
              { label: 'Avg. Margin', value: `${(sampleListings.reduce((s, l) => s + l.profitMargin, 0) / sampleListings.length).toFixed(0)}%` },
              { label: 'Avg. Growth Score', value: `${Math.round(sampleListings.reduce((s, l) => s + l.growthScore, 0) / sampleListings.length)}` },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #e0e0e0 0%, #a0a0a0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >{value}</p>
                <p className="text-[0.62rem] uppercase tracking-[0.24em] text-zinc-600">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Filters */}
        <section
          className="rounded-2xl border p-5"
          style={{
            background: 'rgba(12,12,12,0.97)',
            borderColor: 'rgba(120,120,120,0.1)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          <div className="flex flex-wrap items-end gap-5">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <p className="mb-1.5 text-[0.6rem] uppercase tracking-[0.3em] text-zinc-600">Search</p>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search assets, niches, stacks..."
                className="w-full rounded-xl border px-4 py-2.5 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-700 focus:border-zinc-500"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(120,120,120,0.15)' }}
              />
            </div>

            {/* Category */}
            <div>
              <p className="mb-1.5 text-[0.6rem] uppercase tracking-[0.3em] text-zinc-600">Category</p>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="rounded-full border px-3.5 py-1.5 text-[0.7rem] uppercase tracking-[0.18em] transition-all duration-200"
                    style={
                      activeCategory === cat
                        ? {
                            background: 'linear-gradient(135deg, #b0b0b0, #707070)',
                            borderColor: 'transparent',
                            color: '#050505',
                            boxShadow: '0 0 12px rgba(160,160,160,0.2)',
                          }
                        : {
                            background: 'rgba(255,255,255,0.03)',
                            borderColor: 'rgba(120,120,120,0.15)',
                            color: 'rgba(160,160,160,0.7)',
                          }
                    }
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <p className="mb-1.5 text-[0.6rem] uppercase tracking-[0.3em] text-zinc-600">Sort by</p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border px-4 py-2.5 text-[0.72rem] text-zinc-300 outline-none"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(120,120,120,0.15)' }}
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} style={{ background: '#111' }}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Max price */}
            <div className="min-w-[180px] flex-1">
              <p className="mb-1.5 text-[0.6rem] uppercase tracking-[0.3em] text-zinc-600">
                Max price — <span className="text-zinc-400">${maxPrice.toLocaleString()}</span>
              </p>
              <input
                type="range"
                min={50000}
                max={300000}
                step={5000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </section>

        {/* Results count */}
        <div className="flex items-center justify-between px-1">
          <p className="text-[0.7rem] uppercase tracking-[0.3em] text-zinc-600">
            {filtered.length} {filtered.length === 1 ? 'asset' : 'assets'} found
          </p>
          <Link
            href="/sell"
            className="rounded-full border px-4 py-1.5 text-[0.7rem] uppercase tracking-[0.2em] transition-all duration-200 hover:border-zinc-500 hover:text-zinc-300"
            style={{ borderColor: 'rgba(120,120,120,0.2)', color: 'rgba(140,140,140,0.7)' }}
          >
            + List your website
          </Link>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border py-24 text-center"
            style={{ borderColor: 'rgba(120,120,120,0.1)', background: 'rgba(10,10,10,0.5)' }}
          >
            <p className="text-4xl mb-4" style={{ opacity: 0.2 }}>◈</p>
            <p className="text-sm text-zinc-500">No assets match your filters.</p>
            <button
              onClick={() => { setActiveCategory('All'); setMaxPrice(300000); setSearch(''); }}
              className="mt-4 text-[0.7rem] uppercase tracking-[0.2em] text-zinc-600 underline underline-offset-4 hover:text-zinc-400"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
