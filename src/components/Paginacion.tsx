'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/** Búsqueda + paginación guardadas en la URL (compartibles, y el servidor solo trae una página). */
export function useParamsUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  return (cambios: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(cambios).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };
}

export default function Paginacion({ pagina, total, porPagina, clave = 'p' }: { pagina: number; total: number; porPagina: number; clave?: string }) {
  const setParams = useParamsUrl();
  const paginas = Math.max(1, Math.ceil(total / porPagina));
  if (paginas <= 1) return null;
  const ir = (n: number) => setParams({ [clave]: n > 1 ? String(n) : null });

  return (
    <div className="flex items-center justify-between border-t border-brand-brown/10 px-4 py-3 text-sm text-brand-dark/60 sm:px-6">
      <span>Página {pagina} de {paginas} · {total} en total</span>
      <div className="flex gap-1">
        <button onClick={() => ir(pagina - 1)} disabled={pagina <= 1} aria-label="Página anterior" className="rounded-lg p-2 hover:bg-brand-beige/50 disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>
        <button onClick={() => ir(pagina + 1)} disabled={pagina >= paginas} aria-label="Página siguiente" className="rounded-lg p-2 hover:bg-brand-beige/50 disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
}
