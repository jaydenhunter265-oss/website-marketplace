import { redirect } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase-server';

type MyListing = {
  id: string;
  title: string;
  category: string;
  price: number;
  status: string;
  created_at: string;
};

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { text: string; cls: string }> = {
    active:    { text: 'Active',    cls: 'text-emerald-400 border-emerald-400/25 bg-emerald-400/6' },
    sold:      { text: 'Sold',      cls: 'text-zinc-500 border-zinc-500/20 bg-zinc-500/5' },
    pending:   { text: 'Pending',   cls: 'text-amber-400 border-amber-400/25 bg-amber-400/6' },
    completed: { text: 'Completed', cls: 'text-emerald-400 border-emerald-400/25 bg-emerald-400/6' },
    removed:   { text: 'Removed',   cls: 'text-rose-400 border-rose-400/25 bg-rose-400/6' },
  };
  const { text, cls } = map[status] ?? { text: status, cls: 'text-zinc-500' };
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-[0.62rem] uppercase tracking-[0.18em] ${cls}`}>
      {text}
    </span>
  );
}

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirectTo=/dashboard');
  }

  const service = createServiceRoleClient();

  const { data: myListings } = await service
    .from('listings')
    .select('id, title, category, price, status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const listingList = (myListings ?? []) as MyListing[];

  return (
    <main className="app-shell">
      <div className="mx-auto max-w-[1720px] space-y-8 pb-24">
        <Navbar />

        {/* Header */}
        <section
          className="rounded-[28px] border px-8 py-10"
          style={{
            background: 'linear-gradient(145deg, rgba(14,14,14,0.99) 0%, rgba(8,8,8,1) 100%)',
            borderColor: 'rgba(140,140,140,0.1)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          <p className="mb-1 text-[0.62rem] uppercase tracking-[0.45em] text-zinc-600">Account</p>
          <h1
            className="mb-1 text-3xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #e8e8e8 0%, #b0b0b0 50%, #888 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Dashboard
          </h1>
          <p className="mb-6 text-xs text-zinc-600">{user.email}</p>

          <div className="flex flex-wrap gap-6">
            {[
              { label: 'Active listings',  value: String(listingList.filter((l) => l.status === 'active').length) },
              { label: 'Listings sold',    value: String(listingList.filter((l) => l.status === 'sold').length) },
              { label: 'Total listings',   value: String(listingList.length) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p
                  className="text-2xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #e0e0e0 0%, #a0a0a0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {value}
                </p>
                <p className="text-[0.6rem] uppercase tracking-[0.25em] text-zinc-600">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── My Listings ── */}
        <section>
          <div className="mb-4 flex items-center justify-between px-1">
            <p className="text-[0.65rem] uppercase tracking-[0.38em] text-zinc-600">My listings</p>
            <Link href="/sell"
              className="text-[0.65rem] uppercase tracking-[0.2em] text-zinc-600 underline underline-offset-4 hover:text-zinc-400 transition">
              + Add listing
            </Link>
          </div>

          {listingList.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center rounded-2xl border py-16 text-center"
              style={{ borderColor: 'rgba(120,120,120,0.08)', background: 'rgba(10,10,10,0.5)' }}
            >
              <p className="mb-3 text-3xl" style={{ opacity: 0.12 }}>◈</p>
              <p className="text-sm text-zinc-600">No listings yet.</p>
              <Link href="/sell"
                className="mt-3 text-[0.7rem] uppercase tracking-[0.2em] text-zinc-600 underline underline-offset-4 hover:text-zinc-400">
                List your website
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {listingList.map((listing) => (
                <div
                  key={listing.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-5"
                  style={{
                    background: 'rgba(12,12,12,0.97)',
                    borderColor: 'rgba(120,120,120,0.1)',
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <StatusPill status={listing.status} />
                      <span className="text-[0.62rem] uppercase tracking-[0.2em] text-zinc-600">
                        {listing.category}
                      </span>
                    </div>
                    <p className="font-semibold text-zinc-200">{listing.title}</p>
                    <p className="mt-0.5 text-xs text-zinc-600">
                      Listed {new Date(listing.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <p
                      className="text-lg font-bold tabular-nums"
                      style={{
                        background: 'linear-gradient(135deg, #e0e0e0 0%, #a0a0a0 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      ${Number(listing.price).toLocaleString()}
                    </p>
                    {listing.status === 'active' && (
                      <Link
                        href={`/browse/${listing.id}`}
                        className="rounded-full border px-4 py-1.5 text-[0.65rem] uppercase tracking-[0.18em] text-zinc-500 transition hover:border-zinc-500 hover:text-zinc-300"
                        style={{ borderColor: 'rgba(120,120,120,0.2)' }}
                      >
                        View
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
