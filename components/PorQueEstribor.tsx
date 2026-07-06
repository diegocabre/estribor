"use client";

import { motion } from "framer-motion";
import { Award, Sliders, Target, Heart, Factory, CheckCircle2 } from "lucide-react";

export default function PorQueEstribor() {
  const pillars = [
    {
      title: "Experiencia ejecutiva",
      description: "Consultores que han liderado operaciones reales y entienden los desafíos desde tu posición.",
      icon: Award,
    },
    {
      title: "Soluciones personalizadas",
      description: "Diseños y metodologías a la medida de tu realidad, huyendo de plantillas genéricas.",
      icon: Sliders,
    },
    {
      title: "Enfoque estratégico y operativo",
      description: "Conectamos la visión de largo plazo con la ejecución diaria en faena y oficina.",
      icon: Target,
    },
    {
      title: "Cercanía con los clientes",
      description: "Relaciones horizontales y de confianza a largo plazo, caminando codo a codo contigo.",
      icon: Heart,
    },
    {
      title: "Conocimiento desde el interior de industrias",
      description: "Sabemos cómo operan las industrias productivas y de servicios desde adentro.",
      icon: Factory,
    },
    {
      title: "Compromiso con resultados",
      description: "Nuestras soluciones persiguen un impacto real en seguridad, eficiencia y sostenibilidad.",
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="por-que-estribor" className="py-24 bg-brand-bg relative overflow-hidden">
      {/* Decorative details */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-gold text-xs font-bold tracking-widest uppercase block mb-3 font-sans">
            Nuestros Diferenciadores
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy tracking-tight mb-4">
            ¿Por qué Estribor?
          </h2>
          <p className="text-base text-brand-gray-dark font-light leading-relaxed">
            Combinamos una visión de excelencia con práctica en el terreno para entregar un servicio que realmente transforma tu operación.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                className="bg-white border border-brand-gray/10 p-8 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-gold/30 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-brand-navy/5 text-brand-navy flex items-center justify-center mb-6 group-hover:bg-brand-gold group-hover:text-brand-navy transition-all duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-navy mb-3 group-hover:text-brand-gold transition-colors duration-300">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-brand-gray-dark font-light leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
