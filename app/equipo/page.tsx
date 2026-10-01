"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Scale, Users2, Award } from "lucide-react";

export default function EquipoPage() {
  const pillars = [
    {
      title: "Prevención de Riesgos e Ingeniería",
      subtitle: "Seguridad y Salud en el Trabajo",
      description: "Nuestros consultores son ingenieros especialistas con más de 10 y 15 años de trayectoria implementando sistemas de gestión preventiva de riesgos y protocolos de salud ocupacional en minería, industria pesada y construcción.",
      icon: ShieldCheck,
      color: "border-brand-electric text-brand-electric bg-brand-electric/5",
    },
    {
      title: "Asesoría Legal y Regulatoria",
      subtitle: "Cumplimiento Normativo",
      description: "Contamos con un equipo legal enfocado en auditorías regulatorias, cumplimiento normativo laboral y ambiental, y defensa técnica corporativa frente a infracciones.",
      icon: Scale,
      color: "border-brand-blue-med text-brand-blue-med bg-brand-blue-med/5",
    },
    {
      title: "Gestión y Clima Organizacional",
      subtitle: "Desarrollo de Procesos y Cambio",
      description: "Psicólogos organizacionales y expertos en administración asesoran a las gerencias en el diseño de estructuras eficaces, liderazgo directivo y fortalecimiento del clima interno.",
      icon: Users2,
      color: "border-brand-gray text-brand-gray bg-brand-gray/5",
    },
  ];

  const team = [
    {
      name: "Camila Alvear",
      role: "Directora Ejecutiva",
      bio: "Con más de 10 años de experiencia en industrias productivas, Camila ha liderado estrategias y cambios organizacionales impactando directamente en los objetivos del negocio. Desde la Gestión de Personas, Comunicaciones Corporativas, Compliance y Sostenibilidad.",
      photo: "/images/team/camilaalvear.jpeg",
    },
    {
      name: "Dayana González",
      role: "Consultora Atracción de Talento",
      bio: "Psicóloga Organizacional y Diplomada en Gestión de Recursos Humanos, con experiencia en procesos de Atracción y Selección de talento.",
      photo: "/images/team/dayanagonzalez.jpeg",
    },
    {
      name: "Fernanda Núñez",
      role: "Consultora Senior Comunicaciones Corporativas, Gestión del Cambio y Cultura",
      bio: "Periodista Corporativa, especialista en cultura, comunicaciones y transformación organizacional, con más de 10 años de experiencia acompañando procesos de cambio e integración así como gestión de crisis, sostenibilidad y procesos de reportabilidad.",
      photo: "/images/team/fernandanunez.jpeg",
    },
  ];

  const highlights = [
    "Profesionales seniors con postgrados y certificaciones vigentes.",
    "Amplia experiencia en auditorías de sistemas ISO 45001 e ISO 14001.",
    "Presencia local y cobertura técnica a lo largo de todo Chile.",
    "Capacidad de integración multidisciplinaria para abordar problemáticas complejas.",
  ];

  return (
    <div className="pt-24 pb-16 bg-white overflow-hidden min-h-screen relative">
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#7D7E80/5_1px,transparent_1px),linear-gradient(to_bottom,#7D7E80/5_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-electric text-xs font-bold tracking-widest uppercase block mb-3">
            Nuestros Profesionales
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-brand-navy tracking-tight mb-6">
            Equipo Multidisciplinario
          </h1>
          <p className="text-base sm:text-lg text-brand-gray font-light leading-relaxed">
            En <strong className="font-semibold text-brand-navy">Estribor Consultores</strong> no dependemos de individualidades, sino de la fuerza colectiva de nuestra red de consultores seniors con una sólida base técnica y legal.
          </p>
        </div>

        {/* Leadership Team */}
        <section className="relative mb-16 rounded-3xl bg-brand-navy px-6 py-12 sm:px-10 sm:py-16 shadow-xl overflow-hidden">
          {/* Corner frame accent */}
          <div className="absolute top-6 right-6 h-16 w-24 border-t border-r border-brand-gold/40 pointer-events-none" />
          <div className="absolute bottom-6 left-6 h-16 w-24 border-b border-l border-brand-gold/20 pointer-events-none" />

          <div className="relative z-10 mb-12 max-w-2xl">
            <span className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-brand-gold">
              <span className="h-px w-8 bg-brand-gold" />
              Liderazgo
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
              Nuestro Equipo
            </h2>
          </div>

          <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {team.map((member, idx) => (
              <motion.article
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/40 hover:shadow-2xl hover:shadow-black/30"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={member.photo}
                    alt={`${member.name}, ${member.role}`}
                    fill
                    sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="text-2xl font-bold text-brand-gold">{member.name}</h3>
                    <p className="mt-1 text-sm font-medium leading-snug text-white">{member.role}</p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6 pt-5">
                  <span className="mb-4 h-px w-12 bg-brand-gold/60 transition-all duration-300 group-hover:w-20" />
                  <p className="text-sm font-light leading-relaxed text-white/75">{member.bio}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Big General Statement Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-brand-navy text-white p-8 sm:p-12 rounded-3xl shadow-xl mb-16 relative overflow-hidden"
        >
          {/* Compass silhouette graphic in background */}
          <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 opacity-10 w-96 h-96 pointer-events-none select-none">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="50" cy="50" r="45" strokeDasharray="3 3" />
              <path d="M50 5 L50 95 M5 50 L95 50 M20 20 L80 80 M20 80 L80 20" />
            </svg>
          </div>

          <div className="relative z-10 max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 tracking-tight">
              Sólida Trayectoria al Servicio de tu Empresa
            </h2>
            <p className="text-base sm:text-lg text-white/80 font-light leading-relaxed mb-8">
              Contamos con una red de profesionales con más de 10 y 15 años de experiencia acumulada en diversos sectores productivos de Chile. Esta diversidad disciplinaria nos permite abordar de forma integral la seguridad laboral, el cumplimiento fiscal-regulatorio y la eficiencia operacional de nuestros clientes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-electric shrink-0 mt-0.5" />
                  <span className="text-sm text-white/95 font-light">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Disciplines / Areas Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-brand-navy text-center mb-10 tracking-tight">
            Nuestras Áreas de Especialización
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="bg-white border border-brand-gray/10 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Circle Icon Badge */}
                    <div className={`w-14 h-14 rounded-xl border flex items-center justify-center mb-6 ${pillar.color}`}>
                      <Icon className="h-7 w-7" />
                    </div>

                    <h4 className="text-xl font-bold text-brand-navy mb-1">
                      {pillar.title}
                    </h4>
                    <p className="text-xs font-semibold text-brand-electric uppercase tracking-wider mb-4">
                      {pillar.subtitle}
                    </p>
                    <p className="text-sm text-brand-gray font-light leading-relaxed mb-6">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-6 border-t border-brand-gray/5 text-xs text-brand-gray/80 flex items-center gap-2">
                    <Award className="h-4.5 w-4.5 text-brand-electric" />
                    <span>Consultores Senior Asignados por Proyecto</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
