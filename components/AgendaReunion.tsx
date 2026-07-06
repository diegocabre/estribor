"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, CheckCircle2, Video, ArrowRight, Loader2 } from "lucide-react";

export default function AgendaReunion() {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [duration, setDuration] = useState<string>("30 min");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [objective, setObjective] = useState("Consultoría General");
  const [status, setStatus] = useState<"date-select" | "form-fill" | "submitting" | "success">("date-select");

  const dates = [
    { dayName: "Lun", dayNum: "06", fullDate: "Lunes, 6 de Julio de 2026" },
    { dayName: "Mar", dayNum: "07", fullDate: "Martes, 7 de Julio de 2026" },
    { dayName: "Mié", dayNum: "08", fullDate: "Miércoles, 8 de Julio de 2026" },
    { dayName: "Jue", dayNum: "09", fullDate: "Jueves, 9 de Julio de 2026" },
    { dayName: "Vie", dayNum: "10", fullDate: "Viernes, 10 de Julio de 2026" },
  ];

  const timeSlots = ["09:00", "10:30", "12:00", "14:30", "16:00", "17:30"];

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      setStatus("form-fill");
    }
  };

  const handleBack = () => {
    setStatus("date-select");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Save booking request in localStorage
    const newBooking = {
      date: selectedDate,
      time: selectedTime,
      duration,
      name,
      email,
      company,
      objective,
      createdAt: new Date().toISOString(),
    };
    const currentBookings = JSON.parse(localStorage.getItem("estribor_bookings") || "[]");
    localStorage.setItem("estribor_bookings", JSON.stringify([newBooking, ...currentBookings]));

    setStatus("success");
  };

  const resetBooking = () => {
    setSelectedDate("");
    setSelectedTime("");
    setName("");
    setEmail("");
    setCompany("");
    setStatus("date-select");
  };

  return (
    <section id="agenda" className="py-24 bg-brand-bg relative overflow-hidden scroll-mt-16">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-brand-gold text-xs font-bold tracking-widest uppercase block mb-3 font-sans">
            Planificación Directa
          </span>
          <h2 className="text-3xl font-bold text-brand-navy tracking-tight mb-4">
            Agenda una Asesoría
          </h2>
          <p className="text-sm sm:text-base text-brand-gray-dark font-light leading-relaxed">
            Reserva una sesión estratégica virtual de 15, 30 o 45 minutos con uno de nuestros consultores senior sin demoras ni correos de ida y vuelta.
          </p>
        </div>

        {/* Booker Container */}
        <div className="bg-white border border-brand-gray/10 rounded-3xl shadow-xl overflow-hidden min-h-[460px] flex flex-col md:flex-row">
          
          {/* Sidebar Info (40%) */}
          <div className="md:w-2/5 bg-brand-navy text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-brand-gold/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <span className="text-brand-gold text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 inline-block mb-6">
                Reunión Virtual
              </span>
              <h3 className="text-2xl font-bold text-white mb-2 font-titles">Asesoría de Rumbo</h3>
              <p className="text-sm text-brand-gray font-light leading-relaxed mb-6">
                Espacio consultivo para evaluar requerimientos específicos de tu empresa en RRHH, SST o ESG.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm font-light text-white/90">
                  <Clock className="h-5 w-5 text-brand-gold shrink-0" />
                  <span>{duration} de duración</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-light text-white/90">
                  <Video className="h-5 w-5 text-brand-gold shrink-0" />
                  <span>Videollamada de Google Meet / Teams</span>
                </div>
                {selectedDate && (
                  <div className="flex items-center gap-3 text-sm font-semibold text-brand-gold">
                    <Calendar className="h-5 w-5 text-brand-gold shrink-0" />
                    <span>
                      {dates.find((d) => d.fullDate === selectedDate)?.fullDate} a las {selectedTime} hrs
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-xs text-brand-gray/60 font-light mt-8 relative z-10">
              Estribor Consultores &copy; 2026. Zona horaria: Chile Continental (GMT-4).
            </div>
          </div>

          {/* Booking Area (60%) */}
          <div className="md:w-3/5 p-8 sm:p-10 flex flex-col justify-center bg-white relative">
            <AnimatePresence mode="wait">
              
              {status === "date-select" && (
                <motion.div
                  key="date-select"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h4 className="text-sm font-bold text-brand-navy uppercase tracking-wider mb-3">1. Selecciona Duración</h4>
                    <div className="flex gap-2">
                      {["15 min", "30 min", "45 min"].map((dur) => (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => setDuration(dur)}
                          className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all duration-200 ${
                            duration === dur
                              ? "bg-brand-navy text-white border-brand-navy shadow-sm"
                              : "border-brand-gray/20 text-brand-navy hover:bg-brand-bg"
                          }`}
                        >
                          {dur}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-brand-navy uppercase tracking-wider mb-3">2. Selecciona Fecha</h4>
                    <div className="grid grid-cols-5 gap-2">
                      {dates.map((d) => (
                        <button
                          key={d.fullDate}
                          type="button"
                          onClick={() => setSelectedDate(d.fullDate)}
                          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                            selectedDate === d.fullDate
                              ? "bg-brand-gold text-brand-navy border-brand-gold font-bold scale-105"
                              : "border-brand-gray/20 hover:border-brand-gold/50 text-brand-navy bg-brand-bg/20"
                          }`}
                        >
                          <span className="text-[10px] font-medium opacity-75">{d.dayName}</span>
                          <span className="text-base font-bold leading-none mt-1">{d.dayNum}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedDate && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h4 className="text-sm font-bold text-brand-navy uppercase tracking-wider mb-3">3. Selecciona Hora</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                              selectedTime === time
                                ? "bg-brand-navy text-white border-brand-navy"
                                : "border-brand-gray/20 hover:border-brand-navy/50 text-brand-navy bg-brand-bg/10"
                            }`}
                          >
                            {time} hrs
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {selectedDate && selectedTime && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      type="button"
                      onClick={handleNext}
                      className="w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-navy font-bold py-3.5 px-6 rounded-xl transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-4"
                    >
                      Confirmar Fecha y Hora
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  )}
                </motion.div>
              )}

              {status === "form-fill" && (
                <motion.form
                  key="form-fill"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h4 className="text-sm font-bold text-brand-navy uppercase tracking-wider mb-2">Ingresa tus datos</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-brand-navy uppercase mb-1.5">Nombre *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej. Camila Alvear"
                        className="border border-brand-gray/20 rounded-lg px-3 py-2.5 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold transition-colors"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-brand-navy uppercase mb-1.5">Correo *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ejemplo@empresa.cl"
                        className="border border-brand-gray/20 rounded-lg px-3 py-2.5 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-brand-navy uppercase mb-1.5">Empresa *</label>
                      <input
                        type="text"
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Ej. Estribor SpA"
                        className="border border-brand-gray/20 rounded-lg px-3 py-2.5 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold transition-colors"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-brand-navy uppercase mb-1.5">Objetivo de la Reunión</label>
                      <select
                        value={objective}
                        onChange={(e) => setObjective(e.target.value)}
                        className="border border-brand-gray/20 rounded-lg px-3 py-2.5 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold transition-colors cursor-pointer"
                      >
                        <option value="Consultoría General">Consultoría General</option>
                        <option value="Gestión de Personas">Gestión de Personas</option>
                        <option value="Seguridad y Salud (SST)">Seguridad y Salud (SST)</option>
                        <option value="Sostenibilidad (ESG)">Sostenibilidad (ESG)</option>
                        <option value="Reclutamiento de Vacantes">Reclutamiento de Vacantes</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="w-1/3 border border-brand-gray/20 hover:bg-brand-bg text-brand-navy font-bold py-3 px-4 rounded-xl transition-colors text-xs text-center"
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-brand-navy hover:bg-brand-blue-med text-white font-bold py-3 px-4 rounded-xl transition-colors text-xs shadow-md hover:shadow-lg flex items-center justify-center"
                    >
                      Confirmar Reserva
                    </button>
                  </div>
                </motion.form>
              )}

              {status === "submitting" && (
                <motion.div
                  key="submitting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <Loader2 className="h-10 w-10 text-brand-gold animate-spin mb-4" />
                  <h4 className="font-bold text-brand-navy mb-1 text-sm uppercase">Procesando Reserva...</h4>
                  <p className="text-xs text-brand-gray-dark font-light">Estamos reservando tu bloque en nuestro calendario.</p>
                </motion.div>
              )}

              {status === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-6" />
                  <h3 className="text-2xl font-bold text-brand-navy mb-2">¡Asesoría Agendada!</h3>
                  <p className="text-sm text-brand-gray-dark font-light max-w-sm mb-6 leading-relaxed">
                    Hemos reservado tu reunión para el <strong className="font-bold text-brand-navy">{selectedDate}</strong> a las <strong className="font-bold text-brand-navy">{selectedTime} hrs</strong>.
                  </p>
                  <p className="text-xs text-brand-gray-dark font-light max-w-xs mb-8">
                    Se ha enviado un correo electrónico de confirmación con el enlace de Google Meet al correo proporcionado ({email}).
                  </p>
                  <button
                    type="button"
                    onClick={resetBooking}
                    className="bg-brand-navy hover:bg-brand-blue-med text-white font-bold py-3 px-6 rounded-xl transition-colors text-xs shadow-sm"
                  >
                    Agendar otra reunión
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
