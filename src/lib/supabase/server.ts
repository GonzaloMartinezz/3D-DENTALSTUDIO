import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabase/env';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/** Cliente con la sesión del usuario (cookies). Respeta RLS. */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Llamado desde un Server Component: el proxy ya refresca la sesión.
          }
        },
      },
    },
  );
}
