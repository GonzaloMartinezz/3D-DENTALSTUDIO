'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useParamsUrl } from '@/components/Paginacion';
import { campo } from '@/components/admin/ui';

/** Buscador que guarda el texto en la URL (?q=) y vuelve a la página 1. */
export default function Buscador({ valor, placeholder, parametro = 'q' }: { valor: string; placeholder: string; parametro?: string }) {
  const setParams = useParamsUrl();
  const [texto, setTexto] = useState(valor);

  const buscar = () => {
    if (texto.trim() !== valor) setParams({ [parametro]: texto.trim() || null, p: null });
  };

  return (
    <div className="relative w-full sm:w-80">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-dark/40" aria-hidden />
      <input
        type="search"
        value={texto}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && buscar()}
        onBlur={buscar}
        className={`${campo} pl-10`}
      />
    </div>
  );
}
