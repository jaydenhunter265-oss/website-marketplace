import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// POST /api/checkout — create a Stripe Checkout session for a listing
export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient();

    // Require authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'You must be signed in to purchase.' }, { status: 401 });
    }

    const body = await request.json();
    const { listingId } = body as { listingId?: string };

    if (!listingId) {
      return NextResponse.json({ error: 'listingId is required.' }, { status: 400 });
    }

    // Fetch the listing (RLS: only active listings visible)
    const { data: listing, error: fetchError } = await supabase
      .from('listings')
      .select('id, title, description, price, status, user_id')
      .eq('id', listingId)
      .single();

    if (fetchError || !listing) {
      return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
    }

    if (listing.status !== 'active') {
      return NextResponse.json(
        { error: 'This listing is no longer available for purchase.' },
        { status: 409 }
      );
    }

    // Prevent sellers from buying their own listing
    if (listing.user_id === user.id) {
      return NextResponse.json(
        { error: 'You cannot purchase your own listing.' },
        { status: 403 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: listing.title,
              description: listing.description?.slice(0, 500) ?? undefined,
            },
            // Stripe expects amount in cents
            unit_amount: Math.round(Number(listing.price) * 100),
          },
          quantity: 1,
        },
      ],
      // Pass buyer + listing IDs in metadata so the webhook can act on them
      metadata: {
        listing_id: listingId,
        buyer_id: user.id,
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/browse/${listingId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('POST /api/checkout:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session.' },
      { status: 500 }
    );
  }
}
