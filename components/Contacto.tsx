"use client";

import { CalendarDays, MessageSquare } from "lucide-react";
import dynamic from "next/dynamic";
import ContactForm from "@/components/contacto/ContactForm";
import ContactInfo from "@/components/contacto/ContactInfo";
import { useAgenda } from "@/lib/hooks/useAgenda";

// El calendario depende del reloj del navegador: se carga en el cliente, después del contenido
// principal. El marcador reserva su altura para no provocar saltos de diseño (CLS).
const BookingWidget = dynamic(() => import("@/components/agenda/BookingWidget"), {
  ssr: false,
  loading: () => <div className="min-h-[372px]" aria-busy="true" aria-label="Cargando calendario" />,
});

function ModalityHeader({
  icon,
  label,
  title,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  tone: "electric" | "gold";
}) {
  const iconClass = tone === "electric" ? "bg-brand-electric/10 text-brand-electric" : "bg-brand-gold/15 text-brand-gold";
  const labelClass = tone === "electric" ? "text-brand-electric" : "text-brand-gold-dark";
  return (
    <div className="flex items-center gap-3 mb-6 pb-5 border-b border-brand-gray/10">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconClass}`}>{icon}</div>
      <div>
        <span className={`text-[11px] font-bold uppercase tracking-wider block ${labelClass}`}>{label}</span>
        <h3 className="text-xl font-bold text-brand-navy font-titles">{title}</h3>
      </div>
    </div>
  );
}

const cardClass =
  "lg:col-span-6 bg-white border border-brand-gray/20 rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-between";

/** Sección "¿Quieres contactarnos?": formulario (izquierda) y agenda virtual (derecha). */
export default function Contacto() {
  const agenda = useAgenda();

  return (
    <section id="contacto" className="py-20 md:py-28 bg-brand-bg relative overflow-hidden scroll-mt-20">
      <div id="agenda" className="absolute -top-24 left-0"></div>

      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-electric/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="bg-brand-gold/15 text-brand-navy text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-brand-gold/30">
              Canal de Comunicación Directo
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-brand-navy tracking-tight mb-6">¿Quieres contactarnos?</h2>

          <p className="text-base sm:text-lg text-brand-gray-dark font-light leading-relaxed">
            Elige la modalidad que prefieras: déjanos un mensaje a través del formulario o agenda una sesión virtual directa en
            nuestro calendario.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className={cardClass}>
            <div>
              <ModalityHeader
                icon={<MessageSquare aria-hidden="true" className="h-6 w-6" />}
                label="Modalidad 1"
                title="Enviar Mensaje Directo"
                tone="electric"
              />
              <ContactInfo />
              <ContactForm />
            </div>
          </div>

          <div className={cardClass}>
            <div>
              <ModalityHeader
                icon={<CalendarDays aria-hidden="true" className="h-6 w-6" />}
                label="Modalidad 2"
                title="Agendar Asesoría Virtual"
                tone="gold"
              />
              <BookingWidget agenda={agenda} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
