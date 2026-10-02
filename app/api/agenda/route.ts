import { NextRequest, NextResponse } from "next/server";
import {
  MAX_DAYS_AHEAD,
  addDays,
  formatLongDate,
  getMeetingRange,
  getUpcomingDates,
  isSlotUnavailable,
  isWeekend,
  nowInChile,
  toCalendarUtc,
} from "@/lib/agenda";
import { bookingAdminEmail, bookingClientEmail, getNotificationRecipient, sendEmail } from "@/lib/email";
import {
  HONEYPOT_FIELD,
  getClientIp,
  getSiteUrl,
  internalError,
  isHoneypotFilled,
  jsonError,
  rateLimit,
  stripControlChars,
  tooManyRequests,
} from "@/lib/security";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { bookingSchema, firstIssue, icsQuerySchema } from "@/lib/validation";

const MEETING_TITLE = "Asesoría de Rumbo - Estribor Consultores";

/** Escapa texto para un campo de iCalendar (RFC 5545). */
function icsText(value: string): string {
  return stripControlChars(value).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

function buildIcs(dateStr: string, time: string, duration: "15 min" | "30 min" | "45 min", name: string): string {
  const { start, end } = getMeetingRange(dateStr, time, duration);
  const greeting = name ? `Hola ${name}, gracias` : "Gracias";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Estribor Consultores//NONSGML Calendar//ES",
    "BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}@estriborconsultores.cl`,
    `DTSTAMP:${toCalendarUtc(new Date())}`,
    `DTSTART:${toCalendarUtc(start)}`,
    `DTEND:${toCalendarUtc(end)}`,
    `SUMMARY:${icsText(MEETING_TITLE)}`,
    `DESCRIPTION:${icsText(`${greeting} por agendar con nosotros. Tu reunión de ${duration} ha sido reservada.`)}`,
    `LOCATION:${icsText("Google Meet / Teams (El enlace será enviado en breve)")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const params = request.nextUrl.searchParams;

  // Descarga .ics para Apple Calendar / Outlook (enlace del correo de confirmación).
  if (params.get("download") === "ics") {
    const limit = rateLimit(`agenda-ics:${ip}`, 30, 60_000);
    if (!limit.ok) return tooManyRequests(limit.retryAfter);

    const parsed = icsQuerySchema.safeParse({
      dateStr: params.get("dateStr") ?? undefined,
      time: params.get("time") ?? undefined,
      duration: params.get("duration") ?? undefined,
      name: params.get("name") ?? undefined,
    });
    if (!parsed.success) return jsonError("Parámetros inválidos.", 400);

    const { dateStr, time, duration, name } = parsed.data;
    return new NextResponse(buildIcs(dateStr, time, duration, name), {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="estribor-reunion.ics"',
      },
    });
  }

  const limit = rateLimit(`agenda-get:${ip}`, 60, 60_000);
  if (!limit.ok) return tooManyRequests(limit.retryAfter);

  try {
    // Solo fecha y hora de los próximos días reservables: nunca nombres ni correos.
    const upcoming = getUpcomingDates(nowInChile(), 15).map((d) => d.fullDate);
    const { data, error } = await getSupabaseAdmin()
      .from("bookings")
      .select("date, time")
      .in("date", upcoming);

    if (error) throw error;

    return NextResponse.json(
      { success: true, bookings: data ?? [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    return internalError("No se pudieron leer las reservas", err);
  }
}

export async function POST(request: NextRequest) {
  const limit = rateLimit(`agenda-post:${getClientIp(request)}`, 3, 10 * 60_000);
  if (!limit.ok) return tooManyRequests(limit.retryAfter);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonError("Solicitud inválida.", 400);
  }

  if (isHoneypotFilled(body?.[HONEYPOT_FIELD])) {
    return NextResponse.json({ success: true });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) return jsonError(firstIssue(parsed.error), 400);
  const input = parsed.data;

  const now = nowInChile();
  if (
    isWeekend(input.dateStr) ||
    input.dateStr > addDays(now.dateStr, MAX_DAYS_AHEAD) ||
    isSlotUnavailable([], input.dateStr, input.time, now)
  ) {
    return jsonError("El horario seleccionado no está disponible. Por favor, elige otro.", 400);
  }

  // La fecha visible se calcula aquí: el cliente no decide qué se guarda.
  const date = formatLongDate(input.dateStr);

  try {
    const { error } = await getSupabaseAdmin().from("bookings").insert({
      date,
      time: input.time,
      duration: input.duration,
      name: input.name,
      email: input.email,
      company: input.company,
      objective: input.objective,
    });

    if (error) {
      if (error.code === "23505") {
        return jsonError(
          "Este horario ya ha sido reservado por otra persona. Por favor, selecciona una hora diferente.",
          409
        );
      }
      throw error;
    }
  } catch (err) {
    return internalError("No se pudo guardar la reserva", err);
  }

  const { start, end } = getMeetingRange(input.dateStr, input.time, input.duration);
  const googleUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(MEETING_TITLE)}` +
    `&dates=${toCalendarUtc(start)}/${toCalendarUtc(end)}` +
    `&details=${encodeURIComponent(
      `Hola ${input.name},\n\nHemos registrado tu solicitud para una Asesoría de Rumbo virtual.\n\nDuración: ${input.duration}\nObjetivo: ${input.objective}\n\nEn breve, uno de nuestros consultores enviará el enlace definitivo de la videollamada.`
    )}` +
    `&location=${encodeURIComponent("Google Meet / Teams")}`;

  const icsParams = new URLSearchParams({
    download: "ics",
    dateStr: input.dateStr,
    time: input.time,
    duration: input.duration,
    name: input.name,
  });
  const icsUrl = `${getSiteUrl()}/api/agenda?${icsParams.toString()}`;

  const emailData = { ...input, date, googleUrl, icsUrl };
  const subjectName = stripControlChars(input.name);

  // La reserva ya quedó guardada: un fallo de correo no la deshace, pero se informa.
  const results = await Promise.allSettled([
    sendEmail({
      to: input.email,
      subject: `Confirmación de Reunión: Estribor Consultores - ${date} a las ${input.time}`,
      html: bookingClientEmail(emailData),
    }),
    sendEmail({
      to: getNotificationRecipient(),
      subject: `[Nueva Reunión] ${subjectName} - ${date} a las ${input.time}`,
      html: bookingAdminEmail(emailData),
    }),
  ]);

  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length > 0) {
    console.error("Error al enviar correos de agendamiento:", failed);
    return NextResponse.json({
      success: true,
      warning: "Tu reserva quedó registrada, pero no pudimos enviar el correo de confirmación.",
    });
  }

  return NextResponse.json({ success: true });
}
