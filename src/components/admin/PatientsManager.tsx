'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Copy, KeyRound, Pencil, Send, UserPlus, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Paginacion from '@/components/Paginacion';
import Modal from '@/components/admin/Modal';
import Buscador from '@/components/admin/Buscador';
import { btnIcono, btnPrimario, btnSecundario, campo, etiqueta, formatearFecha, tarjeta, Vacio } from '@/components/admin/ui';
import type { Perfil } from '@/types';

export type PacienteFila = Perfil & { estudios: { count: number }[] };
interface Credencial { nombre: string; dni: string; password: string }

export default function PatientsManager({ pacientes, total, pagina, porPagina, q }: { pacientes: PacienteFila[]; total: number; pagina: number; porPagina: number; q: string }) {
  const router = useRouter();
  const [modal, setModal] = useState<'nuevo' | null>(null);
  const [editando, setEditando] = useState<PacienteFila | null>(null);
  const [credencial, setCredencial] = useState<Credencial | null>(null);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cerrar = () => { setModal(null); setEditando(null); setError(''); };

  const crear = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setEnviando(true);
    setError('');
    const res = await fetch('/api/admin/pacientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dni: f.get('dni'),
        nombre_completo: f.get('nombre'),
        email_contacto: f.get('email'),
        telefono: f.get('telefono'),
        password: f.get('password'),
      }),
    });
    const json = await res.json();
    setEnviando(false);
    if (!res.ok) return setError(json.error ?? 'No se pudo crear el paciente');
    cerrar();
    setCredencial({ nombre: json.paciente.nombre_completo, dni: json.paciente.dni, password: json.password });
    router.refresh();
  };

  const guardar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editando) return;
    const f = new FormData(e.currentTarget);
    setEnviando(true);
    setError('');
    const { error } = await createClient()
      .from('perfiles')
      .update({
        nombre_completo: String(f.get('nombre')).trim(),
        email_contacto: String(f.get('email')).trim() || null,
        telefono: String(f.get('telefono')).trim() || null,
      })
      .eq('id', editando.id);
    setEnviando(false);
    if (error) return setError('No se pudo guardar: ' + error.message);
    cerrar();
    router.refresh();
  };

  const nuevaClave = async (p: PacienteFila) => {
    if (!window.confirm(`¿Generar una contraseña nueva para ${p.nombre_completo}? La anterior dejará de funcionar y deberá elegir otra al ingresar.`)) return;
    const res = await fetch(`/api/admin/pacientes/${p.id}/password`, { method: 'POST' });
    const json = await res.json();
    if (!res.ok) return window.alert(json.error ?? 'No se pudo generar la contraseña');
    setCredencial({ nombre: p.nombre_completo, dni: p.dni, password: json.password });
  };

  const copiar = () => credencial && navigator.clipboard.writeText(`Portal 3D Dental\nUsuario (DNI): ${credencial.dni}\nContraseña: ${credencial.password}`);

  const acciones = (p: PacienteFila) => (
    <div className="flex items-center justify-end gap-1">
      <Link href={`/admin/portal?dni=${p.dni}`} title="Enviar un estudio" aria-label={`Enviar estudio a ${p.nombre_completo}`} className={btnIcono}><Send className="h-4 w-4" /></Link>
      <button onClick={() => { setError(''); setEditando(p); }} title="Editar datos" aria-label={`Editar ${p.nombre_completo}`} className={btnIcono}><Pencil className="h-4 w-4" /></button>
      <button onClick={() => nuevaClave(p)} title="Generar nueva contraseña" aria-label={`Nueva contraseña para ${p.nombre_completo}`} className={btnIcono}><KeyRound className="h-4 w-4" /></button>
    </div>
  );

  return (
    <>
      <div className={tarjeta}>
        <div className="flex flex-col gap-3 border-b border-brand-brown/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <Buscador valor={q} placeholder="Buscar por nombre o DNI…" />
          <button onClick={() => { setError(''); setModal('nuevo'); }} className={btnPrimario}><UserPlus className="h-4 w-4" /> Nuevo paciente</button>
        </div>

        {pacientes.length === 0 ? (
          <Vacio
            icono={<Users className="h-8 w-8" />}
            titulo={q ? 'Sin resultados' : 'Todavía no hay pacientes'}
            texto={q ? 'Probá con otro nombre o DNI.' : 'Registrá al primero para poder enviarle estudios.'}
            accion={!q && <button onClick={() => setModal('nuevo')} className={btnPrimario}><UserPlus className="h-4 w-4" /> Nuevo paciente</button>}
          />
        ) : (
          <>
            {/* Tabla en pantallas medianas y grandes */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-brand-beige/30 text-xs font-bold uppercase tracking-wider text-brand-dark/50">
                  <tr><th className="px-5 py-3">Paciente</th><th className="px-5 py-3">DNI</th><th className="px-5 py-3">Estudios</th><th className="px-5 py-3">Alta</th><th className="px-5 py-3 text-right">Acciones</th></tr>
                </thead>
                <tbody className="divide-y divide-brand-brown/10">
                  {pacientes.map((p) => (
                    <tr key={p.id} className="hover:bg-brand-beige/20">
                      <td className="px-5 py-3"><div className="font-bold text-brand-dark">{p.nombre_completo}</div><div className="text-xs text-brand-dark/50">{p.email_contacto || p.telefono || 'Sin contacto'}</div></td>
                      <td className="px-5 py-3 font-mono text-xs">{p.dni}</td>
                      <td className="px-5 py-3">{p.estudios?.[0]?.count ?? 0}</td>
                      <td className="px-5 py-3 text-brand-dark/60">{formatearFecha(p.creado_en)}</td>
                      <td className="px-5 py-3">{acciones(p)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tarjetas en celulares */}
            <ul className="divide-y divide-brand-brown/10 md:hidden">
              {pacientes.map((p) => (
                <li key={p.id} className="flex items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-bold">{p.nombre_completo}</div>
                    <div className="text-xs text-brand-dark/50">DNI {p.dni} · {p.estudios?.[0]?.count ?? 0} estudio(s)</div>
                  </div>
                  {acciones(p)}
                </li>
              ))}
            </ul>
          </>
        )}
        <Paginacion pagina={pagina} total={total} porPagina={porPagina} />
      </div>

      {modal === 'nuevo' && (
        <Modal titulo="Nuevo paciente" onClose={cerrar}>
          <form onSubmit={crear} className="space-y-3">
            <div><label className={etiqueta} htmlFor="np-nombre">Nombre completo</label><input id="np-nombre" name="nombre" required className={campo} autoFocus /></div>
            <div><label className={etiqueta} htmlFor="np-dni">DNI (será su usuario)</label><input id="np-dni" name="dni" required inputMode="numeric" className={campo} placeholder="12345678" /></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label className={etiqueta} htmlFor="np-email">Email (opcional)</label><input id="np-email" name="email" type="email" className={campo} /></div>
              <div><label className={etiqueta} htmlFor="np-tel">Teléfono (opcional)</label><input id="np-tel" name="telefono" className={campo} /></div>
            </div>
            <div><label className={etiqueta} htmlFor="np-pass">Contraseña (vacío = generar una)</label><input id="np-pass" name="password" minLength={8} autoComplete="off" className={campo} placeholder="Se genera automáticamente" /></div>
            {error && <p role="alert" className="text-sm font-bold text-red-600">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={cerrar} className={btnSecundario}>Cancelar</button>
              <button type="submit" disabled={enviando} className={btnPrimario}>{enviando ? 'Creando…' : 'Crear cuenta'}</button>
            </div>
          </form>
        </Modal>
      )}

      {editando && (
        <Modal titulo="Editar paciente" onClose={cerrar}>
          <form onSubmit={guardar} className="space-y-3">
            <p className="text-xs text-brand-dark/50">DNI {editando.dni} (no se puede cambiar porque es su usuario de acceso).</p>
            <div><label className={etiqueta} htmlFor="ep-nombre">Nombre completo</label><input id="ep-nombre" name="nombre" required defaultValue={editando.nombre_completo} className={campo} /></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label className={etiqueta} htmlFor="ep-email">Email</label><input id="ep-email" name="email" type="email" defaultValue={editando.email_contacto ?? ''} className={campo} /></div>
              <div><label className={etiqueta} htmlFor="ep-tel">Teléfono</label><input id="ep-tel" name="telefono" defaultValue={editando.telefono ?? ''} className={campo} /></div>
            </div>
            {error && <p role="alert" className="text-sm font-bold text-red-600">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={cerrar} className={btnSecundario}>Cancelar</button>
              <button type="submit" disabled={enviando} className={btnPrimario}>{enviando ? 'Guardando…' : 'Guardar cambios'}</button>
            </div>
          </form>
        </Modal>
      )}

      {credencial && (
        <Modal titulo="Datos de acceso" onClose={() => setCredencial(null)}>
          <div className="space-y-2 rounded-xl bg-brand-blue-light p-4 text-sm" role="status">
            <p className="font-bold text-brand-blue-dark">{credencial.nombre}</p>
            <p>Usuario (DNI): <strong>{credencial.dni}</strong></p>
            <p>Contraseña temporal: <strong className="font-mono">{credencial.password}</strong></p>
          </div>
          <p className="mt-3 text-xs text-brand-dark/60">Es la única vez que se muestra. En su primer ingreso el paciente deberá elegir una contraseña propia.</p>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={copiar} className={btnSecundario}><Copy className="h-4 w-4" /> Copiar datos</button>
            <button onClick={() => setCredencial(null)} className={btnPrimario}>Listo</button>
          </div>
        </Modal>
      )}
    </>
  );
}
