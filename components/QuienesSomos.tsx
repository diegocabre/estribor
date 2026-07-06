"use client";

import { motion } from "framer-motion";
import { Users2, ShieldAlert, Leaf, ArrowRight } from "lucide-react";

export default function QuienesSomos() {
  const pillars = [
    {
      title: "Gestión de Personas",
      description: "Soluciones para el desarrollo, reclutamiento y liderazgo en equipos de alto rendimiento.",
      icon: Users2,
      color: "from-brand-blue-light/10 to-brand-blue-light/5 text-brand-blue-light border-brand-blue-light/25",
    },
    {
      title: "Seguridad y Salud en el Trabajo",
      description: "Diagnósticos, auditorías y sistemas de gestión para operaciones seguras y cumplimiento legal.",
      icon: ShieldAlert,
      color: "from-brand-gold/10 to-brand-gold/5 text-brand-gold border-brand-gold/25",
    },
    {
      title: "Sostenibilidad Organizacional",
      description: "Gestión de riesgos, reportes de sostenibilidad y estrategias con indicadores ESG.",
      icon: Leaf,
      color: "from-emerald-500/10 to-emerald-500/5 text-emerald-600 border-emerald-500/25",
    },
  ];

  return (
    <section id="quienes-somos" className="py-24 bg-white relative overflow-hidden border-b border-brand-gray/10">
      {/* Abstract decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-bg rounded-full blur-3xl pointer-events-none opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Text Column (5 cols) */}
          <div className="lg:col-span-5">
            <span className="text-brand-gold text-xs font-bold tracking-widest uppercase block mb-3 font-sans">
              Trayectoria y Cercanía
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy tracking-tight mb-6">
              ¿Quiénes Somos?
            </h2>
            <p className="text-base text-brand-gray-dark font-light leading-relaxed mb-6">
              <strong className="font-semibold text-brand-navy">Estribor Consultores</strong> es una consultora boutique especializada en tres grandes ejes de impacto organizacional: 
              <span className="block mt-2 font-medium text-brand-navy">• Gestión de Personas</span>
              <span className="block font-medium text-brand-navy">• Seguridad y Salud en el Trabajo</span>
              <span className="block font-medium text-brand-navy">• Sostenibilidad Organizacional.</span>
            </p>
            <p className="text-base text-brand-gray-dark font-light leading-relaxed mb-6">
              Acompañamos a empresas de la industria, producción y servicios con soluciones estratégicas adaptadas a su realidad.
            </p>
            <p className="text-base text-brand-gray-dark font-light leading-relaxed mb-8">
              Nuestro enfoque es cercano, práctico y estratégico. Combinamos experiencia ejecutiva con conocimiento profundo de las industrias productivas para entregar resultados concretos y sostenibles, construyendo relaciones de confianza duraderas con cada cliente.
            </p>
            <a
              href="#agenda"
              className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-gold/80 font-bold text-sm transition-colors group"
            >
              Agenda una asesoría con nosotros
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

          {/* Cards Column (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, duration: 0.5 }}
                  className={`bg-gradient-to-r ${pillar.color} p-6 sm:p-8 rounded-2xl border flex flex-col sm:flex-row items-start gap-5 shadow-sm hover:shadow-md transition-all duration-300`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2">{pillar.title}</h3>
                    <p className="text-sm text-brand-gray-dark font-light leading-relaxed">{pillar.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
