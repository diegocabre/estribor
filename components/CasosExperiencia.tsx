import Reveal from "@/components/ui/Reveal";
import { Briefcase, ShieldAlert, Award, FileSpreadsheet } from "lucide-react";

export default function CasosExperiencia() {
  const cases = [
    {
      title: "Hunting ejecutivo y reclutamiento",
      sector: "Sector acuícola / industrial",
      challenge: "Búsqueda crítica de Gerente de Operaciones con experiencia técnica en terreno.",
      solution: "Búsqueda directa de directivos del rubro productivo, evaluando experiencia técnica en terreno y ajuste con la cultura de la empresa.",
      icon: Briefcase,
    },
    {
      title: "Implementación de la Ley Karin y liderazgo",
      sector: "Sector servicios y alimentos",
      challenge: "Adecuación obligatoria de procesos internos, protocolos de acoso y canal de denuncias.",
      solution: "Auditoría del RIOHS, diseño de políticas de prevención y capacitación en liderazgo preventivo a jefaturas.",
      icon: ShieldAlert,
    },
    {
      title: "Auditoría e implementación de SST",
      sector: "Sector construcción y producción",
      challenge: "Alta tasa de accidentabilidad y observaciones de fiscalizaciones normativas.",
      solution: "Diagnóstico, rediseño de matrices IPER, capacitación en terreno e implementación de un sistema de gestión preventivo.",
      icon: Award,
    },
    {
      title: "Estrategia ESG y reportes de sostenibilidad",
      sector: "Sector energía e industria",
      challenge: "Presión de inversionistas y clientes por reportar impacto socio-ambiental y huella hídrica.",
      solution: "Análisis de materialidad con stakeholders clave, medición de huella de carbono, y diseño de reportes anuales bajo lineamientos GRI.",
      icon: FileSpreadsheet,
    },
  ];

  return (
    <section id="casos" className="py-24 bg-white relative overflow-hidden border-t border-brand-gray/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="max-w-2xl">
            <span className="text-brand-gold-dark text-xs font-bold tracking-widest uppercase block mb-3 font-sans">
              Experiencia del equipo
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy tracking-tight mb-4">
              Casos de experiencia
            </h2>
            <p className="text-base text-brand-gray-dark leading-relaxed">
              Trabajos que integrantes de nuestro equipo realizaron antes de formar Estribor. Por confidencialidad no nombramos a las empresas.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <a
              href="#agenda"
              className="inline-flex items-center justify-center bg-brand-navy hover:bg-brand-blue-med text-white text-sm font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm"
            >
              Agendar reunión
            </a>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cases.map((project, idx) => {
            const Icon = project.icon;
            return (
              <Reveal
                key={project.title}
                from="translateY(0px)"
                delay={idx * 0.1}
                className="bg-brand-bg/50 border border-brand-gray/15 p-8 rounded-2xl flex flex-col justify-between hover:shadow-lg hover:bg-white hover:border-brand-gold/30 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-bold text-brand-gold-dark bg-brand-gold/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {project.sector}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-brand-navy/5 text-brand-navy flex items-center justify-center group-hover:bg-brand-gold group-hover:text-brand-navy transition-all duration-300">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-brand-navy mb-4 group-hover:text-brand-gold-dark transition-colors duration-300">
                    {project.title}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-1">El desafío</h4>
                      <p className="text-sm text-brand-gray-dark leading-relaxed">{project.challenge}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-1">La solución</h4>
                      <p className="text-sm text-brand-gray-dark leading-relaxed">{project.solution}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
