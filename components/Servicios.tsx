import Reveal from "@/components/ui/Reveal";
import { Users2, ShieldCheck, Leaf, Check } from "lucide-react";

export default function Servicios() {
  const axes = [
    {
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
      title: "Sostenibilidad organizacional",
      description: "Analizamos materialidad, medimos huella hídrica y de carbono, y preparamos reportes e indicadores ESG.",
      icon: Leaf,
      color: "border-emerald-500/20 hover:border-emerald-500/50",
      iconColor: "text-emerald-600 bg-emerald-500/10",
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
  ];

  return (
    <section id="servicios-home" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative bg gradient */}
      <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-brand-bg rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-gold-dark text-xs font-bold tracking-widest uppercase block mb-3 font-sans">
            Áreas de especialización
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy tracking-tight mb-4">
            Nuestros servicios
          </h2>
          <p className="text-base text-brand-gray-dark leading-relaxed">
            Qué hacemos en cada una de nuestras tres áreas.
          </p>
        </div>

        {/* Services Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {axes.map((axis, index) => {
            const Icon = axis.icon;
            return (
              <Reveal
                key={axis.title}
                from="translateY(0px)"
                delay={index * 0.1}
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
                    href="#agenda"
                    className="inline-flex items-center justify-center w-full bg-brand-navy hover:bg-brand-blue-med text-white text-sm font-semibold py-3 px-4 rounded-xl transition-colors shadow-sm"
                  >
                    Agendar reunión
                  </a>
                </div>

              </Reveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
