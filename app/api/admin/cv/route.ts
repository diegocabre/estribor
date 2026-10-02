import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/admin-auth";
import { cvPathFromStored } from "@/lib/cv-path";
import { internalError, jsonError } from "@/lib/security";
import { CV_BUCKET, getSupabaseAdmin } from "@/lib/supabase-admin";

// URL firmada de 2 minutos para abrir un CV del bucket privado.
const SIGNED_URL_SECONDS = 120;

export async function GET(request: NextRequest) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  const id = request.nextUrl.searchParams.get("id");
  if (!id || id.length > 64) return jsonError("Solicitud inválida.", 400);

  try {
    const supabase = getSupabaseAdmin();
    const { data: app, error } = await supabase
      .from("applications")
      .select("cv_url")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;

    const path = app ? cvPathFromStored(app.cv_url) : null;
    if (!path) return jsonError("Esta postulación no tiene CV.", 404);

    const { data, error: signError } = await supabase.storage
      .from(CV_BUCKET)
      .createSignedUrl(path, SIGNED_URL_SECONDS);
    if (signError) throw signError;

    return NextResponse.json(
      { success: true, url: data.signedUrl },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    return internalError("No se pudo generar el enlace del CV", err);
  }
}
