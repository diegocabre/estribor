"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  Calendar,
  Clock,
  Video,
  ArrowRight,
  ArrowLeft,
  Loader2,
  MessageSquare,
  CalendarDays,
} from "lucide-react";
import LegalFormConsent from "@/components/LegalFormConsent";

export default function Contacto() {
  // -------------------------------------------------------------
  // STATE: FORMULARIO DE CONTACTO (MODALIDAD 1 - IZQUIERDA)
  // -------------------------------------------------------------
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    message: "",
  });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrorMessage(null);

    if (!privacyAccepted) {
      setFormStatus("error");
      setFormErrorMessage("Por favor, acepta la Política de Privacidad para poder enviar tu mensaje.");
      return;
    }

    setFormStatus("loading");

    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          privacyAccepted,
          marketingAccepted,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          role: "",
          message: "",
        });
        setPrivacyAccepted(false);
        setMarketingAccepted(false);
      } else {
        setFormStatus("error");
        setFormErrorMessage(data.error || "Ocurrió un error al enviar el mensaje. Por favor, inténtalo de nuevo.");
      }
    } catch (err) {
      console.error("Error al enviar el formulario:", err);
      setFormStatus("error");
      setFormErrorMessage("No se pudo conectar con el servidor. Por favor, comprueba tu conexión de red.");
    }
  };

  // -------------------------------------------------------------
  // STATE: AGENDA DE REUNIÓN VIRTUAL (MODALIDAD 2 - DERECHA)
  // -------------------------------------------------------------
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [duration, setDuration] = useState<string>("30 min");
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingCompany, setBookingCompany] = useState("");
  const [bookingObjective, setBookingObjective] = useState("Consultoría General");
  const [bookingPrivacyConsent, setBookingPrivacyConsent] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<"date-select" | "form-fill" | "success">("date-select");
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<Array<{ date: string; time: string }>>([]);
  const [bookingErrorMsg, setBookingErrorMsg] = useState("");
  const [dates, setDates] = useState<Array<{ dayName: string; dayNum: string; fullDate: string; dateStr: string }>>([]);

  const timeSlots = ["09:00", "10:30", "12:00", "14:30", "16:00", "17:30"];

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const todayStr = `${year}-${month}-${day}`;

  useEffect(() => {
    const generatedDates = [];
    const localNow = new Date();
    const currentHour = localNow.getHours();
    const currentMin = localNow.getMinutes();
    const isTodayPast = currentHour > 17 || (currentHour === 17 && currentMin >= 30);

    let current = new Date(localNow);
    if (isTodayPast) {
      current.setDate(current.getDate() + 1);
    }

    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const fullDayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    while (generatedDates.length < 5) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const dayName = dayNames[dayOfWeek];
        const dayNum = String(current.getDate()).padStart(2, "0");
        const y = current.getFullYear();
        const m = String(current.getMonth() + 1).padStart(2, "0");
        const dateStr = `${y}-${m}-${dayNum}`;
        const fullDate = `${fullDayNames[dayOfWeek]}, ${current.getDate()} de ${monthNames[current.getMonth()]} de ${y}`;
        generatedDates.push({ dayName, dayNum, fullDate, dateStr });
      }
      current.setDate(current.getDate() + 1);
    }

    setDates(generatedDates);
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("/api/agenda");
        const data = await response.json();
        if (data.success && data.bookings) {
          setBookedSlots(data.bookings);
        }
      } catch (err) {
        console.error("Error al cargar las reservas:", err);
      }
    };
    fetchBookings();
  }, []);

  const isTimeInPast = (timeStr: string) => {
    const isBooked = bookedSlots.some(
      (slot) => slot.date === selectedDate && slot.time === timeStr
    );
    if (isBooked) return true;

    const dateObj = dates.find((d) => d.fullDate === selectedDate);
    if (!dateObj) return false;

    if (dateObj.dateStr < todayStr) return true;
    if (dateObj.dateStr > todayStr) return false;

    const [slotHour, slotMin] = timeStr.split(":").map(Number);
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();

    if (slotHour < currentHour) return true;
    if (slotHour === currentHour && slotMin <= currentMin) return true;

    return false;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingErrorMsg("");

    if (!bookingPrivacyConsent) {
      setBookingErrorMsg("Debes aceptar la Política de Privacidad para confirmar tu reserva.");
      return;
    }

    setIsBookingSubmitting(true);

    try {
      const dateObj = dates.find((d) => d.fullDate === selectedDate);
      const response = await fetch("/api/agenda", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDate,
          dateStr: dateObj ? dateObj.dateStr : "",
          time: selectedTime,
          duration,
          name: bookingName,
          email: bookingEmail,
          company: bookingCompany,
          objective: bookingObjective,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "No se pudo realizar el agendamiento.");
      }

      setBookedSlots((prev) => [...prev, { date: selectedDate, time: selectedTime }]);
      setBookingStatus("success");
    } catch (err: any) {
      setBookingErrorMsg(err.message || "Error al intentar realizar el agendamiento.");
      setBookingStatus("form-fill");
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  const resetBooking = () => {
    setSelectedDate("");
    setSelectedTime("");
    setBookingName("");
    setBookingEmail("");
    setBookingCompany("");
    setBookingPrivacyConsent(false);
    setBookingErrorMsg("");
    setBookingStatus("date-select");
  };

  return (
    <section id="contacto" className="py-20 md:py-28 bg-brand-bg relative overflow-hidden scroll-mt-20">
      <div id="agenda" className="absolute -top-24 left-0"></div>

      {/* Decorative background gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-electric/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* BIG QUESTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="bg-brand-gold/15 text-brand-gold text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-brand-gold/30">
              Canal de Comunicación Directo
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-brand-navy tracking-tight mb-6">
            ¿Quieres contactarnos?
          </h2>

          <p className="text-base sm:text-lg text-brand-gray-dark font-light leading-relaxed">
            Elige la modalidad que prefieras: déjanos un mensaje a través del formulario o agenda una sesión virtual directa en nuestro calendario.
          </p>
        </div>

        {/* 2-COLUMN MODALITY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* ========================================================= */}
          {/* COLUMNA IZQUIERDA: FORMULARIO DE CONTACTO (6 COLS) */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 bg-white border border-brand-gray/20 rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-between">
            <div>
              {/* Header de la Modalidad 1 */}
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-brand-gray/10">
                <div className="w-12 h-12 rounded-2xl bg-brand-electric/10 text-brand-electric flex items-center justify-center shrink-0">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-brand-electric uppercase tracking-wider block">
                    Modalidad 1
                  </span>
                  <h3 className="text-xl font-bold text-brand-navy font-titles">
                    Enviar Mensaje Directo
                  </h3>
                </div>
              </div>

              {/* Quick Contact Info Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 p-4 rounded-xl bg-brand-bg/50 border border-brand-gray/10 text-xs">
                <a
                  href="mailto:contacto@estriborconsultores.cl"
                  className="flex items-center gap-2 text-brand-navy hover:text-brand-electric transition-colors"
                >
                  <Mail className="h-4 w-4 text-brand-electric shrink-0" />
                  <span className="truncate">contacto@estriborconsultores.cl</span>
                </a>
                <a
                  href="tel:+56941676239"
                  className="flex items-center gap-2 text-brand-navy hover:text-brand-electric transition-colors"
                >
                  <Phone className="h-4 w-4 text-brand-electric shrink-0" />
                  <span>+56 9 4167 6239</span>
                </a>
              </div>

              {/* Formulario */}
              <AnimatePresence mode="wait">
                {formStatus === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center text-center py-12"
                  >
                    <CheckCircle2 className="h-14 w-14 text-emerald-500 mb-4 animate-bounce" />
                    <h4 className="text-xl font-bold text-brand-navy mb-2">¡Mensaje Enviado con Éxito!</h4>
                    <p className="text-sm text-brand-gray max-w-sm font-light mb-6">
                      Agradecemos tu interés. Uno de nuestros consultores especializados responderá a tu solicitud a la brevedad.
                    </p>
                    <button
                      onClick={() => setFormStatus("idle")}
                      className="bg-brand-navy hover:bg-brand-blue-med text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm"
                    >
                      Enviar otro mensaje
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label htmlFor="form-name" className="text-xs font-bold text-brand-navy mb-1.5 uppercase tracking-wide">
                          Nombre *
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="form-name"
                          required
                          value={formData.name}
                          onChange={handleFormChange}
                          className="border border-brand-gray/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-electric bg-brand-bg/20 text-brand-navy font-sans"
                          placeholder="Ej. Juan Pérez"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="form-email" className="text-xs font-bold text-brand-navy mb-1.5 uppercase tracking-wide">
                          Correo *
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="form-email"
                          required
                          value={formData.email}
                          onChange={handleFormChange}
                          className="border border-brand-gray/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-electric bg-brand-bg/20 text-brand-navy font-sans"
                          placeholder="ejemplo@empresa.cl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label htmlFor="form-phone" className="text-xs font-bold text-brand-navy mb-1.5 uppercase tracking-wide">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          id="form-phone"
                          value={formData.phone}
                          onChange={handleFormChange}
                          className="border border-brand-gray/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-electric bg-brand-bg/20 text-brand-navy font-sans"
                          placeholder="+56 9 1234 5678"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="form-company" className="text-xs font-bold text-brand-navy mb-1.5 uppercase tracking-wide">
                          Empresa
                        </label>
                        <input
                          type="text"
                          name="company"
                          id="form-company"
                          value={formData.company}
                          onChange={handleFormChange}
                          className="border border-brand-gray/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-electric bg-brand-bg/20 text-brand-navy font-sans"
                          placeholder="Nombre de tu empresa"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="form-message" className="text-xs font-bold text-brand-navy mb-1.5 uppercase tracking-wide">
                        Mensaje o Consulta *
                      </label>
                      <textarea
                        name="message"
                        id="form-message"
                        rows={4}
                        required
                        value={formData.message}
                        onChange={handleFormChange}
                        className="border border-brand-gray/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-electric bg-brand-bg/20 text-brand-navy font-sans resize-none"
                        placeholder="Cuéntanos brevemente tus requerimientos..."
                      ></textarea>
                    </div>

                    <LegalFormConsent
                      privacyAccepted={privacyAccepted}
                      onPrivacyChange={setPrivacyAccepted}
                      marketingAccepted={marketingAccepted}
                      onMarketingChange={setMarketingAccepted}
                      showMarketingOption={false}
                    />

                    {formStatus === "error" && formErrorMessage && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs font-semibold">
                        {formErrorMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={formStatus === "loading"}
                      className="w-full bg-brand-navy hover:bg-brand-blue-med disabled:bg-brand-navy/50 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {formStatus === "loading" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Enviando Mensaje...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Enviar Mensaje
                        </>
                      )}
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ========================================================= */}
          {/* COLUMNA DERECHA: AGENDA VIRTUAL (6 COLS) */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 bg-white border border-brand-gray/20 rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-between">
            <div>
              {/* Header de la Modalidad 2 */}
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-brand-gray/10">
                <div className="w-12 h-12 rounded-2xl bg-brand-gold/15 text-brand-gold flex items-center justify-center shrink-0">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-brand-gold uppercase tracking-wider block">
                    Modalidad 2
                  </span>
                  <h3 className="text-xl font-bold text-brand-navy font-titles">
                    Agendar Asesoría Virtual
                  </h3>
                </div>
              </div>

              {/* Booking widget */}
              <AnimatePresence mode="wait">
                {bookingStatus === "date-select" && (
                  <motion.div
                    key="booking-date-select"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* Duración */}
                    <div>
                      <label className="text-xs font-bold text-brand-navy mb-2 block uppercase tracking-wide">
                        1. Selecciona Duración
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {["15 min", "30 min", "45 min"].map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setDuration(d)}
                            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                              duration === d
                                ? "bg-brand-navy text-white border-brand-navy shadow-sm"
                                : "bg-brand-bg/40 text-brand-navy border-brand-gray/20 hover:border-brand-gold"
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Selector de Fecha */}
                    <div>
                      <label className="text-xs font-bold text-brand-navy mb-2 block uppercase tracking-wide">
                        2. Selecciona Fecha
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {dates.map((d) => {
                          const isSelected = selectedDate === d.fullDate;
                          return (
                            <button
                              key={d.dateStr}
                              type="button"
                              onClick={() => {
                                setSelectedDate(d.fullDate);
                                setSelectedTime("");
                              }}
                              className={`flex flex-col items-center py-2.5 px-1 rounded-xl transition-all border ${
                                isSelected
                                  ? "bg-brand-gold text-brand-navy border-brand-gold font-bold shadow-md scale-105"
                                  : "bg-brand-bg/30 text-brand-navy border-brand-gray/20 hover:border-brand-gold/60"
                              }`}
                            >
                              <span className="text-[10px] uppercase">{d.dayName}</span>
                              <span className="text-base font-extrabold">{d.dayNum}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Selector de Horario */}
                    {selectedDate && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <label className="text-xs font-bold text-brand-navy mb-2 block uppercase tracking-wide">
                          3. Horario Disponible (GMT-4)
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.map((time) => {
                            const unavailable = isTimeInPast(time);
                            const isSelected = selectedTime === time;

                            return (
                              <button
                                key={time}
                                type="button"
                                disabled={unavailable}
                                onClick={() => setSelectedTime(time)}
                                className={`py-2 rounded-lg text-xs font-semibold transition-all border ${
                                  unavailable
                                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through"
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
                      </motion.div>
                    )}

                    {/* Botón Continuar */}
                    <button
                      type="button"
                      disabled={!selectedDate || !selectedTime}
                      onClick={() => setBookingStatus("form-fill")}
                      className="w-full bg-brand-gold hover:bg-brand-gold/90 disabled:opacity-40 disabled:cursor-not-allowed text-brand-navy font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-4 cursor-pointer"
                    >
                      <span>Completar Datos de la Reunión</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                )}

                {/* Paso 2: Formulario de Confirmación */}
                {bookingStatus === "form-fill" && (
                  <motion.form
                    key="booking-form-fill"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleBookingSubmit}
                    className="space-y-4"
                  >
                    <div className="p-3 bg-brand-gold/10 border border-brand-gold/20 rounded-xl text-xs flex items-center justify-between">
                      <div>
                        <span className="font-bold text-brand-navy block">{selectedDate}</span>
                        <span className="text-brand-gray-dark">{selectedTime} hrs ({duration})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setBookingStatus("date-select")}
                        className="text-brand-navy hover:text-brand-gold font-bold flex items-center gap-1 text-xs"
                      >
                        <ArrowLeft className="h-3 w-3" />
                        Cambiar
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="text-xs font-bold text-brand-navy mb-1.5 uppercase tracking-wide">
                          Nombre Completo *
                        </label>
                        <input
                          type="text"
                          required
                          value={bookingName}
                          onChange={(e) => setBookingName(e.target.value)}
                          className="border border-brand-gray/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-gold bg-brand-bg/20 text-brand-navy font-sans"
                          placeholder="Ej. Camila Alvear"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs font-bold text-brand-navy mb-1.5 uppercase tracking-wide">
                          Correo Corporativo *
                        </label>
                        <input
                          type="email"
                          required
                          value={bookingEmail}
                          onChange={(e) => setBookingEmail(e.target.value)}
                          className="border border-brand-gray/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-gold bg-brand-bg/20 text-brand-navy font-sans"
                          placeholder="ejemplo@empresa.cl"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-brand-navy mb-1.5 uppercase tracking-wide">
                        Empresa
                      </label>
                      <input
                        type="text"
                        value={bookingCompany}
                        onChange={(e) => setBookingCompany(e.target.value)}
                        className="border border-brand-gray/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-gold bg-brand-bg/20 text-brand-navy font-sans"
                        placeholder="Nombre de tu empresa"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-brand-navy mb-1.5 uppercase tracking-wide">
                        Objetivo de la Asesoría
                      </label>
                      <select
                        value={bookingObjective}
                        onChange={(e) => setBookingObjective(e.target.value)}
                        className="border border-brand-gray/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-gold bg-brand-bg/20 text-brand-navy font-sans"
                      >
                        <option value="Consultoría General">Consultoría General</option>
                        <option value="Gestión de Personas y RRHH">Gestión de Personas y RRHH</option>
                        <option value="Seguridad y Salud en el Trabajo (SST)">Seguridad y Salud en el Trabajo (SST)</option>
                        <option value="Cumplimiento Ley Karin y Normativas">Cumplimiento Ley Karin y Normativas</option>
                        <option value="Sostenibilidad y ESG">Sostenibilidad y ESG</option>
                      </select>
                    </div>

                    <div className="flex items-start gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="booking-privacy"
                        required
                        checked={bookingPrivacyConsent}
                        onChange={(e) => setBookingPrivacyConsent(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                      />
                      <label htmlFor="booking-privacy" className="text-xs text-brand-gray-dark leading-relaxed">
                        Acepto el tratamiento de datos para la coordinación de la videollamada conforme a la Política de Privacidad.
                      </label>
                    </div>

                    {bookingErrorMsg && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs font-semibold">
                        {bookingErrorMsg}
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setBookingStatus("date-select")}
                        className="w-1/3 border border-brand-gray/30 text-brand-navy hover:bg-brand-bg font-bold py-3 rounded-xl text-xs transition-colors"
                      >
                        Atrás
                      </button>
                      <button
                        type="submit"
                        disabled={isBookingSubmitting}
                        className="w-2/3 bg-brand-gold hover:bg-brand-gold/90 text-brand-navy font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-50"
                      >
                        {isBookingSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Confirmando...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            Confirmar Cita
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* Paso 3: Éxito */}
                {bookingStatus === "success" && (
                  <motion.div
                    key="booking-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <CheckCircle2 className="h-14 w-14 text-emerald-500 mx-auto mb-3" />
                    <h4 className="text-xl font-bold text-brand-navy mb-1">¡Cita Confirmada!</h4>
                    <p className="text-xs text-brand-gray-dark mb-4">
                      Hemos agendado tu sesión para el <strong className="text-brand-navy">{selectedDate} a las {selectedTime} hrs</strong>.
                      Te enviamos el enlace de conexión a tu correo electrónico.
                    </p>
                    <button
                      onClick={resetBooking}
                      className="bg-brand-navy hover:bg-brand-blue-med text-white px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Agendar otra reunión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
