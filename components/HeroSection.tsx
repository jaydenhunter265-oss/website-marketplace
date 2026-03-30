'use client';

import { useState } from 'react';
import CloudinaryGridBackground from './CloudinaryGridBackground';

type HeroSectionProps = {
  summary: { totalRevenue: number; activeListings: number };
};

const CATEGORIES = ['All Categories', 'SaaS', 'eCommerce', 'Content', 'Marketplace'];
const PRICE_RANGES = ['Any Price', 'Under $50K', '$50K – $100K', '$100K – $250K', '$250K+'];

export default function HeroSection({ summary }: HeroSectionProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0]);

  function handleSearch() {
    const params = new URLSearchParams();
    if (query)                     params.set('q', query);
    if (category !== CATEGORIES[0]) params.set('category', category);
    if (priceRange !== PRICE_RANGES[0]) params.set('price', priceRange);
    window.location.href = `/browse?${params.toString()}`;
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSearch();
  }

  return (
    <section className="hero-section">
      {/* ── Animated background ── */}
      <div className="hero-bg" aria-hidden="true">
        <CloudinaryGridBackground />
        <div className="hero-radial-1" />
        <div className="hero-radial-2" />
        <div className="hero-streak hero-streak-1" />
        <div className="hero-streak hero-streak-2" />
        <div className="hero-streak hero-streak-3" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 py-36 md:py-44 text-center">

        {/* ── Live badge ── */}
        <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/[0.10] bg-white/[0.04] px-5 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-gray-400 backdrop-blur-xl">
          <span className="live-dot" />
          Live marketplace · {summary.activeListings} assets available
        </div>

        {/* ── Headline ── */}
        <h1 className="hero-headline mb-7 max-w-5xl">
          Buy &amp; Sell{' '}
          <span className="chrome-text">Digital Assets</span>
          <br className="hidden sm:block" />
          {' '}of the Future
        </h1>

        {/* ── Subheadline ── */}
        <p className="mb-14 max-w-2xl text-lg leading-relaxed text-gray-400 md:text-xl">
          Premium marketplace for startups, domains, apps, and online businesses.
          Verified revenue. AI-powered insights. Secure transactions.
        </p>

        {/* ── Search bar ── */}
        <div className="hero-search-bar w-full max-w-3xl mb-10">
          <div className="search-input-group">
            {/* Magnifier */}
            <div className="search-icon-wrap">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
            </div>

            {/* Text input */}
            <input
              type="text"
              placeholder="Search businesses, SaaS, domains…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              className="search-input"
            />

            {/* Category */}
            <div className="search-divider hidden sm:block" />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="search-select hidden sm:block"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* Price */}
            <div className="search-divider hidden md:block" />
            <select
              value={priceRange}
              onChange={e => setPriceRange(e.target.value)}
              className="search-select hidden md:block"
            >
              {PRICE_RANGES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            {/* Search button */}
            <button onClick={handleSearch} className="search-btn chrome-btn">
              Search
            </button>
          </div>
        </div>

        {/* ── CTAs ── */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href="/browse" className="chrome-btn px-9 py-4 text-[0.9375rem]">
            Explore Listings
          </a>
          <a href="/sell" className="ghost-btn px-9 py-4 text-[0.9375rem]">
            Sell Your Asset
          </a>
        </div>

        {/* ── Floating stat cards ── */}
        <div className="mt-20 flex flex-wrap justify-center gap-5">
          {/* Card 1 */}
          <div className="float-card" style={{ animationDelay: '0s', animationDuration: '5s' }}>
            <p className="section-label mb-3">Monthly Revenue Pool</p>
            <p className="text-2xl font-extrabold tracking-tight text-white">
              ${summary.totalRevenue.toLocaleString()}
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">Live market data</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="float-card" style={{ animationDelay: '0.4s', animationDuration: '5.5s' }}>
            <p className="section-label mb-3">Active Listings</p>
            <p className="text-2xl font-extrabold tracking-tight text-white">
              {summary.activeListings}
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-400" />
              <span className="text-xs text-sky-400 font-medium">Updates every 12s</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="float-card" style={{ animationDelay: '0.8s', animationDuration: '6s' }}>
            <p className="section-label mb-3">Avg Buyer Match</p>
            <p className="text-2xl font-extrabold tracking-tight text-white">82%</p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-violet-400" />
              <span className="text-xs text-violet-400 font-medium">AI-powered matching</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="float-card" style={{ animationDelay: '1.2s', animationDuration: '4.8s' }}>
            <p className="section-label mb-3">Verified Sellers</p>
            <p className="text-2xl font-extrabold tracking-tight text-white">340+</p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span className="text-xs text-amber-400 font-medium">KYC verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom fade to next section ── */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
        style={{ background: 'linear-gradient(to bottom, transparent, #050505)' }}
        aria-hidden="true"
      />
    </section>
  );
}
