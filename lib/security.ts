import { NextResponse } from "next/server";

/** Escapa un valor para insertarlo en HTML (correos). */
export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Quita saltos de línea y caracteres de control (asuntos de correo, campos ICS). */
export function stripControlChars(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f]+/g, " ").trim();
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

// Límite de solicitudes en memoria por instancia. En Vercel cada instancia lleva su propio
// conteo, así que esto es una primera barrera: la protección principal es la regla de
// rate limiting del Firewall de Vercel (ver README).
const hits = new Map<string, number[]>();
let lastSweep = Date.now();

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  if (now - lastSweep > 60_000) {
    for (const [k, stamps] of hits) {
      if (stamps.every((t) => now - t > windowMs)) hits.delete(k);
    }
    lastSweep = now;
  }

  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - recent[0])) / 1000) };
  }
  recent.push(now);
  hits.set(key, recent);
  return { ok: true, retryAfter: 0 };
}

export function resetRateLimits() {
  hits.clear();
}

export function tooManyRequests(retryAfter: number) {
  return NextResponse.json(
    { success: false, error: "Demasiadas solicitudes. Intenta nuevamente en unos minutos." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
}

export function jsonError(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status });
}

/** Registra el error real en el servidor y devuelve un mensaje genérico con un id para soporte. */
export function internalError(context: string, err: unknown) {
  const requestId = crypto.randomUUID().slice(0, 8);
  console.error(`[${requestId}] ${context}:`, err);
  return NextResponse.json(
    { success: false, error: `Ocurrió un error interno. Código de referencia: ${requestId}.` },
    { status: 500 }
  );
}

export { HONEYPOT_FIELD } from "@/lib/honeypot";

/** Campo trampa: los humanos no lo ven; si viene con contenido, es un bot. */
export function isHoneypotFilled(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://www.estriborconsultores.cl").replace(/\/$/, "");
}
