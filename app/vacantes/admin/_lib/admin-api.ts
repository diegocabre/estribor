import { supabase } from "@/lib/supabase";
import type { JobArea } from "@/lib/types";

export type StaffRole = "admin" | "recruiter";

export const DEFAULT_AREAS = ["Gestión de Personas", "Seguridad y Salud en el Trabajo", "Sostenibilidad Organizacional"];

export const defaultAreaList = (): JobArea[] => DEFAULT_AREAS.map((name) => ({ name }));

export class AdminApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

/** Llama a una ruta /api/admin con el token de la sesión; el servidor valida rol y permisos. */
export async function adminFetch<T = Record<string, unknown>>(path: string, init: RequestInit = {}): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
      Authorization: `Bearer ${session?.access_token ?? ""}`,
    },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success) {
    throw new AdminApiError(result.error || `Error ${response.status}`, response.status);
  }
  return result as T;
}

export const errorMessage = (err: unknown) => (err instanceof Error ? err.message : String(err));

export function formatDateChile(isoString?: string): string {
  if (!isoString) return "No registrada";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/** Solo URLs https: evita `javascript:` en enlaces construidos con datos de postulantes. */
export function safeHttpsUrl(value?: string): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}
