import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { jsonRequest, mockResend, uniqueIp } from "./helpers/supabase-mock";
import { POST } from "@/app/api/contacto/route";

const URL_CONTACTO = "https://www.estriborconsultores.cl/api/contacto";

const validMessage = {
  name: "Juan Pérez",
  email: "juan@empresa.cl",
  phone: "+56 9 1234 5678",
  company: "Acuícola Sur",
  message: "Queremos implementar el protocolo de Ley Karin.",
  privacyAccepted: true,
};

beforeEach(() => {
  process.env.RESEND_API_KEY = "re_test";
  process.env.NOTIFICATION_RECIPIENT_EMAIL = "admin@estriborconsultores.cl";
});

afterEach(() => vi.unstubAllGlobals());

describe("POST /api/contacto", () => {
  it("envía la notificación interna y la confirmación al usuario", async () => {
    const { sent } = mockResend();

    const res = await POST(jsonRequest(URL_CONTACTO, validMessage));

    expect(res.status).toBe(200);
    expect(sent.map((m) => m.to)).toEqual(["admin@estriborconsultores.cl", "juan@empresa.cl"]);
    expect(sent[0].subject).toBe("Nuevo mensaje de contacto de Juan Pérez");
  });

  it("escapa el HTML del mensaje: no se pueden inyectar enlaces ni scripts", async () => {
    const { sent } = mockResend();

    await POST(jsonRequest(URL_CONTACTO, { ...validMessage, message: '<script>alert(1)</script><a href="https://x.y">pago</a>' }));

    const html = sent[0].html;
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
  });

  it("rechaza datos inválidos con 400 y sin enviar correos", async () => {
    const { sent } = mockResend();

    const res = await POST(jsonRequest(URL_CONTACTO, { ...validMessage, email: "x" }));

    expect(res.status).toBe(400);
    expect(sent).toHaveLength(0);
  });

  it("exige el consentimiento de privacidad", async () => {
    mockResend();
    const res = await POST(jsonRequest(URL_CONTACTO, { ...validMessage, privacyAccepted: false }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/Política de Privacidad/);
  });

  it("responde 400 a un cuerpo que no es JSON", async () => {
    const req = jsonRequest(URL_CONTACTO, {});
    const broken = new Request(req.url, { method: "POST", headers: req.headers, body: "{no-json" });
    const res = await POST(broken as never);
    expect(res.status).toBe(400);
  });

  it("descarta bots (honeypot) sin enviar nada", async () => {
    const { sent } = mockResend();
    const res = await POST(jsonRequest(URL_CONTACTO, { ...validMessage, website: "spam.example" }));
    expect(res.status).toBe(200);
    expect(sent).toHaveLength(0);
  });

  it("si falla la notificación interna devuelve un error genérico, sin detalles de Resend", async () => {
    mockResend({ failFor: (to) => to === "admin@estriborconsultores.cl" });
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const res = await POST(jsonRequest(URL_CONTACTO, validMessage));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(JSON.stringify(body)).not.toMatch(/sandbox|Resend|re_test/);
  });

  it("si solo falla la confirmación al usuario, el mensaje se da por recibido", async () => {
    mockResend({ failFor: (to) => to === "juan@empresa.cl" });
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const res = await POST(jsonRequest(URL_CONTACTO, validMessage));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.warning).toBeTruthy();
  });

  it("limita a 5 mensajes cada 10 minutos por IP", async () => {
    mockResend();
    const ip = uniqueIp();
    for (let i = 0; i < 5; i++) {
      expect((await POST(jsonRequest(URL_CONTACTO, validMessage, ip))).status).toBe(200);
    }
    expect((await POST(jsonRequest(URL_CONTACTO, validMessage, ip))).status).toBe(429);
  });
});
