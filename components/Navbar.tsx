'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push('/');
    router.refresh();
  }

  const initial = user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <header className="panel rounded-[32px] border border-white/10 p-6 backdrop-blur-xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-indigo-500 shadow-glow">
            <span className="text-lg font-semibold text-slate-950">FM</span>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">FuturiMarket</p>
            <h1 className="text-xl font-semibold text-white">Digital Asset Exchange</h1>
          </div>
        </Link>

        <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Nav links */}
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/browse" className="text-sm text-slate-300 transition hover:text-cyan-200">
              Browse
            </Link>
            <Link href="/sell" className="text-sm text-slate-300 transition hover:text-cyan-200">
              Sell
            </Link>
            {user && (
              <Link href="/dashboard" className="text-sm text-slate-300 transition hover:text-cyan-200">
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth section */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative" ref={menuRef}>
                {/* Avatar button */}
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2.5 rounded-full border px-3 py-1.5 transition-all duration-200 hover:border-zinc-500"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    borderColor: 'rgba(120,120,120,0.2)',
                  }}
                >
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[0.65rem] font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #c0c0c0 0%, #888 100%)',
                      color: '#050505',
                    }}
                  >
                    {initial}
                  </span>
                  <span className="max-w-[140px] truncate text-xs text-zinc-400">
                    {user.email}
                  </span>
                  <svg
                    className={`h-3 w-3 text-zinc-600 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {menuOpen && (
                  <div
                    className="absolute right-0 top-full z-50 mt-2 w-48 rounded-2xl border py-1 shadow-2xl"
                    style={{
                      background: 'rgba(12,12,12,0.98)',
                      borderColor: 'rgba(120,120,120,0.15)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
                    }}
                  >
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-xs text-zinc-400 transition hover:text-zinc-200"
                    >
                      My Dashboard
                    </Link>
                    <Link
                      href="/sell"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-xs text-zinc-400 transition hover:text-zinc-200"
                    >
                      List a Website
                    </Link>
                    <div
                      className="my-1 mx-3 h-px"
                      style={{ background: 'rgba(120,120,120,0.1)' }}
                    />
                    <button
                      onClick={handleSignOut}
                      className="block w-full px-4 py-2.5 text-left text-xs text-rose-400/80 transition hover:text-rose-300"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm text-slate-300 transition hover:text-cyan-200"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="silver-cta-btn button-pulse rounded-full px-6 py-3 text-sm font-semibold"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
