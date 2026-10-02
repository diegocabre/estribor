import "server-only";
import { escapeHtml } from "@/lib/security";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export function getNotificationRecipient(): string {
  return process.env.NOTIFICATION_RECIPIENT_EMAIL || "contacto@estriborconsultores.cl";
}

function getSender(): string {
  const from = process.env.RESEND_FROM_EMAIL;
  if (from) return from;
  if (process.env.VERCEL_ENV === "production") {
    throw new Error("RESEND_FROM_EMAIL no está configurado en producción.");
  }
  return "Estribor Consultores <onboarding@resend.dev>";
}

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY no está configurada.");
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: getSender(), to: [to], subject, html }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(`Resend respondió ${response.status}: ${data?.message ?? "sin detalle"}`);
  }

  return response.json();
}

// ---------- Plantillas ----------
// Todo valor que viene del usuario pasa por escapeHtml antes de entrar al HTML.

const brandHeader = (subtitle: string) => `
  <div style="text-align: center; margin-bottom: 20px;">
    <h1 style="color: #0F1D33; margin: 0; font-size: 24px;">Estribor Consultores</h1>
    <p style="color: #C9A05C; font-size: 14px; margin: 5px 0 0 0; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">${subtitle}</p>
  </div>`;

const publicFooter = `
  <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
  <div style="text-align: center; color: #718096; font-size: 12px; line-height: 1.5;">
    <p style="margin: 0 0 5px 0;">Estribor Consultores — Puerto Varas, Chile</p>
    <p style="margin: 0;">Contacto: <a href="mailto:contacto@estriborconsultores.cl" style="color: #4A7FA5; text-decoration: none;">contacto@estriborconsultores.cl</a> | Web: <a href="https://estriborconsultores.cl" style="color: #4A7FA5; text-decoration: none;">estriborconsultores.cl</a></p>
  </div>`;

const wrap = (body: string) =>
  `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">${body}</div>`;

const row = (label: string, value: string, labelWidth = "") => `
  <tr>
    <td style="padding: 8px; font-weight: bold; ${labelWidth} border-bottom: 1px solid #eaeaea; color: #0F1D33;">${label}</td>
    <td style="padding: 8px; border-bottom: 1px solid #eaeaea; color: #475467;">${value}</td>
  </tr>`;

export interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  message: string;
  marketingAccepted?: boolean;
}

export function contactWelcomeEmail({ name }: Pick<ContactEmailData, "name">): string {
  return wrap(`
    ${brandHeader("Navega con seguridad hacia la excelencia operacional")}
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #C9A05C;">
      <h2 style="color: #0F1D33; margin-top: 0; font-size: 18px;">Hola, ${escapeHtml(name)}:</h2>
      <p style="color: #475467; line-height: 1.6; font-size: 15px;">
        Hemos recibido correctamente tu mensaje a través de nuestro sitio web. Queremos darte la bienvenida y agradecer tu interés en nuestros servicios de Gestión de Personas, Seguridad y Salud en el Trabajo, y Sostenibilidad Organizacional.
      </p>
      <p style="color: #475467; line-height: 1.6; font-size: 15px;">
        Uno de nuestros consultores especializados revisará tu consulta de inmediato y se pondrá en contacto contigo en breve para evaluar tus requerimientos específicos.
      </p>
    </div>
    ${publicFooter}`);
}

export function contactNotificationEmail(data: ContactEmailData): string {
  const acceptedAt = new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" });
  const email = escapeHtml(data.email);
  return wrap(`
    <h2 style="color: #0F1D33; border-bottom: 2px solid #C9A05C; padding-bottom: 10px; margin-top: 0;">Nuevo Mensaje de Contacto</h2>
    <p style="color: #475467; font-size: 15px;">Se ha recibido una consulta a través del formulario de la landing page. A continuación se detallan los datos del contacto:</p>
    <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
      ${row("Nombre Completo:", escapeHtml(data.name), "width: 30%;")}
      ${row("Correo Electrónico:", `<a href="mailto:${email}" style="color: #4A7FA5; text-decoration: none;">${email}</a>`)}
      ${row("Teléfono:", escapeHtml(data.phone || "No especificado"))}
      ${row("Empresa:", escapeHtml(data.company || "No especificada"))}
      ${row("Cargo:", escapeHtml(data.role || "No especificado"))}
      ${row("Consentimiento Ley de Datos:", `<span style="color: #16a34a; font-weight: bold;">Aceptado (${escapeHtml(acceptedAt)})</span>`)}
      ${row("Autorización Marketing:", data.marketingAccepted ? "Sí, autoriza recibir información comercial" : "No")}
    </table>
    <div style="margin-top: 20px; background-color: #f9f9f9; padding: 15px; border-radius: 6px; border-left: 4px solid #C9A05C;">
      <h3 style="color: #0F1D33; margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Mensaje:</h3>
      <p style="color: #475467; font-size: 14px; white-space: pre-wrap; line-height: 1.6; margin-bottom: 0;">${escapeHtml(data.message)}</p>
    </div>
    <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 25px 0 15px 0;" />
    <p style="color: #718096; font-size: 12px; text-align: center; margin: 0;">Este correo fue generado automáticamente por el sitio web de Estribor Consultores.</p>`);
}

