import { redirect } from 'next/navigation';
import { requerirSesion } from '@/lib/auth';
import PatientStudies from '@/components/PatientStudies';
import { getConfig } from '@/lib/config';
import type { Estudio } from '@/types';

export default async function PacientePage() {
  const { supabase, perfil } = await requerirSesion();
  if (perfil.rol === 'admin') redirect('/admin');

  const config = await getConfig(supabase);

  // RLS garantiza que solo se devuelven los estudios de este paciente
  const { data: estudios } = await supabase
    .from('estudios')
    .select('*, archivos:estudio_archivos(*)')
    .order('fecha_estudio', { ascending: false })
    .returns<Estudio[]>();

  return (
    <div className="min-h-screen bg-[#f8f7f5] pt-20 md:pt-10 pb-12 px-4 sm:px-6">
      <PatientStudies perfil={perfil} estudios={estudios ?? []} mensaje={config.mensaje_portal} telefono={config.telefono_contacto} clinica={config.nombre_clinica} />
    </div>
  );
}
