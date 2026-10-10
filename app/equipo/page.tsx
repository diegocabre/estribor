import Image from "next/image";
import JsonLd from "@/components/seo/JsonLd";
import { teamMembers } from "@/lib/content/team";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import Reveal from "@/components/ui/Reveal";
import { CheckCircle2, ShieldCheck, Megaphone, Users2, Handshake } from "lucide-react";

// Todo lo que se afirma aquí sale de las biografías de lib/content/team.ts (ver PRODUCT.md).
export const metadata = pageMetadata({
  title: "Nuestro equipo",
  description:
    "Conoce al equipo de Estribor Consultores: prevención de riesgos, atracción de talento, gestión de personas, comunicaciones corporativas, cultura y gestión del cambio.",
  path: "/equipo",
});

export default function EquipoPage() {
  const pillars = [
    {
      title: "Prevención de riesgos",
      subtitle: "Seguridad y salud en el trabajo",
      description: "Programas preventivos, sistemas de gestión, normativa MINSAL y preparación para certificaciones ASC, BAP e ISO, con experiencia en construcción y salmonicultura.",
      icon: ShieldCheck,
      color: "border-brand-electric text-brand-electric bg-brand-electric/5",
    },
    {
      title: "Personas y talento",
      subtitle: "Gestión de personas",
      description: "Atracción y selección de talento con base en psicología organizacional, y gestión de personas alineada con los objetivos del negocio.",
      icon: Users2,
      color: "border-brand-blue-med text-brand-blue-med bg-brand-blue-med/5",
    },
    {
      title: "Comunicaciones, cultura y cambio",
      subtitle: "Desarrollo organizacional",
      description: "Comunicaciones corporativas, cultura, gestión del cambio y de crisis, y reportabilidad de sostenibilidad.",
      icon: Megaphone,
      color: "border-brand-gray text-brand-gray bg-brand-gray/5",
    },
  ];

  const directors = teamMembers.filter((m) => m.group === "direccion");
  const consultants = teamMembers.filter((m) => m.group === "consultor");

  const highlights = [
    "Más de 10 años en industrias productivas: gestión de personas, comunicaciones corporativas, compliance y sostenibilidad.",
    "Prevención de riesgos en construcción y salmonicultura, con certificaciones ASC, BAP e ISO.",
    "Psicología organizacional aplicada a la atracción y selección de talento.",
    "Oficina en Puerto Varas y trabajo en la Región de Los Lagos.",
  ];

  return (
    <div className="pt-48 md:pt-52 pb-16 bg-white overflow-hidden min-h-screen relative">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Equipo", path: "/equipo" },
        ])}
      />
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(125_126_128/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(125_126_128/0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-gold-dark text-xs font-bold tracking-widest uppercase block mb-3 font-sans">
            Nuestros profesionales
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-navy tracking-tight mb-4">
            Equipo multidisciplinario
          </h1>
          <p className="text-base text-brand-gray-dark leading-relaxed">
            Estas son las personas que atienden a los clientes de <strong className="font-semibold text-brand-navy">Estribor Consultores</strong>: prevención de riesgos, selección de personas, comunicaciones y gestión, en un mismo equipo.
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
              Nuestro equipo
            </h2>
          </div>

          {/* Dirección: tarjeta destacada horizontal */}
          {directors.map((member) => (
            <Reveal
              key={member.name}
              as="article"
              from="translateY(0px)"
              rootMargin="0px 0px -50px 0px"
              className="group relative z-10 mb-14 grid grid-cols-1 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:border-brand-gold/40 hover:shadow-2xl hover:shadow-black/30 md:grid-cols-12"
            >
              <div className="relative aspect-[4/5] overflow-hidden md:col-span-5 lg:col-span-4">
                <Image
                  src={member.photo}
                  alt={member.photoAlt}
                  fill
                  sizes="(min-width: 1024px) 400px, (min-width: 768px) 40vw, 100vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-brand-navy/40" />
              </div>

              <div className="flex flex-col justify-center p-6 sm:p-10 md:col-span-7 lg:col-span-8 lg:p-14">
                <span className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-brand-gold">
                  <span className="h-px w-8 bg-brand-gold" />
                  Dirección
                </span>
                <h3 className="text-3xl font-bold text-brand-gold sm:text-4xl">{member.name}</h3>
                <p className="mt-2 text-base font-medium text-white sm:text-lg">{member.role}</p>
                <span className="my-6 h-px w-16 bg-brand-gold/60 transition-all duration-300 group-hover:w-24" />
                <p className="max-w-2xl text-base leading-relaxed text-white/80">{member.bio}</p>
              </div>
            </Reveal>
          ))}

          {/* Equipo consultor */}
          <div className="relative z-10 mb-8 flex items-center gap-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/80">Equipo consultor</h3>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {consultants.map((member, idx) => (
              <Reveal
                key={member.name}
                as="article"
                from="translateY(0px)"
                delay={idx * 0.15}
                rootMargin="0px 0px -50px 0px"
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/40 hover:shadow-2xl hover:shadow-black/30"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={member.photo}
                    alt={member.photoAlt}
                    fill
                    sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h4 className="text-2xl font-bold text-brand-gold">{member.name}</h4>
                    <p className="mt-1 text-sm font-medium leading-snug text-white">{member.role}</p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6 pt-5">
                  <span className="mb-4 h-px w-12 bg-brand-gold/60 transition-all duration-300 group-hover:w-20" />
                  <p className="text-sm leading-relaxed text-white/75">{member.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Big General Statement Banner */}
        <Reveal
          from="translateY(0px)"
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
              Una empresa nueva con un equipo con trayectoria
            </h2>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-8">
              Estribor partió en 2026. La experiencia que ponemos a tu disposición es la que cada integrante construyó antes, trabajando dentro de industrias productivas y de servicios.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-electric shrink-0 mt-0.5" />
                  <span className="text-sm text-white/95">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Disciplines / Areas Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-brand-navy text-center mb-10 tracking-tight">
            Nuestras áreas de especialización
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <Reveal
                  key={pillar.title}
                  from="translateY(0px)"
                  delay={idx * 0.15}
                  rootMargin="0px 0px -50px 0px"
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
                    <p className="text-sm text-brand-gray-dark leading-relaxed mb-6">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-6 border-t border-brand-gray/5 text-xs text-brand-gray-dark flex items-center gap-2">
                    <Handshake aria-hidden="true" className="h-4.5 w-4.5 text-brand-electric" />
                    <span>Trato directo con quien ejecuta el trabajo</span>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
