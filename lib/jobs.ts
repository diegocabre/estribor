import "server-only";
import { cache } from "react";
import { supabase } from "@/lib/supabase";
import { mapJobRow, type Job, type JobRow } from "@/lib/types";

// Fuente única de vacantes: Supabase. Se lee en el servidor con la clave anon, así que
// aplica RLS (solo vacantes publicadas). Las páginas que la usan se regeneran por ISR y
// las rutas /api/admin/jobs las revalidan al instante cuando cambia una vacante.

/** Abiertas primero; dentro de cada grupo, las más recientes arriba. */
function sortJobs(jobs: Job[]): Job[] {
  return [...jobs].sort((a, b) => {
    if (a.active !== b.active) return a.active ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export const getPublicJobs = cache(async (): Promise<Job[]> => {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("No se pudieron leer las vacantes:", error.message);
    return [];
  }
  return sortJobs((data as JobRow[]).map(mapJobRow));
});

export const getPublicJob = cache(async (id: string): Promise<Job | null> => {
  const { data, error } = await supabase.from("jobs").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error(`No se pudo leer la vacante ${id}:`, error.message);
    return null;
  }
  return data ? mapJobRow(data as JobRow) : null;
});
