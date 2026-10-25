import { requerirAdmin } from '@/lib/auth';
import Paginacion from '@/components/Paginacion';
import { PageHeader, tarjeta } from '@/components/admin/ui';

const POR_PAGINA = 25;
const ACCIONES: Record<string, string> = { INSERT: 'Alta', UPDATE: 'Modificación', DELETE: 'Baja' };
const ENTIDADES: Record<string, string> = { estudios: 'Estudio', estudio_archivos: 'Archivo', perfiles: 'Perfil', configuracion: 'Configuración' };

interface Fila { id: number; accion: string; entidad: string; entidad_id: string | null; creado_en: string; usuario: { nombre_completo: string } | null }

export default async function ActividadPage({ searchParams }: { searchParams: Promise<{ p?: string }> }) {
  const { supabase } = await requerirAdmin();
  const pagina = Math.max(1, parseInt((await searchParams).p ?? '1', 10) || 1);

  const { data, count } = await supabase
    .from('auditoria')
    .select('id, accion, entidad, entidad_id, creado_en, usuario:perfiles(nombre_completo)', { count: 'exact' })
    .order('creado_en', { ascending: false })
    .range((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA - 1)
    .returns<Fila[]>();

  return (
    <>
      <PageHeader titulo="Historial de actividad" descripcion="Registro de cambios del sistema. No se puede modificar ni borrar." />
      <div className={`${tarjeta} overflow-hidden`}>
        <ul className="divide-y divide-brand-brown/10">
          {(data ?? []).map((f) => (
            <li key={f.id} className="flex flex-col gap-0.5 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <span><strong>{ACCIONES[f.accion] ?? f.accion}</strong> · {ENTIDADES[f.entidad] ?? f.entidad} <span className="font-mono text-xs text-brand-dark/40">{f.entidad_id?.slice(0, 8)}</span></span>
              <span className="text-xs text-brand-dark/50">{f.usuario?.nombre_completo ?? 'Sistema'} · {new Date(f.creado_en).toLocaleString('es-AR')}</span>
            </li>
          ))}
          {(data ?? []).length === 0 && <li className="p-6 text-sm text-brand-dark/50">Todavía no hay actividad.</li>}
        </ul>
        <Paginacion pagina={pagina} total={count ?? 0} porPagina={POR_PAGINA} />
      </div>
    </>
  );
}
