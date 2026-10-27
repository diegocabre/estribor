import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BriefcaseBusiness,
  ChartColumn,
  GraduationCap,
  Lightbulb,
  MessageCircle,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  TriangleAlert,
  Users,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { SERVICE_AREAS } from "@/lib/content/services";
import { legalConfig } from "@/lib/legalConfig";

interface Item {
  icon: LucideIcon;
  title: string;
  /** Texto corrido (bloques sobre fondo oscuro) o lista de servicios. */
  text?: string;
  bullets?: string[];
}

interface Area {
  id: (typeof SERVICE_AREAS)[number]["id"];
  label: string;
  heading: string;
  intro: string;
  imagePosition: string;
  items: Item[];
}

const AREAS: Area[] = [
  {
    id: "personas",
    label: "Gestión de personas",
    heading: "Atraemos, desarrollamos y cuidamos el talento que mueve tu negocio",
    intro: "Fortalecemos el talento y la cultura de tu organización, desde la selección hasta el desarrollo de liderazgos.",
    imagePosition: "object-[25%_center]",
    items: [
      { icon: Search, title: "Atracción de talento", bullets: ["Reclutamiento y selección", "Hunting ejecutivo", "Outsourcing de personal"] },
      {
        icon: GraduationCap,
        title: "Desarrollo organizacional",
        bullets: ["Diagnóstico y desarrollo organizacional", "Evaluaciones y assessment", "Liderazgo y coaching"],
      },
      {
        icon: ShieldCheck,
        title: "Cultura y gobernanza",
        bullets: [
          "Cultura organizacional",
          "Protocolos normativos: Ley Karin, Ley de Inclusión Laboral, equidad de género",
          "Gestión del cambio",
        ],
      },
    ],
  },
  {
    id: "seguridad",
    label: "Seguridad y salud en el trabajo",
    heading: "Operaciones más seguras, de forma sostenida",
    intro: "Protegemos a las personas y aseguramos el cumplimiento normativo con una cultura preventiva.",
    imagePosition: "object-center",
    items: [
      { icon: Search, title: "Diagnóstico y auditoría", text: "Diagnósticos de la gestión preventiva y auditorías de cumplimiento." },
      {
        icon: Sun,
        title: "Sistemas de gestión y normativa",
        text: "Diseño e implementación de sistemas de gestión. Cumplimiento DS 44, IRL y RIOHS.",
      },
      { icon: Users, title: "Cultura preventiva y capacitación", text: "Programas para instalar una cultura de seguridad y capacitar a los equipos." },
    ],
  },
  {
    id: "sostenibilidad",
    label: "Sostenibilidad y gestión organizacional",
    heading: "La sostenibilidad como parte de la estrategia",
    intro: "Integramos criterios ESG a la estrategia, la gestión de riesgos y la reportabilidad.",
    imagePosition: "object-center",
    items: [
      { icon: Lightbulb, title: "Estrategia ESG", text: "Diseño de estrategias e indicadores ESG y análisis de materialidad." },
      { icon: TriangleAlert, title: "Riesgos y cumplimiento", text: "Gestión de riesgos y cumplimiento regulatorio." },
      { icon: ChartColumn, title: "Medición y reporte", text: "Medición de huella y elaboración de reportes de sostenibilidad." },
    ],
  },
  {
    id: "comunicaciones",
    label: "Comunicaciones corporativas",
    heading: "Comunicación estratégica que gestiona, acompaña y protege",
    intro: "Comunicamos con propósito para alinear equipos, acompañar el cambio y proteger la reputación.",
    imagePosition: "object-[60%_center]",
    items: [
      { icon: Lightbulb, title: "Estrategia de comunicación", text: "Planes de comunicación alineados al negocio, mensajes clave y vocería." },
      { icon: MessageCircle, title: "Comunicación interna y cultura", text: "Canales, campañas y contenidos que conectan a los equipos con la estrategia." },
      {
        icon: Users,
        title: "Gestión del cambio e integración",
        text: "Acompañamiento comunicacional en reestructuraciones, fusiones y transformaciones.",
      },
      { icon: TriangleAlert, title: "Crisis y reputación", text: "Protocolos de crisis, preparación de voceros y manejo de contingencias." },
    ],
  },
];

const MODALITIES = [
  {
    icon: BriefcaseBusiness,
    title: "Proyectos a medida",
    text: "Intervenciones con alcance, plazos y entregables definidos: un proceso de selección, un diagnóstico o una implementación normativa.",
    idealFor: "desafíos puntuales.",
  },
  {
    icon: MessageCircle,
    title: "Asesoría estratégica continua",
    text: "Acompañamiento periódico como socio estratégico de la gerencia, con focos y dedicación acordados en conjunto.",
    idealFor: "empresas en crecimiento o sin un área interna robusta.",
  },
  {
    icon: Settings,
    title: "Externalización de procesos",
    text: "Nos hacemos cargo de procesos de Personas o de Seguridad y Salud en el Trabajo de forma integral.",
    idealFor: "liberar a tus equipos y ganar eficiencia.",
  },
];

const IMAGES = Object.fromEntries(SERVICE_AREAS.map((area) => [area.id, area.image]));

