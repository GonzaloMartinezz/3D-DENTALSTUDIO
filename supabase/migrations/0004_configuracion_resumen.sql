-- =====================================================================
-- 0004 - Configuración del panel + resumen de métricas para el administrador
-- =====================================================================

-- ---------- Configuración (clave / valor) ----------
create table if not exists public.configuracion (
  clave           text primary key,
  valor           jsonb not null,
  actualizado_en  timestamptz not null default now(),
  actualizado_por uuid references auth.users (id) on delete set null
);

alter table public.configuracion enable row level security;

-- Cualquier usuario con sesión la lee (el portal del paciente muestra el nombre y el mensaje de la clínica)
drop policy if exists "configuracion_select" on public.configuracion;
create policy "configuracion_select" on public.configuracion
  for select to authenticated
  using (true);

drop policy if exists "configuracion_admin_write" on public.configuracion;
create policy "configuracion_admin_write" on public.configuracion
  for all to authenticated
  using (public.es_admin())
  with check (public.es_admin());

insert into public.configuracion (clave, valor) values
  ('nombre_clinica',       to_jsonb('3D Dental Studio'::text)),
  ('telefono_contacto',    to_jsonb(''::text)),
  ('mensaje_portal',       to_jsonb('Acá vas a encontrar tus estudios para descargarlos cuando quieras.'::text)),
  ('tipos_estudio',        '["Tomografía 3D (CBCT)","Radiografía Panorámica","Radiografía Periapical","Telerradiografía","Escaneo Intraoral","Informe / Diagnóstico"]'::jsonb),
  ('publicar_por_defecto', 'true'::jsonb)
on conflict (clave) do nothing;

-- La auditoría identifica la fila por "id" o, en configuración, por "clave"
create or replace function public.registrar_auditoria()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  fila jsonb := to_jsonb(case when tg_op = 'DELETE' then old else new end);
begin
  insert into public.auditoria (usuario_id, accion, entidad, entidad_id, detalle)
  values ((select auth.uid()), tg_op, tg_table_name, coalesce(fila ->> 'id', fila ->> 'clave'),
          case when tg_op = 'UPDATE' then jsonb_build_object('antes', to_jsonb(old), 'despues', to_jsonb(new)) else fila end);
  return null;
end;
$$;

drop trigger if exists auditar_configuracion on public.configuracion;
create trigger auditar_configuracion after insert or update or delete on public.configuracion
  for each row execute function public.registrar_auditoria();

-- ---------- Resumen para el panel (una sola consulta) ----------
-- SECURITY INVOKER: respeta RLS, así que un paciente que la llamara solo vería sus propios números.
create or replace function public.admin_resumen()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'pacientes',              (select count(*) from public.perfiles where rol = 'paciente'),
    'pacientes_mes',          (select count(*) from public.perfiles where rol = 'paciente' and creado_en >= date_trunc('month', now())),
    'pacientes_con_estudios', (select count(distinct paciente_id) from public.estudios),
    'estudios',               (select count(*) from public.estudios),
    'estudios_mes',           (select count(*) from public.estudios where creado_en >= date_trunc('month', now())),
    'estudios_sin_publicar',  (select count(*) from public.estudios where estado <> 'Completado'),
    'descargas_mes',          (select count(*) from public.descargas where descargado_en >= date_trunc('month', now())),
    'almacenamiento_bytes',   (select coalesce(sum(tamano_bytes), 0) from public.estudio_archivos),
    'pacientes_por_mes',      (
      select coalesce(jsonb_agg(jsonb_build_object('mes', to_char(t.m, 'YYYY-MM'), 'total', t.c) order by t.m), '[]'::jsonb)
      from (
        select gs as m,
               (select count(*) from public.perfiles p
                 where p.rol = 'paciente' and date_trunc('month', p.creado_en) = gs) as c
        from generate_series(date_trunc('month', now()) - interval '5 months', date_trunc('month', now()), interval '1 month') gs
      ) t
    )
  );
$$;

revoke all on function public.admin_resumen() from public, anon;
grant execute on function public.admin_resumen() to authenticated;
