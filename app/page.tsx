"use client";

import { motion } from "framer-motion";
import Hero from "@/components/Hero";
import { ShieldCheck, Scale, Users2, Compass, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  const servicePreviews = [
    { title: "Seguridad y Salud", desc: "Sistemas de gestión preventiva y cumplimiento legal.", icon: ShieldCheck },
    { title: "Cumplimiento Normativo", desc: "Asesoría para cumplir con el marco laboral y ambiental.", icon: Scale },
    { title: "Asesorías Técnicas", desc: "Evaluaciones técnicas para optimizar tus operaciones.", icon: Compass },
    { title: "Gestión Organizacional", desc: "Clima laboral, liderazgo y diseño de procesos.", icon: Users2 }
  ];

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Services Preview Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-brand-electric text-xs font-bold tracking-widest uppercase block mb-3">
                Servicios Profesionales
              </span>
              <h2 className="text-3xl font-bold text-brand-navy tracking-tight">
                Soluciones Estratégicas e Integrales
              </h2>
            </div>
            <a
              href="/servicios"
              className="inline-flex items-center gap-2 text-brand-electric hover:text-brand-blue-med font-bold text-sm mt-4 md:mt-0 transition-colors"
            >
              Ver todos los servicios
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicePreviews.map((svc, idx) => {
              const Icon = svc.icon;
              return (
                <motion.div
                  key={svc.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-brand-bg/50 border border-brand-gray/10 p-6 rounded-xl hover:shadow-md transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-electric/10 flex items-center justify-center text-brand-electric mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-brand-navy mb-2">{svc.title}</h3>
                  <p className="text-xs text-brand-gray font-light leading-relaxed">{svc.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About / Misión summary Section */}
      <section className="py-16 bg-brand-bg relative border-t border-brand-gray/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-brand-electric text-xs font-bold tracking-widest uppercase block mb-3">
                Nuestro Compromiso
              </span>
              <h2 className="text-3xl font-bold text-brand-navy tracking-tight mb-6">
                Guiando a las Organizaciones con Rumbo Seguro
              </h2>
              <p className="text-sm sm:text-base text-brand-gray font-light leading-relaxed mb-6">
                En Estribor Consultores nos comprometemos a generar valor de largo plazo para nuestros clientes. Nuestra misión es promover ambientes de trabajo seguros, eficientes y conformes a toda la normativa técnica y legal de Chile.
              </p>
              <a
                href="/mision-vision"
                className="inline-flex items-center gap-2 bg-brand-navy hover:bg-brand-blue-med text-white px-5 py-2.5 rounded text-sm font-semibold transition-colors"
              >
                Ver Misión y Visión
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* Visual Box representing compass values */}
            <div className="lg:col-span-5 bg-white border border-brand-gray/10 p-8 rounded-2xl shadow-sm relative overflow-hidden">
              <h3 className="font-bold text-brand-navy mb-4">Pilares Estratégicos</h3>
              <ul className="space-y-3">
                {[
                  "Enfoque en Seguridad Ocupacional",
                  "Cumplimiento y Continuidad Operacional",
                  "Consultores con +10 Años de Experiencia",
                  "Presencia y Cobertura Nacional"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-xs text-brand-gray font-medium">
                    <CheckCircle2 className="h-4.5 w-4.5 text-brand-electric shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Portal Section */}
      <section className="py-16 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Graphic representing Multidisciplinary team */}
            <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
              <div className="relative w-64 h-64 border border-brand-gray/10 rounded-full flex items-center justify-center p-8 bg-brand-bg/30">
                <Users2 className="h-24 w-24 text-brand-blue-med animate-pulse" />
                <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-brand-electric/10 flex items-center justify-center text-brand-electric border border-brand-electric/25">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-brand-navy/10 flex items-center justify-center text-brand-navy border border-brand-navy/25">
                  <Scale className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Team summary text */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <span className="text-brand-electric text-xs font-bold tracking-widest uppercase block mb-3">
                Fuerza Técnica
              </span>
              <h2 className="text-3xl font-bold text-brand-navy tracking-tight mb-6">
                Respaldo de Consultores Senior
              </h2>
              <p className="text-sm sm:text-base text-brand-gray font-light leading-relaxed mb-6">
                Nuestro equipo está conformado por ingenieros, abogados y psicólogos con más de 10 y 15 años de trayectoria liderando asesorías técnicas, normativas y organizacionales. Trabajamos con una estructura unificada para garantizar que cada proyecto cuente con el máximo respaldo disciplinario.
              </p>
              <a
                href="/equipo"
                className="inline-flex items-center gap-2 text-brand-electric hover:text-brand-blue-med font-bold text-sm transition-colors"
              >
                Conoce las áreas de especialización
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final Portal Contact CTA Banner */}
      <section className="py-16 bg-brand-navy text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4 tracking-tight max-w-2xl mx-auto leading-tight">
            ¿Buscas Optimizar la Seguridad y Cumplimiento en tu Empresa?
          </h2>
          <p className="text-sm sm:text-base text-white/70 font-light mb-8 max-w-xl mx-auto">
            Hablemos sobre los desafíos regulatorios u operativos de tu negocio y diseñemos una solución a tu medida.
          </p>
          <a
            href="/contacto"
            className="inline-flex items-center justify-center bg-brand-electric hover:bg-brand-blue-med text-white px-8 py-4 rounded-md font-bold transition-all shadow-md transform hover:-translate-y-0.5 duration-200"
          >
            Comenzar Asesoría
          </a>
        </div>
      </section>
    </>
  );
}