/** Un área: foto y contenido lado a lado; las áreas pares van en fondo oscuro con la foto a la derecha. */
function AreaSection({ area, index }: { area: Area; index: number }) {
  const dark = index % 2 === 1;
  return (
    <section id={area.id} className={`scroll-mt-28 py-16 md:py-24 ${dark ? "bg-brand-navy" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <Reveal
          from="translateY(16px)"
          className={`lg:col-span-5 relative aspect-[4/3] lg:aspect-[4/5] rounded-xl overflow-hidden bg-brand-gray/20 ${dark ? "lg:order-2" : ""}`}
        >
          <Image
            src={IMAGES[area.id]}
            alt=""
            fill
            sizes="(min-width: 1280px) 500px, (min-width: 1024px) 40vw, 100vw"
            className={`object-cover ${area.imagePosition}`}
          />
        </Reveal>

        <div className="lg:col-span-7">
          <p className={`text-xs font-bold tracking-widest uppercase mb-3 ${dark ? "text-brand-gold" : "text-brand-gold-dark"}`}>
            Área {String(index + 1).padStart(2, "0")} · {area.label}
          </p>
          <h2 className={`text-3xl sm:text-4xl font-semibold tracking-[-0.01em] mb-4 ${dark ? "text-white" : "text-brand-navy"}`}>
            {area.heading}
          </h2>
          <p className={`text-base leading-relaxed mb-8 max-w-2xl ${dark ? "text-white/75" : "text-brand-gray-dark"}`}>{area.intro}</p>

          <ul className="space-y-3">
            {area.items.map(({ icon: Icon, title, text, bullets }) => (
              <li
                key={title}
                className={`flex gap-4 rounded-lg p-5 ${dark ? "bg-white/5 border border-white/10" : "bg-brand-bg border border-brand-gray/20"}`}
              >
                <Icon aria-hidden="true" className={`h-5 w-5 shrink-0 mt-0.5 ${dark ? "text-brand-gold" : "text-brand-gold-dark"}`} />
                <div>
                  <h3 className={`font-titles font-bold leading-snug ${dark ? "text-white" : "text-brand-navy"}`}>{title}</h3>
                  {text && <p className={`mt-1 text-sm leading-relaxed ${dark ? "text-white/70" : "text-brand-gray-dark"}`}>{text}</p>}
                  {bullets && (
                    <ul className="mt-2 space-y-1 text-sm text-brand-gray-dark">
                      {bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2">
                          <span aria-hidden="true" className="mt-2 h-1 w-1 rounded-full bg-brand-gold-dark shrink-0"></span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function Servicios() {
  return (
    <>
      {/* Encabezado de la página con accesos directos a cada área. */}
      <section className="bg-brand-bg py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Ruta de navegación" className="text-xs text-brand-gray-dark mb-8">
            <Link href="/" className="underline underline-offset-2 hover:text-brand-navy">
              Inicio
            </Link>{" "}
            / <span aria-current="page" className="font-semibold text-brand-navy">Servicios</span>
          </nav>
          <p className="text-brand-gold-dark text-xs font-bold tracking-widest uppercase mb-3">Áreas de especialización</p>
          <h1 className="text-4xl sm:text-5xl font-semibold text-brand-navy tracking-[-0.01em] mb-5">Cuatro áreas, una mirada integrada</h1>
          <p className="text-base text-brand-gray-dark leading-relaxed max-w-2xl mb-8">
            Acompañamos a las empresas a diseñar e implementar soluciones que fortalecen su gestión, desarrollan a sus equipos y
            hacen sus operaciones más seguras, eficientes y sostenibles.
          </p>
          <ul className="flex flex-wrap gap-3">
            {AREAS.map((area) => (
              <li key={area.id}>
                <a
                  href={`#${area.id}`}
                  className="inline-flex px-4 py-2 rounded-full border border-brand-gray/50 bg-white text-sm text-brand-navy hover:border-brand-navy transition-colors"
                >
                  {area.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {AREAS.map((area, index) => (
        <AreaSection key={area.id} area={area} index={index} />
      ))}

      <section className="bg-brand-bg py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-brand-gold-dark text-xs font-bold tracking-widest uppercase mb-3">Modalidades de servicio</p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-brand-navy tracking-[-0.01em] mb-10 max-w-2xl">
            Nos adaptamos a la forma en que tu empresa necesita trabajar
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MODALITIES.map(({ icon: Icon, title, text, idealFor }) => (
              <li key={title} className="flex flex-col bg-white rounded-xl border border-brand-gray/20 shadow-sm p-6">
                <Icon aria-hidden="true" className="h-5 w-5 text-brand-gold-dark mb-4" />
                <h3 className="font-titles text-lg font-bold text-brand-navy mb-2">{title}</h3>
                <p className="text-sm text-brand-gray-dark leading-relaxed mb-6">{text}</p>
                <p className="mt-auto pt-4 border-t border-brand-gray/20 text-sm text-brand-gray-dark">
                  <strong className="font-semibold text-brand-gold-dark">Ideal para</strong> {idealFor}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-brand-navy py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-3">Conversemos</p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-[-0.01em] mb-4">
              ¿Tienes un desafío en personas, seguridad, sostenibilidad o comunicaciones?
            </h2>
            <p className="text-base text-white/75">Te ayudamos a abordarlo. Agenda una reunión de 30 minutos, sin costo.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 whitespace-nowrap">
            <Link
              href="/contacto#agenda"
              className="inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-navy px-6 py-3 rounded-md font-bold transition-colors"
            >
              Agendar reunión
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <a
              href={legalConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-white/70 hover:bg-white hover:text-brand-navy text-white px-6 py-3 rounded-md font-semibold transition-colors"
            >
              WhatsApp
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
