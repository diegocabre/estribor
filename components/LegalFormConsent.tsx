"use client";

import React from "react";
import Link from "next/link";
import { legalConfig } from "@/lib/legalConfig";
import { ShieldCheck } from "lucide-react";

interface LegalFormConsentProps {
  privacyAccepted: boolean;
  onPrivacyChange: (checked: boolean) => void;
  marketingAccepted?: boolean;
  onMarketingChange?: (checked: boolean) => void;
  showMarketingOption?: boolean;
}

export default function LegalFormConsent({
  privacyAccepted,
  onPrivacyChange,
  marketingAccepted = false,
  onMarketingChange,
  showMarketingOption = false,
}: LegalFormConsentProps) {
  return (
    <div className="space-y-3 pt-2 text-left">
      {/* Checkbox Obligatorio de Política de Privacidad y Términos */}
      <div className="flex items-start gap-2.5">
        <input
          type="checkbox"
          id="privacy-consent"
          required
          checked={privacyAccepted}
          onChange={(e) => onPrivacyChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-brand-gray/30 text-brand-electric focus:ring-brand-gold cursor-pointer accent-brand-electric"
        />
        <label htmlFor="privacy-consent" className="text-xs text-brand-gray-dark cursor-pointer leading-snug select-none">
          He leído y acepto la{" "}
          <Link
            href="/privacidad"
            target="_blank"
            className="text-brand-electric font-semibold underline hover:text-brand-navy transition-colors"
          >
            Política de Privacidad
          </Link>{" "}
          y los{" "}
          <Link
            href="/terminos"
            target="_blank"
            className="text-brand-electric font-semibold underline hover:text-brand-navy transition-colors"
          >
            Términos y Condiciones
          </Link>
          . <span className="text-rose-500 font-bold">*</span>
        </label>
      </div>

      {/* Checkbox Opcional de Marketing (si aplica) */}
      {showMarketingOption && onMarketingChange && (
        <div className="flex items-start gap-2.5">
          <input
            type="checkbox"
            id="marketing-consent"
            checked={marketingAccepted}
            onChange={(e) => onMarketingChange(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-brand-gray/30 text-brand-electric focus:ring-brand-gold cursor-pointer accent-brand-electric"
          />
          <label htmlFor="marketing-consent" className="text-xs text-brand-gray-dark cursor-pointer leading-snug select-none">
            Deseo recibir novedades, información sobre normativas y artículos técnicos de {legalConfig.brandName}. (Opcional)
          </label>
        </div>
      )}

      {/* Primera Capa Informativa (Transparencia Legal) */}
      <div className="p-3 bg-brand-bg/60 border border-brand-gray/15 rounded-lg text-[11px] text-brand-gray-dark leading-relaxed">
        <div className="flex items-center gap-1.5 font-bold text-brand-navy mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
          Información básica sobre protección de datos:
        </div>
        <p>
          <strong>Responsable:</strong> {legalConfig.companyName}.<br />
          <strong>Finalidad:</strong> Atender su consulta o solicitud de asesoría.<br />
          <strong>Legitimación:</strong> Su consentimiento explícito.<br />
          <strong>Derechos ARCOP:</strong> Puede acceder, rectificar o solicitar la supresión de sus datos escribiendo a <span className="font-semibold text-brand-navy">{legalConfig.privacyEmail}</span>.
        </p>
      </div>
    </div>
  );
}
