"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const consent = localStorage.getItem("estribor_cookie_consent");
      if (!consent) {
        // Small delay for smooth entry after initial page load
        const timer = setTimeout(() => setShowBanner(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore localStorage errors in private browsing modes
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem("estribor_cookie_consent", "all");
    } catch {
      // Ignore
    }
    setShowBanner(false);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("estribor_cookies_accepted"));
    }
  };

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem("estribor_cookie_consent", "essential");
    } catch {
      // Ignore
    }
    setShowBanner(false);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 select-none"
        >
          <div className="bg-brand-navy text-white border border-brand-blue-med/80 shadow-2xl rounded-2xl p-5 backdrop-blur-md relative overflow-hidden">
            {/* Subtle decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-electric/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start gap-3.5 relative z-10">
              <div className="w-9 h-9 rounded-xl bg-brand-gold/15 flex items-center justify-center text-brand-gold shrink-0 mt-0.5">
                <Cookie className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Privacidad y Cookies
                  </h3>
                  <button
                    onClick={handleEssentialOnly}
                    className="text-white/40 hover:text-white transition-colors p-1"
                    aria-label="Cerrar aviso de cookies"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-white/70 mt-1.5 leading-relaxed font-light">
                  Utilizamos cookies técnicas necesarias y cookies analíticas para mejorar tu experiencia de navegación y seguridad. Puedes consultar los detalles en nuestra{" "}
                  <Link
                    href="/privacidad#cookies"
                    className="text-brand-gold hover:text-white underline transition-colors"
                  >
                    Política de Cookies
                  </Link>.
                </p>

                <div className="flex items-center justify-end gap-2.5 mt-4 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleEssentialOnly}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white/80 hover:text-white bg-white/10 hover:bg-white/15 rounded-lg transition-colors"
                  >
                    Solo esenciales
                  </button>
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="px-4 py-1.5 text-xs font-bold text-brand-navy bg-brand-gold hover:bg-brand-gold/90 rounded-lg transition-colors shadow-sm inline-flex items-center gap-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Aceptar todas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
