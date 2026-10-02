"use client";

import { useMemo, useState } from "react";
import type { Job, JobApplication } from "@/lib/types";

export type PeriodPreset = "all" | "today" | "7d" | "30d" | "this_month" | "custom";

export const PERIOD_PRESETS: { id: PeriodPreset; label: string }[] = [
  { id: "all", label: "Todo el período" },
  { id: "today", label: "Hoy" },
  { id: "7d", label: "Últimos 7 días" },
  { id: "30d", label: "Últimos 30 días" },
  { id: "this_month", label: "Este mes" },
];

const formatYMD = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const sortedUnique = (values: string[]) => Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));

/** Filtros de la tabla de postulaciones: período, vacante, ciudad y búsqueda libre. */
export function useApplicationFilters(applications: JobApplication[], jobs: Job[]) {
  const [filterPeriod, setFilterPeriod] = useState<PeriodPreset>("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterJob, setFilterJob] = useState("all");
  const [filterCity, setFilterCity] = useState("all");
  const [filterSearch, setFilterSearch] = useState("");

  const applyPeriodPreset = (preset: PeriodPreset) => {
    setFilterPeriod(preset);
    const now = new Date();
    const daysAgo = (days: number) => {
      const past = new Date();
      past.setDate(now.getDate() - days);
      return formatYMD(past);
    };

    if (preset === "all") {
      setFilterDateFrom("");
      setFilterDateTo("");
    } else if (preset === "today") {
      setFilterDateFrom(formatYMD(now));
      setFilterDateTo(formatYMD(now));
    } else if (preset === "7d") {
      setFilterDateFrom(daysAgo(7));
      setFilterDateTo(formatYMD(now));
    } else if (preset === "30d") {
      setFilterDateFrom(daysAgo(30));
      setFilterDateTo(formatYMD(now));
    } else if (preset === "this_month") {
      setFilterDateFrom(formatYMD(new Date(now.getFullYear(), now.getMonth(), 1)));
      setFilterDateTo(formatYMD(now));
    }
  };

  const setDateFrom = (value: string) => {
    setFilterDateFrom(value);
    setFilterPeriod("custom");
  };

  const setDateTo = (value: string) => {
    setFilterDateTo(value);
    setFilterPeriod("custom");
  };

  const resetFilters = () => {
    setFilterPeriod("all");
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterJob("all");
    setFilterCity("all");
    setFilterSearch("");
  };

  const hasActiveFilters =
    filterPeriod !== "all" ||
    !!filterDateFrom ||
    !!filterDateTo ||
    filterJob !== "all" ||
    filterCity !== "all" ||
    !!filterSearch.trim();

  // Cargos de las postulaciones y de las vacantes registradas.
  const availableJobs = useMemo(
    () => sortedUnique([...applications.map((a) => a.jobTitle), ...jobs.map((j) => j.title)].filter(Boolean)),
    [applications, jobs]
  );

  const availableCities = useMemo(
    () => sortedUnique(applications.map((a) => (a.city || "").trim()).filter(Boolean)),
    [applications]
  );

  const filteredApplications = useMemo(() => {
    const fromDate = filterDateFrom ? new Date(`${filterDateFrom}T00:00:00`) : null;
    const toDate = filterDateTo ? new Date(`${filterDateTo}T23:59:59.999`) : null;
    const q = filterSearch.trim().toLowerCase();

    return applications.filter((app) => {
      if (fromDate || toDate) {
        if (!app.appliedAt) return false;
        const appDate = new Date(app.appliedAt);
        if (isNaN(appDate.getTime())) return false;
        if (fromDate && appDate < fromDate) return false;
        if (toDate && appDate > toDate) return false;
      }

      if (filterJob !== "all" && app.jobTitle !== filterJob) return false;

      if (filterCity !== "all" && (app.city || "").trim().toLowerCase() !== filterCity.trim().toLowerCase()) {
        return false;
      }

      if (q) {
        const haystack = [app.fullName, app.rut, app.email, app.phone, app.jobTitle, app.city]
          .map((v) => (v || "").toLowerCase());
        if (!haystack.some((v) => v.includes(q))) return false;
      }

      return true;
    });
  }, [applications, filterDateFrom, filterDateTo, filterJob, filterCity, filterSearch]);

  return {
    filterPeriod,
    filterDateFrom,
    filterDateTo,
    filterJob,
    filterCity,
    filterSearch,
    setFilterJob,
    setFilterCity,
    setFilterSearch,
    setDateFrom,
    setDateTo,
    applyPeriodPreset,
    resetFilters,
    hasActiveFilters,
    availableJobs,
    availableCities,
    filteredApplications,
  };
}

export type ApplicationFilters = ReturnType<typeof useApplicationFilters>;
