'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import { createClient } from '../../../lib/supabase';

type RawListing = {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string | null;
  user_id: string;
  category: string;
  tech_stack: string | null;
  monthly_revenue: number;
  monthly_profit: number;
  monthly_traffic: number;
  monetization: string | null;
  website_url: string | null;
  age_bracket: string | null;
  contact_email: string | null;
  contact_name: string | null;
  notes: string | null;
  status: string;
  created_at: string;
};

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <p className="mb-1 text-[0.6rem] uppercase tracking-[0.28em] text-zinc-600">{label}</p>
      <p className="text-xl font-bold text-zinc-100">{value}</p>
    </div>
  );
}

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [listing, setListing] = useState<RawListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [userId, setUserId] = useState<string | null>(null);

  // Fetch listing
  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then((data) => setListing(data))
      .catch(() => setError('Listing not found or no longer available.'))
      .finally(() => setLoading(false));
  }, [id]);

  // Get current user
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  if (loading) {
    return (
      <main className="app-shell">
        <div className="mx-auto max-w-[1720px] space-y-8 pb-24">
          <Navbar />
          <div className="flex min-h-[60vh] items-center justify-center">
            <p className="text-sm text-zinc-600">Loading…</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !listing) {
    return (
      <main className="app-shell">
        <div className="mx-auto max-w-[1720px] space-y-8 pb-24">
          <Navbar />
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <p className="mb-4 text-4xl" style={{ opacity: 0.15 }}>◈</p>
            <p className="mb-2 text-base text-zinc-400">{error || 'Listing not found'}</p>
            <Link href="/browse" className="text-xs uppercase tracking-[0.2em] text-zinc-600 underline underline-offset-4 hover:text-zinc-400">
              Back to browse
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isSold = listing.status === 'sold';
  const isOwner = userId === listing.user_id;
  const revenue = Number(listing.monthly_revenue) || 0;
  const profit = Number(listing.monthly_profit) || 0;
  const traffic = Number(listing.monthly_traffic) || 0;
  const price = Number(listing.price) || 0;
  const margin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;
  const multiple = profit > 0 ? (price / (profit * 12)).toFixed(1) : '—';

  return (
    <main className="app-shell">
      <div className="mx-auto max-w-[1720px] space-y-8 pb-24">
        <Navbar />

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 px-1 text-xs text-zinc-600">
          <Link href="/browse" className="hover:text-zinc-400 transition">Browse</Link>
          <span>/</span>
          <span className="text-zinc-500 truncate max-w-[240px]">{listing.title}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Header card */}
            <div
              className="rounded-[28px] border p-8"
              style={{
                background: 'linear-gradient(145deg, rgba(15,15,15,0.98) 0%, rgba(10,10,10,0.99) 100%)',
                borderColor: 'rgba(140,140,140,0.12)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
              }}
            >
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full border px-3 py-0.5 text-[0.65rem] uppercase tracking-[0.22em]"
                  style={{ borderColor: 'rgba(160,160,160,0.2)', background: 'rgba(140,140,140,0.08)', color: 'rgba(200,200,200,0.8)' }}
                >
                  {listing.category}
                </span>
                {listing.tech_stack && (
                  <span
                    className="rounded-full border px-3 py-0.5 text-[0.65rem] uppercase tracking-[0.2em] text-zinc-500"
                    style={{ borderColor: 'rgba(120,120,120,0.15)', background: 'rgba(255,255,255,0.02)' }}
                  >
                    {listing.tech_stack}
                  </span>
                )}
                {isSold && (
                  <span className="rounded-full border px-3 py-0.5 text-[0.65rem] uppercase tracking-[0.2em] text-rose-400"
                    style={{ borderColor: 'rgba(255,60,60,0.2)', background: 'rgba(255,60,60,0.06)' }}>
                    Sold
                  </span>
                )}
              </div>

              <h1
                className="mb-3 text-3xl font-bold md:text-4xl"
                style={{
                  background: 'linear-gradient(180deg, #f0f0f0 0%, #c0c0c0 50%, #888 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {listing.title}
              </h1>

              <p className="text-sm leading-relaxed text-zinc-500">{listing.description}</p>

              {listing.notes && (
                <div
                  className="mt-5 rounded-xl border p-4"
                  style={{ borderColor: 'rgba(120,120,120,0.12)', background: 'rgba(255,255,255,0.02)' }}
                >
                  <p className="mb-1 text-[0.6rem] uppercase tracking-[0.28em] text-zinc-600">Seller notes</p>
                  <p className="text-sm text-zinc-500">{listing.notes}</p>
                </div>
              )}
            </div>

            {/* Screenshot */}
            {listing.image_url && (
              <div
                className="overflow-hidden rounded-[24px] border"
                style={{ borderColor: 'rgba(120,120,120,0.12)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={listing.image_url}
                  alt={listing.title}
                  className="w-full object-cover"
                  style={{ maxHeight: 480 }}
                />
              </div>
            )}

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatBox label="Asking price" value={`$${price.toLocaleString()}`} />
              <StatBox label="Monthly revenue" value={`$${revenue.toLocaleString()}`} />
              <StatBox label="Profit margin" value={`${margin}%`} />
              <StatBox label="Monthly traffic" value={traffic > 0 ? `${(traffic / 1000).toFixed(1)}k` : '—'} />
            </div>

            {/* Additional details */}
            <div
              className="rounded-[24px] border p-6"
              style={{
                background: 'rgba(12,12,12,0.97)',
                borderColor: 'rgba(120,120,120,0.1)',
              }}
            >
              <p className="mb-4 text-[0.65rem] uppercase tracking-[0.38em] text-zinc-600">Asset details</p>
              <div className="grid gap-y-3 sm:grid-cols-2">
                {[
                  { label: 'Revenue multiple', value: `${multiple}x annual profit` },
                  { label: 'Monetization', value: listing.monetization ?? '—' },
                  { label: 'Age', value: listing.age_bracket ?? '—' },
                  { label: 'Website URL', value: listing.website_url ?? '—' },
                  { label: 'Listed', value: new Date(listing.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span className="text-[0.6rem] uppercase tracking-[0.22em] text-zinc-700">{label}</span>
                    <span className="text-sm text-zinc-400">
                      {label === 'Website URL' && listing.website_url ? (
                        <a href={listing.website_url} target="_blank" rel="noopener noreferrer"
                          className="text-cyan-400/70 hover:text-cyan-300 underline underline-offset-4 transition">
                          {listing.website_url}
                        </a>
                      ) : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — Purchase card */}
          <div className="space-y-4">
            <div
              className="sticky top-6 rounded-[28px] border p-7"
              style={{
                background: 'linear-gradient(145deg, rgba(16,16,16,0.99) 0%, rgba(10,10,10,1) 100%)',
                borderColor: 'rgba(160,160,160,0.14)',
                boxShadow: '0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              {/* Price */}
              <p className="mb-1 text-[0.6rem] uppercase tracking-[0.3em] text-zinc-600">Asking price</p>
              <p
                className="mb-6 text-4xl font-bold tabular-nums"
                style={{
                  background: 'linear-gradient(135deg, #f0f0f0 0%, #c8c8c8 40%, #989898 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                ${price.toLocaleString()}
              </p>

              {/* Quick stats */}
              <div className="mb-6 space-y-2.5">
                {[
                  { label: 'Monthly profit', value: `$${profit.toLocaleString()}` },
                  { label: 'Revenue multiple', value: `${multiple}x` },
                  { label: 'Category', value: listing.category },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-zinc-600">{label}</span>
                    <span className="text-xs font-medium text-zinc-300">{value}</span>
                  </div>
                ))}
              </div>

              <div className="mb-4 h-px" style={{ background: 'rgba(120,120,120,0.1)' }} />

              {/* Contact / status */}
              {isSold ? (
                <div className="rounded-xl py-4 text-center text-sm font-semibold text-zinc-600"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(120,120,120,0.1)' }}>
                  This asset has been sold
                </div>
              ) : isOwner ? (
                <div className="rounded-xl py-4 text-center text-xs text-zinc-600"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(120,120,120,0.1)' }}>
                  You own this listing
                </div>
              ) : userId ? (
                /* Logged-in buyer — show seller contact directly */
                listing.contact_email ? (
                  <div
                    className="rounded-xl border p-5"
                    style={{ borderColor: 'rgba(100,200,100,0.2)', background: 'rgba(100,200,100,0.04)' }}
                  >
                    <p className="mb-3 text-[0.6rem] uppercase tracking-[0.3em] text-emerald-600">Contact seller</p>
                    {listing.contact_name && (
                      <p className="mb-1 text-sm font-medium text-zinc-300">{listing.contact_name}</p>
                    )}
                    <a
                      href={`mailto:${listing.contact_email}`}
                      className="block text-sm text-emerald-400/80 underline underline-offset-4 hover:text-emerald-300 transition"
                    >
                      {listing.contact_email}
                    </a>
                  </div>
                ) : (
                  <div className="rounded-xl py-4 text-center text-xs text-zinc-600"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(120,120,120,0.1)' }}>
                    No contact info provided
                  </div>
                )
              ) : (
                /* Not logged in */
                <Link
                  href={`/auth/login?redirectTo=/browse/${id}`}
                  className="block w-full rounded-full py-4 text-center text-sm font-bold uppercase tracking-[0.18em] transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, #d0d0d0 0%, #a0a0a0 50%, #787878 100%)',
                    color: '#050505',
                    boxShadow: '0 0 30px rgba(180,180,180,0.2), 0 8px 20px rgba(0,0,0,0.4)',
                  }}
                >
                  Sign in to contact seller
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
