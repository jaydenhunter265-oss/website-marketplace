'use client';

import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import TrustStrip from '../components/TrustStrip';
import HowItWorks from '../components/HowItWorks';
import WhyChooseUs from '../components/WhyChooseUs';
import SellerCTA from '../components/SellerCTA';
import Footer from '../components/Footer';
import { sampleListings } from '../lib/data';

type LiveSummary = {
  totalRevenue: number;
  activeListings: number;
};

export default function HomePage() {
  // Catch Supabase OAuth redirect on the root path.
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      window.location.replace(`/auth/callback?code=${encodeURIComponent(code)}`);
    }
  }, []);

  const fallbackSummary = useMemo<LiveSummary>(
    () => ({
      totalRevenue: sampleListings.reduce((sum, listing) => sum + listing.monthlyRevenue, 0),
      activeListings: sampleListings.length,
    }),
    []
  );

  const [summary, setSummary] = useState<LiveSummary>(fallbackSummary);

  useEffect(() => {
    let mounted = true;

    fetch('/api/listings')
      .then((response) => response.json())
      .then((data) => {
        if (!mounted || !Array.isArray(data) || data.length === 0) return;

        const totalRevenue = data.reduce((sum, listing) => {
          const revenue = typeof listing?.monthlyRevenue === 'number' ? listing.monthlyRevenue : 0;
          return sum + revenue;
        }, 0);

        setSummary({
          totalRevenue,
          activeListings: data.length,
        });
      })
      .catch(() => {
        // Keep fallback summary if API is unavailable.
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="app-shell">
      <Navbar />

      <div className="pt-[64px]">
        <HeroSection summary={summary} />
      </div>

      <TrustStrip />
      <HowItWorks />
      <WhyChooseUs />
      <SellerCTA />
      <Footer />
    </div>
  );
}
