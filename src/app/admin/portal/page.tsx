import { requerirAdmin } from '@/lib/auth';
import { getConfig } from '@/lib/config';
import PortalEnvio, { type EstudioExistente } from '@/components/admin/PortalEnvio';
import { PageHeader } from '@/components/admin/ui';

export default async function PortalPage({ searchParams }: { searchParams: Promise<{ dni?: string; estudio?: string }> }) {
  const { supabase } = await requerirAdmin();
  const { dni, estudio } = await searchParams;
  const config = await getConfig(supabase);

  // ?estudio=<id> => agregar archivos a un estudio ya existente
  let existente: EstudioExistente | undefined;
  if (estudio && /^[0-9a-f-]{36}$/i.test(estudio)) {
    const { data } = await supabase
      .from('estudios')
      .select('id, paciente_id, tipo_estudio, paciente:perfiles(nombre_completo)')
      .eq('id', estudio)
      .maybeSingle<{ id: string; paciente_id: string; tipo_estudio: string; paciente: { nombre_completo: string } | null }>();
    if (data) existente = { id: data.id, paciente_id: data.paciente_id, tipo_estudio: data.tipo_estudio, paciente_nombre: data.paciente?.nombre_completo ?? '' };
  }

  return (
    <>
      <PageHeader
        titulo={existente ? 'Agregar archivos' : 'Enviar estudio a un paciente'}
        descripcion="Indicá el DNI, completá los datos del estudio y transferí los archivos del tomógrafo. El paciente los verá en su cuenta y podrá descargarlos."
      />
      <PortalEnvio
        tipos={config.tipos_estudio}
        publicarPorDefecto={config.publicar_por_defecto}
        dniInicial={(dni ?? '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 20)}
        estudioExistente={existente}
      />
    </>
  );
}
