"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Briefcase, Building, CheckCircle2, ChevronRight, Lock, MapPin, Search } from "lucide-react";
import type { Job } from "@/lib/types";

const ALL = "Todos";

const uniqueOptions = (values: string[]) => [ALL, ...Array.from(new Set(values))];

const selectClass =
  "border border-brand-gray/20 rounded-xl px-3 py-2.5 text-xs bg-brand-bg/10 text-brand-navy focus:outline-none focus:border-brand-gold cursor-pointer";
const labelClass = "text-[10px] font-bold text-brand-navy uppercase mb-1.5";

/** Buscador, filtros y listado de vacantes. Los datos llegan ya cargados desde el servidor. */
export default function JobsExplorer({ jobs }: { jobs: Job[] }) {
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState(ALL);
  const [selectedLocation, setSelectedLocation] = useState(ALL);
  const [selectedType, setSelectedType] = useState(ALL);
  const [selectedStatus, setSelectedStatus] = useState(ALL);

  const areas = useMemo(() => uniqueOptions(jobs.map((j) => j.area)), [jobs]);
  const locations = useMemo(() => uniqueOptions(jobs.map((j) => j.location)), [jobs]);
  const types = useMemo(() => uniqueOptions(jobs.map((j) => j.type)), [jobs]);

  const filteredJobs = useMemo(() => {
    const q = search.toLowerCase();
    return jobs.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(q) || job.description.toLowerCase().includes(q);
      const matchesArea = selectedArea === ALL || job.area === selectedArea;
      const matchesLoc = selectedLocation === ALL || job.location === selectedLocation;
      const matchesType = selectedType === ALL || job.type === selectedType;
      const matchesStatus =
        selectedStatus === ALL ||
        (selectedStatus === "Activas" && job.active) ||
        (selectedStatus === "Cerradas" && !job.active);
      return matchesSearch && matchesArea && matchesLoc && matchesType && matchesStatus;
    });
  }, [jobs, search, selectedArea, selectedLocation, selectedType, selectedStatus]);

  return (
    <div className="lg:col-span-8 space-y-6">
      {/* Search and Filters Panel */}
      <div className="bg-white border border-brand-gray/10 p-6 rounded-2xl shadow-sm space-y-4">
        <div className="relative">
          <label htmlFor="job-search" className="sr-only">
            Buscar cargos
          </label>
          <Search aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-gray-dark" />
          <input
            id="job-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cargos (ej. Consultor, Jefe)..."
            className="w-full pl-12 pr-4 py-3.5 border border-brand-gray/20 rounded-xl bg-brand-bg/25 text-brand-navy text-sm focus:outline-none focus:border-brand-gold transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="flex flex-col">
            <label htmlFor="filter-area" className={labelClass}>
              Área de Trabajo
            </label>
            <select id="filter-area" value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)} className={selectClass}>
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="filter-location" className={labelClass}>
              Ubicación
            </label>
            <select
              id="filter-location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className={selectClass}
            >
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="filter-type" className={labelClass}>
              Tipo de Cargo
            </label>
            <select id="filter-type" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className={selectClass}>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="filter-status" className={labelClass}>
              Estado
            </label>
            <select
              id="filter-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={selectClass}
            >
              <option value="Todos">Todos</option>
              <option value="Activas">Convocatorias Abiertas</option>
              <option value="Cerradas">Procesos Cerrados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vacancies List */}
      <div className="space-y-4" aria-live="polite">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <article
              key={job.id}
              className={`p-6 sm:p-8 rounded-2xl shadow-sm transition-all duration-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border ${
                job.active
                  ? "bg-white border-brand-gray/10 hover:border-brand-gold/40 hover:shadow-md"
                  : "bg-slate-50/90 border-emerald-200/60 hover:border-emerald-300"
              }`}
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold text-brand-navy bg-brand-gold/15 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {job.area}
                  </span>

                  {job.active ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                      <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Convocatoria Abierta
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                      <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      Proceso Cerrado con Éxito
                    </span>
                  )}

                  {job.confidential && (
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                      <Lock aria-hidden="true" className="h-3 w-3" />
                      Búsqueda Confidencial
                    </span>
                  )}
                </div>

                <h3 className={`text-xl font-bold ${job.active ? "text-brand-navy" : "text-slate-800"}`}>{job.title}</h3>

                <div className="flex flex-wrap gap-4 text-xs text-brand-gray-dark font-medium">
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

              <Link
                href={`/vacantes/${job.id}`}
                aria-label={`${job.active ? "Postular a" : "Ver proceso de"} ${job.title}`}
                className={`inline-flex items-center justify-center text-xs font-bold py-3.5 px-6 rounded-xl transition-all shrink-0 gap-1.5 ${
                  job.active
                    ? "bg-brand-navy hover:bg-brand-blue-med text-white shadow-sm"
                    : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-sm"
                }`}
              >
                <span>{job.active ? "Postular / Detalle" : "Ver Proceso"}</span>
                <ChevronRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </article>
          ))
        ) : (
          <div className="text-center py-16 bg-white border border-brand-gray/10 rounded-2xl">
            <Building aria-hidden="true" className="h-12 w-12 text-brand-gray mx-auto mb-4" />
            <h3 className="text-lg font-bold text-brand-navy">No encontramos vacantes</h3>
            <p className="text-sm text-brand-gray-dark font-light">
              {jobs.length === 0
                ? "No hay convocatorias publicadas en este momento. Puedes dejarnos tu CV en la postulación espontánea."
                : "Intenta ajustando los filtros de búsqueda."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
