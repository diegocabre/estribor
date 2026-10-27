import { Anchor, BriefcaseBusiness, CircleCheck, Layers, Ruler, Users } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const REASONS = [
  { icon: BriefcaseBusiness, title: "Experiencia ejecutiva", description: "Liderazgo en gerencias de personas y HSE de la industria." },
  { icon: Ruler, title: "Trabajo a la medida", description: "Sin paquetes estándar: cada propuesta parte de tu realidad." },
  { icon: Layers, title: "Estrategia y operación", description: "Diseñamos el plan y lo bajamos a terreno." },
  { icon: Users, title: "Cercanía", description: "Un equipo pequeño que responde rápido y conoce tu caso." },
  { icon: Anchor, title: "Conocimiento de industria", description: "Acuicultura, energía, construcción e industria del sur." },
  { icon: CircleCheck, title: "Compromiso con resultados", description: "Indicadores acordados desde el inicio del proyecto." },
];

/** "¿Por qué Estribor?": bloque oscuro con el argumento a la izquierda y seis razones a la derecha. */
export default function PorQueEstribor() {
  return (
    <section id="por-que-estribor" className="bg-brand-navy py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-5">
          <span className="text-brand-gold text-xs font-bold tracking-widest uppercase block mb-3">¿Por qué Estribor?</span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-[-0.01em] mb-5">
            Un equipo comprometido con tus resultados, de principio a fin.
          </h2>
          <p className="text-base text-white/75 leading-relaxed max-w-md">
            Definimos objetivos claros desde el primer día y te acompañamos en cada etapa. Nos medimos por lo que cambia en tu
            empresa, no por los informes que entregamos.
          </p>
        </div>

        <Reveal as="div" from="translateY(16px)" className="lg:col-span-7">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
            {REASONS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-4">
                <Icon aria-hidden="true" className="h-5 w-5 text-brand-gold shrink-0 mt-0.5" />
                <div>
                  <dt className="font-titles font-bold text-white leading-snug">{title}</dt>
                  <dd className="mt-1 text-sm text-white/70 leading-relaxed">{description}</dd>
                </div>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
