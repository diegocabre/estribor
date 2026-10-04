"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, X } from "lucide-react";
import { CONSENT_EVENT, CONSENT_STORAGE_KEY, readConsent, type ConsentValue } from "@/lib/analytics";

/** Evento para volver a abrir el aviso desde el footer ("Preferencias de cookies"). */
export const OPEN_COOKIE_SETTINGS_EVENT = "estribor_open_cookie_settings";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Pequeño retraso para no competir con la carga inicial de la página.
    const timer = readConsent() === null ? setTimeout(() => setShowBanner(true), 800) : undefined;
    const reopen = () => setShowBanner(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
    };
  }, []);

  const saveConsent = (value: ConsentValue) => {
    const previous = readConsent();
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, value);
    } catch {
      // Navegación privada: el consentimiento vale solo para esta visita.
    }
    setShowBanner(false);

    // Retirar el consentimiento: recargar para descargar los scripts de analítica ya cargados.
    if (previous === "all" && value === "essential") {
      window.location.reload();
      return;
    }

    // Avisar a ConsentAnalytics cuando el navegador esté libre: así el clic solo cierra el aviso
    // y montar Clarity y Vercel Analytics no se suma al tiempo de respuesta (INP).
    const notify = () => window.dispatchEvent(new Event(CONSENT_EVENT));
    if ("requestIdleCallback" in window) window.requestIdleCallback(notify, { timeout: 2000 });
    else setTimeout(notify, 200);
  };

  if (!showBanner) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
      className="animate-pop-in fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50"
    >
      <div className="bg-brand-navy text-white border border-brand-blue-med/80 shadow-2xl rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-electric/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start gap-3.5 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-brand-gold/15 flex items-center justify-center text-brand-gold shrink-0 mt-0.5">
            <Cookie aria-hidden="true" className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 id="cookie-banner-title" className="text-sm font-bold text-white flex items-center gap-1.5">
                Privacidad y Cookies
              </h2>
              <button
                type="button"
                onClick={() => saveConsent("essential")}
                className="text-white/60 hover:text-white transition-colors p-1"
                aria-label="Cerrar aviso de cookies (solo esenciales)"
              >
                <X aria-hidden="true" className="w-4 h-4" />
              </button>
            </div>
            <p id="cookie-banner-description" className="text-xs text-white/80 mt-1.5 leading-relaxed font-light">
              Utilizamos cookies técnicas necesarias y, solo si lo aceptas, cookies analíticas (Microsoft Clarity y Vercel
              Analytics) para mejorar tu experiencia. Puedes consultar los detalles en nuestra{" "}
              <Link href="/privacidad#cookies" className="text-brand-gold hover:text-white underline transition-colors">
                Política de Cookies
              </Link>
              .
            </p>

            <div className="flex items-center justify-end gap-2.5 mt-4 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => saveConsent("essential")}
                className="px-3.5 py-1.5 text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/15 rounded-lg transition-colors"
              >
                Solo esenciales
              </button>
              <button
                type="button"
                onClick={() => saveConsent("all")}
                className="px-4 py-1.5 text-xs font-bold text-brand-navy bg-brand-gold hover:bg-brand-gold/90 rounded-lg transition-colors shadow-sm inline-flex items-center gap-1"
              >
                <ShieldCheck aria-hidden="true" className="w-3.5 h-3.5" />
                Aceptar todas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
