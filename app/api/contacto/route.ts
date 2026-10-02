import { NextRequest, NextResponse } from "next/server";
import { contactNotificationEmail, contactWelcomeEmail, getNotificationRecipient, sendEmail } from "@/lib/email";
import {
  HONEYPOT_FIELD,
  getClientIp,
  internalError,
  isHoneypotFilled,
  jsonError,
  rateLimit,
  stripControlChars,
  tooManyRequests,
} from "@/lib/security";
import { contactSchema, firstIssue } from "@/lib/validation";

// 5 mensajes cada 10 minutos por IP.
const LIMIT = 5;
const WINDOW_MS = 10 * 60_000;

export async function POST(request: NextRequest) {
  const limit = rateLimit(`contacto:${getClientIp(request)}`, LIMIT, WINDOW_MS);
  if (!limit.ok) return tooManyRequests(limit.retryAfter);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonError("Solicitud inválida.", 400);
  }

  // Bot: respondemos éxito sin enviar nada, para no darle señales.
  if (isHoneypotFilled(body?.[HONEYPOT_FIELD])) {
    return NextResponse.json({ success: true, message: "Mensaje recibido." });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(firstIssue(parsed.error), 400);
  }
  const data = parsed.data;

  try {
    // 1. Notificación interna: es el envío que importa.
    await sendEmail({
      to: getNotificationRecipient(),
      subject: `Nuevo mensaje de contacto de ${stripControlChars(data.name)}`,
      html: contactNotificationEmail(data),
    });
  } catch (err) {
    return internalError("No se pudo enviar la notificación de contacto", err);
  }

  // 2. Confirmación al usuario: si falla, el mensaje igual quedó recibido.
  try {
    await sendEmail({
      to: data.email,
      subject: "¡Gracias por contactar a Estribor Consultores!",
      html: contactWelcomeEmail(data),
    });
  } catch (err) {
    console.error("No se pudo enviar el correo de confirmación de contacto:", err);
    return NextResponse.json({
      success: true,
      warning: "Recibimos tu mensaje, pero no pudimos enviarte el correo de confirmación.",
    });
  }

  return NextResponse.json({ success: true, message: "Mensaje enviado correctamente." });
}
