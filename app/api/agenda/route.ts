import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Helper function to send email via Resend REST API
async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "Estribor Consultores <onboarding@resend.dev>";

  if (!apiKey) {
    throw new Error("La clave de API de Resend (RESEND_API_KEY) no está configurada.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Resend API falló con código de estado ${response.status}`);
  }

  return data;
}

// Helper to generate Google Calendar URL
function getGoogleCalendarUrl({
  dateStr,
  time,
  duration,
  title,
  details,
  location
}: {
  dateStr: string;
  time: string;
  duration: string;
  title: string;
  details: string;
  location: string;
}) {
  const [hour, min] = time.split(":").map(Number);
  const durationMin = duration.includes("15") ? 15 : duration.includes("45") ? 45 : 30;

  const cleanDateStr = dateStr.replace(/-/g, ""); // "20260706"
  
  // Convert standard Chile time (GMT-4) to UTC by adding 4 hours
  const startHourUtc = hour + 4;
  const startHourStr = String(startHourUtc).padStart(2, "0");
  const startMinStr = String(min).padStart(2, "0");
  
  let endHour = hour;
  let endMin = min + durationMin;
  if (endMin >= 60) {
    endHour += 1;
    endMin -= 60;
  }
  
  const endHourUtc = endHour + 4;
  const endHourStr = String(endHourUtc).padStart(2, "0");
  const endMinStr = String(endMin).padStart(2, "0");

  const startUtc = `${cleanDateStr}T${startHourStr}${startMinStr}00Z`;
  const endUtc = `${cleanDateStr}T${endHourStr}${endMinStr}00Z`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startUtc}/${endUtc}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
}

