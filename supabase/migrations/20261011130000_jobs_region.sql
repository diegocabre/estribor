-- Región de cada vacante (nombre oficial, p. ej. "Región Metropolitana de Santiago").
-- Se usa como addressRegion del JobPosting. Las vacantes existentes quedan en Los Lagos.
alter table public.jobs add column if not exists region text not null default 'Región de Los Lagos';
