import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireStaff } from "@/lib/admin-auth";
import { internalError, jsonError } from "@/lib/security";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { firstIssue, jobSchema } from "@/lib/validation";

// Las páginas públicas de vacantes usan ISR: se regeneran apenas cambia una vacante.
function revalidateJobs(id?: string) {
  revalidatePath("/vacantes");
  revalidatePath("/sitemap.xml");
  if (id) revalidatePath(`/vacantes/${id}`);
}

export async function POST(request: NextRequest) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  const parsed = jobSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError(firstIssue(parsed.error), 400);

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("jobs")
      .insert({ ...parsed.data, active: true })
      .select("id")
      .single();
    if (error) throw error;
    revalidateJobs(data.id);
    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    return internalError("No se pudo crear la vacante", err);
  }
}

const idSchema = z.string().min(1).max(64);
const patchSchema = z.union([
  z.object({ id: idSchema, active: z.boolean() }).strict(),
  jobSchema.extend({ id: idSchema }),
]);

export async function PATCH(request: NextRequest) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  const parsed = patchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError(firstIssue(parsed.error), 400);
  const { id, ...changes } = parsed.data;

  try {
    const { error } = await getSupabaseAdmin().from("jobs").update(changes).eq("id", id);
    if (error) throw error;
    revalidateJobs(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return internalError("No se pudo actualizar la vacante", err);
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireStaff(request, ["admin"]);
  if (!auth.ok) return auth.response;

  const parsed = z.object({ id: idSchema }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonError("Solicitud inválida.", 400);

  try {
    const { error } = await getSupabaseAdmin().from("jobs").delete().eq("id", parsed.data.id);
    if (error) throw error;
    revalidateJobs(parsed.data.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return internalError("No se pudo eliminar la vacante", err);
  }
}
