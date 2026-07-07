"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative pt-24 pb-16 md:pt-36 md:pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-b from-white via-brand-bg to-brand-bg"
    >
      {/* Decorative background grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#7D7E80/5_1px,transparent_1px),linear-gradient(to_bottom,#7D7E80/5_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      {/* Floating abstract gradients */}
      <div className="absolute top-1/4 -right-1/4 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-brand-electric/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 -left-1/4 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-brand-blue-med/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left order-2 lg:order-1"
          >
            <div className="inline-flex items-center justify-center lg:justify-start gap-2 mb-4">
              <span className="bg-brand-gold/10 text-brand-gold text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full border border-brand-gold/20">
                Consultoría Estratégica
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-navy leading-tight mb-6">
              Navega con Seguridad hacia la{" "}
              <span className="text-brand-gold bg-gradient-to-r from-brand-gold to-brand-blue-light bg-clip-text text-transparent">
                Excelencia Operacional
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-brand-gray-dark mb-8 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              Acompañamos a empresas en el diseño e implementación de soluciones estratégicas que fortalecen su gestión, desarrollan sus equipos y promueven operaciones más seguras, eficientes y sostenibles.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#agenda"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-navy px-8 py-4 rounded-md font-bold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Solicitar una reunión
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="/servicios"
                className="w-full sm:w-auto inline-flex items-center justify-center border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white px-8 py-4 rounded-md font-bold transition-all duration-300"
              >
                Conocer nuestros servicios
              </a>
            </div>
          </motion.div>

          {/* Graphic Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="lg:col-span-5 flex justify-center items-center order-1 lg:order-2"
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[400px] lg:h-[400px] flex justify-center items-center">
              {/* Outer compass ring rotating slowly */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-brand-gold/30 rounded-full"
              ></motion.div>

              {/* Inner compass ring rotating the other way */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 65, repeat: Infinity, ease: "linear" }}
                className="absolute w-[85%] h-[85%] border border-brand-blue-light/20 rounded-full"
              ></motion.div>

              {/* Glowing Background */}
              <div className="absolute w-3/4 h-3/4 bg-gradient-to-tr from-brand-gold/25 to-white/10 rounded-full blur-2xl animate-compass-pulse"></div>

              {/* Main Brand Image */}
              <div className="relative w-3/4 h-3/4 select-none drop-shadow-[0_10px_20px_rgba(0,31,66,0.15)]">
                <Image
                  src="/logo_transparent.png"
                  alt="Rosa de los Vientos - Estribor"
                  fill
                  sizes="(max-width: 640px) 240px, (max-width: 1024px) 300px, 400px"
                  priority
                  className="object-contain"
                />
              </div>

              {/* Accent details mimicking fine navigation lines */}
              <div className="absolute -top-4 text-brand-navy/60 font-mono text-xs select-none">N 0°</div>
              <div className="absolute -bottom-4 text-brand-navy/60 font-mono text-xs select-none">S 180°</div>
              <div className="absolute -right-6 text-brand-navy/60 font-mono text-xs select-none">E 90°</div>
              <div className="absolute -left-6 text-brand-navy/60 font-mono text-xs select-none">W 270°</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
