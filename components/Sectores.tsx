import Image from "next/image";

const SECTORS = [
  { name: "Acuicultura", desc: "Selección para centros y plantas, SST en faenas marítimas", image: "/images/home/acuicultura.webp" },
  { name: "Construcción", desc: "Auditorías DS 44 y cultura preventiva en obra", image: "/images/home/construccion.webp" },
  { name: "Energía", desc: "Estrategia ESG y reportabilidad GRI", image: "/images/home/energia.webp" },
  { name: "Industria", desc: "Sistemas de gestión, liderazgo y turnos", image: "/images/home/industria.webp" },
  { name: "Alimentos", desc: "Ley Karin, clima y selección masiva", image: "/images/home/alimentos.webp" },
  { name: "Servicios", desc: "Desarrollo organizacional y comunicaciones", image: "/images/home/servicios.webp" },
];

const EXPERIENCE = ["Acuicultura", "Energía", "Construcción", "Industria", "Alimentos y servicios"];

/** Sectores con foto y, debajo, los rubros donde el equipo trabajó antes de formar Estribor. */
export default function Sectores() {
  return (
    <section id="sectores" className="bg-white py-16 md:py-24 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <span className="text-brand-gold-dark text-xs font-bold tracking-widest uppercase block mb-3">Sectores</span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-brand-navy tracking-[-0.01em]">Conocemos tu industria</h2>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTORS.map((sector) => (
            <li key={sector.name} className="relative aspect-[16/10] rounded-xl overflow-hidden bg-brand-navy">
              <Image
                src={sector.image}
                alt=""
                fill
                sizes="(min-width: 1280px) 400px, (min-width: 1024px) 31vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/30 to-transparent"></div>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-titles text-xl font-bold text-white">{sector.name}</h3>
                <p className="mt-1 text-sm text-white/85 leading-snug">{sector.desc}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-14 md:mt-16 border-t border-brand-gray/30 pt-10 text-center">
          <h3 className="text-xs font-bold tracking-widest uppercase text-brand-gray-dark mb-5">
            Experiencia previa del equipo en empresas de
          </h3>
          <ul className="flex flex-wrap justify-center gap-3">
            {EXPERIENCE.map((item) => (
              <li key={item} className="px-4 py-2 rounded-full border border-brand-gray/40 text-sm text-brand-navy">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
