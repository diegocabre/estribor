import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createSupabaseMock, getRequest, jsonRequest, mockResend, uniqueIp } from "./helpers/supabase-mock";

const supabase = createSupabaseMock();
vi.mock("@/lib/supabase-admin", () => ({
  getSupabaseAdmin: () => supabase.client,
  CV_BUCKET: "cvs",
}));

const { GET, POST } = await import("@/app/api/agenda/route");

const URL_BASE = "https://www.estriborconsultores.cl/api/agenda";

const validBooking = {
  dateStr: "2026-10-05",
  time: "10:30",
  duration: "30 min",
  name: "Ana Soto",
  email: "ana@empresa.cl",
  company: "Salmones del Sur",
  objective: "Consultoría General",
  privacyAccepted: true,
};

beforeEach(() => {
  // Jueves 1 de octubre de 2026, 11:00 en Chile (UTC-3).
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-10-01T14:00:00Z"));
  supabase.calls.length = 0;
  process.env.RESEND_API_KEY = "re_test";
  process.env.NOTIFICATION_RECIPIENT_EMAIL = "admin@estriborconsultores.cl";
  process.env.NEXT_PUBLIC_SITE_URL = "https://www.estriborconsultores.cl";
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("GET /api/agenda", () => {
  it("devuelve solo fecha y hora de los próximos días, nunca datos personales", async () => {
    supabase.queue("bookings", "select", { data: [{ date: "Lunes, 5 de Octubre de 2026", time: "10:30" }], error: null });

    const res = await GET(getRequest(URL_BASE));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.bookings).toEqual([{ date: "Lunes, 5 de Octubre de 2026", time: "10:30" }]);
    expect(supabase.callsFor("bookings", "select")[0].args[0]).toBe("date, time");
    const inFilter = supabase.callsFor("bookings", "in")[0].args;
    expect(inFilter[0]).toBe("date");
    expect(inFilter[1]).toContain("Lunes, 5 de Octubre de 2026");
  });

  it("no filtra el error interno de Supabase", async () => {
    supabase.queue("bookings", "select", { data: null, error: { message: 'relation "bookings" does not exist' } });
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const res = await GET(getRequest(URL_BASE));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).not.toMatch(/relation|bookings/);
    expect(body.error).toMatch(/Código de referencia/);
  });

  it("genera el .ics con hora de verano correcta y sin inyección de campos", async () => {
    const ok = await GET(getRequest(`${URL_BASE}?download=ics&dateStr=2026-12-07&time=09:00&duration=45%20min&name=Ana`));
    const ics = await ok.text();
    expect(ics).toContain("DTSTART:20261207T120000Z");
    expect(ics).toContain("DTEND:20261207T124500Z");

    const attack = await GET(getRequest(`${URL_BASE}?download=ics&dateStr=2026-12-07&time=09:00&name=Ana%0D%0AATTENDEE:mailto:x@y.z`));
    expect(attack.status).toBe(400);
  });
});

describe("POST /api/agenda", () => {
  it("guarda la reserva con la fecha calculada en el servidor y envía dos correos", async () => {
    const { sent } = mockResend();
    supabase.queue("bookings", "insert", { data: null, error: null });

    const res = await POST(jsonRequest(URL_BASE, { ...validBooking, date: "fecha falsa del cliente" }));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
    const inserted = supabase.callsFor("bookings", "insert")[0].args[0] as Record<string, unknown>;
    expect(inserted).toMatchObject({ date: "Lunes, 5 de Octubre de 2026", time: "10:30", email: "ana@empresa.cl" });
    expect(sent.map((m) => m.to)).toEqual(["ana@empresa.cl", "admin@estriborconsultores.cl"]);
    expect(sent[0].html).toContain("https://www.estriborconsultores.cl/api/agenda?download=ics");
  });

  it("responde 409 ante doble reserva del mismo horario (índice único 23505)", async () => {
    mockResend();
    supabase.queue("bookings", "insert", { data: null, error: { code: "23505", message: "duplicate key" } });

    const res = await POST(jsonRequest(URL_BASE, validBooking));

    expect(res.status).toBe(409);
    expect((await res.json()).error).toMatch(/ya ha sido reservado/);
  });

  it.each([
    ["sábado", { dateStr: "2026-10-03" }],
    ["horario que ya pasó hoy", { dateStr: "2026-10-01", time: "09:00" }],
    ["fecha a más de 21 días", { dateStr: "2026-11-30" }],
  ])("rechaza %s sin tocar la base", async (_label, override) => {
    const res = await POST(jsonRequest(URL_BASE, { ...validBooking, ...override }));
    expect(res.status).toBe(400);
    expect(supabase.callsFor("bookings", "insert")).toHaveLength(0);
  });

  it("valida los datos con zod", async () => {
    const res = await POST(jsonRequest(URL_BASE, { ...validBooking, email: "no-es-correo" }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/Correo/);
  });

  it("escapa el HTML que escribe el usuario en los correos", async () => {
    const { sent } = mockResend();
    supabase.queue("bookings", "insert", { data: null, error: null });

    await POST(jsonRequest(URL_BASE, { ...validBooking, company: '<a href="https://phishing.example">Click</a>' }));

    const adminEmail = sent[1].html;
    expect(adminEmail).not.toContain('<a href="https://phishing.example">');
    expect(adminEmail).toContain("&lt;a href=&quot;https://phishing.example&quot;&gt;");
  });

  it("descarta en silencio a los bots que llenan el honeypot", async () => {
    const { sent } = mockResend();
    const res = await POST(jsonRequest(URL_BASE, { ...validBooking, website: "http://spam" }));

    expect(res.status).toBe(200);
    expect(supabase.callsFor("bookings", "insert")).toHaveLength(0);
    expect(sent).toHaveLength(0);
  });

  it("si falla el correo, la reserva queda guardada y se informa con un aviso", async () => {
    mockResend({ failFor: () => true });
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    supabase.queue("bookings", "insert", { data: null, error: null });

    const res = await POST(jsonRequest(URL_BASE, validBooking));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.warning).toMatch(/no pudimos enviar/);
  });

  it("limita a 3 reservas cada 10 minutos por IP", async () => {
    mockResend();
    const ip = uniqueIp();
    for (let i = 0; i < 3; i++) {
      supabase.queue("bookings", "insert", { data: null, error: null });
      expect((await POST(jsonRequest(URL_BASE, validBooking, ip))).status).toBe(200);
    }
    const blocked = await POST(jsonRequest(URL_BASE, validBooking, ip));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("Retry-After")).toBeTruthy();
  });
});
