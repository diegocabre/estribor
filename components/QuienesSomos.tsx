import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { teamMembers } from "@/lib/content/team";
import type { TeamMember } from "@/lib/types";
import { ArrowRight } from "lucide-react";

// Ancho real de cada retrato: la columna de fotos ocupa 7/12 del contenedor (máx. 1280 px) en dos columnas.
const PHOTO_SIZES = "(min-width: 1280px) 330px, (min-width: 1024px) 27vw, 50vw";

function Portrait({ member, delay }: { member: TeamMember; delay: number }) {
  return (
    <Reveal from="translateY(24px)" delay={delay}>
      <figure>
        {/* Contenedor con proporción fija (fotos 4:5): reserva el alto antes de que cargue la imagen. */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-bg">
          <Image src={member.photo} alt={member.photoAlt} fill sizes={PHOTO_SIZES} className="object-cover object-top" />
        </div>
        <figcaption className="mt-3">
          <span className="block font-titles text-base font-bold text-brand-navy">{member.name}</span>
          <span className="mt-0.5 block text-sm leading-snug text-brand-gray-dark">{member.role}</span>
        </figcaption>
      </figure>
    </Reveal>
  );
}

export default function QuienesSomos() {
  // Dos columnas desfasadas: la segunda baja un poco para que la grilla no se lea como cuatro tarjetas iguales.
  const columns = [teamMembers.filter((_, i) => i % 2 === 0), teamMembers.filter((_, i) => i % 2 === 1)];

  return (
    <section id="quienes-somos" className="py-20 md:py-28 bg-white relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Text Column (5 cols) */}
          <div className="lg:col-span-5">
            <h2 className="text-3xl sm:text-4xl font-semibold text-brand-navy tracking-[-0.01em] mb-6">
              ¿Quiénes somos?
            </h2>
            <p className="text-base text-brand-gray-dark leading-relaxed mb-6">
              <strong className="font-semibold text-brand-navy">Estribor Consultores</strong> es una consultora boutique especializada en tres áreas:
              <span className="block mt-2 font-medium text-brand-navy">• Gestión de personas</span>
              <span className="block font-medium text-brand-navy">• Seguridad y salud en el trabajo</span>
              <span className="block font-medium text-brand-navy">• Sostenibilidad organizacional</span>
            </p>
            <p className="text-base text-brand-gray-dark leading-relaxed mb-6">
              Trabajamos con empresas de acuicultura, construcción, industria y servicios en la Región de Los Lagos, en terreno y en oficina.
            </p>
            <p className="text-base text-brand-gray-dark leading-relaxed mb-8">
              Estribor es una empresa nueva; la experiencia es de su equipo, que viene de años de trabajo en industrias productivas, salmonicultura, construcción y comunicaciones corporativas. Quien te atiende es quien hace el trabajo.
            </p>
            <a
              href="#agenda"
              className="inline-flex items-center gap-2 py-2 text-brand-gold-dark hover:text-brand-navy font-bold text-sm transition-colors group"
            >
              Agendar reunión
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

          {/* Equipo (7 cols): retratos reales de quienes atienden a cada cliente. */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-x-4 sm:gap-x-6">
            {columns.map((column, colIdx) => (
              <div key={colIdx} className={`flex flex-col gap-8 ${colIdx === 1 ? "pt-10 sm:pt-16" : ""}`}>
                {column.map((member, idx) => (
                  <Portrait key={member.name} member={member} delay={(idx * 2 + colIdx) * 0.1} />
                ))}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
