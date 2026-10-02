import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Award, Briefcase, CheckCircle, CheckCircle2, FileText, ListTodo, Lock, MapPin } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import JobApplicationForm from "@/components/vacantes/JobApplicationForm";
import ShareButtons from "@/components/vacantes/ShareButtons";
import { getPublicJob, getPublicJobs } from "@/lib/jobs";
import { breadcrumbJsonLd, jobPostingJsonLd } from "@/lib/seo";

// ISR: cada vacante se regenera como máximo cada 5 minutos, y al instante al editarla en el panel.
export const revalidate = 300;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const jobs = await getPublicJobs();
  return jobs.map((job) => ({ id: job.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await getPublicJob(id);
  if (!job) return { title: "Vacante no encontrada", robots: { index: false } };

  const description = `${job.type} en ${job.location}. ${job.description}`.slice(0, 160);
  return {
    title: `${job.title} · ${job.location}`,
    description,
    alternates: { canonical: `/vacantes/${job.id}` },
    // Un proceso cerrado se puede ver, pero no debe competir en buscadores.
    robots: job.active ? undefined : { index: false, follow: true },
    openGraph: {
      title: `${job.title} | Estribor Consultores`,
      description,
      url: `/vacantes/${job.id}`,
      type: "website",
    },
  };
}

export default async function VacanteDetailPage({ params }: PageProps) {
  const { id } = await params;
  const job = await getPublicJob(id);
  if (!job) notFound();

  return (
    <div className="pt-36 md:pt-44 pb-16 bg-brand-bg min-h-screen">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Vacantes", path: "/vacantes" },
          { name: job.title, path: `/vacantes/${job.id}` },
        ])}
      />
      {job.active && <JsonLd data={jobPostingJsonLd(job)} />}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back and share header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            href="/vacantes"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-navy hover:text-brand-gold transition-colors"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Volver al Portal de Vacantes
          </Link>
          <ShareButtons title={job.title} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Vacancy Details (7 columns) */}
          <article className="lg:col-span-7 bg-white border border-brand-gray/10 p-6 sm:p-10 rounded-3xl shadow-sm space-y-8 relative overflow-hidden">
            <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${job.active ? "bg-brand-gold" : "bg-emerald-500"}`}></div>

            {!job.active && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3.5 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                  <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-950">Proceso de Selección Cerrado con Éxito</p>
                  <p className="text-xs text-emerald-800 font-light leading-relaxed">
                    Esta convocatoria de talento ha concluido satisfactoriamente y la vacante ya fue cubierta.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold text-brand-navy bg-brand-gold/15 px-3 py-1 rounded-full uppercase tracking-wider">
                  {job.area}
                </span>

                {job.active ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                    <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Convocatoria Abierta
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                    <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    Proceso Cerrado con Éxito
                  </span>
                )}

                {job.confidential ? (
                  <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                    <Lock aria-hidden="true" className="h-3 w-3" />
                    Búsqueda Confidencial
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-brand-blue-light bg-brand-blue-light/10 border border-brand-blue-light/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Estribor
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-titles">{job.title}</h1>

              <div className="flex flex-wrap gap-4 text-xs text-brand-gray-dark font-medium border-b border-brand-gray/10 pb-4">
                <div className="flex items-center gap-1.5">
                  <MapPin aria-hidden="true" className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase aria-hidden="true" className="h-4 w-4" />
                  <span>{job.type}</span>
                </div>
              </div>
            </div>

            <section className="space-y-3">
              <h2 className="text-sm font-bold text-brand-navy uppercase tracking-wider flex items-center gap-2">
                <FileText aria-hidden="true" className="h-4 w-4 text-brand-gold" />
                Misión del Cargo
              </h2>
              <p className="text-sm text-brand-gray-dark font-light leading-relaxed">{job.description}</p>
            </section>

            {job.functions && (
              <section className="space-y-3">
                <h2 className="text-sm font-bold text-brand-navy uppercase tracking-wider flex items-center gap-2">
                  <ListTodo aria-hidden="true" className="h-4 w-4 text-brand-gold" />
                  Funciones y Responsabilidades
                </h2>
                <ul className="space-y-2.5">
                  {job.functions
                    .split(". ")
                    .filter(Boolean)
                    .map((func, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-brand-gray-dark font-light">
                        <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-2"></span>
                        <span>{func.trim()}</span>
                      </li>
                    ))}
                </ul>
              </section>
            )}

            <section className="space-y-3">
              <h2 className="text-sm font-bold text-brand-navy uppercase tracking-wider flex items-center gap-2">
                <Award aria-hidden="true" className="h-4 w-4 text-brand-gold" />
                Requisitos Excluyentes
              </h2>
              <ul className="space-y-2.5">
                {job.requirements.split(", ").map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-brand-gray-dark font-light">
                    <CheckCircle aria-hidden="true" className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{req.trim()}</span>
                  </li>
                ))}
              </ul>
            </section>
          </article>

          {/* Application Column (5 columns) */}
          <div className="lg:col-span-5 bg-white border border-brand-gray/10 p-6 sm:p-8 rounded-3xl shadow-sm relative">
            {job.active ? (
              <JobApplicationForm jobId={job.id} jobTitle={job.title} />
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-xs">
                  <CheckCircle2 aria-hidden="true" className="h-8 w-8" />
                </div>

                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
                  Búsqueda Finalizada
                </span>

                <h2 className="text-xl font-bold text-brand-navy mb-3 font-titles">Proceso Cerrado con Éxito</h2>

                <p className="text-xs text-brand-gray-dark font-light leading-relaxed mb-6">
                  Agradecemos el gran interés de todos los postulantes. Esta búsqueda ha finalizado con la contratación
                  exitosa del candidato seleccionado y ya no recibe nuevas postulaciones.
                </p>

                <div className="p-4 rounded-2xl bg-brand-bg/60 border border-brand-gray/15 text-left mb-6 space-y-2">
                  <h3 className="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                    <Award aria-hidden="true" className="h-4 w-4 text-brand-gold" />
                    ¿Quieres ser considerado en futuras búsquedas?
                  </h3>
                  <p className="text-xs text-brand-gray-dark font-light leading-relaxed">
                    Súmate a nuestra base de talentos enviando tus antecedentes en la postulación espontánea o revisa
                    otras convocatorias vigentes.
                  </p>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/vacantes"
                    className="w-full inline-flex items-center justify-center bg-brand-navy hover:bg-brand-blue-med text-white text-xs font-bold py-3.5 px-6 rounded-xl transition-all shadow-md gap-2"
                  >
                    <span>Ver Convocatorias Abiertas</span>
                    <ArrowLeft aria-hidden="true" className="h-4 w-4 rotate-180" />
                  </Link>

                  <Link
                    href="/vacantes#espontanea"
                    className="w-full inline-flex items-center justify-center bg-white hover:bg-slate-50 text-brand-navy border border-brand-gray/30 text-xs font-bold py-3.5 px-6 rounded-xl transition-all gap-2"
                  >
                    <span>Postulación Espontánea (Enviar CV)</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
