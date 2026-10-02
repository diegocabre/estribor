import "server-only";
import type { User } from "@supabase/supabase-js";
import { jsonError } from "@/lib/security";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type StaffRole = "admin" | "recruiter";

export interface StaffSession {
  user: User;
  role: StaffRole;
}

const emailList = (value: string | undefined) =>
  (value ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

/**
 * El rol se toma de `app_metadata.role` (solo lo escribe el servidor) o, como respaldo,
 * de las listas ADMIN_EMAILS / RECRUITER_EMAILS. Nunca de `user_metadata`, que el propio
 * usuario puede modificar con `auth.updateUser`.
 */
export function resolveRole(user: User): StaffRole | null {
  const appRole = user.app_metadata?.role;
  if (appRole === "admin" || appRole === "recruiter") return appRole;

  const email = (user.email ?? "").toLowerCase();
  if (!email || !user.email_confirmed_at) return null;
  if (emailList(process.env.ADMIN_EMAILS).includes(email)) return "admin";
  if (emailList(process.env.RECRUITER_EMAILS).includes(email)) return "recruiter";
  return null;
}

type AuthResult = { ok: true; session: StaffSession } | { ok: false; response: Response };

/** Valida el JWT de Supabase enviado como `Authorization: Bearer <token>` y exige un rol. */
export async function requireStaff(request: Request, allowed: StaffRole[] = ["admin", "recruiter"]): Promise<AuthResult> {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return { ok: false, response: jsonError("No autenticado.", 401) };

  const { data, error } = await getSupabaseAdmin().auth.getUser(token);
  if (error || !data.user) return { ok: false, response: jsonError("Sesión inválida o expirada.", 401) };

  const role = resolveRole(data.user);
  if (!role) return { ok: false, response: jsonError("Tu cuenta no tiene acceso al panel.", 403) };
  if (!allowed.includes(role)) {
    return { ok: false, response: jsonError("Tu cuenta no tiene permisos para esta acción.", 403) };
  }

  return { ok: true, session: { user: data.user, role } };
}
