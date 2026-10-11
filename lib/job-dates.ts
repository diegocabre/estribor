// Fechas de cierre de vacantes. Se guardan como fecha sin hora ("2026-11-16") y se comparan
// contra el día actual en Chile, así una vacante vence al terminar su último día.

/** Vigencia de respaldo para vacantes sin fecha de cierre (las publicadas antes de existir el campo). */
const FALLBACK_DAYS = 60;

/** Hoy en Chile como "AAAA-MM-DD". */
export function todayInChile(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Santiago" }).format(now);
}

/** Último día de postulación: la fecha de cierre o, si no hay, publicación + 60 días. */
export function jobValidThrough(job: { createdAt: string; closesAt: string | null }): string {
  if (job.closesAt) return job.closesAt;
  const posted = new Date(job.createdAt);
  return new Date(posted.getTime() + FALLBACK_DAYS * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** true si el último día de postulación ya pasó. */
export function isJobExpired(job: { createdAt: string; closesAt: string | null }, now: Date = new Date()): boolean {
  return jobValidThrough(job) < todayInChile(now);
}

/** "16 de noviembre de 2026". */
export function formatClosingDate(date: string): string {
  return new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`)
  );
}
