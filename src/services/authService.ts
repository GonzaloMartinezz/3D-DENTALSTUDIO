import { createClient } from '@/lib/supabase/client';
import { identificadorAEmail } from '@/lib/constants';

/** Inicia sesión con DNI (pacientes) o email (administradores). */
export async function iniciarSesion(identificador: string, password: string) {
  const supabase = createClient();
  return supabase.auth.signInWithPassword({ email: identificadorAEmail(identificador), password });
}

export async function cerrarSesion() {
  const supabase = createClient();
  return supabase.auth.signOut();
}

export async function cambiarPassword(nueva: string) {
  const res = await fetch('/api/paciente/password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: nueva }),
  });
  const json = await res.json().catch(() => ({}));
  return { error: res.ok ? null : new Error(json.error ?? 'No se pudo cambiar la contraseña') };
}
