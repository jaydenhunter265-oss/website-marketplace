'use client';

import { useEffect, useState } from 'react';
import { FeedEntry } from '../lib/data';

type MarketFeedProps = {
  feed: FeedEntry[];
};

const typeConfig: Record<FeedEntry['type'], { label: string; dot: string; badge: string; icon: string }> = {
  sale:    { label: 'Sale',    dot: '#4ade80', badge: 'border-emerald-400/25 bg-emerald-500/10 text-emerald-300', icon: '↗' },
  listing: { label: 'New',     dot: '#38bdf8', badge: 'border-sky-400/25     bg-sky-500/10     text-sky-300',     icon: '+' },
  drop:    { label: 'Drop',    dot: '#fbbf24', badge: 'border-amber-400/25   bg-amber-500/10   text-amber-200',   icon: '↓' },
  signal:  { label: 'Signal',  dot: '#a78bfa', badge: 'border-violet-400/25  bg-violet-500/10  text-violet-200',  icon: '◈' },
};

function timeAgo(ts: number, now: number): string {
  const s = Math.max(1, Math.floor((now - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

export default function MarketFeed({ feed }: MarketFeedProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <aside className="panel rounded-[28px] border border-white/[0.07] p-6 backdrop-blur-2xl flex flex-col">
      {/* ── Header ── */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="section-label mb-2">Market Activity</p>
          <h3 className="text-xl font-bold tracking-tight text-white">Live Feed</h3>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
          <span className="live-dot scale-75" />
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-gray-400">Auto-refresh</span>
        </div>
      </div>

      {/* ── Feed entries ── */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {feed.map((entry, idx) => {
          const cfg = typeConfig[entry.type];
          const isFresh = idx === 0;

          return (
            <div
              key={entry.id}
              className={`card rounded-2xl border border-white/[0.06] p-4 transition-all duration-300
                ${isFresh ? 'feed-fresh' : ''}
              `}
            >
              <div className="flex items-start gap-3">
                {/* Type dot */}
                <div className="mt-0.5 flex-shrink-0">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-xl text-sm font-bold"
                    style={{
                      background: `${cfg.dot}18`,
                      color: cfg.dot,
                      border: `1px solid ${cfg.dot}30`,
                    }}
                  >
                    {cfg.icon}
                  </span>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-snug text-white">{entry.message}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{entry.detail}</p>
                    </div>
                    {/* Amount badge */}
                    <span className="flex-shrink-0 rounded-full border border-white/[0.10] bg-white/[0.04] px-2.5 py-1 text-xs font-bold text-white">
                      {entry.amount}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <span className={`rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                    <span className="text-[0.65rem] text-gray-600 tabular-nums">{timeAgo(entry.createdAt, now)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer cta ── */}
      <div className="mt-5 pt-5 border-t border-white/[0.06]">
        <a
          href="/browse"
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/[0.06] hover:text-white"
        >
          View all market activity
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </aside>
  );
}
