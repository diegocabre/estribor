"use client";

import { useCallback, useState } from "react";
import type { Job, JobApplication, JobArea } from "@/lib/types";
import { AdminApiError, DEFAULT_AREAS, adminFetch, defaultAreaList, errorMessage, type StaffRole } from "../_lib/admin-api";

export interface JobPayload {
  title: string;
  area: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  functions: string;
  confidential: boolean;
}

const byName = (a: JobArea, b: JobArea) => a.name.localeCompare(b.name);

/**
 * Datos del panel y sus operaciones. Todo pasa por /api/admin/*, que valida el JWT y el rol
 * en el servidor; los controles por rol de esta capa solo ocultan acciones no permitidas.
 */
export function useAdminData({ onUnauthorized }: { onUnauthorized: (reason: string) => void }) {
  const [areas, setAreas] = useState<JobArea[]>(defaultAreaList);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [staffRole, setStaffRole] = useState<StaffRole | null>(null);
  const [savingArea, setSavingArea] = useState(false);
  const [deletingAreaName, setDeletingAreaName] = useState<string | null>(null);
  const [savingJob, setSavingJob] = useState(false);

  // Mientras el servidor no confirma el rol, se asume el de menos permisos.
  const isRecruiter = staffRole !== "admin";

  const fetchData = useCallback(async () => {
    try {
      const data = await adminFetch<{
        role: StaffRole;
        areas: JobArea[];
        jobs: Job[];
        applications: JobApplication[];
      }>("/api/admin/data");

      setStaffRole(data.role);
      setJobs(data.jobs);
      setApplications(data.applications);

      if (data.areas.length > 0) {
        setAreas(data.areas);
      } else {
        // Si job_areas está vacía, usar las áreas por defecto más las de las vacantes.
        const jobAreas = data.jobs.map((j) => j.area).filter(Boolean);
        setAreas(Array.from(new Set([...DEFAULT_AREAS, ...jobAreas])).map((name) => ({ name })));
      }
    } catch (err) {
      if (err instanceof AdminApiError && (err.status === 401 || err.status === 403)) {
        onUnauthorized(err.message);
      } else {
        console.error("Error al cargar los datos del panel:", err);
      }
    }
  }, [onUnauthorized]);

  const reset = useCallback(() => {
    setJobs([]);
    setApplications([]);
    setStaffRole(null);
  }, []);

  /** Agrega un área si no existe. Devuelve el nombre a seleccionar, o null si falló. */
  const addArea = async (nameToAdd: string): Promise<string | null> => {
    const trimmed = nameToAdd.trim();
    if (!trimmed) {
      alert("Por favor ingresa un nombre para el área.");
      return null;
    }
    if (areas.some((a) => a.name.toLowerCase() === trimmed.toLowerCase())) {
      alert("Esta área ya existe en la lista.");
      return trimmed;
    }

    setSavingArea(true);
    try {
      const { area: created } = await adminFetch<{ area: JobArea }>("/api/admin/areas", {
        method: "POST",
        body: JSON.stringify({ name: trimmed }),
      });
      setAreas((prev) =>
        [...prev.filter((a) => a.name.toLowerCase() !== trimmed.toLowerCase()), created].sort(byName)
      );
      return trimmed;
    } catch (err) {
      alert(`Error al guardar el área: ${errorMessage(err)}`);
      return null;
    } finally {
      setSavingArea(false);
    }
  };

  /** Elimina un área tras confirmar. Devuelve la lista resultante, o null si no se eliminó. */
  const deleteArea = async (areaToDelete: JobArea): Promise<JobArea[] | null> => {
    if (isRecruiter) {
      alert("Tu cuenta no tiene permisos para eliminar áreas.");
      return null;
    }
    const jobsCount = jobs.filter((j) => j.area === areaToDelete.name).length;
    let confirmMsg = `¿Estás seguro de que deseas eliminar el área "${areaToDelete.name}" de la base de datos?`;
    if (jobsCount > 0) {
      confirmMsg += `\n\nAtención: Existen ${jobsCount} vacante(s) asociada(s) a esta área. Dichas vacantes mantendrán su historial, pero el área ya no estará disponible para nuevas publicaciones.`;
    }
    if (!confirm(confirmMsg)) return null;

    setDeletingAreaName(areaToDelete.name);
    try {
      await adminFetch("/api/admin/areas", {
        method: "DELETE",
        body: JSON.stringify({ id: areaToDelete.id, name: areaToDelete.name }),
      });
      const updated = areas.filter((a) => a.name !== areaToDelete.name);
      setAreas(updated);
      return updated;
    } catch (err) {
      alert(`Error al eliminar el área: ${errorMessage(err)}`);
      return null;
    } finally {
      setDeletingAreaName(null);
    }
  };

  /** Asegura que el área de una vacante antigua aparezca en la lista al editarla. */
  const ensureArea = (name: string) => {
    if (name && !areas.some((a) => a.name === name)) {
      setAreas((prev) => [...prev, { name }].sort(byName));
    }
  };

  const saveJob = async (payload: JobPayload, editingId?: string): Promise<boolean> => {
    setSavingJob(true);
    try {
      if (editingId) {
        await adminFetch("/api/admin/jobs", { method: "PATCH", body: JSON.stringify({ id: editingId, ...payload }) });
      } else {
        await adminFetch("/api/admin/jobs", { method: "POST", body: JSON.stringify(payload) });
      }
      await fetchData();
      return true;
    } catch (err) {
      alert(`Error al guardar la vacante: ${errorMessage(err)}`);
      return false;
    } finally {
      setSavingJob(false);
    }
  };

  const toggleJobStatus = async (job: Job) => {
    try {
      await adminFetch("/api/admin/jobs", { method: "PATCH", body: JSON.stringify({ id: job.id, active: !job.active }) });
      await fetchData();
    } catch (err) {
      alert(`Error al cambiar el estado: ${errorMessage(err)}`);
    }
  };

  const deleteJob = async (id: string) => {
    if (isRecruiter) {
      alert("Tu cuenta no tiene permisos para eliminar vacantes.");
      return;
    }
    if (!confirm("¿Estás seguro de que deseas eliminar esta vacante de la base de datos de forma permanente?")) return;
    try {
      await adminFetch("/api/admin/jobs", { method: "DELETE", body: JSON.stringify({ id }) });
      await fetchData();
    } catch (err) {
      alert(`Error al eliminar la vacante: ${errorMessage(err)}`);
    }
  };

  /** Los CVs están en un bucket privado: se pide una URL firmada de corta duración. */
  const openCv = async (applicationId: string) => {
    // Abrir la pestaña antes del await evita que el navegador la bloquee como popup.
    const tab = window.open("", "_blank");
    try {
      const { url } = await adminFetch<{ url: string }>(`/api/admin/cv?id=${encodeURIComponent(applicationId)}`);
      if (tab) {
        tab.opener = null;
        tab.location.href = url;
      } else {
        window.location.href = url;
      }
    } catch (err) {
      tab?.close();
      alert(`No se pudo abrir el CV: ${errorMessage(err)}`);
    }
  };

  const deleteApplication = async (id: string) => {
    if (isRecruiter) {
      alert("Tu cuenta no tiene permisos para eliminar postulaciones.");
      return;
    }
    if (!confirm("¿Estás seguro de que deseas eliminar permanentemente esta postulación de la base de datos?")) return;
    try {
      await adminFetch("/api/admin/applications", { method: "DELETE", body: JSON.stringify({ id }) });
      await fetchData();
    } catch (err) {
      alert(`Error al eliminar la postulación: ${errorMessage(err)}`);
    }
  };

  return {
    areas,
    jobs,
    applications,
    isRecruiter,
    savingArea,
    deletingAreaName,
    savingJob,
    fetchData,
    reset,
    addArea,
    deleteArea,
    ensureArea,
    saveJob,
    toggleJobStatus,
    deleteJob,
    openCv,
    deleteApplication,
  };
}

export type AdminData = ReturnType<typeof useAdminData>;
