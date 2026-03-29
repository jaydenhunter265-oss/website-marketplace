export type Listing = {
  id: string;
  name: string;
  tagline: string;
  category: string;
  niche: string;
  seller: string;
  status: string;
  askingPrice: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  monthlyProfit: number;
  profitMargin: number;
  traffic: number;
  revenueHistory: number[];
  trafficHistory: number[];
  aiValuation: number;
  growthScore: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  monetization: string;
  techStack: string;
  growthPotential: string;
  location: string;
  previewUrl: string;
  demoModeAvailable: boolean;
};

export type FeedEntry = {
  id: number;
  type: 'sale' | 'listing' | 'drop' | 'signal';
  message: string;
  detail: string;
  amount: string;
  createdAt: number;
};

export const sampleListings: Listing[] = [
  {
    id: 'asset-01',
    name: 'PulseSaaS.io',
    tagline: 'AI-powered analytics suite for remote teams',
    category: 'SaaS',
    niche: 'B2B analytics',
    seller: 'Northline Capital',
    status: 'Verified Seller',
    askingPrice: 185000,
    monthlyRevenue: 14500,
    yearlyRevenue: 174000,
    monthlyProfit: 9800,
    profitMargin: 67.5,
    traffic: 48200,
    revenueHistory: [12900, 13350, 13700, 14100, 14350, 14420, 14500],
    trafficHistory: [43800, 45200, 46100, 46900, 47300, 47900, 48200],
    aiValuation: 198000,
    growthScore: 84,
    riskLevel: 'Low',
    monetization: 'Subscription',
    techStack: 'Next.js - Node - Stripe',
    growthPotential: 'Expand into enterprise onboarding and conversion insights.',
    location: 'Remote',
    previewUrl: 'https://example.com',
    demoModeAvailable: true
  },
  {
    id: 'asset-02',
    name: 'ShopFlux.com',
    tagline: 'Curated dropshipping store with recurring upsells',
    category: 'eCommerce',
    niche: 'Consumer retail',
    seller: 'Atlas Operators',
    status: 'Traffic Verified',
    askingPrice: 108000,
    monthlyRevenue: 12400,
    yearlyRevenue: 148800,
    monthlyProfit: 6100,
    profitMargin: 49.2,
    traffic: 37200,
    revenueHistory: [10850, 11300, 11600, 11950, 12100, 12250, 12400],
    trafficHistory: [33100, 34000, 34900, 35600, 36200, 36700, 37200],
    aiValuation: 119500,
    growthScore: 72,
    riskLevel: 'Moderate',
    monetization: 'eCommerce',
    techStack: 'Shopify - Klaviyo',
    growthPotential: 'Add direct-to-consumer product lines and ad scaling.',
    location: 'US',
    previewUrl: 'https://example.com',
    demoModeAvailable: false
  },
  {
    id: 'asset-03',
    name: 'MicroNiche.ai',
    tagline: 'Niche content portal with premium lead-gen tools',
    category: 'Content',
    niche: 'SEO publishing',
    seller: 'Orchid Media',
    status: 'Risk Level: Low',
    askingPrice: 72000,
    monthlyRevenue: 6800,
    yearlyRevenue: 81600,
    monthlyProfit: 4200,
    profitMargin: 61.7,
    traffic: 29800,
    revenueHistory: [5400, 5800, 6100, 6400, 6550, 6700, 6800],
    trafficHistory: [24100, 25400, 26500, 27200, 28100, 28900, 29800],
    aiValuation: 79000,
    growthScore: 68,
    riskLevel: 'Low',
    monetization: 'Ads & affiliates',
    techStack: 'WordPress - Cloudflare',
    growthPotential: 'Optimize SEO funnels and premium newsletter upgrades.',
    location: 'EU',
    previewUrl: 'https://example.com',
    demoModeAvailable: false
  },
  {
    id: 'asset-04',
    name: 'NDA-Ready Network',
    tagline: 'Private bidding platform for high-growth digital businesses',
    category: 'Marketplace',
    niche: 'B2B marketplaces',
    seller: 'Volt Equity',
    status: 'Verified Revenue',
    askingPrice: 235000,
    monthlyRevenue: 19200,
    yearlyRevenue: 230400,
    monthlyProfit: 13400,
    profitMargin: 69.8,
    traffic: 56300,
    revenueHistory: [16200, 16900, 17600, 18100, 18700, 19100, 19200],
    trafficHistory: [50200, 51800, 52900, 53700, 54500, 55400, 56300],
    aiValuation: 248000,
    growthScore: 88,
    riskLevel: 'Moderate',
    monetization: 'Lead gen',
    techStack: 'React - Prisma - Supabase',
    growthPotential: 'Unlock enterprise partnerships and white-label channels.',
    location: 'Global',
    previewUrl: 'https://example.com',
    demoModeAvailable: true
  }
];

export const initialFeed: FeedEntry[] = [
  {
    id: 1,
    type: 'sale',
    message: 'Website sold for $12,000',
    detail: 'Premium niche blog acquisition.',
    amount: '$12,000',
    createdAt: Date.now() - 8000
  },
  {
    id: 2,
    type: 'listing',
    message: 'New SaaS listed',
    detail: 'AI automation platform with recurring ARR.',
    amount: '$62,000',
    createdAt: Date.now() - 6000
  },
  {
    id: 3,
    type: 'drop',
    message: 'Price dropped by 10%',
    detail: 'High-traffic shop available at a discount.',
    amount: '$98,000',
    createdAt: Date.now() - 3000
  },
  {
    id: 4,
    type: 'signal',
    message: 'Undervalued deal spotted',
    detail: 'AI model flagged high upside relative to ask.',
    amount: '+14%',
    createdAt: Date.now() - 1000
  }
];
