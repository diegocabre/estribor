"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Scale, Settings, Users, ArrowRight } from "lucide-react";

export default function Servicios() {
  const services = [
    {
      title: "Seguridad y Salud en el Trabajo",
      description: "Implementamos sistemas de gestión preventivos para evitar accidentes laborales y enfermedades profesionales, asegurando el cumplimiento de la ley y protegiendo el activo más valioso: tu equipo.",
      icon: ShieldAlert,
      iconColor: "text-brand-electric",
      iconBg: "bg-brand-electric/10",
      anim: {
        hover: { scale: 1.1, rotate: [0, -10, 10, -10, 10, 0] }
      }
    },
    {
      title: "Cumplimiento Normativo",
      description: "Asesoramos a tu empresa para cumplir a cabalidad con el marco regulatorio vigente, previniendo multas, paralizaciones e infracciones laborales o ambientales.",
      icon: Scale,
      iconColor: "text-brand-navy",
      iconBg: "bg-brand-navy/10",
      anim: {
        hover: { rotate: [0, -12, 12, -6, 6, 0] }
      }
    },
    {
      title: "Asesorías Técnicas",
      description: "Desarrollamos evaluaciones técnicas rigurosas y estudios especializados para optimizar procesos industriales, de construcción y operacionales.",
      icon: Settings,
      iconColor: "text-brand-blue-med",
      iconBg: "bg-brand-blue-med/10",
      anim: {
        hover: { rotate: 360 }
      }
    },
    {
      title: "Gestión Organizacional",
      description: "Mejoramos la eficiencia y el clima interno mediante la consultoría en estructura organizacional, liderazgo, y diseño de procesos eficaces.",
      icon: Users,
      iconColor: "text-brand-gray",
      iconBg: "bg-brand-gray/10",
      anim: {
        hover: { scale: [1, 1.15, 1, 1.1, 1] }
      }
    }
  ];

  return (
    <section id="servicios" className="py-20 bg-white relative overflow-hidden">
      {/* Background visual detail */}
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-brand-bg rounded-full blur-3xl opacity-60"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-brand-electric text-xs font-bold tracking-widest uppercase mb-3"
          >
            Servicios Profesionales
          </motion.h2>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-brand-navy tracking-tight mb-4"
          >
            Soluciones Integrales para Impulsar tu Organización
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-brand-gray font-light"
          >
            Acompañamos a empresas de diversos sectores en su camino al crecimiento y cumplimiento normativo, reduciendo riesgos operativos.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative bg-white border border-brand-gray/10 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-brand-electric/30 flex flex-col justify-between"
              >
                <div>
                  {/* Icon Container */}
                  <div className={`w-14 h-14 rounded-lg ${service.iconBg} flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-brand-electric`}>
                    <motion.div
                      whileHover={service.anim.hover}
                      transition={{ type: "spring", stiffness: 150, damping: 10 }}
                      className={`${service.iconColor} group-hover:text-white transition-colors duration-300`}
                    >
                      <Icon className="h-7 w-7" />
                    </motion.div>
                  </div>

                  {/* Title */}
                  <h4 className="text-xl font-bold text-brand-navy mb-3 group-hover:text-brand-electric transition-colors duration-300">
                    {service.title}
                  </h4>

                  {/* Description */}
                  <p className="text-sm text-brand-gray font-light leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                {/* Learn More link */}
                <a
                  href="#contacto"
                  className="inline-flex items-center gap-2 text-xs font-bold text-brand-electric hover:text-brand-blue-med transition-colors duration-200 mt-auto pt-2"
                >
                  Saber más
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
