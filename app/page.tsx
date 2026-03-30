'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import TrustStrip from '../components/TrustStrip';
import ListingGrid from '../components/ListingGrid';
import MarketFeed from '../components/MarketFeed';
import AdvancedFilters, { FilterState } from '../components/AdvancedFilters';
import IntelligenceDeck from '../components/IntelligenceDeck';
import HowItWorks from '../components/HowItWorks';
import WhyChooseUs from '../components/WhyChooseUs';
import SellerCTA from '../components/SellerCTA';
import Footer from '../components/Footer';
import { FeedEntry, Listing, sampleListings, initialFeed } from '../lib/data';

/* ── Random data helpers ──────────────────────────────────── */
const listingNameParts  = ['Flow', 'Signal', 'Orbit', 'Prime', 'Nexus', 'Scale', 'Spark', 'Vector'];
const listingSuffixes   = ['SaaS', 'Studio', 'Stack', 'Hub', 'Cloud', 'Works', 'Labs'];
const categories        = ['SaaS', 'eCommerce', 'Marketplace', 'Content'];
const niches            = ['B2B analytics', 'Consumer retail', 'SEO publishing', 'B2B marketplaces', 'Productivity', 'AI tooling'];
const sellers           = ['Northline Capital', 'Atlas Operators', 'Orchid Media', 'Volt Equity', 'Helix Holdings'];
const monetizationModels = ['Subscription', 'Lead Gen', 'Ads & affiliates', 'eCommerce'];
const techStacks        = ['Next.js - Postgres', 'Remix - Stripe', 'Shopify - Klaviyo', 'Nuxt - Supabase', 'React - Node'];
const locations         = ['US', 'EU', 'Remote', 'Global'];
const riskLevels: Listing['riskLevel'][] = ['Low', 'Moderate', 'High'];

const feedTemplates: Array<Omit<FeedEntry, 'id' | 'createdAt'>> = [
  { type: 'sale',    message: 'Website sold for $12,000',     detail: 'Premium niche blog closed in under 2 hours.',          amount: '$12,000' },
  { type: 'listing', message: 'New SaaS listed',              detail: 'B2B workflow platform entered live auction.',           amount: '$84,000' },
  { type: 'drop',    message: 'Price dropped by 10%',         detail: 'Seller cut ask after AI valuation recalibration.',     amount: '-10%'    },
  { type: 'signal',  message: 'Undervalued deal identified',  detail: 'Growth model flagged upside with low downside risk.',  amount: '+18%'    },
];

const defaultFilters: FilterState = {
  revenueMin: 4000, revenueMax: 28000,
  trafficMin: 12000, trafficMax: 90000,
  niche: 'all', monetization: 'all', techStack: 'all',
};

const interestOptions = ['SaaS', 'eCommerce', 'Content', 'Marketplace'];

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function buildListing(counter: number): Listing {
  const name           = `${randomItem(listingNameParts)}${randomItem(listingSuffixes)}.${Math.random() > 0.5 ? 'io' : 'com'}`;
  const category       = randomItem(categories);
  const monthlyRevenue = Math.round(6500 + Math.random() * 18000);
  const margin         = 40 + Math.random() * 32;
  const monthlyProfit  = Math.round(monthlyRevenue * (margin / 100));
  const traffic        = Math.round(21000 + Math.random() * 52000);
  const growthScore    = Math.round(60 + Math.random() * 35);
  const valuationMult  = 20 + growthScore / 10;
  const aiValuation    = Math.round(monthlyProfit * valuationMult + traffic * 0.4);
  const askingPrice    = Math.round(aiValuation * (0.82 + Math.random() * 0.28));

  return {
    id: `asset-live-${counter}`,
    name,
    tagline: `${category} asset with verified performance and upside runway`,
    category,
    niche: randomItem(niches),
    seller: randomItem(sellers),
    status: 'Just listed',
    askingPrice,
    monthlyRevenue,
    yearlyRevenue: monthlyRevenue * 12,
    monthlyProfit,
    profitMargin: Number(margin.toFixed(1)),
    traffic,
    revenueHistory: Array.from({ length: 7 }, (_, idx) => Math.round(monthlyRevenue * (0.92 + idx * 0.015))),
    trafficHistory: Array.from({ length: 7 }, (_, idx) => Math.round(traffic * (0.90 + idx * 0.018))),
    aiValuation,
    growthScore,
    riskLevel: randomItem(riskLevels),
    monetization: randomItem(monetizationModels),
    techStack: randomItem(techStacks),
    growthPotential: 'Expand paid acquisition and convert repeat users into annual plans.',
    location: randomItem(locations),
    previewUrl: 'https://example.com',
    demoModeAvailable: Math.random() > 0.45,
  };
}

