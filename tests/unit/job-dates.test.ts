import { describe, expect, it } from "vitest";
import { formatClosingDate, isJobExpired, jobValidThrough, todayInChile } from "@/lib/job-dates";
import { jobPostingJsonLd } from "@/lib/seo";
import { jobSchema } from "@/lib/validation";
import type { Job } from "@/lib/types";

const job: Job = {
  id: "1",
  title: "Encargado(a) de Calidad de Agua",
  area: "Acuicultura",
  location: "Pargua",
  region: "Región de Los Lagos",
  type: "Full-time",
  description: "Descripción",
  requirements: "",
  functions: "",
  confidential: false,
  active: true,
  createdAt: "2026-09-17T20:36:38.951Z",
  closesAt: "2026-11-16",
};

describe("fecha de cierre de vacantes", () => {
  it("usa la fecha de cierre como último día de postulación", () => {
    expect(jobValidThrough(job)).toBe("2026-11-16");
  });

  it("sin fecha de cierre, usa publicación + 60 días", () => {
    expect(jobValidThrough({ ...job, closesAt: null })).toBe("2026-11-16");
  });

  it("vence al terminar el último día en hora de Chile", () => {
    // 16-nov 23:30 en Chile (UTC-3) sigue vigente; el 17-nov ya venció.
    expect(isJobExpired(job, new Date("2026-11-17T02:30:00Z"))).toBe(false);
    expect(isJobExpired(job, new Date("2026-11-17T03:30:00Z"))).toBe(true);
    expect(todayInChile(new Date("2026-11-17T02:30:00Z"))).toBe("2026-11-16");
  });

  it("formatea la fecha en español con el mes en minúscula", () => {
    expect(formatClosingDate("2026-11-16")).toBe("16 de noviembre de 2026");
  });

  it("el JobPosting usa la fecha de cierre como validThrough", () => {
    expect(jobPostingJsonLd(job).validThrough).toBe("2026-11-16");
  });

  it("valida la fecha de cierre del formulario", () => {
    const base = { title: "Cargo", area: "Área", location: "Pargua", type: "Full-time", description: "Texto" };
    expect(jobSchema.parse({ ...base, closesAt: "2026-11-16" }).closesAt).toBe("2026-11-16");
    expect(jobSchema.parse(base).closesAt).toBeNull();
    expect(jobSchema.safeParse({ ...base, closesAt: "16/11/2026" }).success).toBe(false);
  });

  it("usa la región de cada vacante en el JobPosting", () => {
    const santiago = { ...job, location: "Santiago", region: "Región Metropolitana de Santiago" };
    expect(jobPostingJsonLd(santiago).jobLocation.address.addressRegion).toBe("Región Metropolitana de Santiago");
  });

  it("acepta solo regiones de Chile y usa Los Lagos por defecto", () => {
    const base = { title: "Cargo", area: "Área", location: "Santiago", type: "Full-time", description: "Texto" };
    expect(jobSchema.parse(base).region).toBe("Región de Los Lagos");
    expect(jobSchema.parse({ ...base, region: "Región Metropolitana de Santiago" }).region).toBe("Región Metropolitana de Santiago");
    expect(jobSchema.safeParse({ ...base, region: "Santiago" }).success).toBe(false);
  });
});
