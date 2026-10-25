-- =====================================================================
-- 3D Dental Studio - Sistema de estudios por imagen
-- Perfiles (paciente / admin), estudios, auditoría de descargas,
-- bucket privado y políticas RLS.
--
-- Ejecutar una sola vez en el SQL Editor de Supabase (o con supabase db push).
-- Reemplaza a las tablas anteriores `perfiles_pacientes` y `estudios`
-- (que usaba `paciente_dni`). Si ya tenías datos, migrarlos antes.
-- =====================================================================

-- ---------- Perfiles ----------
create table if not exists public.perfiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  dni             text not null unique,
  nombre_completo text not null,
  email_contacto  text,
  telefono        text,
  rol             text not null default 'paciente' check (rol in ('paciente', 'admin')),
  creado_en       timestamptz not null default now()
);

-- ¿El usuario actual es administrador? (security definer evita recursión de RLS)
create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.perfiles p
    where p.id = (select auth.uid()) and p.rol = 'admin'
  );
$$;

revoke all on function public.es_admin() from public, anon;
grant execute on function public.es_admin() to authenticated;

alter table public.perfiles enable row level security;

drop policy if exists "perfiles_select" on public.perfiles;
create policy "perfiles_select" on public.perfiles
  for select to authenticated
  using (id = (select auth.uid()) or public.es_admin());

drop policy if exists "perfiles_admin_all" on public.perfiles;
create policy "perfiles_admin_all" on public.perfiles
  for all to authenticated
  using (public.es_admin())
  with check (public.es_admin());
-- Los pacientes NO pueden modificar su perfil (evita escalar el rol a 'admin').
-- Las altas de pacientes las hace el servidor con la service role key.

-- ---------- Estudios ----------
create table if not exists public.estudios (
  id             uuid primary key default gen_random_uuid(),
  paciente_id    uuid not null references public.perfiles (id) on delete cascade,
  tipo_estudio   text not null,
  estado         text not null default 'Procesando' check (estado in ('Procesando', 'Completado')),
  archivo_path   text not null unique,
  nombre_archivo text not null,
  tamano_bytes   bigint,
  notas          text,
  fecha_estudio  timestamptz not null default now(),
  subido_por     uuid references auth.users (id) on delete set null,
  creado_en      timestamptz not null default now()
);

create index if not exists estudios_paciente_idx on public.estudios (paciente_id, fecha_estudio desc);

alter table public.estudios enable row level security;

drop policy if exists "estudios_select" on public.estudios;
create policy "estudios_select" on public.estudios
  for select to authenticated
  using (paciente_id = (select auth.uid()) or public.es_admin());

drop policy if exists "estudios_admin_write" on public.estudios;
create policy "estudios_admin_write" on public.estudios
  for all to authenticated
  using (public.es_admin())
  with check (public.es_admin());

-- ---------- Auditoría de descargas ----------
create table if not exists public.descargas (
  id          uuid primary key default gen_random_uuid(),
  estudio_id  uuid not null references public.estudios (id) on delete cascade,
  usuario_id  uuid not null references auth.users (id) on delete cascade,
  descargado_en timestamptz not null default now()
);

alter table public.descargas enable row level security;

drop policy if exists "descargas_insert_propia" on public.descargas;
create policy "descargas_insert_propia" on public.descargas
  for insert to authenticated
  with check (usuario_id = (select auth.uid()));

drop policy if exists "descargas_select" on public.descargas;
create policy "descargas_select" on public.descargas
  for select to authenticated
  using (usuario_id = (select auth.uid()) or public.es_admin());

-- ---------- Storage (bucket privado) ----------
insert into storage.buckets (id, name, public, file_size_limit)
values ('estudios-dentales', 'estudios-dentales', false, 2147483648) -- 2 GB
on conflict (id) do update set public = false, file_size_limit = 2147483648;

-- Admin: acceso total al bucket
drop policy if exists "estudios_storage_admin" on storage.objects;
create policy "estudios_storage_admin" on storage.objects
  for all to authenticated
  using (bucket_id = 'estudios-dentales' and public.es_admin())
  with check (bucket_id = 'estudios-dentales' and public.es_admin());

-- Paciente: solo puede leer archivos de SUS estudios ya publicados (Completado)
drop policy if exists "estudios_storage_paciente_lectura" on storage.objects;
create policy "estudios_storage_paciente_lectura" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'estudios-dentales'
    and exists (
      select 1 from public.estudios e
      where e.archivo_path = storage.objects.name
        and e.paciente_id = (select auth.uid())
        and e.estado = 'Completado'
    )
  );

-- =====================================================================
-- PRIMER ADMINISTRADOR
-- 1) Supabase > Authentication > Users > Add user (email + contraseña,
--    marcar "Auto Confirm User").
-- 2) Ejecutar (cambiando el UUID, DNI y nombre):
--
--   insert into public.perfiles (id, dni, nombre_completo, rol)
--   values ('<UUID-DEL-USUARIO>', 'admin', 'Administrador', 'admin');
-- =====================================================================