export interface BookingEmailData {
  date: string;
  time: string;
  duration: string;
  objective: string;
  name: string;
  email: string;
  company: string;
  googleUrl: string;
  icsUrl: string;
}

const detailRow = (label: string, value: string) => `
  <tr>
    <td style="padding: 6px 0; font-weight: bold; color: #0F1D33; width: 35%;">${label}</td>
    <td style="padding: 6px 0; color: #475467;">${value}</td>
  </tr>`;

export function bookingClientEmail(data: BookingEmailData): string {
  return wrap(`
    ${brandHeader("Confirmación de Reunión")}
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin-bottom: 25px; border-left: 4px solid #C9A05C;">
      <h2 style="color: #0F1D33; margin-top: 0; font-size: 18px; border-bottom: 1px solid #eaeaea; padding-bottom: 8px;">¡Tu reserva está confirmada, ${escapeHtml(data.name)}!</h2>
      <p style="color: #475467; font-size: 14px; line-height: 1.6;">
        Agradecemos tu interés. Hemos agendado tu sesión de consultoría virtual con nuestro equipo de consultores senior.
      </p>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 15px;">
        ${detailRow("Fecha:", escapeHtml(data.date))}
        ${detailRow("Hora:", `${escapeHtml(data.time)} hrs (Hora de Chile)`)}
        ${detailRow("Duración:", escapeHtml(data.duration))}
        ${detailRow("Objetivo:", escapeHtml(data.objective))}
      </table>
    </div>
    <div style="margin-bottom: 25px; text-align: center;">
      <h3 style="color: #0F1D33; font-size: 14px; margin-bottom: 15px;">Agrega este evento a tu calendario:</h3>
      <div style="display: inline-block; margin: 5px 10px;">
        <a href="${escapeHtml(data.googleUrl)}" target="_blank" style="background-color: #4285F4; color: white; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: bold; display: inline-block;">Google Calendar</a>
      </div>
      <div style="display: inline-block; margin: 5px 10px;">
        <a href="${escapeHtml(data.icsUrl)}" target="_blank" style="background-color: #0F1D33; color: white; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: bold; display: inline-block;">iPhone / iCal / Outlook</a>
      </div>
    </div>
    <p style="color: #718096; font-size: 12px; line-height: 1.6; text-align: center;">
      * En breve recibirás un correo con el enlace definitivo para conectarnos (Google Meet / Teams).
    </p>
    ${publicFooter}`);
}

export function bookingAdminEmail(data: BookingEmailData): string {
  const email = escapeHtml(data.email);
  return wrap(`
    ${brandHeader("Nueva Reunión Agendada")}
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #C9A05C;">
      <h2 style="color: #0F1D33; margin-top: 0; font-size: 18px; border-bottom: 1px solid #eaeaea; padding-bottom: 8px;">Detalles de la Cita</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 10px;">
        ${detailRow("Fecha:", escapeHtml(data.date))}
        ${detailRow("Hora:", `${escapeHtml(data.time)} hrs`)}
        ${detailRow("Duración:", escapeHtml(data.duration))}
        ${detailRow("Objetivo:", escapeHtml(data.objective))}
      </table>
    </div>
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #0F1D33;">
      <h2 style="color: #0F1D33; margin-top: 0; font-size: 18px; border-bottom: 1px solid #eaeaea; padding-bottom: 8px;">Información del Cliente</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 10px;">
        ${detailRow("Nombre Completo:", escapeHtml(data.name))}
        ${detailRow("Correo Electrónico:", `<a href="mailto:${email}" style="color: #4A7FA5; text-decoration: none;">${email}</a>`)}
        ${detailRow("Empresa:", escapeHtml(data.company || "No especificada"))}
      </table>
    </div>
    <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
    <div style="text-align: center; color: #718096; font-size: 12px; line-height: 1.5;">
      <p style="margin: 0 0 5px 0;">Estribor Consultores — Puerto Varas, Chile</p>
      <p style="margin: 0;">Notificación de sistema generada automáticamente.</p>
    </div>`);
}
