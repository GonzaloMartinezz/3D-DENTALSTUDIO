'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Plus, ShieldCheck, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Config } from '@/lib/config';
import { btnPrimario, btnSecundario, campo, etiqueta, tarjeta } from '@/components/admin/ui';

export interface EventoActividad { id: number; accion: string; entidad: string; creado_en: string; usuario: { nombre_completo: string } | null }

const ACCIONES: Record<string, string> = { INSERT: 'Alta', UPDATE: 'Cambio', DELETE: 'Baja' };
const ENTIDADES: Record<string, string> = { estudios: 'estudio', estudio_archivos: 'archivo', perfiles: 'perfil', configuracion: 'configuración' };

function Seccion({ titulo, descripcion, children }: { titulo: string; descripcion?: string; children: React.ReactNode }) {
  return (
    <section className={`${tarjeta} p-5 sm:p-6`}>
      <h2 className="text-lg font-bold text-brand-brown">{titulo}</h2>
      {descripcion && <p className="mb-4 mt-0.5 text-sm text-brand-dark/60">{descripcion}</p>}
      {!descripcion && <div className="mb-4" />}
      {children}
    </section>
  );
}

export default function ConfigForm({ config, actividad }: { config: Config; actividad: EventoActividad[] }) {
  const router = useRouter();
  const [cfg, setCfg] = useState<Config>(config);
  const [tipoNuevo, setTipoNuevo] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ ok: boolean; texto: string } | null>(null);

  const [clave, setClave] = useState('');
  const [mensajeClave, setMensajeClave] = useState<{ ok: boolean; texto: string } | null>(null);

  const agregarTipo = () => {
    const t = tipoNuevo.trim();
    if (!t || cfg.tipos_estudio.some((x) => x.toLowerCase() === t.toLowerCase())) return setTipoNuevo('');
    setCfg({ ...cfg, tipos_estudio: [...cfg.tipos_estudio, t] });
    setTipoNuevo('');
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cfg.tipos_estudio.length === 0) return setMensaje({ ok: false, texto: 'Dejá al menos un tipo de estudio.' });
    setGuardando(true);
    setMensaje(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const filas = (Object.keys(cfg) as (keyof Config)[]).map((k) => ({ clave: k, valor: cfg[k], actualizado_en: new Date().toISOString(), actualizado_por: user?.id ?? null }));
    const { error } = await supabase.from('configuracion').upsert(filas, { onConflict: 'clave' });
    setGuardando(false);
    if (error) return setMensaje({ ok: false, texto: 'No se pudo guardar: ' + error.message });
    setMensaje({ ok: true, texto: 'Configuración guardada.' });
    router.refresh();
  };

  const cambiarClave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await createClient().auth.updateUser({ password: clave });
    if (error) return setMensajeClave({ ok: false, texto: error.message });
    setClave('');
    setMensajeClave({ ok: true, texto: 'Contraseña actualizada.' });
  };

  const cerrarEnTodos = async () => {
    if (!window.confirm('Se cerrará tu sesión en todos los dispositivos, incluido este. ¿Continuar?')) return;
    await createClient().auth.signOut({ scope: 'global' });
    router.replace('/login');
    router.refresh();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <form onSubmit={guardar} className="space-y-6 lg:col-span-2 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
        <Seccion titulo="Datos de la clínica" descripcion="Se muestran en el panel y en el portal de los pacientes.">
          <div className="space-y-3">
            <div><label className={etiqueta} htmlFor="c-nombre">Nombre de la clínica</label><input id="c-nombre" value={cfg.nombre_clinica} onChange={(e) => setCfg({ ...cfg, nombre_clinica: e.target.value })} required maxLength={60} className={campo} /></div>
            <div><label className={etiqueta} htmlFor="c-tel">Teléfono de contacto</label><input id="c-tel" value={cfg.telefono_contacto} onChange={(e) => setCfg({ ...cfg, telefono_contacto: e.target.value })} maxLength={40} className={campo} placeholder="Para que el paciente consulte dudas" /></div>
            <div><label className={etiqueta} htmlFor="c-msg">Mensaje de bienvenida del portal</label><textarea id="c-msg" value={cfg.mensaje_portal} onChange={(e) => setCfg({ ...cfg, mensaje_portal: e.target.value })} maxLength={240} rows={3} className={campo} /></div>
          </div>
        </Seccion>

        <Seccion titulo="Estudios" descripcion="Opciones que aparecen al enviar un estudio.">
          <div className="space-y-4">
            <div>
              <span className={etiqueta}>Tipos de estudio</span>
              <ul className="flex flex-wrap gap-2">
                {cfg.tipos_estudio.map((t) => (
                  <li key={t} className="inline-flex items-center gap-1 rounded-full bg-brand-beige/60 py-1 pl-3 pr-1 text-sm font-medium">
                    {t}
                    <button type="button" onClick={() => setCfg({ ...cfg, tipos_estudio: cfg.tipos_estudio.filter((x) => x !== t) })} aria-label={`Quitar ${t}`} className="flex h-6 w-6 items-center justify-center rounded-full text-brand-dark/50 hover:bg-white hover:text-red-600"><X className="h-3.5 w-3.5" /></button>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex gap-2">
                <input value={tipoNuevo} onChange={(e) => setTipoNuevo(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); agregarTipo(); } }} placeholder="Nuevo tipo de estudio…" maxLength={60} aria-label="Nuevo tipo de estudio" className={campo} />
                <button type="button" onClick={agregarTipo} className={btnSecundario} aria-label="Agregar tipo"><Plus className="h-4 w-4" /></button>
              </div>
            </div>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-brand-beige/30 p-3 text-sm">
              <input type="checkbox" checked={cfg.publicar_por_defecto} onChange={(e) => setCfg({ ...cfg, publicar_por_defecto: e.target.checked })} className="mt-0.5 h-4 w-4 accent-[#6B4F3A]" />
              <span><strong>Publicar automáticamente al enviar</strong><br /><span className="text-brand-dark/60">Si lo desmarcás, los estudios quedan ocultos hasta que los publiques a mano.</span></span>
            </label>
          </div>
        </Seccion>

        <div className="lg:col-span-2 flex flex-wrap items-center gap-3">
          <button type="submit" disabled={guardando} className={btnPrimario}><Check className="h-4 w-4" /> {guardando ? 'Guardando…' : 'Guardar configuración'}</button>
          {mensaje && <span role="status" className={`text-sm font-bold ${mensaje.ok ? 'text-green-700' : 'text-red-600'}`}>{mensaje.texto}</span>}
        </div>
      </form>

      <Seccion titulo="Seguridad de tu cuenta">
        <div className="mb-4 flex items-center gap-3 rounded-xl bg-green-50 p-3 text-sm text-green-900">
          <ShieldCheck className="h-5 w-5 shrink-0" aria-hidden /> Verificación en dos pasos activa en esta sesión.
        </div>
        <form onSubmit={cambiarClave} className="space-y-3">
          <div><label className={etiqueta} htmlFor="s-clave">Nueva contraseña</label><input id="s-clave" type="password" minLength={10} required autoComplete="new-password" value={clave} onChange={(e) => setClave(e.target.value)} className={campo} placeholder="Mínimo 10 caracteres" /></div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" className={btnSecundario}>Cambiar contraseña</button>
            {mensajeClave && <span role="status" className={`text-sm font-bold ${mensajeClave.ok ? 'text-green-700' : 'text-red-600'}`}>{mensajeClave.texto}</span>}
          </div>
        </form>
        <button type="button" onClick={cerrarEnTodos} className="mt-5 text-sm font-bold text-red-600 underline">Cerrar sesión en todos los dispositivos</button>
      </Seccion>

      <Seccion titulo="Actividad reciente" descripcion="Los últimos cambios hechos en el sistema.">
        {actividad.length === 0 ? (
          <p className="text-sm text-brand-dark/50">Todavía no hay actividad.</p>
        ) : (
          <ul className="divide-y divide-brand-brown/10">
            {actividad.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <span><strong>{ACCIONES[a.accion] ?? a.accion}</strong> de {ENTIDADES[a.entidad] ?? a.entidad}<span className="text-brand-dark/50"> · {a.usuario?.nombre_completo ?? 'Sistema'}</span></span>
                <time className="whitespace-nowrap text-xs text-brand-dark/50" dateTime={a.creado_en}>{new Date(a.creado_en).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}</time>
              </li>
            ))}
          </ul>
        )}
        <Link href="/admin/actividad" className="mt-3 inline-block text-sm font-bold text-brand-brown underline">Ver historial completo</Link>
      </Seccion>
    </div>
  );
}
