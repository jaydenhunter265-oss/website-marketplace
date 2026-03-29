import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { Listing } from '@/lib/data';

// Map a database row to the Listing shape the frontend expects.
// Fields not stored in the DB (revenueHistory, aiValuation, etc.) are derived.
function dbRowToListing(row: Record<string, unknown>): Listing {
  const monthlyRevenue = Number(row.monthly_revenue) || 0;
  const monthlyProfit  = Number(row.monthly_profit)  || Math.round(monthlyRevenue * 0.4);
  const traffic        = Number(row.monthly_traffic) || 0;
  const askingPrice    = Number(row.price)           || 0;

  const profitMargin =
    monthlyRevenue > 0
      ? Math.round((monthlyProfit / monthlyRevenue) * 1000) / 10
      : 0;

  const growthScore = Math.min(
    95,
    Math.round(50 + (profitMargin / 100) * 40)
  );

  return {
    id:             String(row.id),
    name:           String(row.title),
    tagline:        String(row.description).slice(0, 100),
    category:       String(row.category   || 'Other'),
    niche:          String(row.category   || 'Other'),
    seller:         'Independent Seller',
    status:         'Listed',
    askingPrice,
    monthlyRevenue,
    yearlyRevenue:  monthlyRevenue * 12,
    monthlyProfit,
    profitMargin,
    traffic,
    // 7-point history derived from current value (flat baseline approach)
    revenueHistory: Array.from({ length: 7 }, (_, i) =>
      Math.round(monthlyRevenue * (0.86 + i * 0.024))
    ),
    trafficHistory: Array.from({ length: 7 }, (_, i) =>
      Math.round(traffic * (0.86 + i * 0.024))
    ),
    aiValuation:    Math.round(askingPrice * 1.08),
    growthScore,
    riskLevel:      'Moderate',
    monetization:   String(row.monetization || 'Other'),
    techStack:      String(row.tech_stack   || 'Other'),
    growthPotential: String(row.description || ''),
    location:       'Remote',
    previewUrl:     String(row.website_url  || 'https://example.com'),
    demoModeAvailable: false,
  };
}

// GET /api/listings — return all active listings
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json((data ?? []).map(dbRowToListing));
  } catch (err) {
    console.error('GET /api/listings:', err);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}

// POST /api/listings — create a new listing (auth required)
export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      websiteName,
      websiteUrl,
      category,
      techStack,
      description,
      age,
      monthlyRevenue,
      monthlyProfit,
      monthlyTraffic,
      monetization,
      askingPrice,
      name,
      email,
      telegram,
      notes,
      imageUrl,
    } = body;

    // Required-field validation
    if (!websiteName || !category || !description || !monthlyRevenue || !askingPrice || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: websiteName, category, description, monthlyRevenue, askingPrice, email' },
        { status: 400 }
      );
    }

    const parseNum = (v: unknown) =>
      Number(String(v ?? '0').replace(/,/g, '')) || 0;

    const { data, error } = await supabase
      .from('listings')
      .insert({
        title:            websiteName,
        description,
        price:            parseNum(askingPrice),
        image_url:        imageUrl ?? null,
        user_id:          user.id,
        category,
        tech_stack:       techStack ?? null,
        monthly_revenue:  parseNum(monthlyRevenue),
        monthly_profit:   parseNum(monthlyProfit),
        monthly_traffic:  parseNum(monthlyTraffic),
        monetization:     monetization ?? null,
        website_url:      websiteUrl ?? null,
        age_bracket:      age ?? null,
        contact_name:     name ?? null,
        contact_email:    email,
        contact_telegram: telegram ?? null,
        notes:            notes ?? null,
        status:           'active',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(dbRowToListing(data as Record<string, unknown>), {
      status: 201,
    });
  } catch (err) {
    console.error('POST /api/listings:', err);
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}