export async function GET(request: NextRequest) {
  try {
    const download = request.nextUrl.searchParams.get("download");
    
    // Serve .ics download for Apple Calendar / Outlook
    if (download === "ics") {
      const dateStr = request.nextUrl.searchParams.get("dateStr") || "";
      const time = request.nextUrl.searchParams.get("time") || "";
      const duration = request.nextUrl.searchParams.get("duration") || "30 min";
      const name = request.nextUrl.searchParams.get("name") || "";
      
      const [hour, min] = time.split(":").map(Number);
      const durationMin = duration.includes("15") ? 15 : duration.includes("45") ? 45 : 30;
      
      const cleanDateStr = dateStr.replace(/-/g, ""); // "20260706"
      
      const startHourUtc = hour + 4;
      const startHourStr = String(startHourUtc).padStart(2, "0");
      const startMinStr = String(min).padStart(2, "0");
      
      let endHour = hour;
      let endMin = min + durationMin;
      if (endMin >= 60) {
        endHour += 1;
        endMin -= 60;
      }
      const endHourUtc = endHour + 4;
      const endHourStr = String(endHourUtc).padStart(2, "0");
      const endMinStr = String(endMin).padStart(2, "0");
      
      const dtstart = `${cleanDateStr}T${startHourStr}${startMinStr}00Z`;
      const dtend = `${cleanDateStr}T${endHourStr}${endMinStr}00Z`;
      const dtstamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      const uid = `${Date.now()}`;
      
      const summary = "Asesoría de Rumbo - Estribor Consultores";
      const description = `Hola ${name}, gracias por agendar con nosotros. Tu reunión de ${duration} ha sido reservada.`;
      const location = "Google Meet / Teams (El enlace será enviado en breve)";
      
      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Estribor Consultores//NONSGML Calendar//ES",
        "BEGIN:VEVENT",
        `UID:${uid}@estribor.cl`,
        `DTSTAMP:${dtstamp}`,
        `DTSTART:${dtstart}`,
        `DTEND:${dtend}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${location}`,
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");
      
      return new NextResponse(icsContent, {
        headers: {
          "Content-Type": "text/calendar; charset=utf-8",
          "Content-Disposition": `attachment; filename="estribor-reunion.ics"`,
        },
      });
    }

    // Get list of bookings
    const { data, error } = await supabase
      .from("bookings")
      .select("date, time");

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, bookings: data || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { date, dateStr, time, duration, name, email, company, objective } = await request.json();

    if (!date || !dateStr || !time || !duration || !name || !email || !company || !objective) {
      return NextResponse.json(
        { success: false, error: "Todos los campos son requeridos." },
        { status: 400 }
      );
    }

    // Insert into Supabase
    const { error: dbError } = await supabase
      .from("bookings")
      .insert([
        {
          date,
          time,
          duration,
          name,
          email,
          company,
          objective
        }
      ]);

    if (dbError) {
      if (dbError.code === "23505") {
        return NextResponse.json(
          { success: false, error: "Este horario ya ha sido reservado por otra persona. Por favor, selecciona una hora diferente." },
          { status: 409 }
        );
      }
      return NextResponse.json({ success: false, error: dbError.message }, { status: 500 });
    }

    // Generate Calendar Links for the client
    const googleUrl = getGoogleCalendarUrl({
      dateStr,
      time,
      duration,
      title: "Asesoría de Rumbo - Estribor Consultores",
      details: `Hola ${name},\n\nHemos registrado tu solicitud para una Asesoría de Rumbo virtual.\n\nDuración: ${duration}\nObjetivo: ${objective}\n\nEn breve, uno de nuestros consultores enviará el enlace definitivo de la videollamada.`,
      location: "Google Meet / Teams"
    });

    const host = request.headers.get("host") || "estriborconsultores.cl";
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const icsUrl = `${protocol}://${host}/api/agenda?download=ics&dateStr=${dateStr}&time=${time}&duration=${encodeURIComponent(duration)}&name=${encodeURIComponent(name)}`;

    // Email html for the Client
    const clientEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #0F1D33; margin: 0; font-size: 24px;">Estribor Consultores</h1>
          <p style="color: #C9A05C; font-size: 14px; margin: 5px 0 0 0; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">Confirmación de Reunión</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin-bottom: 25px; border-left: 4px solid #C9A05C;">
          <h2 style="color: #0F1D33; margin-top: 0; font-size: 18px; border-bottom: 1px solid #eaeaea; padding-bottom: 8px;">¡Tu reserva está confirmada, ${name}!</h2>
          <p style="color: #475467; font-size: 14px; line-height: 1.6;">
            Agradecemos tu interés. Hemos agendado tu sesión de consultoría virtual con nuestro equipo de consultores senior.
          </p>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 15px;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #0F1D33; width: 35%;">Fecha:</td>
              <td style="padding: 6px 0; color: #475467;">${date}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #0F1D33;">Hora:</td>
              <td style="padding: 6px 0; color: #475467;">${time} hrs (Hora de Chile)</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #0F1D33;">Duración:</td>
              <td style="padding: 6px 0; color: #475467;">${duration}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #0F1D33;">Objetivo:</td>
              <td style="padding: 6px 0; color: #475467;">${objective}</td>
            </tr>
          </table>
        </div>

        <div style="margin-bottom: 25px; text-align: center;">
          <h3 style="color: #0F1D33; font-size: 14px; margin-bottom: 15px;">Agrega este evento a tu calendario:</h3>
          <div style="display: inline-block; margin: 5px 10px;">
            <a href="${googleUrl}" target="_blank" style="background-color: #4285F4; color: white; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: bold; display: inline-block;">
              Google Calendar
            </a>
          </div>
          <div style="display: inline-block; margin: 5px 10px;">
            <a href="${icsUrl}" target="_blank" style="background-color: #0F1D33; color: white; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: bold; display: inline-block;">
              iPhone / iCal / Outlook
            </a>
          </div>
        </div>

        <p style="color: #718096; font-size: 12px; line-height: 1.6; text-align: center;">
          * En breve recibirás un correo con el enlace definitivo para conectarnos (Google Meet / Teams).
        </p>

        <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
        <div style="text-align: center; color: #718096; font-size: 12px; line-height: 1.5;">
          <p style="margin: 0 0 5px 0;">Estribor Consultores — Puerto Varas, Chile</p>
          <p style="margin: 0;">Contacto: <a href="mailto:contacto@estriborconsultores.cl" style="color: #4A7FA5; text-decoration: none;">contacto@estriborconsultores.cl</a> | Web: <a href="https://estriborconsultores.cl" style="color: #4A7FA5; text-decoration: none;">estriborconsultores.cl</a></p>
        </div>
      </div>
    `;

    // Email html for the Admin (Notification)
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #0F1D33; margin: 0; font-size: 24px;">Estribor Consultores</h1>
          <p style="color: #C9A05C; font-size: 14px; margin: 5px 0 0 0; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">Nueva Reunión Agendada</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #C9A05C;">
          <h2 style="color: #0F1D33; margin-top: 0; font-size: 18px; border-bottom: 1px solid #eaeaea; padding-bottom: 8px;">Detalles de la Cita</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 10px;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #0F1D33; width: 35%;">Fecha:</td>
              <td style="padding: 6px 0; color: #475467;">${date}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #0F1D33;">Hora:</td>
              <td style="padding: 6px 0; color: #475467;">${time} hrs</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #0F1D33;">Duración:</td>
              <td style="padding: 6px 0; color: #475467;">${duration}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #0F1D33;">Objetivo:</td>
              <td style="padding: 6px 0; color: #475467;">${objective}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #0F1D33;">
          <h2 style="color: #0F1D33; margin-top: 0; font-size: 18px; border-bottom: 1px solid #eaeaea; padding-bottom: 8px;">Información del Cliente</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 10px;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #0F1D33; width: 35%;">Nombre Completo:</td>
              <td style="padding: 6px 0; color: #475467;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #0F1D33;">Correo Electrónico:</td>
              <td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #4A7FA5; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #0F1D33;">Empresa:</td>
              <td style="padding: 6px 0; color: #475467;">${company}</td>
            </tr>
          </table>
        </div>

        <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
        <div style="text-align: center; color: #718096; font-size: 12px; line-height: 1.5;">
          <p style="margin: 0 0 5px 0;">Estribor Consultores — Puerto Varas, Chile</p>
          <p style="margin: 0;">Notificación de sistema generada automáticamente.</p>
        </div>
      </div>
    `;

    // Send emails
    try {
      // 1. Send confirmation to Client
      await sendEmail({
        to: email,
        subject: `Confirmación de Reunión: Estribor Consultores - ${date} a las ${time}`,
        html: clientEmailHtml
      });

      // 2. Send notification to Admin
      const adminRecipient = process.env.NOTIFICATION_RECIPIENT_EMAIL || "contacto@estriborconsultores.cl";
      await sendEmail({
        to: adminRecipient,
        subject: `[Nueva Reunión] ${name} - ${date} a las ${time}`,
        html: adminEmailHtml
      });
    } catch (emailErr) {
      console.error("Error al enviar correos de agendamiento:", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
