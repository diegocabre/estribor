"use client";

import { motion } from "framer-motion";
import { Users2, ShieldCheck, Leaf, Check } from "lucide-react";

export default function Servicios() {
  const axes = [
    {
      title: "Gestión de Personas",
      description: "Alineamos el talento humano con los objetivos del negocio a través de metodologías ágiles y de probada efectividad.",
      icon: Users2,
      color: "border-brand-blue-light/20 hover:border-brand-blue-light/50",
      iconColor: "text-brand-blue-light bg-brand-blue-light/10",
      list: [
        "Reclutamiento y Selección",
        "Outsourcing",
        "Hunting Ejecutivo",
        "Desarrollo Organizacional",
        "Evaluaciones | Assessment",
        "Capacitación",
        "Cultura y Comunicaciones",
        "Liderazgo",
      ],
    },
    {
      title: "Seguridad y Salud en el Trabajo",
      description: "Construimos culturas preventivas y sistemas de gestión de excelencia para mitigar riesgos operacionales.",
      icon: ShieldCheck,
      color: "border-brand-gold/20 hover:border-brand-gold/50",
      iconColor: "text-brand-gold bg-brand-gold/10",
      list: [
        "Diagnósticos y Línea Base",
        "Auditorías de Cumplimiento",
        "Diseño e Implementación de Sistemas de Gestión",
        "Cumplimiento Normativo (DS44, IRL, RIOHS, Ley Karin)",
        "Cultura Preventiva",
        "Capacitación en Seguridad Ocupacional",
      ],
    },
    {
      title: "Sostenibilidad Organizacional",
      description: "Integramos la sostenibilidad y la gobernanza en el ADN corporativo para la viabilidad de largo plazo.",
      icon: Leaf,
      color: "border-emerald-500/20 hover:border-emerald-500/50",
      iconColor: "text-emerald-600 bg-emerald-500/10",
      list: [
        "Análisis de Materialidad",
        "Gestión de Riesgos Ambientales y Sociales",
        "Cumplimiento Regulatorio y Reportabilidad",
        "Reportes de Sostenibilidad (GRI y otros estándares)",
        "Sostenibilidad y Gestión Organizacional",
        "Diseño de Estrategias e Indicadores ESG",
        "Medición de Huella Hídrica y de Carbono",
      ],
    },
  ];

  return (
    <section id="servicios-home" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative bg gradient */}
      <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-brand-bg rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-gold text-xs font-bold tracking-widest uppercase block mb-3 font-sans">
            Áreas de Especialización
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy tracking-tight mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-base text-brand-gray-dark font-light leading-relaxed">
            Brindamos soluciones integrales y adaptadas a los desafíos de industrias productivas, extractivas y de servicios.
          </p>
        </div>

        {/* Services Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {axes.map((axis, index) => {
            const Icon = axis.icon;
            return (
              <motion.div
                key={axis.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white border rounded-2xl p-8 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-300 ${axis.color}`}
              >
                <div>
                  {/* Header info */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${axis.iconColor}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-navy leading-tight">{axis.title}</h3>
                  </div>

                  <p className="text-sm text-brand-gray-dark font-light leading-relaxed mb-6">
                    {axis.description}
                  </p>

                  <hr className="border-brand-gray/10 my-4" />

                  {/* Specific items list */}
                  <ul className="space-y-3">
                    {axis.list.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-brand-navy">
                        <span className="w-5 h-5 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        <span className="font-light leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact trigger link */}
                <div className="mt-8 pt-6 border-t border-brand-gray/5">
                  <a
                    href="#agenda"
                    className="inline-flex items-center justify-center w-full bg-brand-navy hover:bg-brand-blue-med text-white text-sm font-semibold py-3 px-4 rounded-xl transition-colors shadow-sm"
                  >
                    Solicitar Propuesta
                  </a>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
