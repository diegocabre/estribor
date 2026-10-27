import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { SERVICE_AREAS } from "@/lib/content/services";
import { Users2, ShieldCheck, Leaf, Megaphone, Check } from "lucide-react";

const IMAGES = Object.fromEntries(SERVICE_AREAS.map((area) => [area.id, area.image]));

export default function Servicios() {
  const axes = [
    {
      id: "personas",
      title: "Gestión de personas",
      description: "Reclutamos, evaluamos y capacitamos personas, y acompañamos cambios de cultura y liderazgo.",
      icon: Users2,
      color: "border-brand-blue-light/20 hover:border-brand-blue-light/50",
      iconColor: "text-brand-blue-light bg-brand-blue-light/10",
      list: [
        "Reclutamiento y selección",
        "Outsourcing",
        "Hunting ejecutivo",
        "Desarrollo organizacional",
        "Evaluaciones | Assessment",
        "Capacitación",
        "Cultura y comunicaciones",
        "Liderazgo",
      ],
    },
    {
      id: "seguridad",
      title: "Seguridad y salud en el trabajo",
      description: "Diagnosticamos, auditamos e implementamos sistemas de gestión y la normativa vigente: DS 44, IRL, RIOHS y Ley Karin.",
      icon: ShieldCheck,
      color: "border-brand-gold/20 hover:border-brand-gold/50",
      iconColor: "text-brand-gold bg-brand-gold/10",
      list: [
        "Diagnósticos y línea base",
        "Auditorías de cumplimiento",
        "Diseño e implementación de sistemas de gestión",
        "Cumplimiento normativo (DS 44, IRL, RIOHS, Ley Karin)",
        "Cultura preventiva",
        "Capacitación en seguridad ocupacional",
      ],
    },
    {
      id: "sostenibilidad",
      title: "Sostenibilidad organizacional",
      description: "Analizamos materialidad, medimos huella hídrica y de carbono, y preparamos reportes e indicadores ESG.",
      icon: Leaf,
      color: "border-brand-navy/15 hover:border-brand-navy/40",
      iconColor: "text-brand-navy bg-brand-navy/5",
      list: [
        "Análisis de materialidad",
        "Gestión de riesgos ambientales y sociales",
        "Cumplimiento regulatorio y reportabilidad",
        "Reportes de sostenibilidad (GRI y otros estándares)",
        "Sostenibilidad y gestión organizacional",
        "Diseño de estrategias e indicadores ESG",
        "Medición de huella hídrica y de carbono",
      ],
    },
    {
      id: "comunicaciones",
      title: "Comunicaciones corporativas",
      description: "Ordenamos lo que tu empresa comunica hacia dentro y hacia fuera, y acompañamos cambios, crisis y la relación con tu entorno.",
      icon: Megaphone,
      color: "border-brand-electric/20 hover:border-brand-electric/50",
      iconColor: "text-brand-electric bg-brand-electric/10",
      list: [
        "Branding: identidad y propósito de marca, posicionamiento, mensajes clave y employer branding (marca empleadora)",
        "Comunicaciones internas: diagnóstico, canales, campañas y contenidos, y comunicación para jefaturas",
        "Comunicaciones externas y gestión de crisis: relación con medios, protocolos de crisis, preparación de voceros y manejo de contingencias",
        "Gestión del cambio: acompañamiento en reestructuraciones, fusiones, nuevos sistemas o cambios de liderazgo",
        "Relacionamiento comunitario y asuntos públicos: vínculo con comunidades, autoridades y grupos de interés",
        "Vocería y media training: preparación de ejecutivos para entrevistas, presentaciones y situaciones sensibles (también como taller)",
        "Cultura de seguridad: campañas de seguridad y de cultura preventiva",
      ],
    },
  ];

  return (
    <section id="servicios-home" className="py-24 bg-white relative overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-gold-dark text-xs font-bold tracking-widest uppercase block mb-3 font-sans">
            Áreas de especialización
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-brand-navy tracking-[-0.01em] mb-4">
            Nuestros servicios
          </h1>
          <p className="text-base text-brand-gray-dark leading-relaxed">
            Qué hacemos en cada una de nuestras cuatro áreas.
          </p>
        </div>

        {/* Services Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {axes.map((axis, index) => {
            const Icon = axis.icon;
            return (
              <Reveal
                key={axis.title}
                from="translateY(0px)"
                delay={(index % 2) * 0.1}
                className={`bg-white border rounded-2xl overflow-hidden shadow-sm flex flex-col hover:shadow-xl transition-all duration-300 ${axis.color}`}
              >
                {/* Ancla para /servicios#<id> (menú y tarjetas del Inicio). */}
                <div id={axis.id} className="scroll-mt-32 relative aspect-[2/1] bg-brand-bg">
                  <Image src={IMAGES[axis.id]} alt="" fill sizes="(min-width: 1280px) 600px, (min-width: 1024px) 50vw, 100vw" className="object-cover" />
                </div>

                <div className="p-8 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Header info */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${axis.iconColor}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h2 className="font-titles text-xl font-bold text-brand-navy leading-tight">{axis.title}</h2>
                    </div>

                    <p className="text-sm text-brand-gray-dark leading-relaxed mb-6">
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
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Contact trigger link */}
                  <div className="mt-8 pt-6 border-t border-brand-gray/5">
                    <a
                      href="/contacto#agenda"
                      className="inline-flex items-center justify-center w-full bg-brand-navy hover:bg-brand-blue-med text-white text-sm font-semibold py-3 px-4 rounded-xl transition-colors shadow-sm"
                    >
                      Agendar reunión
                    </a>
                  </div>
                </div>

              </Reveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
