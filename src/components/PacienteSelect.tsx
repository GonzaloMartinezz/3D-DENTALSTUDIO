'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { limpiarBusqueda } from '@/lib/constants';
import type { Perfil } from '@/types';

export type PacienteMin = Pick<Perfil, 'id' | 'dni' | 'nombre_completo'>;

const CAMPO = 'w-full bg-[#1a1512] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37]/50 focus:ring-1 focus:ring-[#d4af37]/50';

/** Buscador de pacientes: consulta la base a medida que se escribe (escala a miles de pacientes). */
export default function PacienteSelect({ valor, onChange, disabled }: { valor: PacienteMin | null; onChange: (p: PacienteMin | null) => void; disabled?: boolean }) {
  const [texto, setTexto] = useState('');
  const [resultados, setResultados] = useState<PacienteMin[]>([]);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const q = limpiarBusqueda(texto);
    if (q.length < 2) return;
    const t = setTimeout(async () => {
      const { data } = await createClient()
        .from('perfiles')
        .select('id, dni, nombre_completo')
        .eq('rol', 'paciente')
        .or(`nombre_completo.ilike.%${q}%,dni.ilike.%${q}%`)
        .order('nombre_completo')
        .limit(8);
      setResultados(data ?? []);
    }, 250);
    return () => clearTimeout(t);
  }, [texto]);

  const hayBusqueda = limpiarBusqueda(texto).length >= 2;

  if (valor) {
    return (
      <div className="flex items-center justify-between bg-[#1a1512] border border-[#d4af37]/30 rounded-xl px-4 py-3 text-sm">
        <span><strong>{valor.nombre_completo}</strong> <span className="text-gray-400">— DNI {valor.dni}</span></span>
        {!disabled && <button type="button" onClick={() => { onChange(null); setTexto(''); }} className="text-xs text-[#d4af37] hover:text-white font-bold">Cambiar</button>}
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        value={texto}
        onChange={(e) => { setTexto(e.target.value); setAbierto(true); }}
        onFocus={() => setAbierto(true)}
        placeholder="Buscar por nombre o DNI…"
        disabled={disabled}
        className={CAMPO}
        role="combobox"
        aria-expanded={abierto}
        aria-controls="lista-pacientes"
        autoComplete="off"
      />
      {abierto && hayBusqueda && resultados.length > 0 && (
        <ul id="lista-pacientes" role="listbox" className="absolute z-20 mt-1 w-full bg-[#1a1512] border border-white/10 rounded-xl overflow-hidden shadow-xl">
          {resultados.map((p) => (
            <li key={p.id} role="option" aria-selected={false}>
              <button type="button" onClick={() => { onChange(p); setAbierto(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-white/5">
                {p.nombre_completo} <span className="text-gray-500">— DNI {p.dni}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {abierto && hayBusqueda && resultados.length === 0 && (
        <p className="absolute z-20 mt-1 w-full bg-[#1a1512] border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-400">Sin resultados</p>
      )}
    </div>
  );
}
