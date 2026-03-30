'use client';

import { useEffect, useRef, useState } from 'react';

type Metric = {
  value: number;
  suffix: string;
  label: string;
  sub: string;
};

const metrics: Metric[] = [
  { value: 1240,  suffix: '+', label: 'Total Listings',         sub: 'Verified digital assets' },
  { value: 84,    suffix: 'M', label: 'Transaction Volume',      sub: 'Across all closings' },
  { value: 340,   suffix: '+', label: 'Verified Sellers',        sub: 'KYC & revenue audited' },
  { value: 97,    suffix: '%', label: 'Satisfaction Rate',       sub: 'From completed buyers' },
];

const ICONS = [
  // Globe
  <svg key="globe" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" d="M12 3a15 15 0 010 18M3 12h18" />
    <path strokeLinecap="round" d="M4.22 7h15.56M4.22 17h15.56" />
  </svg>,
  // Dollar
  <svg key="dollar" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M7 7h8.5a2.5 2.5 0 010 5H8a2.5 2.5 0 000 5H17" />
  </svg>,
  // Shield
  <svg key="shield" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 3.5V12c0 5-3.6 8.6-8 10-4.4-1.4-8-5-8-10V6.5L12 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
  </svg>,
  // Star
  <svg key="star" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>,
];

function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          function step(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(ease * target));
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function CounterCell({ metric, icon }: { metric: Metric; icon: React.ReactNode }) {
  const { count, ref } = useCountUp(metric.value);

  const display =
    metric.suffix === 'M'
      ? `$${count}M`
      : `${count.toLocaleString()}${metric.suffix}`;

  return (
    <div ref={ref} className="flex flex-col items-center justify-center py-10 px-8 text-center group">
      {/* Icon */}
      <div className="feature-icon mb-4 mx-auto transition-transform duration-300 group-hover:scale-110"
        style={{ color: 'rgba(192,192,192,0.7)' }}>
        {icon}
      </div>

      {/* Number */}
      <p className="trust-counter mb-1">{display}</p>

      {/* Label */}
      <p className="text-sm font-semibold text-white mb-1">{metric.label}</p>
      <p className="text-xs text-gray-500">{metric.sub}</p>
    </div>
  );
}

export default function TrustStrip() {
  return (
    <section className="trust-strip">
      <div className="mx-auto max-w-[1720px] px-6">
        <div className="grid grid-cols-2 divide-x divide-white/[0.05] lg:grid-cols-4">
          {metrics.map((m, i) => (
            <CounterCell key={m.label} metric={m} icon={ICONS[i]} />
          ))}
        </div>
      </div>
    </section>
  );
}
