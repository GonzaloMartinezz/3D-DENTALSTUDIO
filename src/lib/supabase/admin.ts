import { SUPABASE_URL } from '@/lib/supabase/env';
import 'server-only';
import { createClient } from '@supabase/supabase-js';

/** Cliente con service role: IGNORA RLS. Usar solo en el servidor, tras validar que quien llama es admin. */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('Falta SUPABASE_SERVICE_ROLE_KEY en el entorno del servidor');

  return createClient(SUPABASE_URL, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
