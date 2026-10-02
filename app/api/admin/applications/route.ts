import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireStaff } from "@/lib/admin-auth";
import { cvPathFromStored } from "@/lib/cv-path";
import { internalError, jsonError } from "@/lib/security";
import { CV_BUCKET, getSupabaseAdmin } from "@/lib/supabase-admin";

export async function DELETE(request: NextRequest) {
  const auth = await requireStaff(request, ["admin"]);
  if (!auth.ok) return auth.response;

  const parsed = z.object({ id: z.string().min(1).max(64) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Solicitud inválida.", 400);

  try {
    const supabase = getSupabaseAdmin();
    const { data: app, error: readError } = await supabase
      .from("applications")
      .select("cv_url")
      .eq("id", parsed.data.id)
      .maybeSingle();
    if (readError) throw readError;

    const { error } = await supabase.from("applications").delete().eq("id", parsed.data.id);
    if (error) throw error;

    // Borrar también el CV: un dato personal no debe quedar huérfano en Storage.
    const path = app ? cvPathFromStored(app.cv_url) : null;
    if (path) {
      const { error: storageError } = await supabase.storage.from(CV_BUCKET).remove([path]);
      if (storageError) console.error("No se pudo borrar el CV de Storage:", storageError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return internalError("No se pudo eliminar la postulación", err);
  }
}
