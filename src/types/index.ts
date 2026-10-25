export type Rol = 'paciente' | 'admin';
export type EstadoEstudio = 'Procesando' | 'Completado';

export interface Perfil {
  id: string;
  dni: string;
  nombre_completo: string;
  email_contacto: string | null;
  telefono: string | null;
  rol: Rol;
  debe_cambiar_password: boolean;
  creado_en: string;
}

export interface EstudioArchivo {
  id: string;
  estudio_id: string;
  path: string;
  nombre: string;
  tamano_bytes: number | null;
  content_type: string | null;
}

export interface Estudio {
  id: string;
  paciente_id: string;
  tipo_estudio: string;
  estado: EstadoEstudio;
  notas: string | null;
  fecha_estudio: string;
  creado_en: string;
  archivos: EstudioArchivo[];
}

export interface EstudioConPaciente extends Estudio {
  paciente: Pick<Perfil, 'dni' | 'nombre_completo'> | null;
}
