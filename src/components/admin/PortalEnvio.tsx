'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import * as tus from 'tus-js-client';
import { AlertTriangle, CheckCircle2, Copy, File as FileIcon, Loader2, Search, Send, UploadCloud, UserCheck, UserPlus, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { SUPABASE_URL } from '@/lib/supabase/env';
import { BUCKET_ESTUDIOS, dniValido, nombreArchivoSeguro, normalizarDni } from '@/lib/constants';
import { btnPrimario, btnSecundario, campo, etiqueta, formatearBytes, tarjeta } from '@/components/admin/ui';
import type { Perfil } from '@/types';

const MAX_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB por archivo
const SUBIDAS_SIMULTANEAS = 3;

type PacienteMin = Pick<Perfil, 'id' | 'dni' | 'nombre_completo' | 'email_contacto' | 'telefono'>;
type Supabase = ReturnType<typeof createClient>;

export interface EstudioExistente { id: string; paciente_id: string; paciente_nombre: string; tipo_estudio: string }
interface Credencial { nombre: string; dni: string; password: string }
interface Resultado { paciente: string; tipo: string; archivos: number; bytes: number; publicado: boolean }

function Paso({ n, titulo, hecho, children }: { n: number; titulo: string; hecho?: boolean; children: React.ReactNode }) {
  return (
    <section className={`${tarjeta} p-5 sm:p-6`}>
      <h2 className="mb-4 flex items-center gap-3 text-lg font-bold text-brand-brown">
        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-black ${hecho ? 'bg-green-600 text-white' : 'bg-brand-brown text-white'}`}>
          {hecho ? <CheckCircle2 className="h-5 w-5" aria-hidden /> : n}
        </span>
        {titulo}
      </h2>
      {children}
    </section>
  );
}

export default function PortalEnvio({
  tipos,
  publicarPorDefecto,
  dniInicial = '',
  estudioExistente,
}: {
  tipos: string[];
  publicarPorDefecto: boolean;
  dniInicial?: string;
  estudioExistente?: EstudioExistente;
}) {
  const router = useRouter();

  // Paso 1: paciente
  const [dni, setDni] = useState(dniInicial);
  const [paciente, setPaciente] = useState<PacienteMin | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [noEncontrado, setNoEncontrado] = useState(false);
  const [busquedaNombre, setBusquedaNombre] = useState(false);
  const [textoNombre, setTextoNombre] = useState('');
  const [sugeridos, setSugeridos] = useState<PacienteMin[]>([]);
  const [nuevo, setNuevo] = useState({ nombre: '', email: '', telefono: '' });
  const [creando, setCreando] = useState(false);
  const [errorPaciente, setErrorPaciente] = useState('');
  const [credencial, setCredencial] = useState<Credencial | null>(null);

  // Paso 2: estudio
  const [tipoEstudio, setTipoEstudio] = useState(tipos[0] ?? '');
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [notas, setNotas] = useState('');
  const [publicar, setPublicar] = useState(publicarPorDefecto);

  // Paso 3: archivos y envío
  const [archivos, setArchivos] = useState<File[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [errorEnvio, setErrorEnvio] = useState('');
  const [resultado, setResultado] = useState<Resultado | null>(null);

  const dniNormalizado = normalizarDni(dni);

  // Búsqueda automática por DNI
  useEffect(() => {
    if (estudioExistente || paciente || !dniValido(dniNormalizado)) return;
    const t = setTimeout(async () => {
      setBuscando(true);
      const { data } = await createClient()
        .from('perfiles')
        .select('id, dni, nombre_completo, email_contacto, telefono')
        .eq('rol', 'paciente')
        .eq('dni', dniNormalizado)
        .maybeSingle<PacienteMin>();
      setBuscando(false);
      if (data) { setPaciente(data); setNoEncontrado(false); } else { setNoEncontrado(true); }
    }, 350);
    return () => clearTimeout(t);
  }, [dniNormalizado, estudioExistente, paciente]);

  // Búsqueda alternativa por nombre
  useEffect(() => {
    const q = textoNombre.replace(/[^\p{L}\p{N} ]/gu, '').trim();
    if (!busquedaNombre || q.length < 2) return;
    const t = setTimeout(async () => {
      const { data } = await createClient()
        .from('perfiles')
        .select('id, dni, nombre_completo, email_contacto, telefono')
        .eq('rol', 'paciente')
        .or(`nombre_completo.ilike.%${q}%,dni.ilike.%${q}%`)
        .order('nombre_completo')
        .limit(6);
      setSugeridos(data ?? []);
    }, 250);
    return () => clearTimeout(t);
  }, [textoNombre, busquedaNombre]);

  const cambiarDni = (valor: string) => {
    setDni(valor);
    setPaciente(null);
    setNoEncontrado(false);
    setCredencial(null);
    setErrorPaciente('');
  };

  const elegirPaciente = (p: PacienteMin) => {
    setPaciente(p);
    setDni(p.dni);
    setNoEncontrado(false);
    setBusquedaNombre(false);
    setSugeridos([]);
    setTextoNombre('');
  };

  const crearPaciente = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreando(true);
    setErrorPaciente('');
    const res = await fetch('/api/admin/pacientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dni: dniNormalizado, nombre_completo: nuevo.nombre, email_contacto: nuevo.email, telefono: nuevo.telefono }),
    });
    const json = await res.json();
    setCreando(false);
    if (!res.ok) return setErrorPaciente(json.error ?? 'No se pudo crear el paciente');
    setPaciente(json.paciente);
    setNoEncontrado(false);
    setCredencial({ nombre: json.paciente.nombre_completo, dni: json.paciente.dni, password: json.password });
    setNuevo({ nombre: '', email: '', telefono: '' });
  };

  const copiarCredencial = () => {
    if (credencial) navigator.clipboard.writeText(`Portal ${'3D Dental'}\nUsuario (DNI): ${credencial.dni}\nContraseña: ${credencial.password}`);
  };

  const onDrop = useCallback((aceptados: File[], rechazados: { file: File }[]) => {
    setErrorEnvio(rechazados.length ? `${rechazados.length} archivo(s) superan los 2 GB y no se agregaron. Comprimilos o dividilos.` : '');
    setArchivos((prev) => [...prev, ...aceptados]);
  }, []);

  // Sin filtro de extensión: acepta cualquier archivo que exporte el software del tomógrafo
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true, maxSize: MAX_BYTES, disabled: enviando });

  const pacienteId = estudioExistente?.paciente_id ?? paciente?.id;
  const totalBytes = archivos.reduce((acc, f) => acc + f.size, 0);
  const puedeEnviar = !!pacienteId && archivos.length > 0 && !enviando && (estudioExistente || tipoEstudio);

  const subirResumable = (supabase: Supabase, ruta: string, archivo: File, alAvanzar: (bytes: number) => void) =>
    new Promise<void>((resolve, reject) => {
      const upload = new tus.Upload(archivo, {
        endpoint: `${SUPABASE_URL}/storage/v1/upload/resumable`,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: { 'x-upsert': 'false' },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        chunkSize: 6 * 1024 * 1024, // Supabase exige 6 MB
        metadata: { bucketName: BUCKET_ESTUDIOS, objectName: ruta, contentType: archivo.type || 'application/octet-stream', cacheControl: '3600' },
        // Token fresco en cada request: soporta subidas más largas que la vida del access token
        onBeforeRequest: async (req) => {
          const { data } = await supabase.auth.getSession();
          if (data.session) req.setHeader('authorization', `Bearer ${data.session.access_token}`);
        },
        onError: reject,
        onProgress: (enviados) => alAvanzar(enviados),
        onSuccess: () => resolve(),
      });
      upload.start();
    });

  const enviar = async () => {
    if (!pacienteId) return;
    setEnviando(true);
    setErrorEnvio('');
    setProgreso(0);

    const supabase = createClient();
    const rutasIntentadas: string[] = [];
    let estudioCreado: string | null = null;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Tu sesión expiró. Volvé a iniciar sesión.');

      // 1) Estudio nuevo en "Procesando" (el paciente no ve nada hasta que todo termine bien),
      //    o el estudio existente al que se agregan archivos
      let estudioId = estudioExistente?.id ?? '';
      if (!estudioExistente) {
        const { data: estudio, error } = await supabase
          .from('estudios')
          .insert({
            paciente_id: pacienteId,
            tipo_estudio: tipoEstudio,
            estado: 'Procesando',
            notas: notas.trim() || null,
            fecha_estudio: new Date(`${fecha}T12:00:00`).toISOString(),
            subido_por: session.user.id,
          })
          .select('id')
          .single();
        if (error || !estudio) throw error ?? new Error('No se pudo crear el estudio');
        estudioId = estudio.id;
        estudioCreado = estudio.id;
      }

      // 2) Archivos en paralelo limitado, con progreso agregado por bytes
      const enviadosPorArchivo = new Array<number>(archivos.length).fill(0);
      const actualizar = () => setProgreso(Math.round((enviadosPorArchivo.reduce((a, b) => a + b, 0) / totalBytes) * 100));
      let siguiente = 0;

      const trabajador = async () => {
        while (siguiente < archivos.length) {
          const i = siguiente++;
          const archivo = archivos[i];
          const ruta = `${pacienteId}/${estudioId}/${crypto.randomUUID()}-${nombreArchivoSeguro(archivo.name)}`;
          rutasIntentadas.push(ruta);

          await subirResumable(supabase, ruta, archivo, (bytes) => { enviadosPorArchivo[i] = bytes; actualizar(); });
          enviadosPorArchivo[i] = archivo.size;
          actualizar();

          const { error } = await supabase.from('estudio_archivos').insert({
            estudio_id: estudioId,
            path: ruta,
            nombre: archivo.name,
            tamano_bytes: archivo.size,
            content_type: archivo.type || null,
          });
          if (error) throw error;
        }
      };
      await Promise.all(Array.from({ length: Math.min(SUBIDAS_SIMULTANEAS, archivos.length) }, trabajador));

      // 3) Publicar solo cuando todos los archivos están completos
      if (publicar && !estudioExistente) {
        const { error } = await supabase.from('estudios').update({ estado: 'Completado' }).eq('id', estudioId);
        if (error) throw error;
      }

      setProgreso(100);
      setResultado({
        paciente: estudioExistente?.paciente_nombre ?? paciente?.nombre_completo ?? '',
        tipo: estudioExistente?.tipo_estudio ?? tipoEstudio,
        archivos: archivos.length,
        bytes: totalBytes,
        publicado: estudioExistente ? true : publicar,
      });
      router.refresh();
    } catch (err) {
      // Todo o nada: no dejar estudios a medias ni archivos huérfanos ocupando espacio
      if (rutasIntentadas.length > 0) {
        await supabase.storage.from(BUCKET_ESTUDIOS).remove(rutasIntentadas);
        await supabase.from('estudio_archivos').delete().in('path', rutasIntentadas);
      }
      if (estudioCreado) await supabase.from('estudios').delete().eq('id', estudioCreado);
      setErrorEnvio(err instanceof Error ? err.message : 'Error al enviar los archivos');
    } finally {
      setEnviando(false);
    }
  };

  const reiniciar = () => {
    setResultado(null);
    setArchivos([]);
    setNotas('');
    setProgreso(0);
    setCredencial(null);
    if (!estudioExistente) { setDni(''); setPaciente(null); }
  };

  // ---------- Pantalla de éxito ----------
  if (resultado) {
    return (
      <div className={`${tarjeta} mx-auto max-w-xl p-8 text-center`} role="status">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700"><CheckCircle2 className="h-9 w-9" /></div>
        <h2 className="text-2xl font-black text-brand-brown">¡Estudio enviado!</h2>
        <p className="mt-2 text-sm text-brand-dark/70">
          {resultado.archivos} archivo(s) · {formatearBytes(resultado.bytes)} · {resultado.tipo}
          <br />para <strong>{resultado.paciente}</strong>
        </p>
        <p className="mt-3 text-sm font-bold">
          {resultado.publicado ? <span className="text-green-700">Ya está disponible en su cuenta para descargar.</span> : <span className="text-yellow-700">Quedó sin publicar: el paciente todavía no lo ve.</span>}
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button onClick={reiniciar} className={btnPrimario}><Send className="h-4 w-4" /> Enviar otro estudio</button>
          <Link href="/admin/estudios" className={btnSecundario}>Ver en Estudios</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
      <div className="space-y-6">
        {/* ---------- Paso 1 ---------- */}
        <Paso n={1} titulo="¿Para quién es el estudio?" hecho={!!pacienteId}>
          {estudioExistente ? (
            <div className="rounded-xl bg-brand-beige/40 px-4 py-3 text-sm">
              Agregando archivos al estudio <strong>{estudioExistente.tipo_estudio}</strong> de <strong>{estudioExistente.paciente_nombre}</strong>.
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className={etiqueta} htmlFor="dni">DNI del paciente</label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-dark/40" aria-hidden />
                  <input
                    id="dni"
                    inputMode="numeric"
                    autoComplete="off"
                    value={dni}
                    onChange={(e) => cambiarDni(e.target.value)}
                    placeholder="Ej: 35123456"
                    className={`${campo} pl-11 text-base`}
                    disabled={enviando}
                  />
                  {buscando && <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-brand-brown" aria-label="Buscando" />}
                </div>
              </div>

              {paciente && (
                <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3" role="status">
                  <UserCheck className="h-6 w-6 shrink-0 text-green-700" aria-hidden />
                  <div className="min-w-0 text-sm">
                    <div className="truncate font-bold text-green-900">{paciente.nombre_completo}</div>
                    <div className="truncate text-green-800/80">DNI {paciente.dni}{paciente.email_contacto ? ` · ${paciente.email_contacto}` : ''}{paciente.telefono ? ` · ${paciente.telefono}` : ''}</div>
                  </div>
                  {!enviando && <button onClick={() => cambiarDni('')} className="ml-auto text-xs font-bold text-green-800 underline">Cambiar</button>}
                </div>
              )}

              {noEncontrado && !paciente && (
                <form onSubmit={crearPaciente} className="space-y-3 rounded-xl border border-brand-brown/15 bg-brand-beige/30 p-4">
                  <p className="text-sm font-bold text-brand-brown">No hay ningún paciente con el DNI {dniNormalizado}. Registralo ahora:</p>
                  <div><label className={etiqueta} htmlFor="n-nombre">Nombre completo</label><input id="n-nombre" required value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} className={campo} /></div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div><label className={etiqueta} htmlFor="n-email">Email (opcional)</label><input id="n-email" type="email" value={nuevo.email} onChange={(e) => setNuevo({ ...nuevo, email: e.target.value })} className={campo} /></div>
                    <div><label className={etiqueta} htmlFor="n-tel">Teléfono (opcional)</label><input id="n-tel" value={nuevo.telefono} onChange={(e) => setNuevo({ ...nuevo, telefono: e.target.value })} className={campo} /></div>
                  </div>
                  {errorPaciente && <p role="alert" className="text-sm font-bold text-red-600">{errorPaciente}</p>}
                  <button type="submit" disabled={creando} className={btnPrimario}><UserPlus className="h-4 w-4" /> {creando ? 'Creando…' : 'Registrar paciente'}</button>
                </form>
              )}

              {credencial && (
                <div className="rounded-xl border border-brand-brown/20 bg-brand-blue-light p-4 text-sm" role="status">
                  <p className="font-bold text-brand-blue-dark">Cuenta creada. Entregale estos datos al paciente:</p>
                  <p className="mt-2">Usuario (DNI): <strong>{credencial.dni}</strong></p>
                  <p>Contraseña temporal: <strong className="font-mono">{credencial.password}</strong></p>
                  <p className="mt-1 text-xs text-brand-dark/60">Es la única vez que se muestra. En su primer ingreso deberá elegir una contraseña propia.</p>
                  <button onClick={copiarCredencial} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand-brown underline"><Copy className="h-3 w-3" /> Copiar datos</button>
                </div>
              )}

              {!paciente && (
                <div>
                  <button type="button" onClick={() => setBusquedaNombre((v) => !v)} className="text-xs font-bold text-brand-brown underline">
                    {busquedaNombre ? 'Ocultar búsqueda por nombre' : '¿No sabés el DNI? Buscar por nombre'}
                  </button>
                  {busquedaNombre && (
                    <div className="mt-2">
                      <input value={textoNombre} onChange={(e) => setTextoNombre(e.target.value)} placeholder="Nombre o apellido…" className={campo} aria-label="Buscar paciente por nombre" />
                      {sugeridos.length > 0 && (
                        <ul className="mt-2 divide-y divide-brand-brown/10 overflow-hidden rounded-xl border border-brand-brown/15 bg-white">
                          {sugeridos.map((p) => (
                            <li key={p.id}>
                              <button type="button" onClick={() => elegirPaciente(p)} className="w-full px-4 py-2.5 text-left text-sm hover:bg-brand-beige/40">
                                <strong>{p.nombre_completo}</strong> <span className="text-brand-dark/50">— DNI {p.dni}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </Paso>

        {/* ---------- Paso 2 ---------- */}
        {!estudioExistente && (
          <Paso n={2} titulo="Datos del estudio" hecho={!!pacienteId && !!tipoEstudio}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={etiqueta} htmlFor="tipo">Tipo de estudio</label>
                <select id="tipo" value={tipoEstudio} onChange={(e) => setTipoEstudio(e.target.value)} disabled={enviando} className={campo}>
                  {tipos.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={etiqueta} htmlFor="fecha">Fecha en que se realizó</label>
                <input id="fecha" type="date" value={fecha} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setFecha(e.target.value)} disabled={enviando} className={campo} />
              </div>
              <div className="sm:col-span-2">
                <label className={etiqueta} htmlFor="notas">Nota para el paciente (opcional)</label>
                <input id="notas" value={notas} onChange={(e) => setNotas(e.target.value)} maxLength={200} disabled={enviando} className={campo} placeholder="Ej: Abrir con el visor incluido en la carpeta" />
              </div>
            </div>
          </Paso>
        )}

        {/* ---------- Paso 3 ---------- */}
        <Paso n={estudioExistente ? 2 : 3} titulo="Archivos del estudio" hecho={archivos.length > 0}>
          <div
            {...getRootProps()}
            className={`flex min-h-[9rem] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
              isDragActive ? 'border-brand-brown bg-brand-beige/50' : 'border-brand-brown/30 hover:border-brand-brown hover:bg-brand-beige/30'
            } ${enviando ? 'pointer-events-none opacity-50' : ''}`}
          >
            <input {...getInputProps()} aria-label="Seleccionar archivos del estudio" />
            <UploadCloud className="mb-2 h-9 w-9 text-brand-brown/70" aria-hidden />
            <p className="font-bold text-brand-brown">Tocá o arrastrá acá los archivos del tomógrafo</p>
            <p className="mt-1 text-xs text-brand-dark/50">Cualquier formato (.zip, DICOM, imágenes, PDF…). Hasta 2 GB cada uno. Si exportaste una carpeta con muchos cortes, comprimila en .zip.</p>
          </div>

          {archivos.length > 0 && (
            <ul className="mt-4 max-h-56 space-y-2 overflow-y-auto">
              {archivos.map((f, i) => (
                <li key={`${f.name}-${i}`} className="flex items-center gap-3 rounded-lg bg-brand-beige/30 px-3 py-2 text-sm">
                  <FileIcon className="h-4 w-4 shrink-0 text-brand-brown" aria-hidden />
                  <span className="min-w-0 flex-1 break-all">{f.name}</span>
                  <span className="whitespace-nowrap text-xs text-brand-dark/50">{formatearBytes(f.size)}</span>
                  {!enviando && (
                    <button onClick={() => setArchivos((prev) => prev.filter((_, j) => j !== i))} aria-label={`Quitar ${f.name}`} className="text-brand-dark/40 hover:text-red-600"><X className="h-4 w-4" /></button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Paso>
      </div>

      {/* ---------- Resumen y envío ---------- */}
      <aside className={`${tarjeta} p-5 sm:p-6 lg:sticky lg:top-24`}>
        <h2 className="mb-4 text-lg font-bold text-brand-brown">Resumen del envío</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-3"><dt className="text-brand-dark/50">Paciente</dt><dd className="text-right font-bold">{estudioExistente?.paciente_nombre ?? paciente?.nombre_completo ?? '—'}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-brand-dark/50">Estudio</dt><dd className="text-right font-bold">{estudioExistente?.tipo_estudio ?? (tipoEstudio || '—')}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-brand-dark/50">Archivos</dt><dd className="text-right font-bold">{archivos.length} · {formatearBytes(totalBytes)}</dd></div>
        </dl>

        {!estudioExistente && (
          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl bg-brand-beige/30 p-3 text-sm">
            <input type="checkbox" checked={publicar} onChange={(e) => setPublicar(e.target.checked)} disabled={enviando} className="mt-0.5 h-4 w-4 accent-[#6B4F3A]" />
            <span><strong>Publicar al terminar</strong><br /><span className="text-brand-dark/60">El paciente lo verá y podrá descargarlo apenas finalice la subida.</span></span>
          </label>
        )}

        {(enviando || progreso > 0) && (
          <div className="mt-4" aria-live="polite">
            <div className="mb-1 flex justify-between text-xs font-bold text-brand-dark/60"><span>Transfiriendo… no cierres esta pestaña</span><span>{progreso}%</span></div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-brand-beige">
              <div className="h-full bg-brand-brown transition-all duration-300" style={{ width: `${progreso}%` }} role="progressbar" aria-valuenow={progreso} aria-valuemin={0} aria-valuemax={100} />
            </div>
          </div>
        )}

        {errorEnvio && (
          <div role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> {errorEnvio}
          </div>
        )}

        <button onClick={enviar} disabled={!puedeEnviar} className={`${btnPrimario} mt-5 w-full py-4 text-base`}>
          {enviando ? <><Loader2 className="h-5 w-5 animate-spin" /> Enviando…</> : <><Send className="h-5 w-5" /> Enviar estudio</>}
        </button>
        {!pacienteId && <p className="mt-2 text-center text-xs text-brand-dark/50">Primero indicá el DNI del paciente.</p>}
        {pacienteId && archivos.length === 0 && <p className="mt-2 text-center text-xs text-brand-dark/50">Agregá al menos un archivo.</p>}
      </aside>
    </div>
  );
}
