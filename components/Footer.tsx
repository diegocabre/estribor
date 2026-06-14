"use client";

import Image from "next/image";
import { Linkedin, Mail, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-brand-navy text-white/80 py-12 border-t border-brand-blue-med">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center md:items-start">
          {/* Logo & Slogan (5 columns) */}
          <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={scrollToTop}>
              <div className="relative h-12 w-12 bg-white/10 rounded-full p-1 border border-white/20">
                <Image
                  src="/logo.png"
                  alt="Estribor Logo"
                  width={40}
                  height={40}
                  className="object-contain filter brightness-0 invert"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xl font-bold tracking-wider text-white leading-none">
                  ESTRIBOR
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-brand-gray leading-none mt-1">
                  CONSULTORES
                </span>
              </div>
            </div>
            <p className="text-sm text-white/60 font-light max-w-sm leading-relaxed">
              Soluciones integrales en seguridad y salud, cumplimiento normativo, asesoría técnica y gestión organizacional en todo Chile.
            </p>
          </div>

          {/* Quick links (4 columns) */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Navegación</h3>
            <ul className="space-y-2 text-center md:text-left text-sm">
              <li>
                <a href="/servicios" className="hover:text-brand-electric transition-colors">
                  Nuestros Servicios
                </a>
              </li>
              <li>
                <a href="/mision-vision" className="hover:text-brand-electric transition-colors">
                  Misión y Visión
                </a>
              </li>
              <li>
                <a href="/equipo" className="hover:text-brand-electric transition-colors">
                  Nuestro Equipo
                </a>
              </li>
              <li>
                <a href="/contacto" className="hover:text-brand-electric transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Socials (3 columns) */}
          <div className="md:col-span-3 flex flex-col items-center md:items-start">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Conéctate</h3>
            <div className="flex items-center gap-4 mb-6">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-brand-electric text-white flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:contacto@estribor.cl"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-brand-electric text-white flex items-center justify-center transition-colors"
                aria-label="Correo"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>

            {/* Scroll back to top */}
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/50 hover:text-brand-electric transition-colors"
            >
              Volver Arriba
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Bottom border & Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40 text-center sm:text-left">
          <p>
            &copy; {new Date().getFullYear()} Estribor Consultores. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">
              Políticas de Privacidad
            </a>
            <span>&middot;</span>
            <a href="#" className="hover:text-white transition-colors">
              Términos de Servicio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
