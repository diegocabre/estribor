import { describe, expect, it } from "vitest";
import { bookingSchema, contactSchema, isValidRut, normalizeRut, validatePdf } from "@/lib/validation";

describe("RUT chileno", () => {
  it("acepta RUT válidos con o sin puntos, guion o K", () => {
    expect(isValidRut("12.345.678-5")).toBe(true);
    expect(isValidRut("123456785")).toBe(true);
    expect(isValidRut("10.000.013-k")).toBe(true);
  });

  it("rechaza dígito verificador incorrecto o formato inválido", () => {
    expect(isValidRut("12.345.678-9")).toBe(false);
    expect(isValidRut("abc")).toBe(false);
    expect(isValidRut("")).toBe(false);
  });

  it("normaliza al formato 12345678-5", () => {
    expect(normalizeRut("12.345.678-5")).toBe("12345678-5");
  });
});

const validContact = {
  name: "Juan Pérez",
  email: "juan@empresa.cl",
  message: "Necesito una asesoría en seguridad laboral.",
  privacyAccepted: true,
};

describe("contactSchema", () => {
  it("acepta un mensaje válido y completa los opcionales", () => {
    const parsed = contactSchema.parse(validContact);
    expect(parsed).toMatchObject({ phone: "", company: "", marketingAccepted: false });
  });

  it("exige consentimiento de privacidad", () => {
    expect(contactSchema.safeParse({ ...validContact, privacyAccepted: false }).success).toBe(false);
  });

  it("rechaza nombres con enlaces o saltos de línea (phishing en el correo de bienvenida)", () => {
    expect(contactSchema.safeParse({ ...validContact, name: "Gana dinero en http://malo.com" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...validContact, name: "Juan\r\nBcc: x@y.z" }).success).toBe(false);
  });

  it("limita el largo del mensaje", () => {
    expect(contactSchema.safeParse({ ...validContact, message: "corto" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...validContact, message: "a".repeat(5001) }).success).toBe(false);
  });
});

const validBooking = {
  dateStr: "2026-10-05",
  time: "10:30",
  duration: "30 min",
  name: "Ana Soto",
  email: "ana@empresa.cl",
  objective: "Consultoría General",
  privacyAccepted: true,
};

describe("bookingSchema", () => {
  it("acepta una reserva válida con empresa opcional", () => {
    expect(bookingSchema.parse(validBooking).company).toBe("");
  });

  it("solo acepta horarios, duraciones y objetivos de la agenda", () => {
    expect(bookingSchema.safeParse({ ...validBooking, time: "03:00" }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...validBooking, duration: "2 horas" }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...validBooking, objective: "<script>" }).success).toBe(false);
  });

  it("exige fecha ISO y consentimiento", () => {
    expect(bookingSchema.safeParse({ ...validBooking, dateStr: "05/10/2026" }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...validBooking, privacyAccepted: false }).success).toBe(false);
  });
});

describe("validatePdf", () => {
  const pdf = (bytes: string, type = "application/pdf") => new File([bytes], "cv.pdf", { type });

  it("acepta un archivo con firma %PDF-", async () => {
    expect(await validatePdf(pdf("%PDF-1.7 contenido"))).toBeNull();
  });

  it("rechaza archivos renombrados a .pdf, vacíos o de otro tipo", async () => {
    expect(await validatePdf(pdf("<html>no soy un pdf</html>"))).toMatch(/no es un PDF/);
    expect(await validatePdf(pdf(""))).toMatch(/vacío/);
    expect(await validatePdf(pdf("%PDF-1.7", "text/html"))).toMatch(/formato PDF/);
    expect(await validatePdf("no-es-archivo")).toMatch(/adjunta/);
  });
});
