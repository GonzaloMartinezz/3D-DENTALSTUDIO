'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FileBox, Calendar, AlertCircle, CheckCircle2, Search, MoreVertical } from 'lucide-react';

interface Estudio {
  id: string;
  paciente_dni: string;
  tipo_estudio: string;
  estado: string;
  archivo_url: string;
  fecha_estudio: string;
}

export default function AdminStudiesList() {
  const [estudios, setEstudios] = useState<Estudio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    fetchEstudios();
  }, []);

  const fetchEstudios = async () => {
    setCargando(true);
    const { data, error } = await supabase
      .from('estudios')
      .select('*')
      .order('fecha_estudio', { ascending: false });

    if (!error && data) {
      setEstudios(data);
    }
    setCargando(false);
  };

  const cambiarEstado = async (id: string, estadoActual: string) => {
    const nuevoEstado = estadoActual === 'Completado' ? 'Procesando' : 'Completado';
    
    const { error } = await supabase
      .from('estudios')
      .update({ estado: nuevoEstado })
      .eq('id', id);

    if (!error) {
      setEstudios(estudios.map(est => est.id === id ? { ...est, estado: nuevoEstado } : est));
    } else {
      alert('Error al cambiar el estado del estudio.');
    }
  };

  const estudiosFiltrados = estudios.filter(est => 
    est.paciente_dni.includes(filtro) || 
    est.tipo_estudio.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="bg-[#0a0806] rounded-3xl border border-white/5 shadow-2xl overflow-hidden mt-8">
      <div className="p-6 sm:p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
          <span className="w-2 h-8 rounded-full bg-[#d4af37]"></span>
          Estudios Recientes
        </h2>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Filtrar DNI o tipo..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full bg-[#1a1512] border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37]/50 focus:ring-1 focus:ring-[#d4af37]/50 transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {cargando ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37]"></div>
          </div>
        ) : estudiosFiltrados.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center">
            <FileBox className="w-12 h-12 text-gray-700 mb-4" />
            <p className="text-gray-400 font-medium">No se encontraron estudios.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#1a1512]/50 text-xs uppercase font-bold text-gray-500">
              <tr>
                <th className="px-6 py-4">Paciente (DNI)</th>
                <th className="px-6 py-4">Tipo de Estudio</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {estudiosFiltrados.map((estudio) => (
                <tr key={estudio.id} className="border-b border-white/5 hover:bg-[#1a1512] transition-colors group">
                  <td className="px-6 py-4 font-bold text-white whitespace-nowrap">
                    {estudio.paciente_dni}
                  </td>
                  <td className="px-6 py-4">
                    {estudio.tipo_estudio}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      {new Date(estudio.fecha_estudio).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      onClick={() => cambiarEstado(estudio.id, estudio.estado)}
                      className={`cursor-pointer inline-flex items-center px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider transition-all hover:opacity-80
                        ${estudio.estado === 'Completado' 
                          ? 'text-green-400 bg-green-400/10 border border-green-400/20' 
                          : 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20'
                        }`}
                      title="Clic para cambiar estado"
                    >
                      {estudio.estado === 'Completado' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
                      )}
                      {estudio.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
