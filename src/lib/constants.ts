export const BUCKET_ESTUDIOS = 'estudios-dentales';

// Los pacientes inician sesión con su DNI. Internamente Supabase Auth necesita
// un email, así que se deriva uno determinístico a partir del DNI.
const DOMINIO_PACIENTES = process.env.NEXT_PUBLIC_PATIENT_EMAIL_DOMAIN || 'pacientes.local';

export const normalizarDni = (valor: string) => valor.trim().replace(/[\s.\-]/g, '').toLowerCase();

export const dniValido = (dni: string) => /^[a-z0-9]{5,20}$/.test(dni);

/** Si recibe un email (ej. un admin) lo respeta; si recibe un DNI lo convierte al email interno. */
export const identificadorAEmail = (identificador: string) => {
  const limpio = identificador.trim();
  if (limpio.includes('@')) return limpio.toLowerCase();
  return `${normalizarDni(limpio)}@${DOMINIO_PACIENTES}`;
};

export const TIPOS_ESTUDIO = [
  'Tomografía 3D (CBCT)',
  'Radiografía Panorámica',
  'Radiografía Periapical',
  'Telerradiografía',
  'Escaneo Intraoral',
  'Informe / Diagnóstico',
] as const;

/** Texto de búsqueda seguro para filtros PostgREST/ILIKE: solo letras, números, espacios y acentos. */
export const limpiarBusqueda = (texto: string) =>
  texto.replace(/[^\p{L}\p{N} ]/gu, '').trim().slice(0, 60);

export const nombreArchivoSeguro = (nombre: string) =>
  nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .slice(-120);
