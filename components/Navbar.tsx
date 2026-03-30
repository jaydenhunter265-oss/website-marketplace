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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 24); }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setMenuOpen(false);
    setMobileOpen(false);
    router.push('/');
    router.refresh();
  }

  const initial = user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <header className={`navbar-glass fixed left-0 right-0 top-0 z-50 ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="mx-auto max-w-[1720px] px-6 py-3">
        <div className="flex items-center justify-between gap-6">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="navbar-logo flex h-10 w-10 items-center justify-center rounded-2xl">
              <span className="text-sm font-extrabold tracking-tight" style={{ color: '#080808' }}>FM</span>
            </div>
            <span className="chrome-text text-lg font-extrabold tracking-tight hidden sm:block">
              FuturiMarket
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-7">
            <Link href="/browse"     className="nav-link">Marketplace</Link>
            <Link href="/sell"       className="nav-link">Sell</Link>
            <a href="#how-it-works"  className="nav-link">How It Works</a>
            <a href="#why-us"        className="nav-link">Why Us</a>
            <a href="#about"         className="nav-link">About</a>
          </nav>

          {/* ── Auth + CTA ── */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(o => !o)}
                  className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 transition hover:border-white/18 hover:bg-white/[0.06]"
                >
                  <span className="chrome-avatar flex h-6 w-6 items-center justify-center rounded-full text-[0.65rem] font-bold text-black">
                    {initial}
                  </span>
                  <span className="max-w-[120px] truncate text-xs text-zinc-400">{user.email}</span>
                  <svg
                    className={`h-3 w-3 text-zinc-500 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="dropdown-glass absolute right-0 top-full z-50 mt-2 w-48 rounded-2xl py-1 shadow-2xl">
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="dropdown-item">
                      My Dashboard
                    </Link>
                    <Link href="/sell" onClick={() => setMenuOpen(false)} className="dropdown-item">
                      List a Website
                    </Link>
                    <div className="mx-3 my-1 h-px bg-white/[0.06]" />
                    <button
                      onClick={handleSignOut}
                      className="dropdown-item w-full text-left text-rose-400/80 hover:text-rose-300"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="nav-link">Sign in</Link>
            )}

            <Link href="/browse" className="chrome-btn px-5 py-2.5 text-sm">
              Browse Listings
            </Link>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="flex flex-col gap-[5px] p-1 lg:hidden"
            aria-label="Toggle menu"
          >
            <span className={`hamburger-line ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`hamburger-line ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`hamburger-line ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileOpen && (
          <div className="mobile-menu-glass mt-3 rounded-2xl p-4 lg:hidden">
            <nav className="flex flex-col gap-1">
              <Link href="/browse"    onClick={() => setMobileOpen(false)} className="mobile-nav-link">Marketplace</Link>
              <Link href="/sell"      onClick={() => setMobileOpen(false)} className="mobile-nav-link">Sell</Link>
              <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="mobile-nav-link">How It Works</a>
              <a href="#why-us"       onClick={() => setMobileOpen(false)} className="mobile-nav-link">Why Us</a>

              <div className="my-2 h-px bg-white/[0.06]" />

              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="mobile-nav-link">Dashboard</Link>
                  <button onClick={handleSignOut} className="mobile-nav-link text-left text-rose-400">Sign out</button>
                </>
              ) : (
                <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="mobile-nav-link">Sign in</Link>
              )}

              <Link
                href="/browse"
                onClick={() => setMobileOpen(false)}
                className="chrome-btn mt-3 py-3 text-sm text-center"
              >
                Browse Listings
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
