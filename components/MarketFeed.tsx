'use client';

import { useEffect, useState } from 'react';
import { FeedEntry } from '../lib/data';

type MarketFeedProps = {
  feed: FeedEntry[];
};

const feedTypeStyles: Record<FeedEntry['type'], string> = {
  sale: 'bg-emerald-500/15 text-emerald-200 border-emerald-300/30',
  listing: 'bg-cyan-500/15 text-cyan-200 border-cyan-300/30',
  drop: 'bg-amber-500/15 text-amber-100 border-amber-300/30',
  signal: 'bg-fuchsia-500/15 text-fuchsia-100 border-fuchsia-300/30'
};

function formatTimeAgo(createdAt: number, now: number): string {
  const seconds = Math.max(1, Math.floor((now - createdAt) / 1000));
  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ago`;
}

export default function MarketFeed({ feed }: MarketFeedProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="panel rounded-[36px] border border-white/10 p-6 shadow-glow backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Market activity</p>
          <h3 className="text-2xl font-semibold text-white">Live activity feed</h3>
        </div>
        <span className="animate-pulse-slow rounded-full bg-slate-950/80 px-3 py-1 text-xs uppercase tracking-[0.35em] text-slate-300">
          Auto-refreshing
        </span>
      </div>

      <div className="space-y-4">
        {feed.map((entry, idx) => (
          <div key={entry.id} className={`card rounded-3xl border border-white/5 p-4 ${idx === 0 ? 'feed-fresh' : ''}`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">{entry.message}</p>
                <p className="mt-1 text-sm text-slate-400">{entry.detail}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-500">{formatTimeAgo(entry.createdAt, now)}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${feedTypeStyles[entry.type]}`}>
                  {entry.type}
                </span>
                <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
                  {entry.amount}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
