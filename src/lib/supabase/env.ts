// Tolera que la variable se haya copiado con un sufijo (ej. ".../rest/v1/"): solo importa el origen.
const bruta = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

export const SUPABASE_URL = (() => {
  try {
    return new URL(bruta).origin;
  } catch {
    return bruta;
  }
})();

export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
