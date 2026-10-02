"use client";

import { useEffect, useState } from "react";
import { trackConversion } from "@/lib/analytics";

const PHONE_NUMBER = "56941676239";
const MESSAGE = encodeURIComponent(
  "Hola Estribor Consultores, me gustaría agendar una reunión o solicitar una propuesta de servicios corporativos."
);
const WA_URL = `https://wa.me/${PHONE_NUMBER}?text=${MESSAGE}`;

export default function WhatsAppWidget() {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {showTooltip && (
        <div className="animate-slide-in-right bg-white border border-brand-gray/10 shadow-xl px-4 py-2.5 rounded-xl text-xs text-brand-navy font-semibold select-none hidden sm:flex items-center gap-2 relative max-w-xs">
          <span aria-hidden="true" className="w-2 h-2 rounded-full bg-emerald-500 motion-safe:animate-ping"></span>
          <span>¿En qué te podemos ayudar?</span>
          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            aria-label="Cerrar mensaje de WhatsApp"
            className="text-brand-gray-dark hover:text-brand-navy font-bold ml-2 text-[10px]"
          >
            <span aria-hidden="true">✕</span>
          </button>
          <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-r border-t border-brand-gray/10 rotate-45"></div>
        </div>
      )}

      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onClick={() => trackConversion("click_whatsapp")}
        className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer relative"
        aria-label="Contactar por WhatsApp (se abre en una pestaña nueva)"
      >
        <span aria-hidden="true" className="absolute inset-0 rounded-full bg-emerald-500 motion-safe:animate-ping opacity-25"></span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </a>
    </div>
  );
}
