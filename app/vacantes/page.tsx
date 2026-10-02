import type { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import JobsExplorer from "@/components/vacantes/JobsExplorer";
import SpontaneousApplicationForm from "@/components/vacantes/SpontaneousApplicationForm";
import { getPublicJobs } from "@/lib/jobs";
import { breadcrumbJsonLd } from "@/lib/seo";

// ISR: la lista se regenera como máximo cada 5 minutos, y al instante cuando el panel
// crea, edita o cierra una vacante (revalidatePath en /api/admin/jobs).
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Portal de Empleo y Vacantes",
  description:
    "Postula a procesos de selección y hunting de Estribor Consultores en el sur de Chile, o deja tu CV en nuestra base de talentos.",
  alternates: { canonical: "/vacantes" },
  openGraph: {
    title: "Portal de Empleo | Estribor Consultores",
    description: "Procesos de selección y hunting ejecutivo en Chile. Postula o deja tu CV.",
    url: "/vacantes",
  },
};

export default async function VacantesPage() {
  const jobs = await getPublicJobs();

  return (
    <div className="pt-28 md:pt-32 pb-16 bg-brand-bg min-h-screen">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Vacantes", path: "/vacantes" },
        ])}
      />

      {/* Header Banner */}
      <div className="bg-brand-navy text-white py-16 mb-12 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-3xl">
            <span className="text-brand-gold text-xs font-bold tracking-widest uppercase block mb-3 font-sans">
              Portal de Empleo & Hunting Estratégico
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 font-titles leading-tight">
              Define el Rumbo de tu Carrera{" "}
              <span className="text-brand-gold bg-gradient-to-r from-brand-gold to-brand-blue-light bg-clip-text text-transparent">
                Impulsa tu Talento en Empresas Líderes
              </span>
            </h1>
            <p className="text-sm sm:text-base text-brand-gray max-w-2xl font-light leading-relaxed mb-6">
              Acompañamos a profesionales de excelencia en su desarrollo laboral. Postula a nuestros procesos de
              selección exclusivos o regístrate en nuestra base de talentos para acceder a nuevas oportunidades
              estratégicas en todo Chile.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#vacantes-lista"
                className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-brand-navy font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-sm"
              >
                <span>Ver Convocatorias</span>
              </a>
              <a
                href="#espontanea"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition-all border border-white/20"
              >
                <span>Postulación Espontánea</span>
              </a>
            </div>
          </div>

          <div className="shrink-0 self-start md:self-center">
            <Link
              href="/vacantes/admin"
              prefetch={false}
              className="inline-flex items-center gap-2 text-xs text-brand-gold hover:text-white bg-white/5 hover:bg-white/10 border border-brand-gold/30 hover:border-brand-gold px-4 py-2.5 rounded-xl font-semibold transition-all shadow-sm"
            >
              <Lock aria-hidden="true" className="h-3.5 w-3.5" />
              <span>Acceso Administrador / Reclutador</span>
            </Link>
          </div>
        </div>
      </div>

      <div id="vacantes-lista" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <JobsExplorer jobs={jobs} />
          <SpontaneousApplicationForm />
        </div>
      </div>
    </div>
  );
}
