-- =====================================================================
-- Estribor Consultores · RLS, políticas mínimas, índices y bucket privado
-- Fecha: 2026-10-01
--
-- NO EJECUTADO. Revisar antes de aplicar con:
--   supabase db push            (CLI)  o  pegarlo en el SQL Editor del panel.
--
-- Modelo de acceso resultante:
--   * anon / authenticated  -> solo pueden LEER vacantes activas (jobs.active = true).
--   * service_role          -> todo lo demás (rutas /api del servidor). Ignora RLS.
--   * applications, bookings, job_areas -> sin políticas: invisibles para el cliente.
--
-- Requiere desplegar a la vez el código que usa SUPABASE_SERVICE_ROLE_KEY en /api;
-- con el código anterior, el formulario de postulación dejaría de funcionar.
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 0. Verificaciones previas (ejecutar solas, antes de la migración)
-- ---------------------------------------------------------------------
-- Reservas duplicadas que impedirían crear el índice único:
--   select date, time, count(*) from public.bookings group by 1, 2 having count(*) > 1;
-- Postulaciones duplicadas por vacante y RUT (sección 6, opcional):
--   select job_id, rut, count(*) from public.applications group by 1, 2 having count(*) > 1;
-- Políticas actuales, para comparar:
--   select schemaname, tablename, policyname, cmd, roles, qual, with_check
--   from pg_policies where schemaname in ('public', 'storage') order by 1, 2;

-- ---------------------------------------------------------------------
-- 1. Activar RLS en todas las tablas del esquema public
-- ---------------------------------------------------------------------
do $$
declare
  t record;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t.tablename);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- 2. Borrar las políticas existentes de las tablas de la app
--    (sus nombres no están versionados; se recrean abajo las mínimas)
-- ---------------------------------------------------------------------
do $$
declare
  p record;
begin
  for p in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename in ('jobs', 'job_areas', 'applications', 'bookings')
  loop
    execute format('drop policy %I on public.%I', p.policyname, p.tablename);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- 3. Políticas mínimas
-- ---------------------------------------------------------------------
-- Lectura pública solo de vacantes publicadas.
create policy "jobs_public_read_active"
  on public.jobs
  for select
  to anon, authenticated
  using (active = true);

-- applications, bookings y job_areas: sin políticas a propósito.
-- Con RLS activo y sin políticas, anon y authenticated no leen ni escriben nada;
-- solo el service role (rutas /api) accede.

-- Defensa en profundidad: quitar también los privilegios de escritura a los roles de cliente.
revoke insert, update, delete on public.jobs, public.job_areas, public.applications, public.bookings
  from anon, authenticated;
revoke select on public.applications, public.bookings, public.job_areas
  from anon, authenticated;

-- ---------------------------------------------------------------------
-- 4. Agenda: evitar doble reserva e indexar las consultas por fecha y hora
-- ---------------------------------------------------------------------
-- El índice único (date, time) cumple dos funciones:
--   * impide reservar dos veces el mismo horario (la API responde 409 con el código 23505);
--   * sirve a la consulta de disponibilidad `where date in (...)`, porque date es su primera columna.
create unique index if not exists bookings_date_time_unique
  on public.bookings (date, time);

-- ---------------------------------------------------------------------
-- 5. Storage: bucket de CVs privado, solo PDF de hasta 5 MB
-- ---------------------------------------------------------------------
update storage.buckets
set public = false,
    file_size_limit = 5242880,
    allowed_mime_types = array['application/pdf']
where id = 'cvs';

-- Borrar políticas de storage.objects que den acceso al bucket cvs.
-- El panel abre los CVs con URLs firmadas que genera el servidor; no se necesitan políticas.
do $$
declare
  p record;
begin
  for p in
    select policyname
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and (coalesce(qual, '') ilike '%cvs%' or coalesce(with_check, '') ilike '%cvs%')
  loop
    execute format('drop policy %I on storage.objects', p.policyname);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- 6. Opcional: restricciones únicas adicionales
--    Descomentar solo si la verificación de la sección 0 no devuelve filas.
-- ---------------------------------------------------------------------
-- Una postulación por RUT y vacante (la API ya lo valida; esto lo garantiza en la base).
-- Nota: las postulaciones nuevas guardan el RUT normalizado (12345678-9);
-- las antiguas pueden tener puntos, así que conviene normalizarlas antes.
-- create unique index if not exists applications_job_rut_unique
--   on public.applications (job_id, rut);

-- Nombres de área sin duplicados, sin distinguir mayúsculas.
-- create unique index if not exists job_areas_name_unique
--   on public.job_areas (lower(name));

commit;

-- ---------------------------------------------------------------------
-- 7. Roles del panel (ejecutar aparte, reemplazando los correos)
--    El servidor lee el rol desde app_metadata, que el usuario no puede editar.
-- ---------------------------------------------------------------------
-- update auth.users
--   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
--   where email in ('admin@estriborconsultores.cl');
--
-- update auth.users
--   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role": "recruiter"}'::jsonb
--   where email in ('dayana@estriborconsultores.cl');
--
-- Además: en Authentication > Providers > Email, desactivar "Allow new users to sign up".
