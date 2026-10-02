import Link from "next/link";

export default function VacanteNotFound() {
  return (
    <div className="pt-36 md:pt-44 pb-24 text-center min-h-screen">
      <h1 className="text-2xl font-bold text-brand-navy mb-4">Oferta de Empleo no encontrada</h1>
      <p className="text-sm text-brand-gray-dark mb-8">
        El enlace de la vacante no existe o la vacante ha sido cerrada.
      </p>
      <Link
        href="/vacantes"
        className="inline-flex items-center gap-2 bg-brand-navy text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
      >
        Volver a Vacantes
      </Link>
    </div>
  );
}
