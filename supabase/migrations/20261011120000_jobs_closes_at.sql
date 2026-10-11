-- Fecha de cierre por vacante. Se usa como validThrough del JobPosting (Google Empleos)
-- y deja de publicarse el JobPosting cuando vence. Nula en vacantes antiguas: en ese caso
-- el sitio usa publicación + 60 días como respaldo.
alter table public.jobs add column if not exists closes_at date;
