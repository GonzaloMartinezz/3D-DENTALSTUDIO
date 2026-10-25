import { NextResponse } from 'next/server';
import { apiRequerirAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { generarPasswordTemporal } from '@/lib/password';

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await apiRequerirAdmin();
  if (error) return error;

  const { id } = await params;
  const admin = createAdminClient();

  // Solo cuentas de pacientes: nunca resetear la de otro admin desde acá.
  const { data: perfil } = await admin.from('perfiles').select('rol').eq('id', id).maybeSingle();
  if (!perfil || perfil.rol !== 'paciente') {
    return NextResponse.json({ error: 'Paciente no encontrado.' }, { status: 404 });
  }

  const password = generarPasswordTemporal();
  const { error: errorUpdate } = await admin.auth.admin.updateUserById(id, { password });
  if (errorUpdate) return NextResponse.json({ error: errorUpdate.message }, { status: 500 });

  await admin.from('perfiles').update({ debe_cambiar_password: true }).eq('id', id);

  return NextResponse.json({ password });
}
