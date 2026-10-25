import { NextResponse } from 'next/server';
import { getSesion } from '@/lib/auth';
import { BUCKET_ESTUDIOS } from '@/lib/constants';

// Devuelve una URL firmada de vida corta. La autorización la imponen RLS (tablas y storage):
// un paciente solo accede a archivos de sus estudios y solo si ya están publicados.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { supabase, user } = await getSesion();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { id } = await params;
  const { data: archivo } = await supabase
    .from('estudio_archivos')
    .select('id, path, nombre, estudio:estudios(estado)')
    .eq('id', id)
    .maybeSingle<{ id: string; path: string; nombre: string; estudio: { estado: string } | null }>();

  if (!archivo) return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
  if (archivo.estudio?.estado !== 'Completado') {
    return NextResponse.json({ error: 'El estudio todavía se está procesando.' }, { status: 409 });
  }

  const { data, error } = await supabase.storage
    .from(BUCKET_ESTUDIOS)
    .createSignedUrl(archivo.path, 60, { download: archivo.nombre });

  if (error || !data) return NextResponse.json({ error: 'No se pudo generar el enlace de descarga.' }, { status: 500 });

  await supabase.from('descargas').insert({ archivo_id: archivo.id, usuario_id: user.id });

  return NextResponse.json({ url: data.signedUrl }, { headers: { 'Cache-Control': 'no-store' } });
}
