'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { createClient } from '../../lib/supabase';

type AdminListing = {
  id: string;
  title: string;
  category: string;
  price: number;
  status: string;
  created_at: string;
  user_id: string;
  contact_email: string | null;
  monthly_revenue: number;
};

const STATUS_OPTIONS = ['active', 'pending', 'sold', 'removed'] as const;

const statusStyle: Record<string, string> = {
  active:  'text-emerald-400 border-emerald-400/25 bg-emerald-400/6',
  pending: 'text-amber-400  border-amber-400/25  bg-amber-400/6',
  sold:    'text-zinc-500   border-zinc-500/20   bg-zinc-500/5',
  removed: 'text-rose-400   border-rose-400/25   bg-rose-400/6',
};

export default function AdminPage() {
  const router = useRouter();
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    // Verify admin client-side too
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push('/auth/login?redirectTo=/admin');
        return;
      }
      const { data: profile } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', data.user.id)
        .single();

      if (!profile?.is_admin) {
        router.push('/');
        return;
      }

      fetchListings();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fetchListings() {
    setLoading(true);
    fetch('/api/admin/listings')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setListings(data);
        else setError('Failed to load listings');
      })
      .catch(() => setError('Failed to load listings'))
      .finally(() => setLoading(false));
  }

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
      }
    } finally {
      setUpdating(null);
    }
  }

  async function deleteListing(id: string) {
    if (!confirm('Permanently delete this listing? This cannot be undone.')) return;
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/listings/${id}`, { method: 'DELETE' });
      if (res.ok) setListings((prev) => prev.filter((l) => l.id !== id));
    } finally {
      setUpdating(null);
    }
  }

  const filtered = filterStatus === 'all'
    ? listings
    : listings.filter((l) => l.status === filterStatus);

  const counts = {
    all:     listings.length,
    active:  listings.filter((l) => l.status === 'active').length,
    pending: listings.filter((l) => l.status === 'pending').length,
    sold:    listings.filter((l) => l.status === 'sold').length,
    removed: listings.filter((l) => l.status === 'removed').length,
  };

  return (
    <main className="app-shell">
      <div className="mx-auto max-w-[1720px] space-y-8 pb-24">
        <Navbar />

        {/* Header */}
        <section
          className="rounded-[28px] border px-8 py-10"
          style={{
            background: 'linear-gradient(145deg, rgba(14,14,14,0.99) 0%, rgba(8,8,8,1) 100%)',
            borderColor: 'rgba(180,60,60,0.15)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          <div className="mb-6 flex items-center gap-3">
            <span
              className="rounded-full border px-3 py-1 text-[0.6rem] uppercase tracking-[0.3em]"
              style={{ borderColor: 'rgba(255,60,60,0.2)', background: 'rgba(255,60,60,0.06)', color: 'rgba(255,100,100,0.8)' }}
            >
              Admin
            </span>
          </div>
          <h1
            className="mb-2 text-3xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #e8e8e8 0%, #b0b0b0 50%, #888 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Moderation Panel
          </h1>
          <p className="text-xs text-zinc-600">Manage listings, resolve disputes, and maintain marketplace quality.</p>

          {/* Stats */}
          <div className="mt-6 flex flex-wrap gap-6">
            {Object.entries(counts).map(([key, val]) => (
              <div key={key}>
                <p className="text-xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #e0e0e0 0%, #a0a0a0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >{val}</p>
                <p className="text-[0.58rem] uppercase tracking-[0.25em] text-zinc-600 capitalize">{key}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 px-1">
          {(['all', ...STATUS_OPTIONS] as string[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="rounded-full border px-4 py-1.5 text-[0.7rem] uppercase tracking-[0.18em] transition-all duration-200"
              style={
                filterStatus === s
                  ? { background: 'linear-gradient(135deg, #b0b0b0, #707070)', borderColor: 'transparent', color: '#050505' }
                  : { background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(120,120,120,0.15)', color: 'rgba(160,160,160,0.7)' }
              }
            >
              {s} {s !== 'all' && `(${counts[s as keyof typeof counts]})`}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <p className="text-sm text-zinc-600">Loading…</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border px-6 py-8 text-center"
            style={{ borderColor: 'rgba(255,60,60,0.2)', background: 'rgba(255,60,60,0.04)' }}>
            <p className="text-sm text-rose-400">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border py-16 text-center"
            style={{ borderColor: 'rgba(120,120,120,0.08)', background: 'rgba(10,10,10,0.5)' }}>
            <p className="text-sm text-zinc-600">No listings in this category.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((listing) => (
              <div
                key={listing.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-5 transition-all duration-200"
                style={{
                  background: updating === listing.id ? 'rgba(20,20,20,0.99)' : 'rgba(12,12,12,0.97)',
                  borderColor: 'rgba(120,120,120,0.1)',
                  opacity: updating === listing.id ? 0.6 : 1,
                }}
              >
                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-0.5 text-[0.6rem] uppercase tracking-[0.18em] ${statusStyle[listing.status] ?? 'text-zinc-500'}`}>
                      {listing.status}
                    </span>
                    <span className="text-[0.6rem] uppercase tracking-[0.2em] text-zinc-600">{listing.category}</span>
                  </div>
                  <p className="font-semibold text-zinc-200">{listing.title}</p>
                  <p className="mt-0.5 text-[0.65rem] text-zinc-600">
                    ${Number(listing.price).toLocaleString()} asking ·{' '}
                    ${Number(listing.monthly_revenue).toLocaleString()}/mo revenue ·{' '}
                    {new Date(listing.created_at).toLocaleDateString()}
                  </p>
                  {listing.contact_email && (
                    <p className="mt-0.5 text-[0.62rem] text-zinc-700">{listing.contact_email}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/browse/${listing.id}`}
                    className="rounded-full border px-3.5 py-1.5 text-[0.65rem] uppercase tracking-[0.18em] text-zinc-500 transition hover:border-zinc-500 hover:text-zinc-300"
                    style={{ borderColor: 'rgba(120,120,120,0.2)' }}
                  >
                    View
                  </Link>

                  <select
                    value={listing.status}
                    disabled={updating === listing.id}
                    onChange={(e) => updateStatus(listing.id, e.target.value)}
                    className="rounded-full border px-3 py-1.5 text-[0.65rem] text-zinc-400 outline-none transition"
                    style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(120,120,120,0.2)' }}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s} style={{ background: '#111' }}>
                        {s}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => deleteListing(listing.id)}
                    disabled={updating === listing.id}
                    className="rounded-full border px-3.5 py-1.5 text-[0.65rem] uppercase tracking-[0.18em] text-rose-500/70 transition hover:border-rose-500/40 hover:text-rose-400 disabled:opacity-40"
                    style={{ borderColor: 'rgba(255,60,60,0.15)' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
