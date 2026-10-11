import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-b from-white via-brand-bg to-brand-bg"
    >


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Column */}
          {/* En móvil el texto va primero para que el botón principal quede en la primera pantalla. */}
          <div
            className="animate-fade-up lg:col-span-7 flex flex-col justify-center text-center lg:text-left"
          >
            <div className="inline-flex items-center justify-center lg:justify-start gap-2 mb-4">
              <span className="bg-brand-gold/10 text-brand-gold-dark text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full border border-brand-gold/20">
                Consultora boutique
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl xl:text-6xl font-semibold tracking-[-0.01em] text-brand-navy leading-tight mb-6">
              Seguridad, personas y sostenibilidad para la{" "}
              <span className="text-brand-gold-dark">industria chilena</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-brand-gray-dark mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Desde Puerto Varas a todo Chile, para acuicultura, construcción e industria: Ley Karin, DS 44, sistemas de gestión, reclutamiento y reportes de sostenibilidad.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#contacto"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-navy px-8 py-4 rounded-md font-bold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Agendar reunión
                <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Graphic Column */}
          <div
            className="animate-zoom-in lg:col-span-5 flex justify-center items-center"
          >
            <div className="relative w-44 h-44 sm:w-72 sm:h-72 lg:w-[400px] lg:h-[400px] flex justify-center items-center">
              {/* Anillos quietos alrededor de la rosa de los vientos. */}
              <div aria-hidden="true" className="absolute inset-0 border border-dashed border-brand-gold/40 rounded-full"></div>
              <div aria-hidden="true" className="absolute w-[85%] h-[85%] border border-brand-blue-light/20 rounded-full"></div>

              {/* Main Brand Image */}
              <div className="relative w-3/4 h-3/4 select-none drop-shadow-[0_10px_20px_rgba(0,31,66,0.15)]">
                <Image
                  src="/logo.webp"
                  alt="Rosa de los Vientos - Estribor"
                  fill
                  sizes="(max-width: 640px) 132px, (max-width: 1024px) 216px, 300px"
                  preload
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
