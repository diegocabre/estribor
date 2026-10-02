"use client";

import { useState } from "react";
import { FolderKanban, Loader2, Plus, Tag, Trash2, X } from "lucide-react";
import type { AdminData } from "../_hooks/useAdminData";
import ModalShell from "./ModalShell";

export default function AreasManagerModal({ data, onClose }: { data: AdminData; onClose: () => void }) {
  const [newAreaInput, setNewAreaInput] = useState("");
  const { areas, jobs } = data;

  const submit = async () => {
    if (!newAreaInput.trim()) return;
    const added = await data.addArea(newAreaInput);
    if (added) setNewAreaInput("");
  };

  return (
    <ModalShell
      labelledBy="areas-manager-title"
      onClose={onClose}
      className="bg-white rounded-3xl max-w-lg w-full shadow-2xl relative border-t-8 border-brand-gold overflow-hidden max-h-[85vh] flex flex-col"
    >
      <div className="p-6 border-b border-brand-gray/10 flex items-center justify-between">
        <h2 id="areas-manager-title" className="text-xl font-bold text-brand-navy font-titles flex items-center gap-2">
          <FolderKanban aria-hidden="true" className="h-5 w-5 text-brand-gold" />
          Gestión de Áreas de Vacantes
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-brand-bg text-brand-gray-dark transition-colors"
          title="Cerrar"
          aria-label="Cerrar"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>

      <div className="p-6 overflow-y-auto space-y-6">
        <div>
          <label htmlFor="manager-new-area" className="text-[10px] font-bold text-brand-navy uppercase mb-1.5 block">
            Agregar Nueva Área a la Base de Datos
          </label>
          <div className="flex gap-2">
            <input
              id="manager-new-area"
              type="text"
              value={newAreaInput}
              onChange={(e) => setNewAreaInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder="Ej. Finanzas y Control de Gestión"
              className="flex-1 border border-brand-gray/20 rounded-xl px-3.5 py-2.5 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold transition-colors"
            />
            <button
              type="button"
              onClick={submit}
              disabled={data.savingArea || !newAreaInput.trim()}
              className="bg-brand-navy hover:bg-brand-blue-med disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap"
            >
              {data.savingArea ? (
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
              ) : (
                <Plus aria-hidden="true" className="h-4 w-4" />
              )}
              Agregar
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-brand-navy uppercase">Áreas Registradas ({areas.length})</span>
            <span className="text-[10px] text-brand-gray-dark font-light">Disponibles en el formulario</span>
          </div>

          <ul className="border border-brand-gray/10 rounded-2xl overflow-hidden divide-y divide-brand-gray/10">
            {areas.map((a) => {
              const jobsCount = jobs.filter((j) => j.area === a.name).length;
              const isDeleting = data.deletingAreaName === a.name;

              return (
                <li key={a.id || a.name} className="flex items-center justify-between p-3 hover:bg-brand-bg/30 transition-colors">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <Tag aria-hidden="true" className="h-3.5 w-3.5 text-brand-gold shrink-0" />
                    <span className="text-xs font-bold text-brand-navy truncate">{a.name}</span>
                    <span className="text-[10px] text-brand-gray-dark bg-brand-bg px-2 py-0.5 rounded-full shrink-0 font-medium">
                      {jobsCount === 1 ? "1 vacante" : `${jobsCount} vacantes`}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => data.deleteArea(a)}
                    disabled={isDeleting || areas.length <= 1}
                    className="p-1.5 text-brand-gray-dark hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-30"
                    title={areas.length <= 1 ? "Debe existir al menos una área" : `Eliminar "${a.name}" de la BD`}
                    aria-label={`Eliminar área ${a.name}`}
                  >
                    {isDeleting ? (
                      <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin text-rose-600" />
                    ) : (
                      <Trash2 aria-hidden="true" className="h-4 w-4" />
                    )}
                  </button>
                </li>
              );
            })}

            {areas.length === 0 && (
              <li className="p-6 text-center text-xs text-brand-gray-dark font-light">No hay áreas registradas. Agrega una arriba.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="p-4 border-t border-brand-gray/10 bg-brand-bg/30 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 bg-brand-navy hover:bg-brand-blue-med text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
        >
          Listo
        </button>
      </div>
    </ModalShell>
  );
}
