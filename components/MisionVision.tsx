"use client";

import { motion } from "framer-motion";
import { Compass, Eye } from "lucide-react";

export default function MisionVision() {
  return (
    <section
      id="mision-vision"
      className="py-20 bg-brand-bg relative overflow-hidden border-y border-brand-gray/5"
    >
      {/* Decorative compass lines in the background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] border border-brand-gray/5 rounded-full pointer-events-none select-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] border border-dashed border-brand-gray/5 rounded-full pointer-events-none select-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-electric text-xs font-bold tracking-widest uppercase block mb-3">
            Nuestro Propósito
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy tracking-tight">
            Misión y Visión
          </h2>
        </div>

        {/* Content columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch relative">
          {/* Vertical divider on desktop */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-brand-gray/20 -translate-x-1/2">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-bg p-2 rounded-full border border-brand-gray/20 text-brand-electric">
              <Compass className="h-6 w-6 animate-spin" style={{ animationDuration: "25s" }} />
            </div>
          </div>

          {/* Misión Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col bg-white p-8 sm:p-10 rounded-2xl shadow-sm hover:shadow-md border border-brand-gray/10 transition-all duration-300 relative group overflow-hidden"
          >
            {/* Side colored bar */}
            <div className="absolute top-0 left-0 w-2 h-full bg-brand-electric"></div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-brand-electric/10 flex items-center justify-center text-brand-electric group-hover:bg-brand-electric group-hover:text-white transition-colors duration-300">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-brand-navy tracking-wide">MISIÓN</h3>
            </div>

            <p className="text-brand-navy/90 text-sm sm:text-base leading-relaxed font-light mb-4">
              En <strong className="font-semibold text-brand-navy">Estribor Consultores</strong> brindamos soluciones integrales de gestión a empresas de diversos sectores, proporcionando servicios especializados en seguridad y salud en el trabajo, cumplimiento normativo, asesorías técnicas y gestión organizacional.
            </p>
            <p className="text-brand-navy/90 text-sm sm:text-base leading-relaxed font-light">
              Nos comprometemos a generar valor para nuestros clientes mediante un equipo multidisciplinario con amplia experiencia, promoviendo ambientes laborales seguros, eficientes y sostenibles que contribuyan al crecimiento y desarrollo de sus organizaciones.
            </p>
          </motion.div>

          {/* Visión Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col bg-white p-8 sm:p-10 rounded-2xl shadow-sm hover:shadow-md border border-brand-gray/10 transition-all duration-300 relative group overflow-hidden"
          >
            {/* Side colored bar */}
            <div className="absolute top-0 left-0 w-2 h-full bg-brand-blue-med"></div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-brand-blue-med/10 flex items-center justify-center text-brand-blue-med group-hover:bg-brand-blue-med group-hover:text-white transition-colors duration-300">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-brand-navy tracking-wide">VISIÓN</h3>
            </div>

            <p className="text-brand-navy/90 text-sm sm:text-base leading-relaxed font-light">
              Ser una empresa consultora líder y referente en soluciones integrales de gestión empresarial, reconocida por la excelencia de nuestros servicios, la calidad de nuestro equipo profesional y nuestra capacidad para contribuir al fortalecimiento, competitividad y sostenibilidad de las organizaciones, consolidando relaciones de confianza y resultados de alto impacto para nuestros clientes.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
