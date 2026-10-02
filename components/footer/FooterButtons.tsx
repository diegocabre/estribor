"use client";

import { ArrowUp } from "lucide-react";
import { OPEN_COOKIE_SETTINGS_EVENT } from "@/components/CookieBanner";

export function ScrollToTopButton() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/70 hover:text-brand-gold transition-colors"
    >
      Volver Arriba
      <ArrowUp aria-hidden="true" className="h-4 w-4" />
    </button>
  );
}

/** Reabre el aviso de cookies para cambiar o retirar el consentimiento. */
export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}
      className="hover:text-brand-gold transition-colors underline-offset-2 hover:underline"
    >
      Preferencias de cookies
    </button>
  );
}
