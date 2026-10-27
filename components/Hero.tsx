import Image from "next/image";
import { ArrowRight } from "lucide-react";

const METRICS = [
  { value: "+15", label: "años de trayectoria del equipo en personas, SST y sostenibilidad" },
  { value: "4", label: "industrias atendidas en nuestro primer año" },
  { value: "4", label: "áreas de especialidad integradas" },
];

export default function Hero() {
  return (
    <section id="inicio" className="relative pt-24 md:pt-28 bg-brand-bg">
      {/* Foto a todo el ancho con velo azul para que el texto blanco se lea sobre cualquier zona. */}
      <div className="relative overflow-hidden">
        <Image
          src="/images/home/hero.webp"
          alt=""
          fill
          sizes="100vw"
          preload
          className="object-cover object-[center_70%]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 via-brand-navy/70 to-brand-navy/30"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-32 md:pt-24 md:pb-40">
          <div className="animate-fade-up max-w-2xl">
            <p className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-4">Consultora boutique · Sur de Chile</p>
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-semibold tracking-[-0.01em] text-white leading-[1.08] mb-6">
              Personas seguras, equipos sólidos, empresas sostenibles.
            </h1>
            <p className="text-base sm:text-lg text-white/85 mb-8 leading-relaxed">
              Asesoramos a empresas de acuicultura, construcción, energía e industria en gestión de personas, seguridad laboral,
              sostenibilidad y comunicaciones, con un equipo que viene de la operación.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/contacto#agenda"
                className="inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-navy px-7 py-3.5 rounded-md font-bold transition-colors shadow-md"
              >
                Agendar reunión
                <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </a>
              <a
                href="#que-hacemos"
                className="inline-flex items-center justify-center border border-white/70 hover:bg-white hover:text-brand-navy text-white px-7 py-3.5 rounded-md font-semibold transition-colors"
              >
                Ver servicios
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas: tarjeta montada sobre el borde inferior de la foto. */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 md:-mt-16">
        <ul className="grid grid-cols-1 sm:grid-cols-3 bg-white rounded-xl shadow-lg border border-brand-gray/20 divide-y sm:divide-y-0 sm:divide-x divide-brand-gray/20">
          {METRICS.map((metric) => (
            <li key={metric.label} className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-1 px-6 py-4 sm:py-6">
              <strong className="font-titles text-3xl sm:text-4xl font-semibold text-brand-navy shrink-0 w-14 sm:w-auto">{metric.value}</strong>
              <span className="text-sm text-brand-gray-dark leading-snug">{metric.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
