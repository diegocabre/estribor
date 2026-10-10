import Reveal from "@/components/ui/Reveal";
import { ArrowRight } from "lucide-react";

interface Case {
  title: string;
  sector: string;
  challenge: string;
  solution: string;
}

// Trabajos reales del equipo antes de formar Estribor (ver PRODUCT.md). Sin cifras: no hay respaldo publicable.
const FEATURED: Case = {
  title: "Implementación de la Ley Karin y liderazgo",
  sector: "Sector servicios y alimentos",
  challenge: "Adecuación obligatoria de procesos internos, protocolos de acoso y canal de denuncias.",
  solution: "Auditoría del RIOHS, diseño de políticas de prevención y capacitación en liderazgo preventivo a jefaturas.",
};

const OTHERS: Case[] = [
  {
    title: "Hunting ejecutivo y reclutamiento",
    sector: "Sector acuícola / industrial",
    challenge: "Búsqueda crítica de Gerente de Operaciones con experiencia técnica en terreno.",
    solution: "Búsqueda directa de directivos del rubro productivo, evaluando experiencia técnica en terreno y ajuste con la cultura de la empresa.",
  },
  {
    title: "Auditoría e implementación de SST",
    sector: "Sector construcción y producción",
    challenge: "Alta tasa de accidentabilidad y observaciones de fiscalizaciones normativas.",
    solution: "Diagnóstico, rediseño de matrices IPER, capacitación en terreno e implementación de un sistema de gestión preventivo.",
  },
  {
    title: "Estrategia ESG y reportes de sostenibilidad",
    sector: "Sector energía e industria",
    challenge: "Presión de inversionistas y clientes por reportar impacto socio-ambiental y huella hídrica.",
    solution: "Análisis de materialidad con stakeholders clave, medición de huella de carbono, y diseño de reportes anuales bajo lineamientos GRI.",
  },
];

function Detail({ label, text, tone }: { label: string; text: string; tone: "light" | "dark" }) {
  return (
    <div>
      <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 ${tone === "dark" ? "text-brand-gold" : "text-brand-navy"}`}>
        {label}
      </h4>
      <p className={`text-sm leading-relaxed ${tone === "dark" ? "text-white/80" : "text-brand-gray-dark"}`}>{text}</p>
    </div>
  );
}

/** Casos: un trabajo destacado en grande y los demás como columnas de texto. */
export default function CasosExperiencia() {
  return (
    <section id="casos" className="bg-white py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10 md:mb-14">
          <span className="text-brand-gold-dark text-xs font-bold tracking-widest uppercase block mb-3">
            Experiencia del equipo
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy tracking-tight mb-4">Casos de experiencia</h2>
          <p className="text-base text-brand-gray-dark leading-relaxed">
            Trabajos que integrantes de nuestro equipo realizaron antes de formar Estribor. Por confidencialidad no nombramos a las empresas.
          </p>
        </div>

        {/* Caso destacado: el título es el protagonista. */}
        <Reveal
          as="article"
          from="translateY(20px)"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 rounded-3xl bg-brand-navy p-7 sm:p-10 lg:p-14"
        >
          <div className="lg:col-span-7">
            <p className="text-sm font-semibold text-white/70 mb-4">{FEATURED.sector}</p>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1]">
              {FEATURED.title}
            </h3>
          </div>
          <div className="lg:col-span-5 flex flex-col justify-end gap-6">
            <Detail label="El desafío" text={FEATURED.challenge} tone="dark" />
            <Detail label="La solución" text={FEATURED.solution} tone="dark" />
          </div>
        </Reveal>

        {/* Resto de los casos: columnas de texto separadas por una línea superior. */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {OTHERS.map((item) => (
            <article key={item.title} className="border-t border-brand-gray/40 pt-6">
              <p className="text-sm font-semibold text-brand-gold-dark mb-2">{item.sector}</p>
              <h3 className="font-titles text-xl font-bold text-brand-navy mb-4 leading-snug">{item.title}</h3>
              <div className="space-y-4">
                <Detail label="El desafío" text={item.challenge} tone="light" />
                <Detail label="La solución" text={item.solution} tone="light" />
              </div>
            </article>
          ))}
        </div>

        <a
          href="#agenda"
          className="mt-12 md:mt-16 inline-flex items-center gap-2 bg-brand-navy hover:bg-brand-blue-med text-white text-sm font-semibold py-3 px-6 rounded-xl transition-colors"
        >
          Agendar reunión
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
