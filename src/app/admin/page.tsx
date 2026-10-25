import Link from 'next/link';
import { Download, FileBox, HardDrive, Send, UserPlus, Users } from 'lucide-react';
import { requerirAdmin } from '@/lib/auth';
import { nombreMes, RESUMEN_VACIO, type ResumenPanel } from '@/lib/resumen';
import { btnPrimario, btnSecundario, formatearBytes, formatearFecha, Insignia, PageHeader, Stat, tarjeta } from '@/components/admin/ui';

interface FilaReciente { id: string; tipo_estudio: string; estado: string; fecha_estudio: string; paciente: { nombre_completo: string; dni: string } | null }

export default async function AdminResumen() {
  const { supabase, perfil } = await requerirAdmin();

  const [resumenRes, recientes] = await Promise.all([
    supabase.rpc('admin_resumen'),
    supabase
      .from('estudios')
      .select('id, tipo_estudio, estado, fecha_estudio, paciente:perfiles(nombre_completo, dni)')
      .order('creado_en', { ascending: false })
      .limit(6)
      .returns<FilaReciente[]>(),
  ]);

  const r: ResumenPanel = { ...RESUMEN_VACIO, ...(resumenRes.data ?? {}) };
  const maximo = Math.max(1, ...r.pacientes_por_mes.map((m) => m.total));

  return (
    <>
      <PageHeader
        titulo={`Hola, ${perfil.nombre_completo.split(' ')[0]}`}
        descripcion="Este es el estado de la clínica hoy."
        acciones={
          <>
            <Link href="/admin/pacientes" className={btnSecundario}><UserPlus className="h-4 w-4" /> Pacientes</Link>
            <Link href="/admin/portal" className={btnPrimario}><Send className="h-4 w-4" /> Enviar estudio</Link>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Stat etiqueta="Pacientes" valor={r.pacientes} detalle={`+${r.pacientes_mes} este mes`} icono={<Users className="h-5 w-5" />} />
        <Stat etiqueta="Estudios" valor={r.estudios} detalle={`+${r.estudios_mes} este mes`} icono={<FileBox className="h-5 w-5" />} />
        <Stat etiqueta="Descargas del mes" valor={r.descargas_mes} detalle="Hechas por pacientes" icono={<Download className="h-5 w-5" />} />
        <Stat etiqueta="Almacenamiento" valor={formatearBytes(r.almacenamiento_bytes)} detalle="Archivos guardados" icono={<HardDrive className="h-5 w-5" />} />
      </div>

      {r.estudios_sin_publicar > 0 && (
        <Link href="/admin/estudios?estado=sin_publicar" className="flex items-center justify-between gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900 hover:bg-yellow-100">
          <span><strong>{r.estudios_sin_publicar} estudio(s) sin publicar.</strong> Los pacientes todavía no los ven.</span>
          <span className="whitespace-nowrap font-bold underline">Revisar</span>
        </Link>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        <section className={`${tarjeta} p-5 sm:p-6 lg:col-span-2`}>
          <h2 className="text-lg font-bold text-brand-brown">Pacientes nuevos por mes</h2>
          <p className="text-sm text-brand-dark/60">{r.pacientes_con_estudios} de {r.pacientes} ya recibieron al menos un estudio.</p>
          <div className="mt-6 flex h-40 items-end gap-2 sm:gap-3" role="img" aria-label="Gráfico de pacientes nuevos en los últimos 6 meses">
            {r.pacientes_por_mes.map((m) => (
              <div key={m.mes} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                <span className="text-xs font-bold text-brand-brown">{m.total}</span>
                <div className="w-full rounded-t-lg bg-brand-brown/80" style={{ height: `${Math.max(4, (m.total / maximo) * 70)}%` }} />
                <span className="text-xs uppercase text-brand-dark/50">{nombreMes(m.mes)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={`${tarjeta} lg:col-span-3`}>
          <div className="flex items-center justify-between p-5 pb-2 sm:p-6 sm:pb-2">
            <h2 className="text-lg font-bold text-brand-brown">Últimos estudios enviados</h2>
            <Link href="/admin/estudios" className="text-sm font-bold text-brand-brown underline">Ver todos</Link>
          </div>
          {(recientes.data ?? []).length === 0 ? (
            <p className="p-6 text-sm text-brand-dark/50">Todavía no enviaste ningún estudio.</p>
          ) : (
            <ul className="divide-y divide-brand-brown/10">
              {recientes.data!.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 px-5 py-3 sm:px-6">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold">{e.paciente?.nombre_completo ?? '—'}</div>
                    <div className="truncate text-xs text-brand-dark/50">{e.tipo_estudio} · {formatearFecha(e.fecha_estudio)}</div>
                  </div>
                  {e.estado === 'Completado' ? <Insignia tono="ok">Publicado</Insignia> : <Insignia tono="pendiente">Sin publicar</Insignia>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
