const steps = [
  {
    number: '01',
    title: 'Browse & Discover',
    body: 'Explore hundreds of verified digital assets — SaaS, eCommerce stores, content sites, and more. Use AI-powered filters to zero in on exactly what matches your investment criteria.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="11" cy="11" r="8" />
        <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Evaluate & Verify',
    body: 'Access full P&L exports, traffic audits, churn cohorts, and AI valuation reports. Every listing is independently reviewed before going live.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Negotiate & Purchase',
    body: 'Enter our private deal room to send offers, negotiate directly with verified sellers, and finalize terms — all within a secure, managed environment.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Transfer & Launch',
    body: 'Our expert migration team handles domain transfers, code handoff, payment processor migration, and all technical details — so you can start operating from day one.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="mx-auto max-w-[1720px]">
        {/* ── Header ── */}
        <div className="mb-16 text-center">
          <p className="section-label mb-4">How It Works</p>
          <h2 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            From Discovery to{' '}
            <span className="chrome-text">Ownership</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-gray-400">
            A streamlined, four-step process designed for serious buyers and sellers of digital businesses.
          </p>
        </div>

        {/* ── Steps grid ── */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.number} className="step-card p-7 flex flex-col gap-5">
              {/* Step number */}
              <div className="flex items-start justify-between">
                <p className="step-number">{step.number}</p>
                <div className="step-icon-wrap" style={{ color: 'rgba(192,192,192,0.65)' }}>
                  {step.icon}
                </div>
              </div>

              {/* Connector line for all but last */}
              {i < steps.length - 1 && (
                <div
                  className="hidden xl:block absolute right-0 top-1/2 w-5 h-px -translate-y-1/2 translate-x-full"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                  aria-hidden="true"
                />
              )}

              {/* Content */}
              <div>
                <h3 className="text-lg font-bold tracking-tight text-white mb-3">{step.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
