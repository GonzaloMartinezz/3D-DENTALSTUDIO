import type { SupabaseClient } from '@supabase/supabase-js';
import { TIPOS_ESTUDIO } from '@/lib/constants';

export interface Config {
  nombre_clinica: string;
  telefono_contacto: string;
  mensaje_portal: string;
  tipos_estudio: string[];
  publicar_por_defecto: boolean;
}

export const CONFIG_DEFECTO: Config = {
  nombre_clinica: '3D Dental Studio',
  telefono_contacto: '',
  mensaje_portal: 'Acá vas a encontrar tus estudios para descargarlos cuando quieras.',
  tipos_estudio: [...TIPOS_ESTUDIO],
  publicar_por_defecto: true,
};

/** Lee la tabla `configuracion` y completa con valores por defecto lo que falte. */
export async function getConfig(supabase: SupabaseClient): Promise<Config> {
  const { data } = await supabase.from('configuracion').select('clave, valor');
  const cfg: Record<string, unknown> = { ...CONFIG_DEFECTO };
  for (const fila of data ?? []) cfg[fila.clave] = fila.valor;

  const tipos = Array.isArray(cfg.tipos_estudio) ? (cfg.tipos_estudio as unknown[]).filter((t): t is string => typeof t === 'string' && t.trim() !== '') : [];
  return {
    nombre_clinica: String(cfg.nombre_clinica ?? CONFIG_DEFECTO.nombre_clinica),
    telefono_contacto: String(cfg.telefono_contacto ?? ''),
    mensaje_portal: String(cfg.mensaje_portal ?? ''),
    tipos_estudio: tipos.length ? tipos : CONFIG_DEFECTO.tipos_estudio,
    publicar_por_defecto: cfg.publicar_por_defecto !== false,
  };
}
