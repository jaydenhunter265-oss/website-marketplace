import { NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase-server';

type Params = { params: { id: string } };

async function requireAdmin() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single();
  return profile?.is_admin ? user : null;
}

const VALID_STATUSES = ['pending', 'active', 'sold', 'removed'] as const;
type ListingStatus = (typeof VALID_STATUSES)[number];

// PATCH /api/admin/listings/:id — update status
export async function PATCH(request: Request, { params }: Params) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const newStatus = body.status as ListingStatus | undefined;

    if (!newStatus || !VALID_STATUSES.includes(newStatus)) {
      return NextResponse.json(
        { error: `status must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const service = createServiceRoleClient();
    const { error } = await service
      .from('listings')
      .update({ status: newStatus })
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`PATCH /api/admin/listings/${params.id}:`, err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE /api/admin/listings/:id — hard delete
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const service = createServiceRoleClient();
    const { error } = await service
      .from('listings')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`DELETE /api/admin/listings/${params.id}:`, err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
