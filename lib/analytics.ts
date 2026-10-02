import { track } from "@vercel/analytics";

// Consentimiento de cookies compartido por CookieBanner, Clarity y Vercel Analytics.
export const CONSENT_STORAGE_KEY = "estribor_cookie_consent";
export const CONSENT_EVENT = "estribor_cookies_accepted";

export type ConsentValue = "all" | "essential";

export function readConsent(): ConsentValue | null {
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "all" || value === "essential" ? value : null;
  } catch {
    return null;
  }
}

export function hasAnalyticsConsent(): boolean {
  return typeof window !== "undefined" && readConsent() === "all";
}

export type ConversionEvent =
  | "formulario_contacto_enviado"
  | "reunion_agendada"
  | "postulacion_enviada"
  | "click_whatsapp";

type ClarityFn = (command: "event" | "set", ...args: string[]) => void;

/**
 * Registra una conversión en Vercel Analytics y Microsoft Clarity.
 * No hace nada si el usuario no aceptó la analítica: nunca se envían datos personales.
 */
export function trackConversion(event: ConversionEvent, props?: Record<string, string>) {
  if (!hasAnalyticsConsent()) return;

  try {
    track(event, props);
  } catch {
    // La analítica nunca debe romper un formulario.
  }

  const clarity = (window as unknown as { clarity?: ClarityFn }).clarity;
  if (typeof clarity === "function") {
    clarity("event", event);
  }
}
