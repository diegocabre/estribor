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
  loading: () => <div className="min-h-[243px]" aria-busy="true" aria-label="Cargando calendario" />,
});

function ModalityHeader({
  icon,
  title,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  tone: "electric" | "gold";
}) {
  const iconClass = tone === "electric" ? "bg-brand-electric/10 text-brand-electric" : "bg-brand-gold/15 text-brand-gold";
  return (
    <div className="flex items-center gap-3 mb-6 pb-5 border-b border-brand-gray/10">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconClass}`}>{icon}</div>
      <h3 className="text-xl font-bold text-brand-navy font-titles">{title}</h3>
    </div>
  );
}

const cardClass =
  "lg:col-span-6 bg-white border border-brand-gray/20 rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-between";

/** Sección "Agenda una reunión o escríbenos": formulario (izquierda) y agenda virtual (derecha). */
export default function Contacto({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  // En /contacto esta sección es el contenido principal y su título debe ser el h1 de la página.
  const Heading = headingLevel;
  const agenda = useAgenda();

  return (
    <section id="contacto" className="py-16 md:py-24 bg-brand-bg relative overflow-hidden scroll-mt-20">
      <div id="agenda" className="absolute -top-24 left-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <Heading className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-brand-navy tracking-[-0.01em] mb-6">Agenda una reunión o escríbenos</Heading>

          <p className="text-base sm:text-lg text-brand-gray-dark leading-relaxed">
            Elige la modalidad que prefieras: déjanos un mensaje a través del formulario o agenda una reunión virtual en
            nuestro calendario.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className={cardClass}>
            <div>
              <ModalityHeader
                icon={<MessageSquare aria-hidden="true" className="h-6 w-6" />}
                title="Enviar mensaje directo"
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
                title="Agendar reunión virtual"
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
