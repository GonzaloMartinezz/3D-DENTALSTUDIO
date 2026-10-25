import { requerirAdmin } from '@/lib/auth';
import { getConfig } from '@/lib/config';
import ConfigForm, { type EventoActividad } from '@/components/admin/ConfigForm';
import { PageHeader } from '@/components/admin/ui';

export default async function ConfiguracionPage() {
  const { supabase } = await requerirAdmin();
  const [config, actividad] = await Promise.all([
    getConfig(supabase),
    supabase
      .from('auditoria')
      .select('id, accion, entidad, creado_en, usuario:perfiles(nombre_completo)')
      .order('creado_en', { ascending: false })
      .limit(8)
      .returns<EventoActividad[]>(),
  ]);

  return (
    <>
      <PageHeader titulo="Configuración" descripcion="Ajustá cómo funciona el panel y qué ven los pacientes." />
      <ConfigForm config={config} actividad={actividad.data ?? []} />
    </>
  );
}
