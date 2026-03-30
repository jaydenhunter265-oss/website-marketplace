'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ListingGrid from '../components/ListingGrid';
import MarketFeed from '../components/MarketFeed';
import AdvancedFilters, { FilterState } from '../components/AdvancedFilters';
import IntelligenceDeck from '../components/IntelligenceDeck';
import { FeedEntry, Listing, sampleListings, initialFeed } from '../lib/data';

const listingNameParts = ['Flow', 'Signal', 'Orbit', 'Prime', 'Nexus', 'Scale', 'Spark', 'Vector'];
const listingSuffixes = ['SaaS', 'Studio', 'Stack', 'Hub', 'Cloud', 'Works', 'Labs'];
const categories = ['SaaS', 'eCommerce', 'Marketplace', 'Content'];
const niches = ['B2B analytics', 'Consumer retail', 'SEO publishing', 'B2B marketplaces', 'Productivity', 'AI tooling'];
const sellers = ['Northline Capital', 'Atlas Operators', 'Orchid Media', 'Volt Equity', 'Helix Holdings'];
const monetizationModels = ['Subscription', 'Lead Gen', 'Ads & affiliates', 'eCommerce'];
const techStacks = ['Next.js - Postgres', 'Remix - Stripe', 'Shopify - Klaviyo', 'Nuxt - Supabase', 'React - Node'];
const locations = ['US', 'EU', 'Remote', 'Global'];
const riskLevels: Listing['riskLevel'][] = ['Low', 'Moderate', 'High'];

const feedTemplates: Array<Omit<FeedEntry, 'id' | 'createdAt'>> = [
  {
    type: 'sale',
    message: 'Website sold for $12,000',
    detail: 'Premium niche blog closed in under 2 hours.',
    amount: '$12,000'
  },
  {
    type: 'listing',
    message: 'New SaaS listed',
    detail: 'B2B workflow platform entered live auction.',
    amount: '$84,000'
  },
  {
    type: 'drop',
    message: 'Price dropped by 10%',
    detail: 'Seller cut ask after AI valuation recalibration.',
    amount: '-10%'
  },
  {
    type: 'signal',
    message: 'Undervalued deal identified',
    detail: 'Growth model flagged upside with low downside risk.',
    amount: '+18%'
  }
];

const defaultFilters: FilterState = {
  revenueMin: 4000,
  revenueMax: 28000,
  trafficMin: 12000,
  trafficMax: 90000,
  niche: 'all',
  monetization: 'all',
  techStack: 'all'
};

const interestOptions = ['SaaS', 'eCommerce', 'Content', 'Marketplace'];

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function buildListing(counter: number): Listing {
  const name = `${randomItem(listingNameParts)}${randomItem(listingSuffixes)}.${Math.random() > 0.5 ? 'io' : 'com'}`;
  const category = randomItem(categories);
  const monthlyRevenue = Math.round(6500 + Math.random() * 18000);
  const margin = 40 + Math.random() * 32;
  const monthlyProfit = Math.round(monthlyRevenue * (margin / 100));
  const traffic = Math.round(21000 + Math.random() * 52000);
  const growthScore = Math.round(60 + Math.random() * 35);
  const valuationMultiplier = 20 + growthScore / 10;
  const aiValuation = Math.round(monthlyProfit * valuationMultiplier + traffic * 0.4);
  const askingDiscount = 0.82 + Math.random() * 0.28;
  const askingPrice = Math.round(aiValuation * askingDiscount);

  const revenueHistory = Array.from({ length: 7 }, (_, idx) => {
    const weight = 0.92 + idx * 0.015;
    return Math.round(monthlyRevenue * weight);
  });

  const trafficHistory = Array.from({ length: 7 }, (_, idx) => {
    const weight = 0.9 + idx * 0.018;
    return Math.round(traffic * weight);
  });

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
    revenueHistory,
    trafficHistory,
    aiValuation,
    growthScore,
    riskLevel: randomItem(riskLevels),
    monetization: randomItem(monetizationModels),
    techStack: randomItem(techStacks),
    growthPotential: 'Expand paid acquisition and convert repeat users into annual plans.',
    location: randomItem(locations),
    previewUrl: 'https://example.com',
    demoModeAvailable: Math.random() > 0.45
  };
}

function createFeedEntry(): FeedEntry {
  const base = randomItem(feedTemplates);
  return {
    ...base,
    id: Date.now() + Math.floor(Math.random() * 1000),
    createdAt: Date.now()
  };
}

