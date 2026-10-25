import 'server-only';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Perfil } from '@/types';

/**
 * Sesión para lecturas. getClaims() valida la firma del JWT localmente (sin viaje a Supabase),
 * lo que mantiene rápidas las páginas. RLS vuelve a validar el token en cada consulta.
 */
export async function getSesion() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return { supabase, user: null, perfil: null, aal: null as string | null };

  const { data: perfil } = await supabase.from('perfiles').select('*').eq('id', claims.sub).maybeSingle<Perfil>();
  return { supabase, user: { id: claims.sub }, perfil, aal: ((claims as { aal?: string }).aal ?? 'aal1') as string };
}

/** Para páginas: exige sesión + perfil, redirige si no. */
export async function requerirSesion() {
  const sesion = await getSesion();
  if (!sesion.user) redirect('/login');
  if (!sesion.perfil) redirect('/login?error=sin-perfil');
  return { supabase: sesion.supabase, user: sesion.user, perfil: sesion.perfil, aal: sesion.aal };
}

/** Admin con verificación en dos pasos completada (aal2). */
export async function requerirAdmin() {
  const sesion = await requerirSesion();
  if (sesion.perfil.rol !== 'admin') redirect('/paciente');
  if (sesion.aal !== 'aal2') redirect('/mfa');
  return sesion;
}

/** Para route handlers de administración: verifica el token contra Supabase (getUser) y exige 2FA. */
export async function apiRequerirAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: 'No autenticado' }, { status: 401 }) };

  const { data: claims } = await supabase.auth.getClaims();
  const { data: perfil } = await supabase.from('perfiles').select('*').eq('id', user.id).maybeSingle<Perfil>();
  if (perfil?.rol !== 'admin') return { error: NextResponse.json({ error: 'Acceso denegado' }, { status: 403 }) };
  if ((claims?.claims as { aal?: string } | undefined)?.aal !== 'aal2') {
    return { error: NextResponse.json({ error: 'Se requiere verificación en dos pasos' }, { status: 403 }) };
  }
  return { sesion: { supabase, user, perfil } };
}
