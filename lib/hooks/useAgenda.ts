"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  OBJECTIVES,
  formatLongDate,
  getUpcomingDates,
  isSlotUnavailable,
  nowInChile,
  type AgendaDate,
  type Duration,
  type Objective,
  type TimeSlot,
} from "@/lib/agenda";
import { trackConversion } from "@/lib/analytics";
import type { BookedSlot } from "@/lib/types";

export type BookingStep = "date-select" | "form-fill" | "success";

export interface BookingDetails {
  name: string;
  email: string;
  company: string;
  objective: Objective;
}

const EMPTY_DETAILS: BookingDetails = { name: "", email: "", company: "", objective: OBJECTIVES[0] };

// Las fechas dependen del reloj del navegador: en el servidor (prerender) la lista va vacía y
// se completa al hidratar, sin desajustes. La referencia se mantiene estable mientras no cambie el día.
let datesCache: { key: string; dates: AgendaDate[] } | null = null;
const EMPTY_DATES: AgendaDate[] = [];
const subscribeNoop = () => () => undefined;

function getDatesSnapshot(): AgendaDate[] {
  const dates = getUpcomingDates();
  const key = dates[0]?.dateStr ?? "";
  if (!datesCache || datesCache.key !== key) datesCache = { key, dates };
  return datesCache.dates;
}

/** Estado y reglas del flujo de reserva: duración → fecha → hora → datos → confirmación. */
export function useAgenda() {
  const dates = useSyncExternalStore(subscribeNoop, getDatesSnapshot, () => EMPTY_DATES);

  const [step, setStep] = useState<BookingStep>("date-select");
  const [duration, setDuration] = useState<Duration>("30 min");
  const [selectedDateStr, setSelectedDateStr] = useState("");
  const [selectedTime, setSelectedTime] = useState<TimeSlot | "">("");
  const [details, setDetails] = useState<BookingDetails>(EMPTY_DETAILS);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/agenda")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.success && Array.isArray(data.bookings)) setBookedSlots(data.bookings);
      })
      .catch((err) => console.error("Error al cargar las reservas:", err));
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedDate = dates.find((d) => d.dateStr === selectedDateStr);
  /** Fecha larga visible, p. ej. "Lunes, 6 de Julio de 2026". */
  const selectedDateLabel = selectedDateStr ? formatLongDate(selectedDateStr) : "";

  const isTimeUnavailable = (time: TimeSlot) =>
    !selectedDateStr || isSlotUnavailable(bookedSlots, selectedDateStr, time, nowInChile());

  const selectDate = (dateStr: string) => {
    setSelectedDateStr(dateStr);
    setSelectedTime("");
  };

  const updateDetails = <K extends keyof BookingDetails>(key: K, value: BookingDetails[K]) =>
    setDetails((prev) => ({ ...prev, [key]: value }));

  const canContinue = Boolean(selectedDateStr && selectedTime);

  const goToForm = () => {
    if (canContinue) setStep("form-fill");
  };

  const goBack = () => setStep("date-select");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!privacyAccepted) {
      setErrorMsg("Debes aceptar la Política de Privacidad para confirmar tu reserva.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/agenda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dateStr: selectedDateStr,
          time: selectedTime,
          duration,
          ...details,
          privacyAccepted,
          website: honeypot,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.error || "No se pudo realizar el agendamiento.");
      }

      setBookedSlots((prev) => [...prev, { date: selectedDateLabel, time: selectedTime }]);
      trackConversion("reunion_agendada", { duracion: duration, objetivo: details.objective });
      setStep("success");
    } catch (err) {
      setErrorMsg((err as Error).message || "Error al intentar realizar el agendamiento.");
      setStep("form-fill");
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setSelectedDateStr("");
    setSelectedTime("");
    setDetails(EMPTY_DETAILS);
    setPrivacyAccepted(false);
    setErrorMsg("");
    setStep("date-select");
  };

  return {
    dates,
    step,
    duration,
    setDuration,
    selectedDateStr,
    selectedDate,
    selectedDateLabel,
    selectedTime,
    setSelectedTime,
    selectDate,
    isTimeUnavailable,
    canContinue,
    goToForm,
    goBack,
    details,
    updateDetails,
    privacyAccepted,
    setPrivacyAccepted,
    honeypot,
    setHoneypot,
    isSubmitting,
    errorMsg,
    submit,
    reset,
  };
}

export type AgendaState = ReturnType<typeof useAgenda>;
