"use client";

import { Calendar, Clock, Video } from "lucide-react";
import BookingWidget from "@/components/agenda/BookingWidget";
import { useAgenda } from "@/lib/hooks/useAgenda";

/**
 * Variante independiente de la agenda (sección propia con barra lateral). Hoy no se usa en
 * ninguna página: la home y /contacto usan la agenda integrada en <Contacto />. Ambas comparten
 * useAgenda y BookingWidget, así que no hay lógica duplicada.
 */
export default function AgendaReunion() {
  const agenda = useAgenda();

  return (
    <section id="agenda" className="py-24 bg-brand-bg relative overflow-hidden scroll-mt-16">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-brand-gold-dark text-xs font-bold tracking-widest uppercase block mb-3 font-sans">
            Planificación Directa
          </span>
          <h2 className="text-3xl font-bold text-brand-navy tracking-tight mb-4">Agenda una Asesoría</h2>
          <p className="text-sm sm:text-base text-brand-gray-dark font-light leading-relaxed">
            Reserva una sesión estratégica virtual de 15, 30 o 45 minutos con uno de nuestros consultores senior sin demoras
            ni correos de ida y vuelta.
          </p>
        </div>

        <div className="bg-white border border-brand-gray/10 rounded-3xl shadow-xl overflow-hidden min-h-[460px] flex flex-col md:flex-row">
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
                  <Clock aria-hidden="true" className="h-5 w-5 text-brand-gold shrink-0" />
                  <span>{agenda.duration} de duración</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-light text-white/90">
                  <Video aria-hidden="true" className="h-5 w-5 text-brand-gold shrink-0" />
                  <span>Videollamada de Google Meet / Teams</span>
                </div>
                {agenda.selectedDateLabel && (
                  <div className="flex items-center gap-3 text-sm font-semibold text-brand-gold">
                    <Calendar aria-hidden="true" className="h-5 w-5 text-brand-gold shrink-0" />
                    <span>
                      {agenda.selectedDateLabel}
                      {agenda.selectedTime && ` a las ${agenda.selectedTime} hrs`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-xs text-brand-gray/80 font-light mt-8 relative z-10">
              Estribor Consultores &copy; {new Date().getFullYear()}. Zona horaria: hora de Chile continental.
            </div>
          </div>

          <div className="md:w-3/5 p-8 sm:p-10 flex flex-col justify-center bg-white relative">
            <BookingWidget agenda={agenda} />
          </div>
        </div>
      </div>
    </section>
  );
}
