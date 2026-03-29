'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';

const categories = ['SaaS', 'eCommerce', 'Content / Blog', 'Marketplace', 'Agency', 'Other'];
const monetizations = ['Subscription / SaaS', 'eCommerce Sales', 'Ads & Affiliates', 'Lead Generation', 'Services', 'Other'];
const techStacks = ['Next.js', 'React', 'Shopify', 'WordPress', 'Webflow', 'Vue / Nuxt', 'Other'];
const revenueRanges = ['Under $1k/mo', '$1k – $5k/mo', '$5k – $15k/mo', '$15k – $50k/mo', '$50k+/mo'];
const ageBrackets = ['Under 6 months', '6 – 12 months', '1 – 2 years', '2 – 5 years', '5+ years'];

type Step = 1 | 2 | 3;

const STEPS: { num: Step; label: string; sub: string }[] = [
  { num: 1, label: 'Website Info', sub: 'Basic details about your asset' },
  { num: 2, label: 'Financials', sub: 'Revenue, traffic & valuation' },
  { num: 3, label: 'Contact', sub: 'How we reach you' },
];

function SilverHeading({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        background: 'linear-gradient(135deg, #f0f0f0 0%, #c0c0c0 45%, #888 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {children}
    </span>
  );
}

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.32em] text-zinc-500">
        {label}
        {required && <span className="text-zinc-600">*</span>}
      </label>
      {children}
      {hint && <p className="text-[0.62rem] text-zinc-700">{hint}</p>}
    </div>
  );
}

const inputCls =
  'w-full rounded-xl border px-4 py-3 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-700 focus:border-zinc-500';
