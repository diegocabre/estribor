import Link from "next/link";

export default function NotFound() {
  return (
    <div className="pt-36 md:pt-44 pb-24 text-center min-h-[70vh] px-4">
      <p className="text-brand-gold-dark text-xs font-bold tracking-widest uppercase mb-3">Error 404</p>
      <h1 className="text-3xl sm:text-4xl font-bold text-brand-navy tracking-tight mb-4">Página no encontrada</h1>
      <p className="text-base text-brand-gray-dark font-light mb-8 max-w-md mx-auto">
        El enlace que seguiste no existe o fue movido. Revisa la dirección o vuelve al inicio.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-brand-navy hover:bg-brand-blue-med text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          Ir al inicio
        </Link>
        <Link
          href="/contacto"
          className="inline-flex items-center gap-2 border border-brand-navy text-brand-navy hover:bg-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          Contáctanos
        </Link>
      </div>
    </div>
  );
}
