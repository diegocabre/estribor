"use client";

import {
  Briefcase,
  Calendar,
  Download,
  FileSpreadsheet,
  Filter,
  MapPin,
  RotateCcw,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import type { JobApplication } from "@/lib/types";
import { formatDateChile, safeHttpsUrl } from "../_lib/admin-api";
import { PERIOD_PRESETS, type ApplicationFilters } from "../_hooks/useApplicationFilters";

interface ApplicationsPanelProps {
  applications: JobApplication[];
  filters: ApplicationFilters;
  isRecruiter: boolean;
  onExport: () => void;
  onOpenCv: (id: string) => void;
  onDelete: (id: string) => void;
}

const filterLabelClass = "text-[10px] font-bold text-brand-navy uppercase mb-1 flex items-center gap-1";
const filterInputClass =
  "border border-brand-gray/20 rounded-lg text-xs bg-brand-bg/40 text-brand-navy focus:outline-none focus:border-brand-gold transition-colors";

export default function ApplicationsPanel({
  applications,
  filters,
  isRecruiter,
  onExport,
  onOpenCv,
  onDelete,
}: ApplicationsPanelProps) {
  const { filteredApplications, hasActiveFilters, resetFilters } = filters;

  return (
    <div className="space-y-6">
      {/* Header Toolbar: Filters Summary & Excel Export Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-brand-gray/10 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-brand-navy font-titles flex items-center gap-2">
              <Users aria-hidden="true" className="h-5 w-5 text-brand-gold" />
              Postulaciones Recibidas
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-bg text-brand-navy border border-brand-gray/20">
              {filteredApplications.length} de {applications.length}
            </span>
          </div>
          <p className="text-xs text-brand-gray-dark font-light mt-0.5">
            Filtra por período, vacante, cargo o ciudad y descarga la nómina completa en Excel con todos los datos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="px-3.5 py-2.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center gap-1.5"
              title="Restablecer todos los filtros"
            >
              <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
              Limpiar Filtros
            </button>
          )}

          <button
            type="button"
            onClick={onExport}
            disabled={filteredApplications.length === 0}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/40 disabled:cursor-not-allowed text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition-all shadow-sm shrink-0"
            title="Descargar las postulaciones seleccionadas en archivo Excel (.xlsx)"
          >
            <FileSpreadsheet aria-hidden="true" className="h-4 w-4" />
            <span>Descargar Excel ({filteredApplications.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Card */}
      <div className="bg-white p-5 rounded-2xl border border-brand-gray/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-gray/10 pb-3">
          <span className="text-xs font-bold text-brand-navy uppercase tracking-wider flex items-center gap-1.5">
            <Filter aria-hidden="true" className="h-3.5 w-3.5 text-brand-gold" />
            Filtros de Búsqueda
          </span>

          <div role="group" aria-label="Período" className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            {PERIOD_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => filters.applyPeriodPreset(p.id)}
                aria-pressed={filters.filterPeriod === p.id}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  filters.filterPeriod === p.id
                    ? "bg-brand-navy text-white"
                    : "bg-brand-bg/60 text-brand-navy/70 hover:bg-brand-bg hover:text-brand-navy"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5">
          <div className="lg:col-span-4 grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <label htmlFor="filter-from" className={filterLabelClass}>
                <Calendar aria-hidden="true" className="h-3 w-3 text-brand-gold" />
                Desde
              </label>
              <input
                id="filter-from"
                type="date"
                value={filters.filterDateFrom}
                onChange={(e) => filters.setDateFrom(e.target.value)}
                className={`${filterInputClass} px-2.5 py-2`}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="filter-to" className={filterLabelClass}>
                <Calendar aria-hidden="true" className="h-3 w-3 text-brand-gold" />
                Hasta
              </label>
              <input
                id="filter-to"
                type="date"
                value={filters.filterDateTo}
                onChange={(e) => filters.setDateTo(e.target.value)}
                className={`${filterInputClass} px-2.5 py-2`}
              />
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col">
            <label htmlFor="filter-job" className={filterLabelClass}>
              <Briefcase aria-hidden="true" className="h-3 w-3 text-brand-gold" />
              Vacante / Cargo
            </label>
            <select
              id="filter-job"
              value={filters.filterJob}
              onChange={(e) => filters.setFilterJob(e.target.value)}
              className={`${filterInputClass} px-3 py-2 truncate`}
            >
              <option value="all">Todos los cargos y vacantes</option>
              {filters.availableJobs.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2 flex flex-col">
            <label htmlFor="filter-city" className={filterLabelClass}>
              <MapPin aria-hidden="true" className="h-3 w-3 text-brand-gold" />
              Ciudad
            </label>
            <select
              id="filter-city"
              value={filters.filterCity}
              onChange={(e) => filters.setFilterCity(e.target.value)}
              className={`${filterInputClass} px-3 py-2 truncate`}
            >
              <option value="all">Todas las ciudades</option>
              {filters.availableCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-3 flex flex-col">
            <label htmlFor="filter-search" className={filterLabelClass}>
              <Search aria-hidden="true" className="h-3 w-3 text-brand-gold" />
              Buscar
            </label>
            <div className="relative">
              <input
                id="filter-search"
                type="text"
                value={filters.filterSearch}
                onChange={(e) => filters.setFilterSearch(e.target.value)}
                placeholder="Nombre, RUT, correo..."
                className={`w-full ${filterInputClass} pl-8 pr-7 py-2 placeholder:text-brand-gray-dark/60`}
              />
              <Search
                aria-hidden="true"
                className="h-3.5 w-3.5 text-brand-gray-dark absolute left-2.5 top-1/2 -translate-y-1/2"
              />
              {filters.filterSearch && (
                <button
                  type="button"
                  onClick={() => filters.setFilterSearch("")}
                  aria-label="Borrar búsqueda"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-gray-dark hover:text-brand-navy"
                >
                  <X aria-hidden="true" className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table wrapper */}
      <div className="bg-white border border-brand-gray/10 rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <caption className="sr-only">Postulaciones recibidas</caption>
          <thead>
            <tr className="bg-brand-bg/50 border-b border-brand-gray/10 text-brand-navy font-bold uppercase tracking-wider">
              <th scope="col" className="p-4">Postulante</th>
              <th scope="col" className="p-4">RUT</th>
              <th scope="col" className="p-4">Puesto al que Postula</th>
              <th scope="col" className="p-4">Contacto</th>
              <th scope="col" className="p-4">Pretensión</th>
              <th scope="col" className="p-4">Disponibilidad</th>
              <th scope="col" className="p-4">F. Aplicación</th>
              <th scope="col" className="p-4">CV</th>
              <th scope="col" className="p-4 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-gray/5 text-brand-navy font-light">
            {filteredApplications.map((app) => {
              const linkedin = safeHttpsUrl(app.linkedinProfile);
              return (
                <tr key={app.id} className="hover:bg-brand-bg/20 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-brand-navy">{app.fullName}</div>
                    <div className="text-[10px] text-brand-gray-dark flex items-center gap-1 mt-0.5">
                      <MapPin aria-hidden="true" className="h-3 w-3 text-brand-gold shrink-0" />
                      <span>{app.city || "Sin ciudad"}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-medium">{app.rut}</td>
                  <td className="p-4 font-semibold text-brand-navy max-w-[220px]">
                    <div className="truncate" title={app.jobTitle}>
                      {app.jobTitle}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="truncate max-w-[180px]" title={app.email}>
                      {app.email}
                    </div>
                    <div className="text-[10px] text-brand-gray-dark mt-0.5">{app.phone}</div>
                    {linkedin && (
                      <a
                        href={linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] font-bold text-brand-blue-light hover:underline block mt-0.5"
                      >
                        Ver LinkedIn
                      </a>
                    )}
                  </td>
                  <td className="p-4 font-semibold whitespace-nowrap">{app.salaryExpectation}</td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="text-[10px] font-semibold bg-brand-bg px-2.5 py-1 rounded-full text-brand-navy border border-brand-gray/15">
                      {app.availability || "Inmediata"}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap text-brand-gray-dark text-[11px]">{formatDateChile(app.appliedAt)}</td>
                  <td className="p-4 whitespace-nowrap">
                    {app.cvFileName ? (
                      <button
                        type="button"
                        onClick={() => onOpenCv(app.id)}
                        aria-label={`Ver CV de ${app.fullName}`}
                        className="px-2.5 py-1 bg-brand-navy text-white rounded flex items-center gap-1 hover:bg-brand-blue-med transition-colors text-[9px] w-fit font-bold"
                      >
                        <Download aria-hidden="true" className="h-3 w-3" />
                        Ver CV
                      </button>
                    ) : (
                      <span className="text-[10px] text-brand-gray-dark">Sin Archivo</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {!isRecruiter ? (
                      <button
                        type="button"
                        onClick={() => onDelete(app.id)}
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors"
                        title="Eliminar postulación"
                        aria-label={`Eliminar postulación de ${app.fullName}`}
                      >
                        <Trash2 aria-hidden="true" className="h-4 w-4" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-brand-gray-dark/50 italic select-none">Registrada</span>
                    )}
                  </td>
                </tr>
              );
            })}

            {filteredApplications.length === 0 && applications.length > 0 && (
              <tr>
                <td colSpan={9} className="text-center p-12 text-brand-gray-dark font-light">
                  <Filter aria-hidden="true" className="h-10 w-10 text-brand-gray mx-auto mb-3 opacity-40" />
                  <p className="font-semibold text-brand-navy text-sm mb-1">
                    No se encontraron postulaciones con los filtros seleccionados
                  </p>
                  <p className="text-xs text-brand-gray-dark mb-4">
                    Intenta ajustar el período de fechas, cargo o ciudad para ampliar los resultados.
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-4 py-2 bg-brand-navy text-white text-xs font-bold rounded-xl hover:bg-brand-blue-med transition-colors inline-flex items-center gap-1.5"
                  >
                    <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
                    Restablecer Filtros
                  </button>
                </td>
              </tr>
            )}

            {applications.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center p-12 text-brand-gray-dark font-light">
                  <Users aria-hidden="true" className="h-10 w-10 text-brand-gray mx-auto mb-3" />
                  No se han recibido postulaciones en la plataforma.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
