"use client";

import { useState } from "react";
import { Check, Loader2, Plus, Trash2, X } from "lucide-react";
import type { Job } from "@/lib/types";
import type { AdminData } from "../_hooks/useAdminData";
import ModalShell from "./ModalShell";

const inputClass =
  "border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold";
const labelClass = "text-[10px] font-bold text-brand-navy uppercase mb-1";

interface JobFormModalProps {
  data: AdminData;
  editingJob: Job | null;
  onClose: () => void;
}

/** Crear o editar una vacante. Se monta al abrir, así el estado parte desde la vacante elegida. */
export default function JobFormModal({ data, editingJob, onClose }: JobFormModalProps) {
  const { areas, isRecruiter } = data;

  const [title, setTitle] = useState(editingJob?.title ?? "");
  const [area, setArea] = useState(editingJob?.area ?? (areas[0]?.name || "Gestión de Personas"));
  const [location, setLocation] = useState(editingJob?.location ?? "");
  const [type, setType] = useState(editingJob?.type ?? "Full-time");
  const [description, setDescription] = useState(editingJob?.description ?? "");
  const [requirements, setRequirements] = useState(editingJob?.requirements ?? "");
  const [functions, setFunctions] = useState(editingJob?.functions ?? "");
  const [confidential, setConfidential] = useState(editingJob?.confidential ?? false);
  const [isAddingArea, setIsAddingArea] = useState(false);
  const [newAreaInput, setNewAreaInput] = useState("");

  const startAddingArea = () => {
    setIsAddingArea(true);
    setNewAreaInput("");
  };

  const cancelAddingArea = () => {
    setIsAddingArea(false);
    setNewAreaInput("");
  };

  const handleAddArea = async () => {
    const selected = await data.addArea(newAreaInput);
    if (selected) {
      setArea(selected);
      cancelAddingArea();
    }
  };

  const handleDeleteSelectedArea = async () => {
    const target = areas.find((a) => a.name === area);
    if (!target) return;
    const updated = await data.deleteArea(target);
    if (updated) setArea(updated[0]?.name ?? "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const saved = await data.saveJob(
      { title, area, location, type, description, requirements, functions, confidential },
      editingJob?.id
    );
    if (saved) onClose();
  };

  return (
    <ModalShell
      labelledBy="job-form-title"
      onClose={onClose}
      className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border-t-8 border-brand-gold"
    >
      <div className="p-8">
        <h2 id="job-form-title" className="text-2xl font-bold text-brand-navy mb-6 font-titles">
          {editingJob ? "Editar Vacante" : "Publicar Nueva Vacante"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="job-title" className={labelClass}>
                Título de la Vacante *
              </label>
              <input
                id="job-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Consultor SST"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor={isAddingArea ? "job-new-area" : "job-area"} className="text-[10px] font-bold text-brand-navy uppercase">
                  Área *
                </label>
                {!isAddingArea && (
                  <button
                    type="button"
                    onClick={startAddingArea}
                    className="text-[10px] font-semibold text-brand-gold-dark hover:text-brand-navy flex items-center gap-1 transition-colors"
                  >
                    <Plus aria-hidden="true" className="h-3 w-3" />
                    Agregar nueva área
                  </button>
                )}
              </div>

              {isAddingArea ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <input
                      id="job-new-area"
                      type="text"
                      value={newAreaInput}
                      onChange={(e) => setNewAreaInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddArea();
                        }
                      }}
                      placeholder="Ej. Finanzas y Control de Gestión"
                      autoFocus
                      className="border border-brand-gold rounded-lg px-3 py-2 text-xs bg-white text-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-gold flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleAddArea}
                      disabled={data.savingArea || !newAreaInput.trim()}
                      className="bg-brand-navy hover:bg-brand-blue-med disabled:opacity-50 text-white p-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center"
                      title="Guardar área en la BD"
                      aria-label="Guardar área"
                    >
                      {data.savingArea ? (
                        <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check aria-hidden="true" className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={cancelAddingArea}
                      className="border border-brand-gray/20 hover:bg-brand-bg text-brand-gray-dark p-2 rounded-lg text-xs transition-colors"
                      title="Cancelar"
                      aria-label="Cancelar nueva área"
                    >
                      <X aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-[10px] text-brand-gray-dark font-light">
                    Presiona Enter o el check para guardar en la BD.
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <select
                    id="job-area"
                    value={area}
                    onChange={(e) => {
                      if (e.target.value === "__NEW__") {
                        startAddingArea();
                      } else {
                        setArea(e.target.value);
                      }
                    }}
                    className={`${inputClass} flex-1 cursor-pointer`}
                  >
                    {areas.map((a) => (
                      <option key={a.id || a.name} value={a.name}>
                        {a.name}
                      </option>
                    ))}
                    <option value="__NEW__" className="text-brand-gold font-bold">
                      + Otra área (escribir nueva)...
                    </option>
                  </select>
                  {!isRecruiter && area && areas.some((a) => a.name === area) && (
                    <button
                      type="button"
                      onClick={handleDeleteSelectedArea}
                      disabled={data.deletingAreaName === area || areas.length <= 1}
                      className="p-2 border border-brand-gray/20 hover:border-rose-300 hover:bg-rose-50 text-brand-gray-dark hover:text-rose-600 rounded-lg text-xs transition-colors"
                      title={`Eliminar área "${area}" de la lista y BD`}
                      aria-label={`Eliminar área ${area}`}
                    >
                      {data.deletingAreaName === area ? (
                        <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin text-rose-600" />
                      ) : (
                        <Trash2 aria-hidden="true" className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="job-location" className={labelClass}>
                Ubicación / Ciudad *
              </label>
              <input
                id="job-location"
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej. Puerto Montt"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="job-type" className={labelClass}>
                Tipo de Cargo *
              </label>
              <select id="job-type" value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Remoto">Remoto</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 py-2">
            <input
              type="checkbox"
              id="confidential"
              checked={confidential}
              onChange={(e) => setConfidential(e.target.checked)}
              className="h-4.5 w-4.5 text-brand-gold border-brand-gray/30 rounded focus:ring-brand-gold cursor-pointer"
            />
            <label htmlFor="confidential" className="text-xs text-brand-navy font-semibold cursor-pointer select-none flex items-center gap-1">
              Marcar como Búsqueda Confidencial
            </label>
          </div>

          <div className="flex flex-col">
            <label htmlFor="job-description" className={labelClass}>
              Misión / Descripción General *
            </label>
            <textarea
              id="job-description"
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe de qué trata el puesto..."
              className={`${inputClass} resize-none`}
            ></textarea>
          </div>

          <div className="flex flex-col">
            <label htmlFor="job-functions" className={labelClass}>
              Responsabilidades / Funciones * (Separar por puntos para viñetas)
            </label>
            <textarea
              id="job-functions"
              rows={3}
              required
              value={functions}
              onChange={(e) => setFunctions(e.target.value)}
              placeholder="Ej. Ejecutar auditorías preventivas en plantas. Redactar informes de control."
              className={`${inputClass} resize-none`}
            ></textarea>
          </div>

          <div className="flex flex-col">
            <label htmlFor="job-requirements" className={labelClass}>
              Requisitos Excluyentes * (Separar por comas para viñetas)
            </label>
            <textarea
              id="job-requirements"
              rows={2}
              required
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Ej. 10 años de experiencia, Título de Ingeniero SNS, Residencia local"
              className={`${inputClass} resize-none`}
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-brand-gray/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-brand-gray/20 rounded-xl text-xs hover:bg-brand-bg text-brand-navy font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={data.savingJob}
              className="bg-brand-navy hover:bg-brand-blue-med text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              {data.savingJob ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
              {editingJob ? "Guardar Cambios" : "Publicar Vacante"}
            </button>
          </div>
        </form>
      </div>
    </ModalShell>
  );
}
