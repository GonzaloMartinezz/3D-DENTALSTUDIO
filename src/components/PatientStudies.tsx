'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Loader2, Calendar, FileBox, AlertCircle, CheckCircle2, User, KeyRound } from 'lucide-react';
import { cerrarSesion, cambiarPassword } from '@/services/authService';
import type { Estudio, EstudioArchivo, Perfil } from '@/types';

const formatearTamano = (bytes: number | null) => {
  if (!bytes) return '';
  return bytes >= 1024 ** 3 ? `${(bytes / 1024 ** 3).toFixed(2)} GB` : `${(bytes / 1024 ** 2).toFixed(1)} MB`;
};

export default function PatientStudies({ perfil, estudios, mensaje, telefono, clinica }: { perfil: Perfil; estudios: Estudio[]; mensaje: string; telefono: string; clinica: string }) {
  const router = useRouter();
  const [descargando, setDescargando] = useState<string | null>(null);
  const [errorDescarga, setErrorDescarga] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [mensajePassword, setMensajePassword] = useState<{ ok: boolean; texto: string } | null>(null);

  const descargar = async (archivo: EstudioArchivo) => {
    setDescargando(archivo.id);
    setErrorDescarga('');
    try {
      const res = await fetch(`/api/archivos/${archivo.id}/descarga`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'No se pudo descargar');
      window.location.assign(json.url); // la URL firmada fuerza la descarga y expira en 60 s
    } catch (e) {
      setErrorDescarga(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setDescargando(null);
    }
  };

  const salir = async () => {
    await cerrarSesion();
    router.replace('/login');
    router.refresh();
  };

  const guardarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await cambiarPassword(nuevaPassword);
    setMensajePassword(error ? { ok: false, texto: error.message } : { ok: true, texto: 'Contraseña actualizada.' });
    if (!error) {
      setNuevaPassword('');
      router.refresh(); // limpia la marca de cambio obligatorio
    }
  };

  if (perfil.debe_cambiar_password) {
    return (
      <form onSubmit={guardarPassword} className="w-full max-w-md mx-auto bg-brand-beige p-5 sm:p-8 rounded-[2rem] border border-brand-brown/10 shadow-lg space-y-4">
        <h1 className="text-2xl font-black text-brand-brown">Elegí tu contraseña</h1>
        <p className="text-sm text-brand-dark/60">Por seguridad, reemplazá la contraseña temporal que te dio la clínica por una propia (mínimo 10 caracteres).</p>
        <input
          type="password"
          required
          minLength={10}
          autoComplete="new-password"
          value={nuevaPassword}
          onChange={(e) => setNuevaPassword(e.target.value)}
          placeholder="Nueva contraseña"
          className="w-full bg-brand-beige/40 border border-brand-brown/20 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder:text-brand-dark/40 focus:outline-none focus:border-brand-brown"
        />
        <button type="submit" className="w-full bg-brand-brown text-brand-beige font-black py-3 rounded-xl hover:bg-brand-dark transition-colors">Guardar y continuar</button>
        {mensajePassword && !mensajePassword.ok && <p role="alert" className="text-sm font-bold text-red-600">{mensajePassword.texto}</p>}
        <button type="button" onClick={salir} className="text-xs text-brand-dark/50 hover:text-brand-brown underline">Cerrar sesión</button>
      </form>
    );
  }

  const enProceso = estudios.filter((e) => e.estado !== 'Completado');

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-brand-beige p-5 sm:p-8 rounded-[2rem] border border-brand-brown/10 shadow-lg">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-brand-brown flex items-center justify-center text-brand-beige shadow-lg flex-shrink-0">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-brand-brown tracking-wide">Hola, {perfil.nombre_completo.split(' ')[0]}</h1>
            <p className="text-brand-dark/60 mt-1 text-sm font-medium">DNI: <span className="text-brand-brown font-bold">{perfil.dni}</span></p>
            {mensaje && <p className="text-brand-dark/60 mt-2 text-sm max-w-xl">{mensaje}</p>}
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setMostrarPassword((v) => !v)} className="bg-white hover:bg-brand-brown hover:text-brand-beige text-brand-brown px-5 py-3 rounded-full text-sm font-bold transition-colors border border-brand-brown/20 flex items-center gap-2">
            <KeyRound className="w-4 h-4" /> Contraseña
          </button>
          <button onClick={salir} className="bg-brand-brown hover:bg-brand-dark text-brand-beige px-6 py-3 rounded-full text-sm font-bold transition-colors">
            Cerrar sesión
          </button>
        </div>
      </div>

      {mostrarPassword && (
        <form onSubmit={guardarPassword} className="bg-white p-5 sm:p-6 rounded-2xl border border-brand-brown/10 shadow-sm flex flex-col sm:flex-row gap-3 sm:items-center">
          <input
            type="password"
            required
            minLength={10}
            autoComplete="new-password"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            placeholder="Nueva contraseña (mínimo 10 caracteres)"
            className="flex-1 bg-brand-beige/40 border border-brand-brown/20 rounded-xl px-4 py-3 text-sm text-brand-dark placeholder:text-brand-dark/40 focus:outline-none focus:border-brand-brown"
          />
          <button type="submit" className="bg-brand-brown text-brand-beige font-black px-6 py-3 rounded-xl text-sm hover:bg-brand-dark transition-colors">Guardar</button>
          {mensajePassword && <span role="status" className={`text-sm font-bold ${mensajePassword.ok ? 'text-green-700' : 'text-red-600'}`}>{mensajePassword.texto}</span>}
        </form>
      )}

      {enProceso.map((estudio) => (
        <div key={`proc-${estudio.id}`} className="bg-yellow-50 border border-yellow-200 p-4 sm:p-5 rounded-2xl flex items-center" aria-live="polite">
          <Loader2 className="w-6 h-6 text-yellow-600 animate-spin flex-shrink-0" />
          <p className="ml-4 text-sm font-medium text-yellow-900">
            Tu <strong>{estudio.tipo_estudio}</strong> (del {new Date(estudio.fecha_estudio).toLocaleDateString('es-AR')}) está siendo procesado. Estará disponible para descargar en breve.
          </p>
        </div>
      ))}

      {errorDescarga && <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm font-bold p-4 rounded-xl">{errorDescarga}</div>}

      {estudios.length === 0 ? (
        <div className="bg-white border border-brand-brown/10 rounded-[2rem] p-8 sm:p-16 text-center flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-brand-beige flex items-center justify-center mb-6">
            <FileBox className="w-10 h-10 text-brand-brown/60" />
          </div>
          <h2 className="text-2xl font-black text-brand-brown mb-2">Aún no hay estudios asociados</h2>
          <p className="text-brand-dark/60 max-w-md">Cuando {clinica} cargue tu estudio, lo vas a encontrar acá para descargarlo.{telefono && <> Ante dudas, comunicate al <strong>{telefono}</strong>.</>}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {estudios.map((estudio) => {
            const listo = estudio.estado === 'Completado';
            return (
              <div key={estudio.id} className="bg-white text-brand-dark p-5 sm:p-8 rounded-[2rem] border border-brand-brown/10 shadow-md flex flex-col justify-between hover:border-brand-brown/40 hover:shadow-xl transition-all duration-300">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="flex items-center text-sm font-bold text-brand-dark/70 bg-brand-beige/50 px-4 py-2 rounded-xl border border-brand-brown/10">
                      <Calendar className="w-4 h-4 mr-2 text-brand-brown" />
                      {new Date(estudio.fecha_estudio).toLocaleDateString('es-AR')}
                    </span>
                    {listo ? (
                      <span className="flex items-center text-xs font-black uppercase tracking-wider text-green-700 bg-green-100 px-3 py-1.5 rounded-lg border border-green-200">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Disponible
                      </span>
                    ) : (
                      <span className="flex items-center text-xs font-black uppercase tracking-wider text-yellow-800 bg-yellow-100 px-3 py-1.5 rounded-lg border border-yellow-200">
                        <AlertCircle className="w-3.5 h-3.5 mr-1.5" /> Procesando
                      </span>
                    )}
                  </div>
                  <h3 className="font-black text-xl sm:text-2xl text-brand-brown mb-2 leading-tight">{estudio.tipo_estudio}</h3>
                  {estudio.notas && <p className="text-sm text-brand-dark/60 mb-6 leading-relaxed">{estudio.notas}</p>}
                </div>

                {listo && (
                  <ul className="mt-4 space-y-2">
                    {estudio.archivos.map((archivo) => (
                      <li key={archivo.id}>
                        <button
                          onClick={() => descargar(archivo)}
                          disabled={descargando === archivo.id}
                          className="w-full bg-brand-brown border border-brand-brown text-brand-beige hover:bg-brand-dark py-3 px-4 rounded-xl font-bold flex items-center gap-3 transition-all duration-300 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-brand-brown focus:ring-offset-2 text-left"
                          aria-label={`Descargar ${archivo.nombre}`}
                        >
                          {descargando === archivo.id ? <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" /> : <Download className="w-5 h-5 flex-shrink-0" />}
                          <span className="flex-1 break-all text-sm">{archivo.nombre}</span>
                          <span className="text-xs opacity-70 whitespace-nowrap">{formatearTamano(archivo.tamano_bytes)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
