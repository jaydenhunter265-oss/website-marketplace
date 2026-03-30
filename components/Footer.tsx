import Link from 'next/link';

const cols = [
  {
    heading: 'Marketplace',
    links: [
      { label: 'Browse Listings',     href: '/browse'    },
      { label: 'SaaS Businesses',     href: '/browse?category=SaaS' },
      { label: 'eCommerce Stores',    href: '/browse?category=eCommerce' },
      { label: 'Content Sites',       href: '/browse?category=Content' },
      { label: 'Marketplaces',        href: '/browse?category=Marketplace' },
    ],
  },
  {
    heading: 'Sellers',
    links: [
      { label: 'List Your Business',  href: '/sell'      },
      { label: 'Free Valuation',      href: '/sell'      },
      { label: 'How It Works',        href: '#how-it-works' },
      { label: 'Seller Dashboard',    href: '/dashboard' },
    ],
  },
  {
    heading: 'Buyers',
    links: [
      { label: 'Buyer Resources',     href: '/browse'    },
      { label: 'Due Diligence Guide', href: '/browse'    },
      { label: 'AI Match Engine',     href: '/browse'    },
      { label: 'Deal Room',           href: '/browse'    },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About',               href: '#about'     },
      { label: 'Blog',                href: '#'          },
      { label: 'Careers',             href: '#'          },
      { label: 'Contact',             href: '#'          },
      { label: 'Privacy Policy',      href: '#'          },
      { label: 'Terms of Service',    href: '#'          },
    ],
  },
];

const socials = [
  {
    label: 'Twitter / X',
    href: '#',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: '#',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="about">
      <div className="mx-auto max-w-[1720px] px-6">

        {/* ── Top row ── */}
        <div className="grid gap-12 py-16 md:grid-cols-[1.5fr_repeat(4,1fr)]">
          {/* Brand column */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, #e8e8e8 0%, #b0b0b0 50%, #787878 100%)',
                  boxShadow: '0 0 20px rgba(192,192,192,0.15), inset 0 1px 0 rgba(255,255,255,0.5)',
                }}
              >
                <span className="text-sm font-extrabold" style={{ color: '#080808' }}>FM</span>
              </div>
              <span className="chrome-text text-lg font-extrabold tracking-tight">FuturiMarket</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500 max-w-[220px]">
              The premium marketplace for buying and selling digital assets of the future.
            </p>

            {/* Socials */}
            <div className="flex gap-3">
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-gray-500 transition hover:border-white/[0.16] hover:text-gray-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map(col => (
            <div key={col.heading}>
              <p className="section-label mb-5">{col.heading}</p>
              <ul className="space-y-3">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.05] py-6">
          <p className="text-xs text-gray-600">
            © {year} FuturiMarket. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-5">
            {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map(t => (
              <a key={t} href="#" className="footer-link text-xs">{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
