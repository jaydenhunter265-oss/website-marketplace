const features = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Verified Listings Only',
    body: 'Every asset undergoes independent revenue auditing, traffic verification, and risk scoring before it reaches our marketplace. No unverified numbers, ever.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Secure Transactions',
    body: 'Funds are held in escrow until transfer is verified and both parties confirm completion. Our legal framework protects every party across every deal size.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'AI-Powered Insights',
    body: 'Our AI engine provides real-time valuation estimates, growth scoring, risk profiling, and personalised buyer-match scores — so you never overpay.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Expert Deal Support',
    body: 'Dedicated acquisition advisors guide you from due diligence through closing. Whether it\'s your first deal or your fiftieth, you have a team in your corner.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Fast Closing Process',
    body: 'Most deals close in under 30 days. Our standardised deal room, e-signature integrations, and migration checklists eliminate the usual bottlenecks.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    title: 'Post-Sale Migration',
    body: 'From DNS transfers and code handoffs to subscription platform migrations — our technical team handles the entire transition so you can focus on growth.',
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="py-24 px-6"
      style={{ background: 'linear-gradient(180deg, #050505 0%, #080808 100%)' }}>
      <div className="mx-auto max-w-[1720px]">
        {/* ── Header ── */}
        <div className="mb-16 grid gap-8 lg:grid-cols-[1fr_2fr] lg:items-end">
          <div>
            <p className="section-label mb-4">Why FuturiMarket</p>
            <h2 className="text-4xl font-extrabold tracking-tight text-white leading-[1.1] md:text-5xl">
              Built for{' '}
              <span className="chrome-text">Serious</span>{' '}
              Investors
            </h2>
          </div>
          <p className="text-lg text-gray-400 leading-relaxed max-w-2xl lg:ml-auto">
            We built FuturiMarket because existing platforms weren't good enough for sophisticated buyers and sellers.
            Every feature is designed around one goal: making premium digital asset transactions faster, safer, and smarter.
          </p>
        </div>

        {/* ── Feature grid ── */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon" style={{ color: 'rgba(192,192,192,0.65)' }}>
                {f.icon}
              </div>
              <h3 className="text-base font-bold tracking-tight text-white mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{f.body}</p>
            </div>
          ))}
        </div>

        {/* ── Trust badges ── */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-6">
          {[
            'SOC 2 Compliant',
            'KYC Verified Sellers',
            'Escrow Protected',
            'Revenue Audited',
            'AI-Graded Risk',
          ].map(badge => (
            <div
              key={badge}
              className="flex items-center gap-2.5 rounded-full border border-white/[0.09] bg-white/[0.04] px-5 py-2.5"
            >
              <svg className="h-3.5 w-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-semibold tracking-wide text-gray-300">{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
