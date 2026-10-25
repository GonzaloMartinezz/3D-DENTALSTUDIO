'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/** Diálogo accesible: se cierra con Escape o tocando afuera, y en celulares sube desde abajo. */
export default function Modal({ titulo, onClose, children }: { titulo: string; onClose: () => void; children: React.ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previo = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const alTeclear = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', alTeclear);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', alTeclear);
      document.body.style.overflow = '';
      previo?.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-brand-dark/50 p-0 sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl focus:outline-none sm:max-w-lg sm:rounded-3xl sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-black text-brand-brown">{titulo}</h2>
          <button onClick={onClose} aria-label="Cerrar" className="flex h-9 w-9 items-center justify-center rounded-full text-brand-dark/50 hover:bg-brand-beige/50"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
