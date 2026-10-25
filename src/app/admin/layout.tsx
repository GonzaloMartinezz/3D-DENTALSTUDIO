import { requerirAdmin } from '@/lib/auth';
import { getConfig } from '@/lib/config';
import AdminShell from '@/components/admin/AdminShell';

// Guardia única de todo /admin: solo administradores con 2FA completado llegan a cualquier subpágina.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { supabase, perfil } = await requerirAdmin();
  const config = await getConfig(supabase);

  return (
    <AdminShell nombre={perfil.nombre_completo} clinica={config.nombre_clinica}>
      {children}
    </AdminShell>
  );
}
