"use client";

import { CheckCircle2 } from "lucide-react";
import type { AgendaState } from "@/lib/hooks/useAgenda";
import BookingCalendar from "./BookingCalendar";
import BookingDetailsForm from "./BookingDetailsForm";

/** Flujo completo de reserva en tres pasos. El estado vive en useAgenda (recibido por props). */
export default function BookingWidget({ agenda }: { agenda: AgendaState }) {
  return (
    <>
      {agenda.step === "date-select" && (
        <div key="booking-date-select" className="animate-fade-in">
          <BookingCalendar agenda={agenda} />
        </div>
      )}

      {agenda.step === "form-fill" && (
        <div key="booking-form-fill" className="animate-slide-in-right">
          <BookingDetailsForm agenda={agenda} />
        </div>
      )}

      {agenda.step === "success" && (
        <div
          key="booking-success"
          className="animate-scale-in text-center py-8"
          role="status"
        >
          <CheckCircle2 aria-hidden="true" className="h-14 w-14 text-emerald-500 mx-auto mb-3" />
          <h4 className="text-xl font-bold text-brand-navy mb-1">¡Cita Confirmada!</h4>
          <p className="text-xs text-brand-gray-dark mb-4">
            Hemos agendado tu sesión para el{" "}
            <strong className="text-brand-navy">
              {agenda.selectedDateLabel} a las {agenda.selectedTime} hrs
            </strong>
            . Te enviamos el enlace de conexión a tu correo electrónico.
          </p>
          <button
            type="button"
            onClick={agenda.reset}
            className="bg-brand-navy hover:bg-brand-blue-med text-white px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors"
          >
            Agendar otra reunión
          </button>
        </div>
      )}
    </>
  );
}
