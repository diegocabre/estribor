import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireStaff } from "@/lib/admin-auth";
import { internalError, jsonError } from "@/lib/security";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { areaSchema, firstIssue } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  const parsed = areaSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError(firstIssue(parsed.error), 400);

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("job_areas")
      .insert({ name: parsed.data.name })
      .select("id, name")
      .single();
    if (error) {
      if (error.code === "23505") return jsonError("Esta área ya existe en la lista.", 409);
      throw error;
    }
    return NextResponse.json({ success: true, area: data });
  } catch (err) {
    return internalError("No se pudo crear el área", err);
  }
}

const deleteSchema = z.object({
  id: z.string().max(64).optional(),
  name: z.string().trim().min(1).max(100),
});

export async function DELETE(request: NextRequest) {
  const auth = await requireStaff(request, ["admin"]);
  if (!auth.ok) return auth.response;

  const parsed = deleteSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Solicitud inválida.", 400);

  try {
    const query = getSupabaseAdmin().from("job_areas").delete();
    const { error } = parsed.data.id
      ? await query.eq("id", parsed.data.id)
      : await query.eq("name", parsed.data.name);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    return internalError("No se pudo eliminar el área", err);
  }
}
