'use client';

import { Suspense, useState } from 'react';
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

function LoginForm() {
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

  async function handleGoogleSignIn() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    });
  }

  return (
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

        {/* Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="mb-6 flex w-full items-center justify-center gap-3 rounded-xl border py-3 text-sm font-medium transition-all duration-200 hover:border-zinc-500 hover:text-zinc-200"
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderColor: 'rgba(120,120,120,0.2)',
            color: 'rgba(180,180,180,0.9)',
          }}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" style={{ borderColor: 'rgba(120,120,120,0.12)' }} />
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 text-[0.65rem] uppercase tracking-[0.3em] text-zinc-600"
              style={{ background: 'rgba(10,10,10,0.97)' }}>
              or email
            </span>
          </div>
        </div>

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
  );
}

export default function LoginPage() {
  return (
    <main className="app-shell">
      <div className="mx-auto max-w-[1720px] space-y-8 pb-24">
        <Navbar />
        <Suspense fallback={<div className="flex min-h-[70vh] items-center justify-center" />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
