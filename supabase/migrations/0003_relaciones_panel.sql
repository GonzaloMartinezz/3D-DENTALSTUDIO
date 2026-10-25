-- Permite que el panel muestre el nombre de quien descargó (PostgREST necesita una FK directa a perfiles).
alter table public.descargas
  add constraint descargas_usuario_perfil_fk
  foreign key (usuario_id) references public.perfiles (id) on delete cascade;

create index if not exists descargas_fecha_idx on public.descargas (descargado_en desc);

-- Idem para mostrar el nombre en el historial de actividad (no valida filas historicas).
alter table public.auditoria
  add constraint auditoria_usuario_perfil_fk
  foreign key (usuario_id) references public.perfiles (id) on delete set null not valid;
