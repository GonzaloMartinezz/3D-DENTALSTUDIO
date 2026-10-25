import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

const MIN_LARGO = 10;

// Cambia la contraseña propia y limpia la marca "debe cambiarla". Se hace en el servidor
// porque los pacientes no tienen permiso de escritura sobre `perfiles`.
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const nueva = String(body?.password ?? '');
  if (nueva.length < MIN_LARGO) {
    return NextResponse.json({ error: `La contraseña debe tener al menos ${MIN_LARGO} caracteres.` }, { status: 400 });
  }
  if (nueva.toLowerCase().includes(String(user.user_metadata?.dni ?? '\u0000').toLowerCase())) {
    return NextResponse.json({ error: 'La contraseña no puede contener tu DNI.' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(user.id, { password: nueva });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await admin.from('perfiles').update({ debe_cambiar_password: false }).eq('id', user.id);
  return NextResponse.json({ ok: true });
}
