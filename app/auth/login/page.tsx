'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import { createClient } from '../../../lib/supabase';

const inputCls =
  'w-full rounded-xl border px-4 py-3 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-700 focus:border-zinc-500';
const inputStyle = {
  background: 'rgba(255,255,255,0.03)',
  borderColor: 'rgba(120,120,120,0.15)',
};

export default function LoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirectTo   = searchParams.get('redirectTo') ?? '/';

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <main className="app-shell">
      <div className="mx-auto max-w-[1720px] space-y-8 pb-24">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <div
            className="w-full max-w-md rounded-2xl border p-10"
            style={{
              background: 'rgba(10,10,10,0.97)',
              borderColor: 'rgba(120,120,120,0.1)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
            }}
          >
            {/* Header */}
            <p className="mb-2 text-[0.65rem] uppercase tracking-[0.5em] text-zinc-500">
              FuturiMarket
            </p>
            <h1
              className="mb-1 text-3xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #f0f0f0 0%, #c0c0c0 45%, #888 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Sign in
            </h1>
            <p className="mb-8 text-xs text-zinc-600">
              Don&apos;t have an account?{' '}
              <Link
                href={`/auth/signup?redirectTo=${encodeURIComponent(redirectTo)}`}
                className="text-zinc-400 underline underline-offset-4 hover:text-zinc-200"
              >
                Create one
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[0.65rem] uppercase tracking-[0.32em] text-zinc-500">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className={inputCls}
                  style={inputStyle}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[0.65rem] uppercase tracking-[0.32em] text-zinc-500">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputCls}
                  style={inputStyle}
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div
                  className="rounded-xl border px-4 py-3 text-xs text-rose-400"
                  style={{
                    background: 'rgba(255,60,60,0.06)',
                    borderColor: 'rgba(255,60,60,0.2)',
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full py-3 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-200 disabled:opacity-40"
                style={{
                  background: 'linear-gradient(135deg, #c0c0c0 0%, #888 50%, #666 100%)',
                  color: '#050505',
                  boxShadow: '0 0 20px rgba(160,160,160,0.2)',
                }}
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