export default function HomePage() {
  // Supabase sometimes drops ?code= on the root URL instead of /auth/callback.
  // Catch it here and forward it so the session gets established correctly.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      window.location.replace(`/auth/callback?code=${encodeURIComponent(code)}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [listings, setListings] = useState(sampleListings);
  const [feed, setFeed] = useState(initialFeed);
  const [justListedIds, setJustListedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [budget, setBudget] = useState(180000);
  const [interests, setInterests] = useState<string[]>(['SaaS', 'Marketplace']);
  const [pastActivity, setPastActivity] = useState<string[]>(['SaaS', 'Content']);
  const [watchedIds, setWatchedIds] = useState<string[]>([]);
  const [followedSellers, setFollowedSellers] = useState<string[]>([]);
  const [selectedListingId, setSelectedListingId] = useState<string>(sampleListings[0]?.id ?? '');
  const listingCounterRef = useRef(sampleListings.length + 1);

  // Seed initial listings from the real database; fall back to sample data if
  // the API isn't reachable (e.g. no .env.local configured yet).
  useEffect(() => {
    fetch('/api/listings')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setListings(data);
          setSelectedListingId(data[0].id);
          listingCounterRef.current = data.length + 1;
        }
      })
      .catch(() => { /* keep sample data */ });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const liveSummary = useMemo(() => {
    const totalRevenue = listings.reduce((sum, item) => sum + item.monthlyRevenue, 0);
    return { totalRevenue, activeListings: listings.length };
  }, [listings]);

  const filteredListings = useMemo(
    () =>
      listings.filter((listing) => {
        const matchRevenue = listing.monthlyRevenue >= filters.revenueMin && listing.monthlyRevenue <= filters.revenueMax;
        const matchTraffic = listing.traffic >= filters.trafficMin && listing.traffic <= filters.trafficMax;
        const matchNiche = filters.niche === 'all' || listing.niche === filters.niche;
        const matchMonetization = filters.monetization === 'all' || listing.monetization === filters.monetization;
        const matchStack = filters.techStack === 'all' || listing.techStack === filters.techStack;
        return matchRevenue && matchTraffic && matchNiche && matchMonetization && matchStack;
      }),
    [listings, filters]
  );

  const matchScores = useMemo(() => {
    const byId: Record<string, number> = {};

    for (const listing of listings) {
      const budgetDistance = Math.abs(budget - listing.askingPrice);
      const budgetScore = Math.max(10, 100 - (budgetDistance / Math.max(1, budget)) * 100);
      const interestScore = interests.includes(listing.category) ? 100 : 45;
      const historyScore = pastActivity.includes(listing.category) ? 90 : 50;
      const valuationScore = listing.askingPrice < listing.aiValuation ? 85 : 60;
      const growthScore = listing.growthScore;
      const score = Math.round(budgetScore * 0.32 + interestScore * 0.24 + historyScore * 0.18 + valuationScore * 0.12 + growthScore * 0.14);
      byId[listing.id] = Math.min(99, Math.max(40, score));
    }

    return byId;
  }, [listings, budget, interests, pastActivity]);

  const selectedListing = useMemo(
    () => filteredListings.find((listing) => listing.id === selectedListingId) ?? filteredListings[0] ?? null,
    [filteredListings, selectedListingId]
  );

  useEffect(() => {
    if (!selectedListing && filteredListings[0]) {
      setSelectedListingId(filteredListings[0].id);
    }
  }, [selectedListing, filteredListings]);

  useEffect(() => {
    const metricInterval = setInterval(() => {
      setListings((current) =>
        current.map((listing) => {
          const variance = Math.random() * 0.08 - 0.04;
          const revenueFactor = 1 + variance;
          const trafficFactor = 1 + variance * 1.75;

          const monthlyRevenue = Math.max(2000, Math.round(listing.monthlyRevenue * revenueFactor));
          const traffic = Math.max(9000, Math.round(listing.traffic * trafficFactor));
          const nextMargin = Math.min(84, Math.max(30, listing.profitMargin + variance * 8));
          const monthlyProfit = Math.round(monthlyRevenue * (nextMargin / 100));
          const growthScore = Math.min(99, Math.max(40, Math.round(listing.growthScore + variance * 20)));
          const aiValuation = Math.round(monthlyProfit * (20 + growthScore / 10) + traffic * 0.4);
          const valuationGap = aiValuation - listing.askingPrice;
          const askDrift = valuationGap > 0 ? 1 + Math.random() * 0.01 : 1 - Math.random() * 0.01;
          const askingPrice = Math.round(Math.max(18000, listing.askingPrice * askDrift));

          return {
            ...listing,
            askingPrice,
            monthlyRevenue,
            yearlyRevenue: monthlyRevenue * 12,
            monthlyProfit,
            profitMargin: Number(nextMargin.toFixed(1)),
            traffic,
            revenueHistory: [...listing.revenueHistory.slice(-6), monthlyRevenue],
            trafficHistory: [...listing.trafficHistory.slice(-6), traffic],
            aiValuation,
            growthScore
          };
        })
      );

      setFeed((current) => [createFeedEntry(), ...current].slice(0, 10));
    }, 3600);

    const listingInterval = setInterval(() => {
      setListings((current) => {
        const newListing = buildListing(listingCounterRef.current);
        listingCounterRef.current += 1;
        setJustListedIds((ids) => [newListing.id, ...ids]);
        return [newListing, ...current].slice(0, 10);
      });
    }, 12000);

    return () => {
      clearInterval(metricInterval);
      clearInterval(listingInterval);
    };
  }, []);

  useEffect(() => {
    if (justListedIds.length === 0) {
      return;
    }

    const timeout = setTimeout(() => {
      setJustListedIds((ids) => ids.slice(0, -1));
    }, 6500);

    return () => clearTimeout(timeout);
  }, [justListedIds]);

  function toggleInterest(value: string) {
    setInterests((current) => (current.includes(value) ? current.filter((item) => item !== value) : [...current, value]));
  }

  function togglePastActivity(value: string) {
    setPastActivity((current) => (current.includes(value) ? current.filter((item) => item !== value) : [...current, value]));
  }

  function toggleWatch(id: string) {
    setWatchedIds((current) => (current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]));
  }

  function toggleFollowSeller(seller: string) {
    setFollowedSellers((current) => (current.includes(seller) ? current.filter((entry) => entry !== seller) : [...current, seller]));
  }

  return (
    <main className="app-shell">
      <div className="mx-auto max-w-[1720px] space-y-8 pb-24">
        <Navbar />
        <HeroSection summary={liveSummary} />

        <section className="panel rounded-[32px] border border-white/10 p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-cyan-300/80">Smart buyer matching</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Adaptive buyer profile engine</h3>
            </div>
            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-cyan-200">
              Personalized in real time
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="rounded-3xl bg-white/5 p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.26em] text-slate-400">Budget</p>
              <p className="mt-2 text-3xl font-semibold text-white">${budget.toLocaleString()}</p>
              <input
                type="range"
                min={40000}
                max={350000}
                step={5000}
                value={budget}
                onChange={(event) => setBudget(Number(event.target.value))}
                className="mt-3 w-full"
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-3xl bg-white/5 p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.26em] text-slate-400">Interests</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {interestOptions.map((entry) => (
                    <button
                      key={entry}
                      onClick={() => toggleInterest(entry)}
                      className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${
                        interests.includes(entry) ? 'bg-cyan-500/20 text-cyan-100' : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {entry}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white/5 p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.26em] text-slate-400">Past activity</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {interestOptions.map((entry) => (
                    <button
                      key={entry}
                      onClick={() => togglePastActivity(entry)}
                      className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${
                        pastActivity.includes(entry) ? 'bg-emerald-500/20 text-emerald-100' : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {entry}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <AdvancedFilters
          filters={filters}
          niches={[...new Set(listings.map((listing) => listing.niche))]}
          monetizations={[...new Set(listings.map((listing) => listing.monetization))]}
          techStacks={[...new Set(listings.map((listing) => listing.techStack))]}
          onChange={setFilters}
          onReset={() => setFilters(defaultFilters)}
        />

        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
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

      {selectedListing && (
        <div className="mobile-sticky-buy md:hidden">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Selected listing</p>
            <p className="text-sm font-semibold text-white">{selectedListing.name}</p>
            <p className="text-xs text-cyan-100">{selectedListing.askingPrice.toLocaleString()} ask</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => toggleWatch(selectedListing.id)} className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs text-slate-200">
              {watchedIds.includes(selectedListing.id) ? 'Saved' : 'Save'}
            </button>
            <button className="glow-button rounded-full px-4 py-2 text-xs font-semibold">Make Offer</button>
          </div>
        </div>
      )}
    </main>
  );
}
