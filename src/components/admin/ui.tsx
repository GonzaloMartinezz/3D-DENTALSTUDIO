import type { ReactNode } from 'react';

// Sistema visual del panel: superficies claras con los colores de la web (beige / marrón / azul suave).
export const tarjeta = 'bg-white rounded-2xl border border-brand-brown/10 shadow-sm';
export const campo =
  'w-full rounded-xl border border-brand-brown/20 bg-white px-4 py-3 text-sm text-brand-dark placeholder:text-brand-dark/40 focus:outline-none focus:border-brand-brown focus:ring-2 focus:ring-brand-brown/15 disabled:bg-brand-beige/20 disabled:text-brand-dark/50';
export const etiqueta = 'block text-xs font-bold text-brand-dark/60 uppercase tracking-wider mb-1.5';
export const btnPrimario =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-brand-brown px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50';
export const btnSecundario =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-brand-brown/20 bg-white px-4 py-2.5 text-sm font-bold text-brand-brown transition-colors hover:bg-brand-beige/40 disabled:opacity-50';
export const btnIcono =
  'inline-flex h-9 w-9 items-center justify-center rounded-lg text-brand-dark/50 transition-colors hover:bg-brand-beige/50 hover:text-brand-brown';

export function PageHeader({ titulo, descripcion, acciones }: { titulo: string; descripcion?: string; acciones?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-brown font-heading tracking-wide">{titulo}</h1>
        {descripcion && <p className="mt-1 text-sm text-brand-dark/60 max-w-2xl">{descripcion}</p>}
      </div>
      {acciones && <div className="flex flex-wrap gap-2">{acciones}</div>}
    </div>
  );
}

export function Stat({ etiqueta: texto, valor, detalle, icono }: { etiqueta: string; valor: ReactNode; detalle?: string; icono?: ReactNode }) {
  return (
    <div className={`${tarjeta} p-4 sm:p-5`}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-dark/50">{texto}</span>
        {icono && <span className="text-brand-brown/60">{icono}</span>}
      </div>
      <div className="mt-2 text-3xl font-black text-brand-brown">{valor}</div>
      {detalle && <div className="mt-1 text-xs text-brand-dark/50">{detalle}</div>}
    </div>
  );
}

export function Insignia({ tono, children }: { tono: 'ok' | 'pendiente' | 'info'; children: ReactNode }) {
  const tonos = {
    ok: 'bg-green-100 text-green-800 border-green-200',
    pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    info: 'bg-brand-blue-light text-brand-blue-dark border-brand-blue',
  };
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${tonos[tono]}`}>{children}</span>;
}

export function Vacio({ icono, titulo, texto, accion }: { icono: ReactNode; titulo: string; texto?: string; accion?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-beige/50 text-brand-brown/70">{icono}</div>
      <h3 className="text-lg font-bold text-brand-brown">{titulo}</h3>
      {texto && <p className="mt-1 max-w-sm text-sm text-brand-dark/60">{texto}</p>}
      {accion && <div className="mt-5">{accion}</div>}
    </div>
  );
}

export const formatearBytes = (bytes: number) => {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
};

export const formatearFecha = (iso: string) => new Date(iso).toLocaleDateString('es-AR');
