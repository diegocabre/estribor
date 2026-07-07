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

export async function GET() {
  try {
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
    const { date, time, duration, name, email, company, objective } = await request.json();

    if (!date || !time || !duration || !name || !email || !company || !objective) {
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
      // Check if it's a unique constraint violation (duplicate key value violates unique constraint)
      if (dbError.code === "23505") {
        return NextResponse.json(
          { success: false, error: "Este horario ya ha sido reservado por otra persona. Por favor, selecciona una hora diferente." },
          { status: 409 }
        );
      }
      return NextResponse.json({ success: false, error: dbError.message }, { status: 500 });
    }

    // Send email notification to cialvearv@gmail.com
    const emailHtml = `
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

    try {
      await sendEmail({
        to: "cialvearv@gmail.com",
        subject: `Nueva Reunión: ${name} - ${date} a las ${time}`,
        html: emailHtml
      });
    } catch (emailErr) {
      console.error("Error al enviar correo de notificación:", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
