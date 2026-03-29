import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// For use in Route Handlers and Server Components (Next.js 14).
// cookies() is synchronous in Next.js 14.
export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Components cannot set cookies — safe to ignore.
          }
        },
      },
    }
  );
}
