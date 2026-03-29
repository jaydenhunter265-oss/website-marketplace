import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

type Params = { params: { id: string } };

// GET /api/listings/:id — fetch single listing
export async function GET(_req: Request, { params }: Params) {
  try {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(`GET /api/listings/${params.id}:`, err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE /api/listings/:id — delete listing (owner only)
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const supabase = createServerSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership before deleting
    const { data: listing, error: fetchError } = await supabase
      .from('listings')
      .select('user_id')
      .eq('id', params.id)
      .single();

    if (fetchError || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (listing.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`DELETE /api/listings/${params.id}:`, err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
