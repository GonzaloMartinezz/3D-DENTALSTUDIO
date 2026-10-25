-- =====================================================================
-- 0002 - Varios archivos por estudio, 2FA obligatorio para admin,
--        auditoría inmutable, cambio de clave inicial e índices de búsqueda.
-- Ejecutar DESPUÉS de 0001.
-- =====================================================================

create extension if not exists pg_trgm with schema extensions;

-- ---------- Admin: exige verificación en dos pasos (aal2) ----------
-- Aunque roben la contraseña del admin, sin el segundo factor la base no responde.
create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select auth.jwt() ->> 'aal'), '') = 'aal2'
     and exists (
       select 1 from public.perfiles p
       where p.id = (select auth.uid()) and p.rol = 'admin'
     );
$$;

-- ---------- Perfiles: cambio de clave obligatorio ----------
alter table public.perfiles
  add column if not exists debe_cambiar_password boolean not null default false;

create index if not exists perfiles_nombre_trgm on public.perfiles using gin (nombre_completo extensions.gin_trgm_ops);
create index if not exists perfiles_dni_trgm    on public.perfiles using gin (dni extensions.gin_trgm_ops);

-- ---------- Archivos de cada estudio (1 estudio -> N archivos) ----------
create table if not exists public.estudio_archivos (
  id           uuid primary key default gen_random_uuid(),
  estudio_id   uuid not null references public.estudios (id) on delete cascade,
  path         text not null unique,
  nombre       text not null,
  tamano_bytes bigint,
  content_type text,
  creado_en    timestamptz not null default now()
);
create index if not exists estudio_archivos_estudio_idx on public.estudio_archivos (estudio_id);

-- La política vieja de storage depende de estudios.archivo_path: se quita antes de borrar la columna
drop policy if exists "estudios_storage_paciente_lectura" on storage.objects;

-- Migrar lo que existiera con el modelo anterior (1 archivo por estudio)
do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'estudios' and column_name = 'archivo_path') then
    insert into public.estudio_archivos (estudio_id, path, nombre, tamano_bytes)
    select id, archivo_path, nombre_archivo, tamano_bytes from public.estudios
    on conflict (path) do nothing;

    alter table public.estudios drop column archivo_path;
    alter table public.estudios drop column nombre_archivo;
    alter table public.estudios drop column tamano_bytes;
  end if;
end $$;

create index if not exists estudios_fecha_idx on public.estudios (fecha_estudio desc);
create index if not exists estudios_tipo_trgm on public.estudios using gin (tipo_estudio extensions.gin_trgm_ops);

alter table public.estudio_archivos enable row level security;

drop policy if exists "archivos_select" on public.estudio_archivos;
create policy "archivos_select" on public.estudio_archivos
  for select to authenticated
  using (
    public.es_admin()
    or exists (
      select 1 from public.estudios e
      where e.id = estudio_archivos.estudio_id and e.paciente_id = (select auth.uid())
    )
  );

drop policy if exists "archivos_admin_write" on public.estudio_archivos;
create policy "archivos_admin_write" on public.estudio_archivos
  for all to authenticated
  using (public.es_admin())
  with check (public.es_admin());

-- Storage: el paciente solo lee archivos de SUS estudios ya publicados
drop policy if exists "estudios_storage_paciente_lectura" on storage.objects;
create policy "estudios_storage_paciente_lectura" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'estudios-dentales'
    and exists (
      select 1
      from public.estudio_archivos a
      join public.estudios e on e.id = a.estudio_id
      where a.path = storage.objects.name
        and e.paciente_id = (select auth.uid())
        and e.estado = 'Completado'
    )
  );

-- Descargas: ahora por archivo
alter table public.descargas add column if not exists archivo_id uuid references public.estudio_archivos (id) on delete set null;

-- ---------- Auditoría (solo lectura para admin, escrita por triggers) ----------
create table if not exists public.auditoria (
  id         bigint generated always as identity primary key,
  usuario_id uuid,
  accion     text not null,
  entidad    text not null,
  entidad_id text,
  detalle    jsonb,
  creado_en  timestamptz not null default now()
);
create index if not exists auditoria_fecha_idx on public.auditoria (creado_en desc);

alter table public.auditoria enable row level security;

drop policy if exists "auditoria_select_admin" on public.auditoria;
create policy "auditoria_select_admin" on public.auditoria
  for select to authenticated
  using (public.es_admin());
-- Sin políticas de insert/update/delete: nadie puede alterar el historial desde la API.

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
  values ((select auth.uid()), tg_op, tg_table_name, fila ->> 'id',
          case when tg_op = 'UPDATE' then jsonb_build_object('antes', to_jsonb(old), 'despues', to_jsonb(new)) else fila end);
  return null;
end;
$$;

revoke all on function public.registrar_auditoria() from public, anon, authenticated;

drop trigger if exists auditar_estudios on public.estudios;
create trigger auditar_estudios after insert or update or delete on public.estudios
  for each row execute function public.registrar_auditoria();

drop trigger if exists auditar_archivos on public.estudio_archivos;
create trigger auditar_archivos after insert or delete on public.estudio_archivos
  for each row execute function public.registrar_auditoria();

drop trigger if exists auditar_perfiles on public.perfiles;
create trigger auditar_perfiles after insert or update or delete on public.perfiles
  for each row execute function public.registrar_auditoria();

-- =====================================================================
-- Recuperar un admin que perdió su celular (2FA):
--   delete from auth.mfa_factors where user_id = '<UUID-DEL-ADMIN>';
-- y volver a enrolar en /mfa.
-- =====================================================================
