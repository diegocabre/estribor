import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { teamMembers } from "@/lib/content/team";

/** Equipo en el Inicio: los cuatro retratos en una fila (dos columnas en móvil). */
export default function QuienesSomos() {
  return (
    <section id="equipo" className="bg-white py-16 md:py-24 border-t border-brand-gray/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <span className="text-brand-gold-dark text-xs font-bold tracking-widest uppercase block mb-3">Equipo</span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-brand-navy tracking-[-0.01em]">Las personas detrás de Estribor</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6">
          {teamMembers.map((member, index) => (
            <Reveal key={member.name} from="translateY(16px)" delay={index * 0.08}>
              <figure>
                {/* Proporción fija (fotos 4:5): reserva el alto antes de que cargue la imagen. */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-brand-bg">
                  <Image
                    src={member.photo}
                    alt={member.photoAlt}
                    fill
                    sizes="(min-width: 1280px) 300px, (min-width: 1024px) 23vw, 50vw"
                    className="object-cover object-top"
                  />
                </div>
                <figcaption className="mt-3">
                  <span className="block font-titles text-base font-bold text-brand-navy">{member.name}</span>
                  <span className="mt-0.5 block text-sm leading-snug text-brand-gray-dark">{member.role}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
