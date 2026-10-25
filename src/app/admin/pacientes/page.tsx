import { Calendar, UserCheck, UserMinus, Users } from 'lucide-react';
import { requerirAdmin } from '@/lib/auth';
import { limpiarBusqueda } from '@/lib/constants';
import { RESUMEN_VACIO, type ResumenPanel } from '@/lib/resumen';
import PatientsManager, { type PacienteFila } from '@/components/admin/PatientsManager';
import { PageHeader, Stat } from '@/components/admin/ui';

const POR_PAGINA = 15;

export default async function PacientesPage({ searchParams }: { searchParams: Promise<{ q?: string; p?: string }> }) {
  const { supabase } = await requerirAdmin();
  const sp = await searchParams;
  const q = limpiarBusqueda(sp.q ?? '');
  const pagina = Math.max(1, parseInt(sp.p ?? '1', 10) || 1);

  let consulta = supabase
    .from('perfiles')
    .select('*, estudios(count)', { count: 'exact' })
    .eq('rol', 'paciente')
    .order('nombre_completo')
    .range((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA - 1);
  if (q) consulta = consulta.or(`nombre_completo.ilike.%${q}%,dni.ilike.%${q}%`);

  const [lista, resumenRes] = await Promise.all([consulta.returns<PacienteFila[]>(), supabase.rpc('admin_resumen')]);
  const r: ResumenPanel = { ...RESUMEN_VACIO, ...(resumenRes.data ?? {}) };

  return (
    <>
      <PageHeader titulo="Pacientes" descripcion="Controlá cuántos pacientes tiene la clínica y administrá sus cuentas de acceso." />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat etiqueta="Total de pacientes" valor={r.pacientes} icono={<Users className="h-5 w-5" />} />
        <Stat etiqueta="Nuevos este mes" valor={r.pacientes_mes} icono={<Calendar className="h-5 w-5" />} />
        <Stat etiqueta="Con estudios" valor={r.pacientes_con_estudios} icono={<UserCheck className="h-5 w-5" />} />
        <Stat etiqueta="Sin estudios" valor={Math.max(0, r.pacientes - r.pacientes_con_estudios)} icono={<UserMinus className="h-5 w-5" />} />
      </div>
      <PatientsManager pacientes={lista.data ?? []} total={lista.count ?? 0} pagina={pagina} porPagina={POR_PAGINA} q={q} />
    </>
  );
}
