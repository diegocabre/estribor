"use client";

import { motion } from "framer-motion";
import { Anchor, Shield, Zap, HardHat, Soup, Briefcase } from "lucide-react";

export default function Sectores() {
  const sectors = [
    { name: "Acuicultura", icon: Anchor, desc: "Asesorías en terreno para centros de cultivo, plantas de proceso y logística marítima." },
    { name: "Industria", icon: Shield, desc: "Evaluación y optimización de procesos productivos y cumplimiento normativo DS44." },
    { name: "Energía", icon: Zap, desc: "Sistemas de gestión, auditorías operativas e indicadores ESG para el sector energético." },
    { name: "Construcción", icon: HardHat, desc: "Supervisión técnica de seguridad y salud (SST) en obras civiles y edificación." },
    { name: "Alimentos", icon: Soup, desc: "Aseguramiento del cumplimiento regulatorio y optimización de procesos en manufactura." },
    { name: "Servicios", icon: Briefcase, desc: "Outsourcing, clima organizacional y hunting ejecutivo para empresas del sector terciario." },
  ];

  return (
    <section id="sectores" className="py-24 bg-brand-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-gold text-xs font-bold tracking-widest uppercase block mb-3 font-sans">
            Presencia Multisectorial
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy tracking-tight mb-4">
            Sectores Donde Trabajamos
          </h2>
          <p className="text-base text-brand-gray-dark font-light leading-relaxed">
            Nuestros consultores cuentan con experiencia ejecutiva directa en las industrias clave del país, permitiendo una entrega de soluciones contextualizadas.
          </p>
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectors.map((sector, idx) => {
            const Icon = sector.icon;
            return (
              <motion.div
                key={sector.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className="bg-white p-6 rounded-2xl border border-brand-gray/10 shadow-sm hover:shadow-md hover:border-brand-blue-light/30 transition-all duration-300 group flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-navy/5 text-brand-navy flex items-center justify-center shrink-0 group-hover:bg-brand-blue-light group-hover:text-white transition-all duration-300">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-navy group-hover:text-brand-blue-light transition-colors mb-1">
                    {sector.name}
                  </h3>
                  <p className="text-xs text-brand-gray-dark font-light leading-relaxed">
                    {sector.desc}
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
