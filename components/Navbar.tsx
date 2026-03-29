import Link from 'next/link';

const navLinks = [
  { label: 'Browse', href: '/browse' },
  { label: 'Sell', href: '/sell' },
  { label: 'Dashboard', href: '#' },
  { label: 'Messages', href: '#' },
];

export default function Navbar() {
  return (
    <header className="panel rounded-[32px] border border-white/10 p-6 backdrop-blur-xl">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-indigo-500 shadow-glow">
            <span className="text-lg font-semibold text-slate-950">FM</span>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">FuturiMarket</p>
            <h1 className="text-xl font-semibold text-white">Digital Asset Exchange</h1>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-xl">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-cyan-200/60">Search</span>
            <input
              type="search"
              placeholder="Search websites, SaaS, niches..."
              className="w-full rounded-full border border-white/10 bg-white/5 px-24 py-3 text-sm text-slate-100 outline-none ring-1 ring-transparent transition focus:ring-cyan-400/50"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-sm text-slate-300 transition hover:text-cyan-200">
                {link.label}
              </Link>
            ))}
            <Link href="/sell" className="silver-cta-btn button-pulse rounded-full px-6 py-3 text-sm font-semibold">
              List Website
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
