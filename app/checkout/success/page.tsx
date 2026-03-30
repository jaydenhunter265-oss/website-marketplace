import Link from 'next/link';
import Navbar from '../../../components/Navbar';

export default function CheckoutSuccessPage() {
  return (
    <main className="app-shell">
      <div className="mx-auto max-w-[1720px] space-y-8 pb-24">
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center px-4">
          <div
            className="w-full max-w-lg rounded-[32px] border p-12 text-center"
            style={{
              background: 'linear-gradient(145deg, rgba(14,14,14,0.99) 0%, rgba(8,8,8,1) 100%)',
              borderColor: 'rgba(140,140,140,0.12)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            {/* Icon */}
            <div
              className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-[28px] text-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(140,200,140,0.15) 0%, rgba(80,160,80,0.08) 100%)',
                border: '1px solid rgba(100,200,100,0.2)',
                boxShadow: '0 0 40px rgba(100,200,100,0.08)',
              }}
            >
              ✓
            </div>

            <p className="mb-2 text-[0.65rem] uppercase tracking-[0.5em] text-zinc-600">
              Payment confirmed
            </p>

            <h1
              className="mb-4 text-3xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #f0f0f0 0%, #c0c0c0 45%, #888 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Purchase Complete
            </h1>

            <p className="mb-8 text-sm leading-relaxed text-zinc-500">
              Your payment was successful. The seller has been notified and will
              reach out to transfer access. You can track this purchase in your
              dashboard.
            </p>

            <div
              className="mb-8 rounded-2xl border p-5 text-left"
              style={{
                borderColor: 'rgba(100,200,100,0.15)',
                background: 'rgba(100,200,100,0.04)',
              }}
            >
              <p className="mb-3 text-[0.62rem] uppercase tracking-[0.3em] text-emerald-600">What happens next</p>
              <div className="space-y-2.5">
                {[
                  'Seller is notified of the sale',
                  'They will contact you within 24–48 hours',
                  'Website credentials and assets are transferred',
                  'Order marked complete in your dashboard',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[0.55rem] font-bold"
                      style={{
                        background: 'rgba(100,200,100,0.15)',
                        border: '1px solid rgba(100,200,100,0.25)',
                        color: 'rgba(120,220,120,0.8)',
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-xs text-zinc-500">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/dashboard"
                className="rounded-full px-8 py-3 text-xs font-bold uppercase tracking-[0.18em] transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #c0c0c0 0%, #888 50%, #666 100%)',
                  color: '#050505',
                  boxShadow: '0 0 20px rgba(160,160,160,0.15)',
                }}
              >
                View Dashboard
              </Link>
              <Link
                href="/browse"
                className="rounded-full border px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-all duration-200 hover:border-zinc-500 hover:text-zinc-300"
                style={{
                  borderColor: 'rgba(120,120,120,0.2)',
                  color: 'rgba(140,140,140,0.8)',
                }}
              >
                Browse More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
