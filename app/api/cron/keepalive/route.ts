import { NextRequest, NextResponse } from "next/server";
import { internalError, jsonError } from "@/lib/security";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// Supabase Free pausa el proyecto tras 7 días sin actividad. Vercel Cron llama a esta ruta
// cada 3 días (vercel.json) con `Authorization: Bearer <CRON_SECRET>`.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return jsonError("CRON_SECRET no está configurado.", 500);
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return jsonError("No autorizado.", 401);
  }

  try {
    // Consulta liviana: solo cuenta filas, sin traer datos.
    const { count, error } = await getSupabaseAdmin()
      .from("jobs")
      .select("id", { count: "exact", head: true });
    if (error) throw error;
    return NextResponse.json({ success: true, jobs: count ?? 0, at: new Date().toISOString() });
  } catch (err) {
    return internalError("Keepalive de Supabase falló", err);
  }
}
