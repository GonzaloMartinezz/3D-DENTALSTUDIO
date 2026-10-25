'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Download, Eye, EyeOff, FilePlus, FileBox, Pencil, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { BUCKET_ESTUDIOS } from '@/lib/constants';
import Paginacion, { useParamsUrl } from '@/components/Paginacion';
import Modal from '@/components/admin/Modal';
import Buscador from '@/components/admin/Buscador';
import { btnIcono, btnPrimario, btnSecundario, campo, etiqueta, formatearBytes, formatearFecha, Insignia, tarjeta, Vacio } from '@/components/admin/ui';
import type { EstudioArchivo, EstudioConPaciente } from '@/types';

export default function StudiesManager({
  estudios, total, pagina, porPagina, q, estado, tipos,
}: { estudios: EstudioConPaciente[]; total: number; pagina: number; porPagina: number; q: string; estado: string; tipos: string[] }) {
  const router = useRouter();
  const setParams = useParamsUrl();
  const [error, setError] = useState('');
  const [editando, setEditando] = useState<EstudioConPaciente | null>(null);
  const [tipo, setTipo] = useState('');
  const [fecha, setFecha] = useState('');
  const [notas, setNotas] = useState('');

  const abrirEdicion = (e: EstudioConPaciente) => {
    setError('');
    setEditando(e);
    setTipo(e.tipo_estudio);
    setFecha(e.fecha_estudio.slice(0, 10));
    setNotas(e.notas ?? '');
  };

  const guardar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!editando) return;
    const { error } = await createClient()
      .from('estudios')
      .update({ tipo_estudio: tipo, fecha_estudio: new Date(`${fecha}T12:00:00`).toISOString(), notas: notas.trim() || null })
      .eq('id', editando.id);
    if (error) return setError('No se pudo guardar: ' + error.message);
    setEditando(null);
    router.refresh();
  };

  const quitarArchivo = async (archivo: EstudioArchivo) => {
    if (!window.confirm(`¿Quitar "${archivo.nombre}" de este estudio?`)) return;
    const supabase = createClient();
    const { error: e1 } = await supabase.storage.from(BUCKET_ESTUDIOS).remove([archivo.path]);
    if (e1) return setError('No se pudo borrar el archivo: ' + e1.message);
    const { error: e2 } = await supabase.from('estudio_archivos').delete().eq('id', archivo.id);
    if (e2) return setError('No se pudo quitar el registro: ' + e2.message);
    setEditando(null);
    router.refresh();
  };

  const alternarPublicacion = async (e: EstudioConPaciente) => {
    setError('');
    const nuevo = e.estado === 'Completado' ? 'Procesando' : 'Completado';
    const { error } = await createClient().from('estudios').update({ estado: nuevo }).eq('id', e.id);
    if (error) setError('No se pudo cambiar el estado: ' + error.message);
    router.refresh();
  };

  const descargar = async (a: EstudioArchivo) => {
    setError('');
    const { data, error } = await createClient().storage.from(BUCKET_ESTUDIOS).createSignedUrl(a.path, 60, { download: a.nombre });
    if (error || !data) return setError('No se pudo generar la descarga.');
    window.location.assign(data.signedUrl);
  };

  const eliminar = async (e: EstudioConPaciente) => {
    if (!window.confirm(`¿Eliminar definitivamente "${e.tipo_estudio}" de ${e.paciente?.nombre_completo}? Se borran también sus archivos y no se puede deshacer.`)) return;
    setError('');
    const supabase = createClient();
    if (e.archivos.length) {
      const { error: errStorage } = await supabase.storage.from(BUCKET_ESTUDIOS).remove(e.archivos.map((a) => a.path));
      if (errStorage) return setError('No se pudieron borrar los archivos: ' + errStorage.message);
    }
    const { error: errDb } = await supabase.from('estudios').delete().eq('id', e.id);
    if (errDb) setError('No se pudo borrar el registro: ' + errDb.message);
    router.refresh();
  };

  const acciones = (e: EstudioConPaciente) => (
    <div className="flex items-center justify-end gap-1">
      <button onClick={() => alternarPublicacion(e)} title={e.estado === 'Completado' ? 'Ocultar al paciente' : 'Publicar al paciente'} aria-label={e.estado === 'Completado' ? 'Ocultar al paciente' : 'Publicar al paciente'} className={btnIcono}>
        {e.estado === 'Completado' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
      <Link href={`/admin/portal?estudio=${e.id}`} title="Agregar archivos" aria-label="Agregar archivos" className={btnIcono}><FilePlus className="h-4 w-4" /></Link>
      <button onClick={() => abrirEdicion(e)} title="Editar" aria-label="Editar estudio" className={btnIcono}><Pencil className="h-4 w-4" /></button>
      <button onClick={() => eliminar(e)} title="Eliminar" aria-label="Eliminar estudio" className={`${btnIcono} hover:!text-red-600`}><Trash2 className="h-4 w-4" /></button>
    </div>
  );

  const insignia = (e: EstudioConPaciente) => e.estado === 'Completado' ? <Insignia tono="ok">Publicado</Insignia> : <Insignia tono="pendiente">Sin publicar</Insignia>;

  return (
    <>
      <div className={tarjeta}>
        <div className="flex flex-col gap-3 border-b border-brand-brown/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <Buscador valor={q} placeholder="Buscar paciente, DNI o tipo…" />
          <select
            value={estado}
            onChange={(e) => setParams({ estado: e.target.value === 'todos' ? null : e.target.value, p: null })}
            aria-label="Filtrar por estado"
            className={`${campo} sm:w-52`}
          >
            <option value="todos">Todos los estados</option>
            <option value="publicados">Publicados</option>
            <option value="sin_publicar">Sin publicar</option>
          </select>
        </div>

        {error && <div role="alert" className="m-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{error}</div>}

        {estudios.length === 0 ? (
          <Vacio
            icono={<FileBox className="h-8 w-8" />}
            titulo="No hay estudios para mostrar"
            texto={q || estado !== 'todos' ? 'Probá quitando los filtros.' : 'Cuando envíes el primero lo vas a ver acá.'}
            accion={<Link href="/admin/portal" className={btnPrimario}>Enviar un estudio</Link>}
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-brand-beige/30 text-xs font-bold uppercase tracking-wider text-brand-dark/50">
                  <tr><th className="px-5 py-3">Paciente</th><th className="px-5 py-3">Estudio</th><th className="px-5 py-3">Fecha</th><th className="px-5 py-3">Estado</th><th className="px-5 py-3 text-right">Acciones</th></tr>
                </thead>
                <tbody className="divide-y divide-brand-brown/10">
                  {estudios.map((e) => (
                    <tr key={e.id} className="hover:bg-brand-beige/20">
                      <td className="px-5 py-3"><div className="font-bold">{e.paciente?.nombre_completo ?? '—'}</div><div className="text-xs text-brand-dark/50">DNI {e.paciente?.dni ?? '—'}</div></td>
                      <td className="px-5 py-3">{e.tipo_estudio}<div className="text-xs text-brand-dark/50">{e.archivos.length} archivo(s) · {formatearBytes(e.archivos.reduce((acc, a) => acc + (a.tamano_bytes ?? 0), 0))}</div></td>
                      <td className="whitespace-nowrap px-5 py-3 text-brand-dark/70">{formatearFecha(e.fecha_estudio)}</td>
                      <td className="px-5 py-3">{insignia(e)}</td>
                      <td className="px-5 py-3">{acciones(e)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-brand-brown/10 md:hidden">
              {estudios.map((e) => (
                <li key={e.id} className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0"><div className="truncate font-bold">{e.paciente?.nombre_completo ?? '—'}</div><div className="text-xs text-brand-dark/50">DNI {e.paciente?.dni ?? '—'}</div></div>
                    {insignia(e)}
                  </div>
                  <div className="text-sm">{e.tipo_estudio} <span className="text-brand-dark/50">· {formatearFecha(e.fecha_estudio)} · {e.archivos.length} archivo(s)</span></div>
                  {acciones(e)}
                </li>
              ))}
            </ul>
          </>
        )}
        <Paginacion pagina={pagina} total={total} porPagina={porPagina} />
      </div>

      {editando && (
        <Modal titulo="Editar estudio" onClose={() => setEditando(null)}>
          <form onSubmit={guardar} className="space-y-3">
            <p className="text-sm text-brand-dark/60">Paciente: <strong>{editando.paciente?.nombre_completo}</strong></p>
            <div>
              <label className={etiqueta} htmlFor="e-tipo">Tipo de estudio</label>
              <select id="e-tipo" value={tipo} onChange={(ev) => setTipo(ev.target.value)} className={campo}>
                {[...new Set([tipo, ...tipos])].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div><label className={etiqueta} htmlFor="e-fecha">Fecha del estudio</label><input id="e-fecha" type="date" value={fecha} onChange={(ev) => setFecha(ev.target.value)} className={campo} /></div>
            <div><label className={etiqueta} htmlFor="e-notas">Nota para el paciente</label><input id="e-notas" value={notas} maxLength={200} onChange={(ev) => setNotas(ev.target.value)} className={campo} /></div>

            <div>
              <span className={etiqueta}>Archivos</span>
              <ul className="space-y-1.5">
                {editando.archivos.map((a) => (
                  <li key={a.id} className="flex items-center gap-2 rounded-lg bg-brand-beige/30 px-3 py-2 text-sm">
                    <span className="min-w-0 flex-1 break-all">{a.nombre}</span>
                    <button type="button" onClick={() => descargar(a)} aria-label={`Descargar ${a.nombre}`} className={btnIcono}><Download className="h-4 w-4" /></button>
                    <button type="button" onClick={() => quitarArchivo(a)} aria-label={`Quitar ${a.nombre}`} className={`${btnIcono} hover:!text-red-600`}><Trash2 className="h-4 w-4" /></button>
                  </li>
                ))}
              </ul>
            </div>
            {error && <p role="alert" className="text-sm font-bold text-red-600">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditando(null)} className={btnSecundario}>Cancelar</button>
              <button type="submit" className={btnPrimario}>Guardar cambios</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