const inputStyle = { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(120,120,120,0.15)' };

function ChipSelect({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className="rounded-full border px-3.5 py-1.5 text-[0.68rem] uppercase tracking-[0.16em] transition-all duration-200"
          style={
            value === opt
              ? {
                  background: 'linear-gradient(135deg, #b0b0b0, #707070)',
                  borderColor: 'transparent',
                  color: '#050505',
                  boxShadow: '0 0 14px rgba(160,160,160,0.2)',
                }
              : {
                  background: 'rgba(255,255,255,0.03)',
                  borderColor: 'rgba(120,120,120,0.15)',
                  color: 'rgba(160,160,160,0.65)',
                }
          }
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function SellPage() {
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1 — website info
  const [websiteName, setWebsiteName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [category, setCategory] = useState('');
  const [techStack, setTechStack] = useState('');
  const [description, setDescription] = useState('');
  const [age, setAge] = useState('');

  // Image upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState('');

  // Step 2 — financials
  const [revenueRange, setRevenueRange] = useState('');
  const [monthlyRevenue, setMonthlyRevenue] = useState('');
  const [monthlyProfit, setMonthlyProfit] = useState('');
  const [monthlyTraffic, setMonthlyTraffic] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [monetization, setMonetization] = useState('');

  // Step 3 — contact
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telegram, setTelegram] = useState('');
  const [notes, setNotes] = useState('');
  const [nda, setNda] = useState(false);

  function canProceed() {
    if (step === 1) return websiteName.trim() && category && description.trim() && age;
    if (step === 2) return revenueRange && monthlyRevenue.trim() && askingPrice.trim() && monetization;
    return name.trim() && email.trim();
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageError('');
    setImageUploading(true);

    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setImageUrl(data.url);
    } catch (err: unknown) {
      setImageError(err instanceof Error ? err.message : 'Image upload failed');
      setImageFile(null);
      setImagePreview('');
    } finally {
      setImageUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteName, websiteUrl, category, techStack, description, age,
          revenueRange, monthlyRevenue, monthlyProfit, monthlyTraffic,
          monetization, askingPrice,
          name, email, telegram, notes,
          imageUrl: imageUrl || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('You must be logged in to submit a listing. Please sign in and try again.');
        }
        throw new Error(data.error || 'Failed to submit listing');
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="app-shell">
        <div className="mx-auto max-w-[1720px] space-y-8 pb-24">
          <Navbar />
          <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-[32px] border text-center"
            style={{
              background: 'linear-gradient(180deg, rgba(14,14,14,0.98) 0%, rgba(8,8,8,0.99) 100%)',
              borderColor: 'rgba(140,140,140,0.1)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            <div
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(140,140,140,0.15), rgba(80,80,80,0.08))',
                border: '1px solid rgba(140,140,140,0.2)',
              }}
            >
              ✦
            </div>
            <h2 className="mb-3 text-3xl font-bold">
              <SilverHeading>Application Received</SilverHeading>
            </h2>
            <p className="mb-2 max-w-md text-sm text-zinc-500">
              Your listing for <span className="text-zinc-300">{websiteName || 'your website'}</span> has been submitted for review.
            </p>
            <p className="max-w-md text-xs text-zinc-600">
              Our team will verify your financials and reach out within 48 hours via <span className="text-zinc-400">{email}</span>.
            </p>
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setSubmitted(false)}
                className="rounded-full border px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-300"
                style={{ borderColor: 'rgba(120,120,120,0.2)' }}
              >
                Submit another
              </button>
              <a
                href="/browse"
                className="rounded-full px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #c0c0c0 0%, #888 50%, #666 100%)',
                  color: '#050505',
                  boxShadow: '0 0 20px rgba(160,160,160,0.2)',
                }}
              >
                Browse listings
              </a>
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

        {/* Page hero */}
        <section
          className="relative overflow-hidden rounded-[32px] border px-8 py-12 text-center"
          style={{
            background: 'linear-gradient(180deg, rgba(18,18,18,0.98) 0%, rgba(8,8,8,0.99) 100%)',
            borderColor: 'rgba(140,140,140,0.12)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(220,220,220,0.2), transparent)' }} />
          <div className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(160,160,160,0.05) 0%, transparent 60%)' }} />

          <p className="mb-3 text-[0.65rem] uppercase tracking-[0.5em] text-zinc-500">Sell on FuturiMarket</p>
          <h1
            className="mb-4 text-4xl font-bold md:text-5xl"
            style={{
              background: 'linear-gradient(180deg, #f5f5f5 0%, #c0c0c0 40%, #888 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            List Your Website
          </h1>
          <p className="mx-auto max-w-lg text-sm text-zinc-500">
            Submit your asset for review. Verified listings go live within 48 hours and reach thousands of qualified buyers.
          </p>

          {/* Value props */}
          <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-8">
            {[
              { icon: '◈', label: 'AI valuation included' },
              { icon: '⬡', label: 'Zero upfront listing fees' },
              { icon: '◇', label: 'Verified buyer network' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-zinc-600">{icon}</span>
                <span className="text-[0.7rem] uppercase tracking-[0.2em] text-zinc-500">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Stepper + Form */}
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

          {/* Stepper sidebar */}
          <div
            className="rounded-2xl border p-6"
            style={{
              background: 'rgba(10,10,10,0.97)',
              borderColor: 'rgba(120,120,120,0.1)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
            }}
          >
            <p className="mb-5 text-[0.6rem] uppercase tracking-[0.34em] text-zinc-600">Application steps</p>
            <div className="space-y-1">
              {STEPS.map(({ num, label, sub }) => {
                const isActive = step === num;
                const isDone = step > num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => isDone && setStep(num)}
                    className="w-full rounded-xl p-3.5 text-left transition-all duration-200"
                    style={{
                      background: isActive ? 'rgba(255,255,255,0.04)' : 'transparent',
                      border: isActive ? '1px solid rgba(140,140,140,0.15)' : '1px solid transparent',
                      cursor: isDone ? 'pointer' : 'default',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-bold"
                        style={
                          isActive
                            ? {
                                background: 'linear-gradient(135deg, #c0c0c0, #787878)',
                                color: '#050505',
                                boxShadow: '0 0 12px rgba(160,160,160,0.25)',
                              }
                            : isDone
                            ? { background: 'rgba(140,140,140,0.15)', color: '#a0a0a0', border: '1px solid rgba(140,140,140,0.2)' }
                            : { background: 'rgba(255,255,255,0.04)', color: '#555', border: '1px solid rgba(120,120,120,0.12)' }
                        }
                      >
                        {isDone ? '✓' : num}
                      </div>
                      <div>
                        <p
                          className="text-[0.72rem] font-semibold"
                          style={{ color: isActive ? '#d0d0d0' : isDone ? '#888' : '#555' }}
                        >
                          {label}
                        </p>
                        <p className="text-[0.62rem] text-zinc-700">{sub}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <p className="mb-1.5 text-[0.6rem] uppercase tracking-[0.3em] text-zinc-700">Progress</p>
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((step - 1) / 2) * 100}%`,
                    background: 'linear-gradient(90deg, #888, #c0c0c0)',
                  }}
                />
              </div>
              <p className="mt-1 text-right text-[0.58rem] text-zinc-700">Step {step} of 3</p>
            </div>
          </div>

          {/* Form panel */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border p-8"
            style={{
              background: 'rgba(10,10,10,0.97)',
              borderColor: 'rgba(120,120,120,0.1)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
            }}
          >
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-7">
                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.4em] text-zinc-600">Step 1 of 3</p>
                  <h2 className="mt-1.5 text-2xl font-bold">
                    <SilverHeading>Website Information</SilverHeading>
                  </h2>
                  <p className="mt-1 text-xs text-zinc-600">Tell us about the asset you want to sell.</p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Website / Brand Name" required>
                    <input value={websiteName} onChange={(e) => setWebsiteName(e.target.value)}
                      placeholder="e.g. PulseSaaS.io" className={inputCls} style={inputStyle} required />
                  </Field>
                  <Field label="Website URL" hint="We will not make this public until listing is approved.">
                    <input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://yoursite.com" className={inputCls} style={inputStyle} type="url" />
                  </Field>
                </div>

                {/* Screenshot / logo upload */}
                <Field label="Screenshot or Logo" hint="Optional. JPEG, PNG, or WebP — max 5 MB.">
                  <div className="space-y-3">
                    <label
                      className="flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition hover:border-zinc-500"
                      style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(120,120,120,0.15)' }}
                    >
                      <span className="text-xs text-zinc-500">
                        {imageUploading ? 'Uploading…' : imageFile ? imageFile.name : 'Choose file…'}
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={handleImageChange}
                        disabled={imageUploading}
                      />
                    </label>
                    {imagePreview && (
                      <div className="relative h-32 w-full overflow-hidden rounded-xl border"
                        style={{ borderColor: 'rgba(120,120,120,0.15)' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                        {imageUploading && (
                          <div className="absolute inset-0 flex items-center justify-center"
                            style={{ background: 'rgba(0,0,0,0.6)' }}>
                            <span className="text-xs text-zinc-300">Uploading…</span>
                          </div>
                        )}
                      </div>
                    )}
                    {imageError && (
                      <p className="text-xs text-rose-400">{imageError}</p>
                    )}
                  </div>
                </Field>

                <Field label="Category" required>
                  <ChipSelect options={categories} value={category} onChange={setCategory} />
                </Field>

                <Field label="Tech Stack">
                  <ChipSelect options={techStacks} value={techStack} onChange={setTechStack} />
                </Field>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Business Age" required>
                    <ChipSelect options={ageBrackets} value={age} onChange={setAge} />
                  </Field>
                </div>

                <Field label="Short Description" required hint="2–4 sentences covering what the business does and why it has value.">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Describe the product, target market, and key value proposition..."
                    className={inputCls}
                    style={inputStyle}
                    required
                  />
                </Field>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-7">
                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.4em] text-zinc-600">Step 2 of 3</p>
                  <h2 className="mt-1.5 text-2xl font-bold">
                    <SilverHeading>Financial Details</SilverHeading>
                  </h2>
                  <p className="mt-1 text-xs text-zinc-600">Accurate numbers speed up verification and attract serious buyers.</p>
                </div>

                <Field label="Monthly Revenue Range" required>
                  <ChipSelect options={revenueRanges} value={revenueRange} onChange={setRevenueRange} />
                </Field>

                <div className="grid gap-5 md:grid-cols-3">
                  <Field label="Avg Monthly Revenue ($)" required>
                    <input value={monthlyRevenue} onChange={(e) => setMonthlyRevenue(e.target.value)}
                      placeholder="e.g. 8,500" className={inputCls} style={inputStyle} required />
                  </Field>
                  <Field label="Avg Monthly Profit ($)">
                    <input value={monthlyProfit} onChange={(e) => setMonthlyProfit(e.target.value)}
                      placeholder="e.g. 5,200" className={inputCls} style={inputStyle} />
                  </Field>
                  <Field label="Monthly Traffic (Uniques)" hint="Sessions or unique visitors per month">
                    <input value={monthlyTraffic} onChange={(e) => setMonthlyTraffic(e.target.value)}
                      placeholder="e.g. 24,000" className={inputCls} style={inputStyle} />
                  </Field>
                </div>

                <Field label="Monetization Model" required>
                  <ChipSelect options={monetizations} value={monetization} onChange={setMonetization} />
                </Field>

                <Field label="Asking Price ($)" required hint="Our AI will also generate an independent valuation for buyers.">
                  <input value={askingPrice} onChange={(e) => setAskingPrice(e.target.value)}
                    placeholder="e.g. 95,000" className={inputCls} style={inputStyle} required />
                </Field>

                {/* Insight callout */}
                {monthlyRevenue && askingPrice && (
                  <div
                    className="rounded-xl border p-4"
                    style={{ background: 'rgba(140,140,140,0.04)', borderColor: 'rgba(140,140,140,0.12)' }}
                  >
                    <p className="text-[0.65rem] uppercase tracking-[0.3em] text-zinc-600 mb-2">Valuation insight</p>
                    <p className="text-xs text-zinc-400">
                      At ${Number(monthlyRevenue.replace(/,/g, '')).toLocaleString()} / mo, typical marketplace multiples
                      suggest a range of{' '}
                      <span className="text-zinc-300 font-semibold">
                        ${(Number(monthlyRevenue.replace(/,/g, '')) * 20).toLocaleString()} – ${(Number(monthlyRevenue.replace(/,/g, '')) * 36).toLocaleString()}
                      </span>
                      . Your ask of{' '}
                      <span className="text-zinc-300">${Number(askingPrice.replace(/,/g, '')).toLocaleString()}</span> will
                      be benchmarked by our AI on listing.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-7">
                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.4em] text-zinc-600">Step 3 of 3</p>
                  <h2 className="mt-1.5 text-2xl font-bold">
                    <SilverHeading>Contact & Preferences</SilverHeading>
                  </h2>
                  <p className="mt-1 text-xs text-zinc-600">How should we reach you during verification?</p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Full Name" required>
                    <input value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Your name" className={inputCls} style={inputStyle} required />
                  </Field>
                  <Field label="Email Address" required>
                    <input value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com" type="email" className={inputCls} style={inputStyle} required />
                  </Field>
                </div>

                <Field label="Telegram Handle" hint="Optional but recommended for faster communication.">
                  <input value={telegram} onChange={(e) => setTelegram(e.target.value)}
                    placeholder="@yourhandle" className={inputCls} style={inputStyle} />
                </Field>

                <Field label="Additional Notes" hint="Any caveats, special terms, or context for our team.">
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                    rows={4} placeholder="Anything else we should know..."
                    className={inputCls} style={inputStyle} />
                </Field>

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={nda}
                    onChange={(e) => setNda(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-transparent accent-zinc-400"
                  />
                  <span className="text-xs text-zinc-500 leading-relaxed">
                    I agree to FuturiMarket&apos;s seller terms. I confirm that all financial information submitted is accurate
                    and verifiable. I understand that misrepresentation may result in removal from the platform.
                  </span>
                </label>

                {/* Summary card */}
                <div
                  className="rounded-xl border p-5 space-y-2"
                  style={{ background: 'rgba(140,140,140,0.03)', borderColor: 'rgba(140,140,140,0.1)' }}
                >
                  <p className="text-[0.62rem] uppercase tracking-[0.3em] text-zinc-600 mb-3">Application summary</p>
                  {[
                    { label: 'Asset', value: websiteName || '—' },
                    { label: 'Category', value: category || '—' },
                    { label: 'Monthly Revenue', value: monthlyRevenue ? `$${monthlyRevenue}` : '—' },
                    { label: 'Asking Price', value: askingPrice ? `$${askingPrice}` : '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-[0.68rem] text-zinc-600">{label}</span>
                      <span className="text-[0.72rem] text-zinc-300">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Global error banner */}
            {error && (
              <div
                className="mt-6 rounded-xl border px-4 py-3 text-xs text-rose-400"
                style={{ background: 'rgba(255,60,60,0.06)', borderColor: 'rgba(255,60,60,0.2)' }}
              >
                {error}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-8 flex items-center justify-between border-t pt-6"
              style={{ borderColor: 'rgba(120,120,120,0.1)' }}
            >
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s - 1) as Step)}
                  className="rounded-full border px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-300"
                  style={{ borderColor: 'rgba(120,120,120,0.2)' }}
                >
                  ← Back
                </button>
              ) : (
                <span />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => canProceed() && setStep((s) => (s + 1) as Step)}
                  disabled={!canProceed()}
                  className="rounded-full px-8 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-200 disabled:opacity-30"
                  style={{
                    background: canProceed()
                      ? 'linear-gradient(135deg, #c0c0c0 0%, #888 50%, #666 100%)'
                      : 'rgba(120,120,120,0.2)',
                    color: canProceed() ? '#050505' : '#555',
                    boxShadow: canProceed() ? '0 0 20px rgba(160,160,160,0.2)' : 'none',
                  }}
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!canProceed() || !nda || loading || imageUploading}
                  className="rounded-full px-8 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-200 disabled:opacity-30"
                  style={{
                    background: canProceed() && nda && !loading
                      ? 'linear-gradient(135deg, #d0d0d0 0%, #909090 50%, #686868 100%)'
                      : 'rgba(120,120,120,0.2)',
                    color: canProceed() && nda && !loading ? '#050505' : '#555',
                    boxShadow: canProceed() && nda && !loading ? '0 0 24px rgba(180,180,180,0.25)' : 'none',
                  }}
                >
                  {loading ? 'Submitting…' : 'Submit Application'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
