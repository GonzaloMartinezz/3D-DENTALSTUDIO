'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Download, Loader2, Calendar } from 'lucide-react';

interface Estudio {
  id: string;
  paciente_dni: string;
  tipo_estudio: string;
  estado: string;
  archivo_url: string;
  fecha_estudio: string;
}

export default function PatientDashboard({ UserDni }: { UserDni: string }) {
  const [estudios, setEstudios] = useState<Estudio[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchEstudios = async () => {
      // Consulta en PostgreSQL filtrando por el DNI del paciente logueado
      const { data, error } = await supabase
        .from('estudios')
        .select('*')
        .eq('paciente_dni', UserDni)
        .order('fecha_estudio', { ascending: false });

      if (!error && data) {
        setEstudios(data);
      }
      setCargando(false);
    };

    fetchEstudios();
  }, [UserDni]);

  const descargarArchivo = async (rutaArchivo: string, nombreEstudio: string) => {
    try {
      // Generamos una URL firmada segura que expira en 60 segundos
      const { data, error } = await supabase.storage
        .from('estudios-dentales')
        .createSignedUrl(rutaArchivo, 60);

      if (error) throw error;
      if (!data) throw new Error('No se pudo generar la URL firmada');

      // Forzar la descarga del archivo ZIP en el dispositivo móvil
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = `${nombreEstudio.replace(/\s+/g, '_')}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      alert('No se pudo generar el enlace de descarga: ' + error.message);
    }
  };

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-blue-600">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Cargando tus estudios...</p>
      </div>
    );
  }

  // Notificaciones calculadas
  const estudiosCompletados = estudios.filter(e => e.estado === 'Completado');
  const estudiosEnProceso = estudios.filter(e => e.estado !== 'Completado');

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mis Estudios Dentales</h1>
        <p className="text-sm text-gray-500 mt-1">DNI: {UserDni}</p>
      </div>

      {/* Sección de Notificaciones */}
      <div className="space-y-3">
        {estudiosCompletados.map(estudio => (
          <div key={`notif-${estudio.id}`} className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <Download className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800 font-medium">
                  ¡Tu {estudio.tipo_estudio} del {new Date(estudio.fecha_estudio).toLocaleDateString()} ya está lista para descargar!
                </p>
              </div>
            </div>
          </div>
        ))}
        {estudiosEnProceso.map(estudio => (
          <div key={`notif-${estudio.id}`} className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800 font-medium">
                  Tu {estudio.tipo_estudio} del {new Date(estudio.fecha_estudio).toLocaleDateString()} aún está en proceso de carga. Te avisaremos cuando esté lista.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {estudios.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-gray-500 font-medium">No posees estudios registrados actualmente.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {estudios.map((estudio) => (
            <div key={estudio.id} className="p-5 bg-white rounded-xl shadow-sm border border-gray-200 space-y-4 transition-all hover:shadow-md">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="flex items-center text-sm font-medium text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(estudio.fecha_estudio).toLocaleDateString()}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  estudio.estado === 'Completado' 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                }`}>
                  {estudio.estado}
                </span>
              </div>
              
              <div>
                <h3 className="font-bold text-lg text-gray-900">{estudio.tipo_estudio}</h3>
                <p className="text-sm text-gray-500 mt-1">Estudio de diagnóstico por imágenes en alta resolución.</p>
              </div>

              {estudio.estado === 'Completado' && (
                <button
                  onClick={() => descargarArchivo(estudio.archivo_url, estudio.tipo_estudio)}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium text-sm transition-colors flex justify-center items-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar archivo .zip</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
