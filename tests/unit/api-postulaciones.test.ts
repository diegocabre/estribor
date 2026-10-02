import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createSupabaseMock, uniqueIp } from "./helpers/supabase-mock";

const supabase = createSupabaseMock();
vi.mock("@/lib/supabase-admin", () => ({
  getSupabaseAdmin: () => supabase.client,
  CV_BUCKET: "cvs",
}));

const { POST } = await import("@/app/api/postulaciones/route");

function applicationRequest(overrides: Record<string, string | File> = {}, ip = uniqueIp()) {
  const form = new FormData();
  const fields: Record<string, string | File> = {
    jobId: "job-123",
    fullName: "Camila Rojas",
    rut: "12.345.678-5",
    email: "camila@correo.cl",
    phone: "+56 9 8765 4321",
    city: "Puerto Montt",
    salaryExpectation: "1.500.000",
    availability: "Inmediata",
    privacyAccepted: "true",
    cv: new File(["%PDF-1.7 contenido"], "cv.pdf", { type: "application/pdf" }),
    ...overrides,
  };
  for (const [k, v] of Object.entries(fields)) form.append(k, v);
  return new NextRequest("https://www.estriborconsultores.cl/api/postulaciones", {
    method: "POST",
    headers: { "x-forwarded-for": ip },
    body: form,
  });
}

beforeEach(() => {
  supabase.calls.length = 0;
  supabase.storageCalls.length = 0;
});

describe("POST /api/postulaciones", () => {
  it("sube el CV con nombre UUID al bucket privado y guarda solo la ruta", async () => {
    supabase.queue("jobs", "select", { data: { id: "job-123", title: "Jefe de Planta", active: true }, error: null });
    supabase.queue("applications", "select", { data: [], error: null });
    supabase.queue("applications", "insert", { data: null, error: null });

    const res = await POST(applicationRequest());

    expect(res.status).toBe(200);
    const [path] = supabase.storageCalls.find((c) => c.method === "upload")!.args as [string];
    expect(path).toMatch(/^job-123\/[0-9a-f-]{36}\.pdf$/);
    const row = supabase.callsFor("applications", "insert")[0].args[0] as Record<string, unknown>;
    expect(row).toMatchObject({ cv_url: path, job_title: "Jefe de Planta", rut: "12345678-5" });
  });

  it("toma el título desde la base y rechaza vacantes cerradas", async () => {
    supabase.queue("jobs", "select", { data: { id: "job-123", title: "Jefe de Planta", active: false }, error: null });

    const res = await POST(applicationRequest());

    expect(res.status).toBe(404);
    expect(supabase.storageCalls).toHaveLength(0);
  });

  it("rechaza RUT inválido y archivos que no son PDF", async () => {
    expect((await POST(applicationRequest({ rut: "12.345.678-9" }))).status).toBe(400);
    const fake = new File(["<html>"], "cv.pdf", { type: "application/pdf" });
    expect((await POST(applicationRequest({ cv: fake }))).status).toBe(400);
    expect(supabase.storageCalls).toHaveLength(0);
  });

  it("evita postulaciones duplicadas por RUT en la misma vacante", async () => {
    supabase.queue("jobs", "select", { data: { id: "job-123", title: "Jefe de Planta", active: true }, error: null });
    supabase.queue("applications", "select", { data: [{ id: "previa" }], error: null });

    const res = await POST(applicationRequest());

    expect(res.status).toBe(409);
    expect(supabase.storageCalls).toHaveLength(0);
  });

  it("borra el CV subido si la fila no se pudo guardar", async () => {
    supabase.queue("jobs", "select", { data: { id: "job-123", title: "Jefe de Planta", active: true }, error: null });
    supabase.queue("applications", "select", { data: [], error: null });
    supabase.queue("applications", "insert", { data: null, error: { message: "permission denied" } });
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const res = await POST(applicationRequest());

    expect(res.status).toBe(500);
    expect((await res.json()).error).not.toMatch(/permission/);
    expect(supabase.storageCalls.map((c) => c.method)).toEqual(["upload", "remove"]);
  });

  it("exige el consentimiento de tratamiento de datos", async () => {
    const res = await POST(applicationRequest({ privacyAccepted: "false" }));
    expect(res.status).toBe(400);
  });
});
