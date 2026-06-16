import { NextRequest, NextResponse } from "next/server";

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

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, company, message } = await request.json();

    // Validar campos requeridos
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Nombre, correo y mensaje son requeridos." },
        { status: 400 }
      );
    }

    // Diseñar cuerpo del correo de bienvenida para el usuario
    const htmlWelcome = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #0b2240; margin: 0; font-size: 24px;">Estribor Consultores</h1>
          <p style="color: #00D1FF; font-size: 14px; margin: 5px 0 0 0; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">Tu rumbo seguro</p>
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
          <h2 style="color: #0b2240; margin-top: 0; font-size: 18px;">Hola, ${name}:</h2>
          <p style="color: #4a5568; line-height: 1.6; font-size: 15px;">
            Hemos recibido correctamente tu mensaje a través de nuestro sitio web. Queremos darte la bienvenida y agradecer tu interés en nuestros servicios de consultoría, gestión, seguridad y cumplimiento normativo.
          </p>
          <p style="color: #4a5568; line-height: 1.6; font-size: 15px;">
            Uno de nuestros consultores especializados revisará tu consulta de inmediato y se pondrá en contacto contigo en breve para evaluar tus requerimientos específicos.
          </p>
        </div>
        <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
        <div style="text-align: center; color: #718096; font-size: 12px; line-height: 1.5;">
          <p style="margin: 0 0 5px 0;">Estribor Consultores — Santiago, Chile</p>
          <p style="margin: 0;">Contacto: <a href="mailto:contacto@estribor.cl" style="color: #00D1FF; text-decoration: none;">contacto@estribor.cl</a> | Web: <a href="https://estribor.cl" style="color: #00D1FF; text-decoration: none;">estribor.cl</a></p>
        </div>
      </div>
    `;

    // Diseñar cuerpo del correo de notificación para el administrador
    const htmlNotification = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #0b2240; border-bottom: 2px solid #00D1FF; padding-bottom: 10px; margin-top: 0;">Nuevo Mensaje de Contacto</h2>
        <p style="color: #4a5568; font-size: 15px;">Se ha recibido una consulta a través del formulario de la landing page. A continuación se detallan los datos del contacto:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 30%; border-bottom: 1px solid #eaeaea; color: #0b2240;">Nombre Completo:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eaeaea; color: #4a5568;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eaeaea; color: #0b2240;">Correo Electrónico:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eaeaea;"><a href="mailto:${email}" style="color: #00D1FF; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eaeaea; color: #0b2240;">Teléfono:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eaeaea; color: #4a5568;">${phone || "No especificado"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eaeaea; color: #0b2240;">Empresa:</td>
            <td style="padding: 8px; border-bottom: 1px solid #eaeaea; color: #4a5568;">${company || "No especificada"}</td>
          </tr>
        </table>
        
        <div style="margin-top: 20px; background-color: #f9f9f9; padding: 15px; border-radius: 6px; border-left: 4px solid #00D1FF;">
          <h3 style="color: #0b2240; margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Mensaje:</h3>
          <p style="color: #4a5568; font-size: 14px; white-space: pre-wrap; line-height: 1.6; margin-bottom: 0;">${message}</p>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 25px 0 15px 0;" />
        <p style="color: #718096; font-size: 12px; text-align: center; margin: 0;">Este correo fue generado automáticamente por el sitio web de Estribor Consultores.</p>
      </div>
    `;

    let welcomeSent = false;
    let welcomeError = null;
    let notificationSent = false;
    let notificationError = null;

    // 1. Intentar enviar correo de bienvenida al usuario
    try {
      await sendEmail({
        to: email,
        subject: "¡Gracias por contactar a Estribor Consultores!",
        html: htmlWelcome,
      });
      welcomeSent = true;
    } catch (err: any) {
      console.error("Error al enviar el correo de bienvenida:", err);
      welcomeError = err.message || err;
    }

    // 2. Intentar enviar correo de notificación al administrador
    try {
      const recipient = process.env.NOTIFICATION_RECIPIENT_EMAIL || "estribor.consultores@gmail.com";
      await sendEmail({
        to: recipient,
        subject: `Nuevo mensaje de contacto de ${name}`,
        html: htmlNotification,
      });
      notificationSent = true;
    } catch (err: any) {
      console.error("Error al enviar el correo de notificación:", err);
      notificationError = err.message || err;
    }

    // Evaluar resultados
    if (welcomeSent && notificationSent) {
      return NextResponse.json({
        success: true,
        message: "Todos los correos han sido enviados correctamente.",
      });
    }

    if (notificationSent && !welcomeSent) {
      // El correo de notificación al administrador funcionó, pero el de bienvenida falló.
      // En modo sandbox, esto es normal si el correo del remitente es ajeno.
      return NextResponse.json({
        success: true,
        warning: "El mensaje fue recibido correctamente, pero el correo de bienvenida no pudo entregarse debido a restricciones del sandbox de Resend.",
        welcomeError,
      });
    }

    // Si falló el correo de notificación principal, consideramos la acción fallida.
    return NextResponse.json(
      {
        success: false,
        error: "No se pudo procesar el envío de correo de notificación principal.",
        details: { welcomeError, notificationError },
      },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Error en la ruta de API de contacto:", error);
    return NextResponse.json(
      { success: false, error: "Ocurrió un error interno en el servidor." },
      { status: 500 }
    );
  }
}
