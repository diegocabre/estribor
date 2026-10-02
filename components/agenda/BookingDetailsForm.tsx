"use client";

import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import Honeypot from "@/components/Honeypot";
import { OBJECTIVES } from "@/lib/agenda";
import type { AgendaState } from "@/lib/hooks/useAgenda";

const inputClass =
  "border border-brand-gray/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-gold bg-brand-bg/20 text-brand-navy font-sans";
const labelClass = "text-xs font-bold text-brand-navy mb-1.5 uppercase tracking-wide";

/** Paso 2 de la reserva: datos de contacto y consentimiento. */
export default function BookingDetailsForm({ agenda }: { agenda: AgendaState }) {
  const { details, updateDetails } = agenda;

  return (
    <form onSubmit={agenda.submit} className="space-y-4 relative">
      <Honeypot value={agenda.honeypot} onChange={agenda.setHoneypot} />

      <div className="p-3 bg-brand-gold/10 border border-brand-gold/20 rounded-xl text-xs flex items-center justify-between">
        <div>
          <span className="font-bold text-brand-navy block">{agenda.selectedDateLabel}</span>
          <span className="text-brand-gray-dark">
            {agenda.selectedTime} hrs ({agenda.duration})
          </span>
        </div>
        <button
          type="button"
          onClick={agenda.goBack}
          className="text-brand-navy hover:text-brand-gold font-bold flex items-center gap-1 text-xs"
        >
          <ArrowLeft aria-hidden="true" className="h-3 w-3" />
          Cambiar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="booking-name" className={labelClass}>
            Nombre Completo *
          </label>
          <input
            id="booking-name"
            type="text"
            required
            autoComplete="name"
            value={details.name}
            onChange={(e) => updateDetails("name", e.target.value)}
            className={inputClass}
            placeholder="Ej. Camila Alvear"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="booking-email" className={labelClass}>
            Correo Corporativo *
          </label>
          <input
            id="booking-email"
            type="email"
            required
            autoComplete="email"
            value={details.email}
            onChange={(e) => updateDetails("email", e.target.value)}
            className={inputClass}
            placeholder="ejemplo@empresa.cl"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label htmlFor="booking-company" className={labelClass}>
          Empresa
        </label>
        <input
          id="booking-company"
          type="text"
          autoComplete="organization"
          value={details.company}
          onChange={(e) => updateDetails("company", e.target.value)}
          className={inputClass}
          placeholder="Nombre de tu empresa"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="booking-objective" className={labelClass}>
          Objetivo de la Asesoría
        </label>
        <select
          id="booking-objective"
          value={details.objective}
          onChange={(e) => updateDetails("objective", e.target.value as (typeof OBJECTIVES)[number])}
          className={inputClass}
        >
          {OBJECTIVES.map((objective) => (
            <option key={objective} value={objective}>
              {objective}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-start gap-2 pt-1">
        <input
          type="checkbox"
          id="booking-privacy"
          required
          checked={agenda.privacyAccepted}
          onChange={(e) => agenda.setPrivacyAccepted(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
        />
        <label htmlFor="booking-privacy" className="text-xs text-brand-gray-dark leading-relaxed">
          Acepto el tratamiento de datos para la coordinación de la videollamada conforme a la Política de Privacidad.
        </label>
      </div>

      {agenda.errorMsg && (
        <div role="alert" className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs font-semibold">
          {agenda.errorMsg}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={agenda.goBack}
          className="w-1/3 border border-brand-gray/30 text-brand-navy hover:bg-brand-bg font-bold py-3 rounded-xl text-xs transition-colors"
        >
          Atrás
        </button>
        <button
          type="submit"
          disabled={agenda.isSubmitting}
          className="w-2/3 bg-brand-gold hover:bg-brand-gold/90 text-brand-navy font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-50"
        >
          {agenda.isSubmitting ? (
            <>
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              Confirmando...
            </>
          ) : (
            <>
              <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
              Confirmar Cita
            </>
          )}
        </button>
      </div>
    </form>
  );
}
