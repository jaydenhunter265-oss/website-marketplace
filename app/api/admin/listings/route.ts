import { NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase-server';

// Shared admin auth check
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

// GET /api/admin/listings — all listings regardless of status
export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const service = createServiceRoleClient();

    const { data, error } = await service
      .from('listings')
      .select('id, title, category, price, status, created_at, user_id, contact_email, monthly_revenue')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error('GET /api/admin/listings:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
