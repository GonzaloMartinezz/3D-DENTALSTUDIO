import { requerirAdmin } from '@/lib/auth';
import { getConfig } from '@/lib/config';
import { limpiarBusqueda } from '@/lib/constants';
import StudiesManager from '@/components/admin/StudiesManager';
import { PageHeader } from '@/components/admin/ui';
import type { EstudioConPaciente } from '@/types';

const POR_PAGINA = 20;

export default async function EstudiosPage({ searchParams }: { searchParams: Promise<{ q?: string; p?: string; estado?: string }> }) {
  const { supabase } = await requerirAdmin();
  const sp = await searchParams;
  const q = limpiarBusqueda(sp.q ?? '');
  const pagina = Math.max(1, parseInt(sp.p ?? '1', 10) || 1);
  const estado = sp.estado === 'publicados' || sp.estado === 'sin_publicar' ? sp.estado : 'todos';
  const config = await getConfig(supabase);

  // Con búsqueda, primero se resuelven los pacientes que coinciden por nombre o DNI
  let filtro = '';
  if (q) {
    const { data } = await supabase
      .from('perfiles').select('id').eq('rol', 'paciente')
      .or(`nombre_completo.ilike.%${q}%,dni.ilike.%${q}%`).limit(200);
    const ids = (data ?? []).map((p) => p.id);
    filtro = ids.length ? `paciente_id.in.(${ids.join(',')}),tipo_estudio.ilike.%${q}%` : `tipo_estudio.ilike.%${q}%`;
  }

  let consulta = supabase
    .from('estudios')
    .select('*, paciente:perfiles(dni, nombre_completo), archivos:estudio_archivos(*)', { count: 'exact' })
    .order('fecha_estudio', { ascending: false })
    .range((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA - 1);
  if (filtro) consulta = consulta.or(filtro);
  if (estado === 'publicados') consulta = consulta.eq('estado', 'Completado');
  if (estado === 'sin_publicar') consulta = consulta.neq('estado', 'Completado');

  const { data, count } = await consulta.returns<EstudioConPaciente[]>();

  return (
    <>
      <PageHeader titulo="Estudios" descripcion="Todos los estudios enviados. Publicalos, editalos o agregá archivos." />
      <StudiesManager estudios={data ?? []} total={count ?? 0} pagina={pagina} porPagina={POR_PAGINA} q={q} estado={estado} tipos={config.tipos_estudio} />
    </>
  );
}
