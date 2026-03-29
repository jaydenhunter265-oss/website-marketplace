'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Listing } from '../lib/data';

type IntelligenceDeckProps = {
  listings: Listing[];
  selectedListing: Listing | null;
  matchScores: Record<string, number>;
  watchedIds: string[];
  followedSellers: string[];
  onSelectListing: (id: string) => void;
  onToggleWatch: (id: string) => void;
  onToggleFollowSeller: (seller: string) => void;
};

type DealMessage = {
  id: number;
  author: 'Buyer' | 'Seller';
  text: string;
  createdAt: number;
};

type OfferRow = {
  id: number;
  label: string;
  amount: number;
  status: 'Pending' | 'Countered' | 'Accepted';
};

function formatMoney(value: number): string {
  return `$${value.toLocaleString()}`;
}

export default function IntelligenceDeck({
  listings,
  selectedListing,
  matchScores,
  watchedIds,
  followedSellers,
  onSelectListing,
  onToggleWatch,
  onToggleFollowSeller
}: IntelligenceDeckProps) {
  const [previewMode, setPreviewMode] = useState<'live' | 'sandbox'>('live');
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<DealMessage[]>([
    { id: 1, author: 'Seller', text: 'All financial exports are available in the data room.', createdAt: Date.now() - 420000 },
    { id: 2, author: 'Buyer', text: 'Great. I am reviewing churn and cohort retention now.', createdAt: Date.now() - 260000 }
  ]);
  const [offers, setOffers] = useState<OfferRow[]>([
    { id: 1, label: 'Initial ask', amount: selectedListing?.askingPrice ?? 0, status: 'Pending' },
    {
      id: 2,
      label: 'Current offer',
      amount: selectedListing ? Math.round(selectedListing.askingPrice * 0.92) : 0,
      status: 'Countered'
    }
  ]);

  const trending = useMemo(
    () =>
      [...listings]
        .sort((a, b) => (matchScores[b.id] ?? 0) + b.growthScore - ((matchScores[a.id] ?? 0) + a.growthScore))
        .slice(0, 4),
    [listings, matchScores]
  );

  const hotDeals = useMemo(
    () => listings.filter((listing) => listing.askingPrice < listing.aiValuation * 0.88).slice(0, 3),
    [listings]
  );

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim()) {
      return;
    }

    setMessages((current) => [
      ...current,
      { id: Date.now(), author: 'Buyer', text: draft.trim(), createdAt: Date.now() }
    ]);
    setDraft('');
  }

  function pushOffer() {
    if (!selectedListing) {
      return;
    }

    const amount = Math.round(selectedListing.askingPrice * (0.86 + Math.random() * 0.1));
    setOffers((current) => [
      ...current,
      {
        id: Date.now(),
        label: `Offer #${current.length + 1}`,
        amount,
        status: Math.random() > 0.5 ? 'Pending' : 'Countered'
      }
    ]);
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <article className="panel rounded-[30px] border border-white/10 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-cyan-300/80">Smart matching</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Buyer-fit recommendations</h3>
          </div>
          <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">AI rank</span>
        </div>
        <div className="space-y-3">
          {trending.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectListing(item.id)}
              className="w-full rounded-3xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-cyan-300/35"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">{item.name}</p>
                <p className="text-sm font-semibold text-cyan-200">{matchScores[item.id] ?? 62}% match</p>
              </div>
              <p className="mt-1 text-sm text-slate-400">{item.niche}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-200">{formatMoney(item.askingPrice)}</span>
                <span className="rounded-full border border-emerald-300/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                  {item.growthScore}/100 growth
                </span>
                <span className="rounded-full border border-indigo-300/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-100">{item.monetization}</span>
              </div>
            </button>
          ))}
        </div>
      </article>

      <article className="panel rounded-[30px] border border-white/10 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-cyan-300/80">Preview mode</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Website and SaaS sandbox</h3>
          </div>
          <div className="flex gap-2 text-xs">
            <button
              onClick={() => setPreviewMode('live')}
              className={`rounded-full px-3 py-1 uppercase tracking-[0.24em] ${
                previewMode === 'live' ? 'bg-cyan-500/20 text-cyan-100' : 'bg-white/5 text-slate-300'
              }`}
            >
              Live
            </button>
            <button
              onClick={() => setPreviewMode('sandbox')}
              className={`rounded-full px-3 py-1 uppercase tracking-[0.24em] ${
                previewMode === 'sandbox' ? 'bg-cyan-500/20 text-cyan-100' : 'bg-white/5 text-slate-300'
              }`}
            >
              Sandbox
            </button>
          </div>
        </div>

        {selectedListing ? (
          <div className="space-y-3">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-3">
              <p className="text-sm font-semibold text-white">{selectedListing.name}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                {previewMode === 'sandbox' ? 'Interactive demo runtime' : 'Live site preview'}
              </p>
            </div>
            {previewMode === 'live' ? (
              <iframe
                title="live preview"
                src={selectedListing.previewUrl}
                className="h-56 w-full rounded-3xl border border-white/10 bg-slate-950"
              />
            ) : (
              <div className="h-56 rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-slate-950 to-cyan-950/20 p-4">
                <p className="text-sm text-slate-300">Sandbox telemetry</p>
                <p className="mt-2 text-lg font-semibold text-cyan-100">
                  {selectedListing.demoModeAvailable ? 'Demo mode ready' : 'Demo pending seller access'}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-2xl bg-white/5 p-3 text-slate-200">Signup flow replay</div>
                  <div className="rounded-2xl bg-white/5 p-3 text-slate-200">Billing webhook simulation</div>
                  <div className="rounded-2xl bg-white/5 p-3 text-slate-200">Load test snapshots</div>
                  <div className="rounded-2xl bg-white/5 p-3 text-slate-200">Admin action trails</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-slate-300">Select a listing to open preview mode.</p>
        )}
      </article>

      <article className="panel rounded-[30px] border border-white/10 p-6 xl:col-span-2">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-cyan-300/80">Deal room</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Private negotiation workspace</h3>
          </div>
          <button onClick={pushOffer} className="glow-button rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em]">
            Submit offer
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Negotiation chat</p>
            <div className="max-h-56 space-y-2 overflow-auto">
              {messages.map((message) => (
                <div key={message.id} className={`rounded-2xl px-3 py-2 text-sm ${message.author === 'Buyer' ? 'bg-cyan-500/15 text-cyan-100' : 'bg-slate-900/75 text-slate-200'}`}>
                  <p className="text-xs uppercase tracking-[0.2em] opacity-75">{message.author}</p>
                  <p className="mt-1">{message.text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={submitMessage} className="flex gap-2">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Send a private message"
                className="flex-1 rounded-full border border-white/10 bg-slate-950/80 px-4 py-2 text-sm text-slate-100"
              />
              <button type="submit" className="rounded-full border border-cyan-300/30 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-100">
                Send
              </button>
            </form>
          </div>

          <div className="grid gap-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Files</p>
              <div className="mt-2 space-y-2 text-sm text-slate-200">
                <p className="rounded-2xl bg-slate-900/70 px-3 py-2">P&L Export Q1-Q4.csv</p>
                <p className="rounded-2xl bg-slate-900/70 px-3 py-2">Traffic Verification.pdf</p>
                <p className="rounded-2xl bg-slate-900/70 px-3 py-2">Churn Cohorts.xlsx</p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Offer tracking</p>
              <div className="mt-2 space-y-2 text-sm">
                {offers.map((offer) => (
                  <div key={offer.id} className="rounded-2xl bg-slate-900/70 px-3 py-2 text-slate-200">
                    <div className="flex items-center justify-between">
                      <span>{offer.label}</span>
                      <span>{formatMoney(offer.amount)}</span>
                    </div>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cyan-200">{offer.status}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Deal timeline</p>
              <div className="mt-2 space-y-2 text-xs uppercase tracking-[0.2em] text-slate-300">
                <p>KYC completed</p>
                <p>Data room unlocked</p>
                <p>Letter of intent drafted</p>
                <p>Escrow readiness check</p>
              </div>
            </div>
          </div>
        </div>
      </article>

      <article className="panel rounded-[30px] border border-white/10 p-6 xl:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-cyan-300/80">Social and viral</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Trending businesses and hot deals</h3>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {hotDeals.map((listing) => (
            <div key={listing.id} className="rounded-3xl border border-emerald-300/25 bg-emerald-500/10 p-4">
              <p className="text-sm font-semibold text-white">{listing.name}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.22em] text-emerald-100">Hot deal</p>
              <p className="mt-2 text-sm text-slate-100">{formatMoney(listing.askingPrice)} ask vs {formatMoney(listing.aiValuation)} AI fair value</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => onToggleWatch(listing.id)}
                  className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${
                    watchedIds.includes(listing.id) ? 'bg-cyan-500/20 text-cyan-100' : 'bg-white/10 text-slate-200'
                  }`}
                >
                  {watchedIds.includes(listing.id) ? 'Watching' : 'Watch'}
                </button>
                <button
                  onClick={() => onToggleFollowSeller(listing.seller)}
                  className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${
                    followedSellers.includes(listing.seller) ? 'bg-indigo-500/25 text-indigo-100' : 'bg-white/10 text-slate-200'
                  }`}
                >
                  {followedSellers.includes(listing.seller) ? 'Following' : 'Follow seller'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
