import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServiceRoleClient } from '@/lib/supabase-server';

// Stripe sends the raw body — we must NOT let Next.js parse it.
// Verify the signature first, then act on the event.
export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Only act on successful payments
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const listingId = session.metadata?.listing_id;
    const buyerId = session.metadata?.buyer_id;

    if (!listingId || !buyerId) {
      console.error('Webhook missing metadata', session.metadata);
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
    }

    // Use service role to bypass RLS for the post-purchase updates
    const supabase = createServiceRoleClient();

    // 1. Mark the listing as sold
    const { error: updateError } = await supabase
      .from('listings')
      .update({ status: 'sold' })
      .eq('id', listingId);

    if (updateError) {
      console.error('Failed to mark listing as sold:', updateError);
      // Don't return an error — Stripe will retry if we return 5xx
    }

    // 2. Record the completed order
    const amountPaid =
      session.amount_total != null ? session.amount_total / 100 : null;

    const { error: orderError } = await supabase.from('orders').insert({
      buyer_id: buyerId,
      listing_id: listingId,
      status: 'completed',
      amount_paid: amountPaid,
      stripe_session_id: session.id,
    });

    if (orderError) {
      console.error('Failed to create order record:', orderError);
    }
  }

  // Always return 200 so Stripe doesn't retry unnecessarily
  return NextResponse.json({ received: true });
}
