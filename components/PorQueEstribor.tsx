import Reveal from "@/components/ui/Reveal";

const REASONS = [
  {
    title: "Experiencia ejecutiva",
    description: "Consultores que han liderado operaciones reales y entienden los desafíos desde tu posición.",
  },
  {
    title: "Trabajo a la medida",
    description: "Diagnosticamos tu operación antes de proponer, y adaptamos protocolos y procesos a tu realidad.",
  },
  {
    title: "Enfoque estratégico y operativo",
    description: "Conectamos la visión de largo plazo con la ejecución diaria en faena y oficina.",
  },
  {
    title: "Cercanía con los clientes",
    description: "Relaciones horizontales y de confianza a largo plazo, caminando codo a codo contigo.",
  },
  {
    title: "Conocimiento desde el interior de industrias",
    description: "Sabemos cómo operan las industrias productivas y de servicios desde adentro.",
  },
  {
    title: "Compromiso con resultados",
    description: "Nuestras soluciones persiguen un impacto real en seguridad, eficiencia y sostenibilidad.",
  },
];

/** "¿Por qué Estribor?": título a la izquierda y razones como lista de texto, sin tarjetas. */
export default function PorQueEstribor() {
  return (
    <section id="por-que-estribor" className="bg-brand-bg pt-16 pb-12 md:pt-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy tracking-tight mb-4">¿Por qué Estribor?</h2>
          <p className="text-base text-brand-gray-dark leading-relaxed max-w-md">
            Un equipo pequeño que conoce la faena y la normativa, y que trabaja contigo de principio a fin.
          </p>
        </div>

        <Reveal as="div" from="translateY(16px)" className="lg:col-span-8">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-7 sm:gap-y-10">
            {REASONS.map((reason) => (
              <div key={reason.title}>
                <dt className="font-titles text-lg font-bold text-brand-navy leading-snug">{reason.title}</dt>
                <dd className="mt-1.5 text-sm sm:text-base text-brand-gray-dark leading-relaxed">{reason.description}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
