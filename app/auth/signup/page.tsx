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

export default function SignupPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirectTo   = searchParams.get('redirectTo') ?? '/';

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}` },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // If email confirmation is disabled in Supabase, sign in directly
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!signInError) {
      router.push(redirectTo);
      router.refresh();
      return;
    }

    // Email confirmation is enabled — show success message
    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <main className="app-shell">
        <div className="mx-auto max-w-[1720px] space-y-8 pb-24">
          <Navbar />
          <div className="flex min-h-[70vh] items-center justify-center px-4">
            <div
              className="w-full max-w-md rounded-2xl border p-10 text-center"
              style={{
                background: 'rgba(10,10,10,0.97)',
                borderColor: 'rgba(120,120,120,0.1)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
              }}
            >
              <div
                className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl text-xl"
                style={{
                  background: 'rgba(140,140,140,0.1)',
                  border: '1px solid rgba(140,140,140,0.2)',
                }}
              >
                ✉
              </div>
              <h2
                className="mb-3 text-2xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #f0f0f0 0%, #c0c0c0 45%, #888 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Check your email
              </h2>
              <p className="text-sm text-zinc-500">
                We sent a confirmation link to{' '}
                <span className="text-zinc-300">{email}</span>. Click it to
                activate your account.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
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
              Create account
            </h1>
            <p className="mb-8 text-xs text-zinc-600">
              Already have one?{' '}
              <Link
                href={`/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`}
                className="text-zinc-400 underline underline-offset-4 hover:text-zinc-200"
              >
                Sign in
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
                  placeholder="Min. 8 characters"
                  className={inputCls}
                  style={inputStyle}
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[0.65rem] uppercase tracking-[0.32em] text-zinc-500">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  className={inputCls}
                  style={inputStyle}
                  required
                  autoComplete="new-password"
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
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
