const perks = [
  { label: 'Free valuation report', icon: '◈' },
  { label: 'Expert listing support',  icon: '◎' },
  { label: 'Verified buyer network',  icon: '◉' },
  { label: 'Close in under 30 days',  icon: '◆' },
];

export default function SellerCTA() {
  return (
    <section className="seller-cta-section py-28 px-6">
      <div className="mx-auto max-w-5xl text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/[0.10] bg-white/[0.04] px-5 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
          For Sellers
        </div>

        {/* Headline */}
        <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-white leading-[1.1] md:text-5xl lg:text-6xl">
          Sell Your Digital Asset
          <br />
          <span className="chrome-text">with Confidence</span>
        </h2>

        {/* Sub */}
        <p className="mx-auto mb-14 max-w-2xl text-lg leading-relaxed text-gray-400">
          List your SaaS, eCommerce store, content site, or online business in front of our network of
          340+ verified buyers. Get a free AI valuation and close on your terms.
        </p>

        {/* Perks */}
        <div className="mb-14 flex flex-wrap items-center justify-center gap-4">
          {perks.map(p => (
            <div
              key={p.label}
              className="flex items-center gap-2.5 rounded-full border border-white/[0.09] bg-white/[0.04] px-5 py-2.5 backdrop-blur"
            >
              <span className="text-[0.8rem]" style={{ color: 'rgba(192,192,192,0.6)' }}>{p.icon}</span>
              <span className="text-sm font-semibold text-gray-300">{p.label}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href="/sell" className="chrome-btn px-10 py-4 text-[0.9375rem]">
            List Your Asset
          </a>
          <a
            href="/browse"
            className="ghost-btn px-10 py-4 text-[0.9375rem]"
          >
            Get a Free Valuation
          </a>
        </div>

        {/* Footnote */}
        <p className="mt-8 text-xs text-gray-600">
          No upfront fees · Success-based commission only · Cancel anytime
        </p>
      </div>
    </section>
  );
}
