"use client";

import { ArrowRight } from "lucide-react";
import { DURATIONS, TIME_SLOTS } from "@/lib/agenda";
import type { AgendaState } from "@/lib/hooks/useAgenda";

const groupLabelClass = "text-xs font-bold text-brand-navy mb-2 block uppercase tracking-wide";

/** Paso 1 de la reserva: duración, fecha y horario. Reutilizable en cualquier sección. */
export default function BookingCalendar({ agenda }: { agenda: AgendaState }) {
  return (
    <div className="space-y-6">
      {/* Duración */}
      <div role="group" aria-labelledby="booking-duration-label">
        <p id="booking-duration-label" className={groupLabelClass}>
          1. Selecciona Duración
        </p>
        <div className="grid grid-cols-3 gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => agenda.setDuration(d)}
              aria-pressed={agenda.duration === d}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                agenda.duration === d
                  ? "bg-brand-navy text-white border-brand-navy shadow-sm"
                  : "bg-brand-bg/40 text-brand-navy border-brand-gray/20 hover:border-brand-gold"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Fecha */}
      <div role="group" aria-labelledby="booking-date-label">
        <p id="booking-date-label" className={groupLabelClass}>
          2. Selecciona Fecha
        </p>
        <div className="grid grid-cols-5 gap-2 min-h-[61px]">
          {agenda.dates.map((d) => {
            const isSelected = agenda.selectedDateStr === d.dateStr;
            return (
              <button
                key={d.dateStr}
                type="button"
                onClick={() => agenda.selectDate(d.dateStr)}
                aria-pressed={isSelected}
                aria-label={d.fullDate}
                className={`flex flex-col items-center py-2.5 px-1 rounded-xl transition-all border ${
                  isSelected
                    ? "bg-brand-gold text-brand-navy border-brand-gold font-bold shadow-md scale-105"
                    : "bg-brand-bg/30 text-brand-navy border-brand-gray/20 hover:border-brand-gold/60"
                }`}
              >
                <span aria-hidden="true" className="text-[10px] uppercase">
                  {d.dayName}
                </span>
                <span aria-hidden="true" className="text-base font-extrabold">
                  {d.dayNum}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Horario */}
      {agenda.selectedDateStr && (
        <div
          className="animate-rise-in"
          role="group"
          aria-labelledby="booking-time-label"
        >
          <p id="booking-time-label" className={groupLabelClass}>
            3. Horario Disponible (hora de Chile)
          </p>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map((time) => {
              const unavailable = agenda.isTimeUnavailable(time);
              const isSelected = agenda.selectedTime === time;
              return (
                <button
                  key={time}
                  type="button"
                  disabled={unavailable}
                  onClick={() => agenda.setSelectedTime(time)}
                  aria-pressed={isSelected}
                  aria-label={`${time} horas${unavailable ? ", no disponible" : ""}`}
                  className={`py-2 rounded-lg text-xs font-semibold transition-all border ${
                    unavailable
                      ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed line-through"
                      : isSelected
                        ? "bg-brand-navy text-white border-brand-navy shadow-sm"
                        : "bg-white text-brand-navy border-brand-gray/20 hover:border-brand-electric hover:bg-brand-electric/5"
                  }`}
                >
                  {time} hrs
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        disabled={!agenda.canContinue}
        onClick={agenda.goToForm}
        className="w-full bg-brand-gold hover:bg-brand-gold/90 disabled:opacity-40 disabled:cursor-not-allowed text-brand-navy font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-4 cursor-pointer"
      >
        <span>Completar Datos de la Reunión</span>
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
}
