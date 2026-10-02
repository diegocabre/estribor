import { z } from "zod";
import { DURATIONS, OBJECTIVES, TIME_SLOTS } from "@/lib/agenda";

// Sin saltos de línea ni enlaces: estos campos terminan en asuntos y saludos de correo.
const NO_URL = /(https?:\/\/|www\.)/i;
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;

const personName = z
  .string({ error: "El nombre es requerido." })
  .trim()
  .min(2, { error: "El nombre es muy corto." })
  .max(100, { error: "El nombre es muy largo." })
  .refine((v) => !CONTROL_CHARS.test(v) && !NO_URL.test(v), { error: "El nombre contiene caracteres no permitidos." });

const shortText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .refine((v) => !CONTROL_CHARS.test(v), { error: "Contiene caracteres no permitidos." });

const optionalShortText = (max: number) => shortText(max).optional().default("");

const email = z.email({ error: "Correo electrónico inválido." }).max(254);

const phone = z
  .string()
  .trim()
  .max(30)
  .regex(/^[+\d\s()-]*$/, { error: "Teléfono inválido." });

/** Valida un RUT chileno con su dígito verificador (acepta puntos y guion). */
export function isValidRut(raw: string): boolean {
  const clean = raw.replace(/[.\s-]/g, "").toUpperCase();
  if (!/^\d{7,8}[\dK]$/.test(clean)) return false;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  let sum = 0;
  let factor = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number(body[i]) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const expected = 11 - (sum % 11);
  const expectedDv = expected === 11 ? "0" : expected === 10 ? "K" : String(expected);
  return dv === expectedDv;
}

export function normalizeRut(raw: string): string {
  const clean = raw.replace(/[.\s-]/g, "").toUpperCase();
  return `${clean.slice(0, -1)}-${clean.slice(-1)}`;
}

export const contactSchema = z.object({
  name: personName,
  email,
  phone: phone.optional().default(""),
  company: optionalShortText(120),
  role: optionalShortText(100),
  message: z
    .string({ error: "El mensaje es requerido." })
    .trim()
    .min(10, { error: "El mensaje debe tener al menos 10 caracteres." })
    .max(5000, { error: "El mensaje es muy largo (máximo 5.000 caracteres)." }),
  privacyAccepted: z.literal(true, { error: "Debe aceptar la Política de Privacidad para enviar su consulta." }),
  marketingAccepted: z.boolean().optional().default(false),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const bookingSchema = z.object({
  dateStr: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { error: "Fecha inválida." }),
  time: z.enum(TIME_SLOTS, { error: "Horario inválido." }),
  duration: z.enum(DURATIONS, { error: "Duración inválida." }),
  name: personName,
  email,
  // En el formulario la empresa es opcional.
  company: optionalShortText(120),
  objective: z.enum(OBJECTIVES, { error: "Objetivo inválido." }),
  privacyAccepted: z.literal(true, { error: "Debes aceptar la Política de Privacidad para confirmar tu reserva." }),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export const icsQuerySchema = z.object({
  dateStr: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.enum(TIME_SLOTS),
  duration: z.enum(DURATIONS).default("30 min"),
  name: personName.optional().default(""),
});

export const SPONTANEOUS_JOB_ID = "spontaneous";

export const applicationSchema = z.object({
  jobId: z.string().trim().min(1).max(64),
  area: optionalShortText(100),
  fullName: personName,
  rut: z
    .string()
    .trim()
    .refine(isValidRut, { error: "El RUT ingresado no es válido." })
    .transform(normalizeRut),
  email,
  phone: phone.min(8, { error: "Teléfono inválido." }),
  city: shortText(80).min(2, { error: "La ciudad es requerida." }),
  salaryExpectation: optionalShortText(60),
  availability: optionalShortText(60),
  linkedinProfile: z
    .string()
    .trim()
    .max(200)
    .optional()
    .default("")
    .refine((v) => v === "" || /^https:\/\/([a-z]{2,3}\.)?linkedin\.com\//i.test(v), {
      error: "El perfil de LinkedIn debe ser una URL de linkedin.com.",
    }),
  privacyAccepted: z.literal("true", { error: "Debes autorizar el tratamiento de tus datos personales." }),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

export const MAX_CV_BYTES = 5 * 1024 * 1024;

/** Revisa tipo, tamaño y firma "%PDF-" del archivo, no solo su extensión. */
export async function validatePdf(file: unknown): Promise<string | null> {
  if (!(file instanceof File)) return "Por favor, adjunta tu CV en formato PDF.";
  if (file.size === 0) return "El archivo está vacío.";
  if (file.size > MAX_CV_BYTES) return "El CV no puede superar los 5 MB.";
  if (file.type && file.type !== "application/pdf") return "El CV debe estar en formato PDF.";
  const head = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  const signature = String.fromCharCode(...head);
  if (signature !== "%PDF-") return "El archivo no es un PDF válido.";
  return null;
}

export const jobSchema = z.object({
  title: shortText(150).min(3, { error: "El título es requerido." }),
  area: shortText(100).min(1, { error: "El área es requerida." }),
  location: shortText(100).min(1, { error: "La ubicación es requerida." }),
  type: shortText(40).min(1),
  description: z.string().trim().min(1).max(10000),
  requirements: z.string().trim().max(10000).default(""),
  functions: z.string().trim().max(10000).default(""),
  confidential: z.boolean().default(false),
});

export const areaSchema = z.object({ name: shortText(100).min(1, { error: "Por favor ingresa un nombre para el área." }) });

/** Primer mensaje de error legible de un resultado de zod. */
export function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Datos inválidos.";
}