function createFeedEntry(): FeedEntry {
  return {
    ...randomItem(feedTemplates),
    id: Date.now() + Math.floor(Math.random() * 1000),
    createdAt: Date.now(),
  };
}

/* ── Page ─────────────────────────────────────────────────── */
export default function HomePage() {
  // Catch Supabase OAuth redirect on the root path
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) window.location.replace(`/auth/callback?code=${encodeURIComponent(code)}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [listings, setListings]           = useState(sampleListings);
  const [feed, setFeed]                   = useState(initialFeed);
  const [justListedIds, setJustListedIds] = useState<string[]>([]);
  const [filters, setFilters]             = useState<FilterState>(defaultFilters);
  const [budget, setBudget]               = useState(180000);
  const [interests, setInterests]         = useState<string[]>(['SaaS', 'Marketplace']);
  const [pastActivity, setPastActivity]   = useState<string[]>(['SaaS', 'Content']);
  const [watchedIds, setWatchedIds]       = useState<string[]>([]);
  const [followedSellers, setFollowedSellers] = useState<string[]>([]);
  const [selectedListingId, setSelectedListingId] = useState<string>(sampleListings[0]?.id ?? '');
  const listingCounterRef = useRef(sampleListings.length + 1);

  // Seed from real DB if available
  useEffect(() => {
    fetch('/api/listings')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setListings(data);
          setSelectedListingId(data[0].id);
          listingCounterRef.current = data.length + 1;
        }
      })
      .catch(() => {/* keep sample data */});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const liveSummary = useMemo(() => ({
    totalRevenue:   listings.reduce((s, l) => s + l.monthlyRevenue, 0),
    activeListings: listings.length,
  }), [listings]);

  const filteredListings = useMemo(
    () => listings.filter(l =>
      l.monthlyRevenue >= filters.revenueMin && l.monthlyRevenue <= filters.revenueMax &&
      l.traffic >= filters.trafficMin && l.traffic <= filters.trafficMax &&
      (filters.niche        === 'all' || l.niche        === filters.niche)        &&
      (filters.monetization === 'all' || l.monetization === filters.monetization) &&
      (filters.techStack    === 'all' || l.techStack    === filters.techStack)
    ),
    [listings, filters]
  );

  const matchScores = useMemo(() => {
    const byId: Record<string, number> = {};
    for (const l of listings) {
      const budgetScore    = Math.max(10, 100 - (Math.abs(budget - l.askingPrice) / Math.max(1, budget)) * 100);
      const interestScore  = interests.includes(l.category) ? 100 : 45;
      const historyScore   = pastActivity.includes(l.category) ? 90 : 50;
      const valuationScore = l.askingPrice < l.aiValuation ? 85 : 60;
      byId[l.id] = Math.min(99, Math.max(40, Math.round(
        budgetScore * 0.32 + interestScore * 0.24 + historyScore * 0.18 + valuationScore * 0.12 + l.growthScore * 0.14
      )));
    }
    return byId;
  }, [listings, budget, interests, pastActivity]);

  const selectedListing = useMemo(
    () => filteredListings.find(l => l.id === selectedListingId) ?? filteredListings[0] ?? null,
    [filteredListings, selectedListingId]
  );

  useEffect(() => {
    if (!selectedListing && filteredListings[0]) setSelectedListingId(filteredListings[0].id);
  }, [selectedListing, filteredListings]);

  // Live metric simulation
  useEffect(() => {
    const metricInterval = setInterval(() => {
      setListings(cur => cur.map(l => {
        const v   = Math.random() * 0.08 - 0.04;
        const rev = Math.max(2000, Math.round(l.monthlyRevenue * (1 + v)));
        const trk = Math.max(9000, Math.round(l.traffic * (1 + v * 1.75)));
        const mg  = Math.min(84, Math.max(30, l.profitMargin + v * 8));
        const pft = Math.round(rev * (mg / 100));
        const gs  = Math.min(99, Math.max(40, Math.round(l.growthScore + v * 20)));
        const aiv = Math.round(pft * (20 + gs / 10) + trk * 0.4);
        const gap = aiv - l.askingPrice;
        const ask = Math.round(Math.max(18000, l.askingPrice * (gap > 0 ? 1 + Math.random() * 0.01 : 1 - Math.random() * 0.01)));
        return {
          ...l,
          askingPrice: ask, monthlyRevenue: rev, yearlyRevenue: rev * 12,
          monthlyProfit: pft, profitMargin: Number(mg.toFixed(1)),
          traffic: trk, aiValuation: aiv, growthScore: gs,
          revenueHistory: [...l.revenueHistory.slice(-6), rev],
          trafficHistory: [...l.trafficHistory.slice(-6), trk],
        };
      }));
      setFeed(cur => [createFeedEntry(), ...cur].slice(0, 10));
    }, 3600);

    const listingInterval = setInterval(() => {
      setListings(cur => {
        const next = buildListing(listingCounterRef.current++);
        setJustListedIds(ids => [next.id, ...ids]);
        return [next, ...cur].slice(0, 10);
      });
    }, 12000);

    return () => { clearInterval(metricInterval); clearInterval(listingInterval); };
  }, []);

  // Clear just-listed flash after 6.5 s
  useEffect(() => {
    if (justListedIds.length === 0) return;
    const t = setTimeout(() => setJustListedIds(ids => ids.slice(0, -1)), 6500);
    return () => clearTimeout(t);
  }, [justListedIds]);

  function toggleInterest(v: string) {
    setInterests(cur => cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v]);
  }
  function togglePastActivity(v: string) {
    setPastActivity(cur => cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v]);
  }
  function toggleWatch(id: string) {
    setWatchedIds(cur => cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id]);
  }
  function toggleFollowSeller(s: string) {
    setFollowedSellers(cur => cur.includes(s) ? cur.filter(x => x !== s) : [...cur, s]);
  }

  return (
    <div className="app-shell">
      {/* ── Fixed navbar ── */}
      <Navbar />

      {/* ── Hero (full-bleed, accounts for fixed navbar height) ── */}
      <div className="pt-[64px]">
        <HeroSection summary={liveSummary} />
      </div>

      {/* ── Trust strip ── */}
      <TrustStrip />

      {/* ── Marketplace content ── */}
      <div
        id="listings"
        className="mx-auto max-w-[1720px] space-y-8 px-6 py-16 pb-24"
      >
        {/* Buyer profile panel */}
        <section className="panel rounded-[24px] border border-white/[0.07] p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="section-label mb-1.5">Smart buyer matching</p>
              <h3 className="text-xl font-bold tracking-tight text-white">Adaptive Buyer Profile</h3>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
              Personalised in real time
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
            {/* Budget */}
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5">
              <p className="section-label mb-2">Budget</p>
              <p className="text-3xl font-extrabold tracking-tight text-white">${budget.toLocaleString()}</p>
              <input
                type="range" min={40000} max={350000} step={5000} value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                className="mt-4 w-full"
              />
            </div>

            {/* Interests + Past activity */}
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
                <p className="section-label mb-3">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map(v => (
                    <button
                      key={v}
                      onClick={() => toggleInterest(v)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-150
                        ${interests.includes(v)
                          ? 'border-silver-400/30 bg-white/[0.08] text-white'
                          : 'border-white/[0.07] bg-white/[0.03] text-gray-400 hover:text-gray-200'
                        }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
                <p className="section-label mb-3">Past Activity</p>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map(v => (
                    <button
                      key={v}
                      onClick={() => togglePastActivity(v)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-150
                        ${pastActivity.includes(v)
                          ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'
                          : 'border-white/[0.07] bg-white/[0.03] text-gray-400 hover:text-gray-200'
                        }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <AdvancedFilters
          filters={filters}
          niches={[...new Set(listings.map(l => l.niche))]}
          monetizations={[...new Set(listings.map(l => l.monetization))]}
          techStacks={[...new Set(listings.map(l => l.techStack))]}
          onChange={setFilters}
          onReset={() => setFilters(defaultFilters)}
        />

        {/* Listings + Feed */}
        <div className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
          <ListingGrid
            listings={filteredListings}
            justListedIds={justListedIds}
            matchScores={matchScores}
            watchedIds={watchedIds}
            selectedId={selectedListing?.id ?? null}
            onSelectListing={setSelectedListingId}
            onToggleWatch={toggleWatch}
          />
          <MarketFeed feed={feed} />
        </div>

        {/* Intelligence deck */}
        <IntelligenceDeck
          listings={filteredListings.length > 0 ? filteredListings : listings}
          selectedListing={selectedListing}
          matchScores={matchScores}
          watchedIds={watchedIds}
          followedSellers={followedSellers}
          onSelectListing={setSelectedListingId}
          onToggleWatch={toggleWatch}
          onToggleFollowSeller={toggleFollowSeller}
        />
      </div>

      {/* ── Marketing sections ── */}
      <HowItWorks />
      <WhyChooseUs />
      <SellerCTA />
      <Footer />

      {/* ── Mobile sticky bar ── */}
      {selectedListing && (
        <div className="mobile-sticky-buy md:hidden">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-gray-500">Selected</p>
            <p className="text-sm font-bold text-white">{selectedListing.name}</p>
            <p className="text-xs text-gray-400">${selectedListing.askingPrice.toLocaleString()} ask</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => toggleWatch(selectedListing.id)}
              className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-2 text-xs text-gray-300"
            >
              {watchedIds.includes(selectedListing.id) ? '✓ Saved' : 'Save'}
            </button>
            <button className="chrome-btn px-4 py-2 text-xs">Make Offer</button>
          </div>
        </div>
      )}
    </div>
  );
}
