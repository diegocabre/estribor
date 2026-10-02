"use client";

import { Archive, CheckCircle2, Edit2, FolderKanban, Plus, Trash2, XCircle } from "lucide-react";
import type { Job } from "@/lib/types";

interface JobsPanelProps {
  jobs: Job[];
  areasCount: number;
  isRecruiter: boolean;
  onManageAreas: () => void;
  onCreate: () => void;
  onEdit: (job: Job) => void;
  onToggle: (job: Job) => void;
  onDelete: (id: string) => void;
}

export default function JobsPanel({
  jobs,
  areasCount,
  isRecruiter,
  onManageAreas,
  onCreate,
  onEdit,
  onToggle,
  onDelete,
}: JobsPanelProps) {
  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-white p-4 rounded-xl border border-brand-gray/10 shadow-sm">
        <span className="text-xs text-brand-gray-dark font-medium">Búsquedas activas listas para reclutar.</span>
        <div className="flex items-center gap-2">
          {!isRecruiter && (
            <button
              type="button"
              onClick={onManageAreas}
              className="px-3.5 py-2.5 border border-brand-navy/20 hover:border-brand-navy hover:bg-brand-bg text-brand-navy text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              title="Gestionar lista de áreas disponibles"
            >
              <FolderKanban aria-hidden="true" className="h-4 w-4 text-brand-gold" />
              Gestionar Áreas ({areasCount})
            </button>
          )}
          <button
            type="button"
            onClick={onCreate}
            className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Crear Vacante
          </button>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white border border-brand-gray/10 rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <caption className="sr-only">Ofertas publicadas</caption>
          <thead>
            <tr className="bg-brand-bg/50 border-b border-brand-gray/10 text-brand-navy font-bold uppercase tracking-wider">
              <th scope="col" className="p-4">Cargo</th>
              <th scope="col" className="p-4">Área</th>
              <th scope="col" className="p-4">Ubicación</th>
              <th scope="col" className="p-4">Tipo</th>
              <th scope="col" className="p-4">Confidencial</th>
              <th scope="col" className="p-4">Estado</th>
              <th scope="col" className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-gray/5 text-brand-navy font-light">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-brand-bg/20 transition-colors">
                <td className="p-4 font-bold">{job.title}</td>
                <td className="p-4">{job.area}</td>
                <td className="p-4">{job.location}</td>
                <td className="p-4">{job.type}</td>
                <td className="p-4">
                  {job.confidential ? (
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">Sí</span>
                  ) : (
                    <span className="text-[10px] font-bold text-brand-gray-dark bg-brand-bg px-2 py-0.5 rounded-full">No</span>
                  )}
                </td>
                <td className="p-4">
                  {job.active ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 inline-flex items-center gap-1">
                      <CheckCircle2 aria-hidden="true" className="h-3 w-3" />
                      Activa
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100 inline-flex items-center gap-1">
                      <XCircle aria-hidden="true" className="h-3 w-3" />
                      Cerrada
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggle(job)}
                      className="p-1.5 hover:bg-brand-bg rounded-lg text-brand-navy transition-colors"
                      title={job.active ? "Cerrar vacante" : "Reabrir vacante"}
                      aria-label={`${job.active ? "Cerrar" : "Reabrir"} vacante ${job.title}`}
                    >
                      <Archive aria-hidden="true" className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(job)}
                      className="p-1.5 hover:bg-brand-bg rounded-lg text-brand-blue-light transition-colors"
                      title="Editar vacante"
                      aria-label={`Editar vacante ${job.title}`}
                    >
                      <Edit2 aria-hidden="true" className="h-4 w-4" />
                    </button>
                    {!isRecruiter && (
                      <button
                        type="button"
                        onClick={() => onDelete(job.id)}
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors"
                        title="Eliminar vacante"
                        aria-label={`Eliminar vacante ${job.title}`}
                      >
                        <Trash2 aria-hidden="true" className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-12 text-brand-gray-dark font-light">
                  No hay ofertas publicadas. Haz clic en &quot;Crear Vacante&quot; para publicar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
