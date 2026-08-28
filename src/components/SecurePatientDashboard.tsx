'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Download, Loader2, Calendar, FileBox, AlertCircle, CheckCircle2, User } from 'lucide-react';

interface Estudio {
  id: string;
  paciente_dni: string;
  tipo_estudio: string;
  estado: string;
  archivo_url: string;
  fecha_estudio: string;
}

export default function SecurePatientDashboard({ userDni, onLogout }: { userDni: string, onLogout: () => void }) {
  const [estudios, setEstudios] = useState<Estudio[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchEstudios = async () => {
      setCargando(true);
      const { data, error } = await supabase
        .from('estudios')
        .select('*')
        .eq('paciente_dni', userDni)
        .order('fecha_estudio', { ascending: false });

      if (!error && data) {
        setEstudios(data);
      }
      setCargando(false);
    };

    fetchEstudios();
  }, [userDni]);

  const descargarArchivo = async (rutaArchivo: string, nombreEstudio: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('estudios-dentales')
        .createSignedUrl(rutaArchivo, 60);

      if (error) throw error;
      if (!data) throw new Error('No se pudo generar la URL firmada');

      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = `${nombreEstudio.replace(/\s+/g, '_')}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      alert('Error en la descarga segura: ' + msg);
    }
  };

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-[#d4af37] animate-pulse" aria-live="polite">
        <Loader2 className="w-12 h-12 animate-spin mb-6" />
        <p className="font-black text-xl tracking-tight text-white">Cargando tus estudios de alta resolución...</p>
      </div>
    );
  }

  const estudiosCompletados = estudios.filter(e => e.estado === 'Completado');
  const estudiosEnProceso = estudios.filter(e => e.estado !== 'Completado');

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col space-y-10 animate-in fade-in duration-700">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-[#0a0806]/80 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#d4af37] to-[#8a7224] flex items-center justify-center text-[#1a1512] shadow-lg">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-3xl font-black font-heading text-white tracking-wide">Tus Estudios</h2>
            <p className="text-gray-400 mt-1 text-sm font-medium">Paciente DNI: <span className="text-[#d4af37]">{userDni}</span></p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white px-6 py-3 rounded-full text-sm font-bold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37] border border-white/5"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Notifications area */}
      {(estudiosCompletados.length > 0 || estudiosEnProceso.length > 0) && (
        <div className="space-y-4" aria-live="polite">
          {estudiosEnProceso.map(estudio => (
            <div key={`notif-${estudio.id}`} className="bg-yellow-500/10 border border-yellow-500/20 p-5 rounded-2xl flex items-center shadow-md">
              <Loader2 className="w-6 h-6 text-yellow-500 animate-spin flex-shrink-0" />
              <p className="ml-4 text-sm font-medium text-yellow-200/90 leading-relaxed">
                Tu <strong>{estudio.tipo_estudio}</strong> (del {new Date(estudio.fecha_estudio).toLocaleDateString()}) está siendo procesado por nuestros especialistas. Te avisaremos cuando esté listo.
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Studies Grid */}
      {estudios.length === 0 ? (
        <div className="bg-[#0a0806]/50 border border-white/5 rounded-[2rem] p-16 text-center flex flex-col items-center relative overflow-hidden group">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#d4af37]/5 blur-[80px] rounded-full pointer-events-none transition-all duration-700 group-hover:bg-[#d4af37]/10" />
          
          <div className="w-24 h-24 rounded-full bg-[#1a1512] border border-white/10 flex items-center justify-center mb-6 shadow-xl relative z-10">
            <FileBox className="w-10 h-10 text-[#d4af37]/50" />
          </div>
          <h3 className="text-2xl font-black text-white mb-2 relative z-10 tracking-tight">Aún no hay estudios asociados</h3>
          <p className="text-gray-400 max-w-md relative z-10 leading-relaxed">
            Si te realizaste un estudio recientemente en nuestra clínica, estará disponible aquí en las próximas 24 horas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {estudios.map((estudio) => (
            <div 
              key={estudio.id} 
              className="bg-[#0a0806]/80 text-white p-8 rounded-[2rem] border border-white/10 shadow-xl flex flex-col justify-between hover:border-[#d4af37]/40 hover:shadow-[0_10px_40px_rgba(212,175,55,0.1)] transition-all duration-300 group"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="flex items-center text-sm font-bold text-gray-400 bg-[#1a1512] px-4 py-2 rounded-xl border border-white/5 shadow-inner">
                    <Calendar className="w-4 h-4 mr-2 text-[#d4af37]" />
                    {new Date(estudio.fecha_estudio).toLocaleDateString()}
                  </span>
                  
                  {estudio.estado === 'Completado' ? (
                    <span className="flex items-center text-xs font-black uppercase tracking-wider text-green-400 bg-green-400/10 px-3 py-1.5 rounded-lg border border-green-400/20 shadow-[0_0_15px_rgba(74,222,128,0.15)]">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                      Disponible
                    </span>
                  ) : (
                    <span className="flex items-center text-xs font-black uppercase tracking-wider text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded-lg border border-yellow-400/20 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
                      <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
                      Procesando
                    </span>
                  )}
                </div>
                
                <h3 className="font-black text-2xl text-white mb-3 leading-tight group-hover:text-[#d4af37] transition-colors">{estudio.tipo_estudio}</h3>
                <p className="text-sm text-gray-400 mb-8 leading-relaxed">Diagnóstico por imágenes volumétricas con visor DICOM 3D de alta precisión incluido.</p>
              </div>

              {estudio.estado === 'Completado' && (
                <button
                  onClick={() => descargarArchivo(estudio.archivo_url, estudio.tipo_estudio)}
                  className="w-full bg-[#1a1512] border border-white/10 text-white hover:bg-[#d4af37] hover:text-[#1a1512] hover:border-[#d4af37] py-4 rounded-xl font-black flex justify-center items-center gap-3 transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 focus:ring-offset-[#0a0806]"
                  aria-label={`Descargar ${estudio.tipo_estudio}`}
                >
                  <Download className="w-5 h-5" />
                  <span>Descargar Estudio Seguro</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
