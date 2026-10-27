import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { SERVICE_AREAS } from "@/lib/content/services";

// Resumen de cada área para el Inicio; el detalle completo está en /servicios.
const SUMMARIES: Record<(typeof SERVICE_AREAS)[number]["id"], { description: string; bullets: string[]; linkLabel: string }> = {
  personas: {
    description: "Encontramos, evaluamos y desarrollamos al talento que tu operación necesita.",
    bullets: ["Reclutamiento y hunting ejecutivo", "Outsourcing de procesos de personas", "Desarrollo organizacional y cultura"],
    linkLabel: "Ver servicios de personas",
  },
  seguridad: {
    description: "Te ayudamos a cumplir el DS 44 y la Ley Karin, y a instalar una cultura preventiva real.",
    bullets: ["Diagnóstico, auditoría y línea base", "Sistemas de gestión DS 44, IRL y RIOHS", "Implementación de la Ley Karin"],
    linkLabel: "Ver servicios de SST",
  },
  sostenibilidad: {
    description: "Medimos, gestionamos y reportamos tu desempeño ESG con estándares GRI.",
    bullets: ["Estrategia e indicadores ESG", "Reportes de sostenibilidad GRI", "Huella hídrica y de carbono"],
    linkLabel: "Ver servicios de sostenibilidad",
  },
  comunicaciones: {
    description: "Ordenamos lo que tu empresa comunica hacia dentro y hacia fuera, y acompañamos sus cambios.",
    bullets: ["Estrategia de comunicación", "Comunicación interna y cultura", "Gestión del cambio y reputación"],
    linkLabel: "Ver servicios de comunicaciones",
  },
};

/** "Qué hacemos": una tarjeta por área, con la misma altura y el enlace siempre abajo. */
export default function QueHacemos() {
  return (
    <section id="que-hacemos" className="bg-brand-bg pt-16 pb-20 md:pt-20 md:pb-28 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10 md:mb-12">
          <span className="text-brand-gold-dark text-xs font-bold tracking-widest uppercase block mb-3">Qué hacemos</span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-brand-navy tracking-[-0.01em]">
            Cuatro áreas, un mismo rumbo: tu operación funcionando bien
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICE_AREAS.map((area, index) => {
            const summary = SUMMARIES[area.id];
            return (
              <Reveal
                key={area.id}
                as="article"
                from="translateY(16px)"
                delay={index * 0.08}
                className="flex flex-col bg-white rounded-xl overflow-hidden border border-brand-gray/20 shadow-sm"
              >
                <div className="relative aspect-[3/2] bg-brand-gray/20">
                  <Image
                    src={area.image}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 300px, (min-width: 1024px) 23vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col flex-1 p-6">
                  <h3 className="font-titles text-lg font-bold text-brand-navy leading-snug mb-2">{area.title}</h3>
                  <p className="text-sm text-brand-gray-dark leading-relaxed mb-4">{summary.description}</p>
                  <ul className="space-y-1.5 text-sm text-brand-navy mb-6">
                    {summary.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2">
                        <span aria-hidden="true" className="mt-2 h-1 w-1 rounded-full bg-brand-gold-dark shrink-0"></span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/servicios#${area.id}`}
                    className="mt-auto text-sm font-semibold text-brand-gold-dark hover:text-brand-navy transition-colors"
                  >
                    {summary.linkLabel} <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
