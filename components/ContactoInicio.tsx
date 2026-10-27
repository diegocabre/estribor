import { ArrowRight } from "lucide-react";
import ContactForm from "@/components/contacto/ContactForm";
import { legalConfig } from "@/lib/legalConfig";

/** Cierre del Inicio: invitación a conversar y formulario. El calendario de reuniones vive en /contacto#agenda. */
export default function ContactoInicio() {
  return (
    <section id="contacto" className="bg-brand-navy py-16 md:py-24 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-5">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-[-0.01em] mb-5">
            ¿Tienes un desafío organizacional, una vacante crítica o un reporte ESG en camino?
          </h2>
          <p className="text-base text-white/75 leading-relaxed mb-8 max-w-md">
            Conversemos 30 minutos, sin costo. Te decimos con franqueza si podemos ayudarte y cómo.
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 whitespace-nowrap">
            <a
              href="/contacto#agenda"
              className="inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-navy px-6 py-3 rounded-md font-bold transition-colors"
            >
              Agendar reunión virtual
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
            <a
              href={legalConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-white/70 hover:bg-white hover:text-brand-navy text-white px-6 py-3 rounded-md font-semibold transition-colors"
            >
              Escribir por WhatsApp
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-xl">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
