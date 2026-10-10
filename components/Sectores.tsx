const SECTORS = [
  { name: "Acuicultura", desc: "Asesorías en terreno para centros de cultivo, plantas de proceso y logística marítima." },
  { name: "Industria", desc: "Evaluación y optimización de procesos productivos y cumplimiento normativo DS44." },
  { name: "Energía", desc: "Sistemas de gestión, auditorías operativas e indicadores ESG para el sector energético." },
  { name: "Construcción", desc: "Supervisión técnica de seguridad y salud (SST) en obras civiles y edificación." },
  { name: "Alimentos", desc: "Aseguramiento del cumplimiento regulatorio y optimización de procesos en manufactura." },
  { name: "Servicios", desc: "Outsourcing, clima organizacional y hunting ejecutivo para empresas del sector terciario." },
];

/** Franja compacta de sectores: continúa el fondo de "¿Por qué Estribor?" y se separa con una línea. */
export default function Sectores() {
  return (
    <section id="sectores" className="bg-brand-bg pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 border-t border-brand-gray/40 pt-12 md:pt-16">
          <div className="lg:col-span-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy tracking-tight mb-3">Sectores donde trabajamos</h2>
            <p className="text-base text-brand-gray-dark leading-relaxed">
              Rubros en los que asesoramos, con foco en la Región de Los Lagos.
            </p>
          </div>

          <ul className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-6">
            {SECTORS.map((sector) => (
              <li key={sector.name}>
                <h3 className="font-titles font-bold text-brand-navy">{sector.name}</h3>
                <p className="mt-1 text-sm text-brand-gray-dark leading-relaxed">{sector.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
