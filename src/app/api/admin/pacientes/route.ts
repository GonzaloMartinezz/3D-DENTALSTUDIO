import { NextResponse } from 'next/server';
import { apiRequerirAdmin } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { dniValido, identificadorAEmail, normalizarDni } from '@/lib/constants';
import { generarPasswordTemporal } from '@/lib/password';

export async function POST(request: Request) {
  const { error } = await apiRequerirAdmin();
  if (error) return error;

  const body = await request.json().catch(() => null);
  const dni = normalizarDni(String(body?.dni ?? ''));
  const nombre = String(body?.nombre_completo ?? '').trim();
  const emailContacto = String(body?.email_contacto ?? '').trim() || null;
  const telefono = String(body?.telefono ?? '').trim() || null;
  const passwordIngresada = String(body?.password ?? '');

  if (!dniValido(dni)) return NextResponse.json({ error: 'DNI inválido (5 a 20 letras o números).' }, { status: 400 });
  if (nombre.length < 3) return NextResponse.json({ error: 'Ingresá el nombre completo.' }, { status: 400 });
  if (passwordIngresada && passwordIngresada.length < 8) {
    return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres.' }, { status: 400 });
  }

  const password = passwordIngresada || generarPasswordTemporal();
  const admin = createAdminClient();

  const { data: creado, error: errorAuth } = await admin.auth.admin.createUser({
    email: identificadorAEmail(dni),
    password,
    email_confirm: true,
    user_metadata: { dni, nombre_completo: nombre },
  });

  if (errorAuth || !creado.user) {
    const duplicado = errorAuth?.message.toLowerCase().includes('already');
    return NextResponse.json(
      { error: duplicado ? 'Ya existe un paciente con ese DNI.' : `No se pudo crear la cuenta: ${errorAuth?.message}` },
      { status: duplicado ? 409 : 500 },
    );
  }

  const { data: perfil, error: errorPerfil } = await admin
    .from('perfiles')
    .insert({ id: creado.user.id, dni, nombre_completo: nombre, email_contacto: emailContacto, telefono, rol: 'paciente', debe_cambiar_password: true })
    .select()
    .single();

  if (errorPerfil) {
    await admin.auth.admin.deleteUser(creado.user.id); // no dejar cuentas huérfanas
    return NextResponse.json({ error: `No se pudo guardar el perfil: ${errorPerfil.message}` }, { status: 500 });
  }

  return NextResponse.json({ paciente: perfil, password }, { status: 201 });
}
