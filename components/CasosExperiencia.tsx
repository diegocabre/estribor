"use client";

import { motion } from "framer-motion";
import { Briefcase, ShieldAlert, Award, FileSpreadsheet } from "lucide-react";

export default function CasosExperiencia() {
  const cases = [
    {
      title: "Hunting Ejecutivo & Reclutamiento",
      sector: "Sector Acuícola / Industrial",
      challenge: "Búsqueda crítica de Gerente de Operaciones con experiencia técnica en terreno.",
      solution: "Hunting consultivo enfocado en directivos del rubro productivo. Selección exitosa en un plazo menor a 40 días, asegurando fit cultural.",
      icon: Briefcase,
    },
    {
      title: "Implementación Ley Karin & Liderazgo",
      sector: "Sector Servicios & Alimentos",
      challenge: "Adecuación obligatoria de procesos internos, protocolos de acoso y canal de denuncias.",
      solution: "Auditoría de RIOHS, diseño de políticas de prevención, y capacitación en liderazgo preventivo a jefaturas con más de 250 colaboradores entrenados.",
      icon: ShieldAlert,
    },
    {
      title: "Auditoría e Implementación de SST",
      sector: "Sector Construcción & Producción",
      challenge: "Alta tasa de accidentabilidad y observaciones de fiscalizaciones normativas.",
      solution: "Diagnóstico profundo, rediseño de matrices IPER, capacitación en terreno e implantación de sistema de gestión preventivo. Tasa de accidentabilidad disminuida en un 42%.",
      icon: Award,
    },
    {
      title: "Estrategia ESG y Reportes Sostenibles",
      sector: "Sector Energía & Industria",
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
            <span className="text-brand-gold text-xs font-bold tracking-widest uppercase block mb-3 font-sans">
              Trayectoria de Impacto
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy tracking-tight mb-4">
              Casos de Experiencia
            </h2>
            <p className="text-base text-brand-gray-dark font-light leading-relaxed">
              Por confidencialidad corporativa y respeto a nuestros clientes, presentamos resúmenes de proyectos representativos que reflejan nuestras metodologías en el terreno.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <a
              href="#agenda"
              className="inline-flex items-center justify-center bg-brand-navy hover:bg-brand-blue-med text-white text-sm font-semibold py-3 px-6 rounded-xl transition-colors shadow-sm"
            >
              Solicitar Referencias
            </a>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cases.map((project, idx) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="bg-brand-bg/50 border border-brand-gray/15 p-8 rounded-2xl flex flex-col justify-between hover:shadow-lg hover:bg-white hover:border-brand-gold/30 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-bold text-brand-gold bg-brand-gold/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {project.sector}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-brand-navy/5 text-brand-navy flex items-center justify-center group-hover:bg-brand-gold group-hover:text-brand-navy transition-all duration-300">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-brand-navy mb-4 group-hover:text-brand-gold transition-colors duration-300">
                    {project.title}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-1">El Desafío:</h4>
                      <p className="text-sm text-brand-gray-dark font-light leading-relaxed">{project.challenge}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-1">La Solución:</h4>
                      <p className="text-sm text-brand-gray-dark font-light leading-relaxed">{project.solution}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
