import { NextRequest, NextResponse } from "next/server";
import {
  HONEYPOT_FIELD,
  getClientIp,
  internalError,
  isHoneypotFilled,
  jsonError,
  rateLimit,
  tooManyRequests,
} from "@/lib/security";
import { CV_BUCKET, getSupabaseAdmin } from "@/lib/supabase-admin";
import { SPONTANEOUS_JOB_ID, applicationSchema, firstIssue, validatePdf } from "@/lib/validation";

// 5 postulaciones por hora por IP.
const LIMIT = 5;
const WINDOW_MS = 60 * 60_000;

const field = (form: FormData, key: string) => {
  const value = form.get(key);
  return typeof value === "string" ? value : undefined;
};

export async function POST(request: NextRequest) {
  const limit = rateLimit(`postulaciones:${getClientIp(request)}`, LIMIT, WINDOW_MS);
  if (!limit.ok) return tooManyRequests(limit.retryAfter);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonError("Solicitud inválida.", 400);
  }

  if (isHoneypotFilled(form.get(HONEYPOT_FIELD))) {
    return NextResponse.json({ success: true });
  }

  const parsed = applicationSchema.safeParse({
    jobId: field(form, "jobId"),
    area: field(form, "area"),
    fullName: field(form, "fullName"),
    rut: field(form, "rut"),
    email: field(form, "email"),
    phone: field(form, "phone"),
    city: field(form, "city"),
    salaryExpectation: field(form, "salaryExpectation"),
    availability: field(form, "availability"),
    linkedinProfile: field(form, "linkedinProfile"),
    privacyAccepted: field(form, "privacyAccepted"),
  });
  if (!parsed.success) return jsonError(firstIssue(parsed.error), 400);
  const input = parsed.data;

  const cv = form.get("cv");
  const cvError = await validatePdf(cv);
  if (cvError) return jsonError(cvError, 400);

  const supabase = getSupabaseAdmin();
  const isSpontaneous = input.jobId === SPONTANEOUS_JOB_ID;

  try {
    // El título se toma de la base: el cliente no puede postular a una vacante cerrada o inventada.
    let jobTitle: string;
    if (isSpontaneous) {
      jobTitle = `Postulación Espontánea - ${input.area || "General"}`;
    } else {
      const { data: job, error } = await supabase
        .from("jobs")
        .select("id, title, active")
        .eq("id", input.jobId)
        .maybeSingle();
      if (error) throw error;
      if (!job || !job.active) {
        return jsonError("Esta vacante ya no está disponible.", 404);
      }
      jobTitle = job.title;
    }

    const { data: existing, error: dupError } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", input.jobId)
      .eq("rut", input.rut)
      .limit(1);
    if (dupError) throw dupError;
    if (existing && existing.length > 0) {
      return jsonError(
        isSpontaneous
          ? "Ya te has registrado en nuestra postulación espontánea con este RUT. Tu perfil ya está en nuestra base de datos."
          : "Ya registramos una postulación con este RUT para esta vacante.",
        409
      );
    }

    // Nombre no adivinable dentro de un bucket privado: el panel lo abre con URL firmada.
    const cvPath = `${isSpontaneous ? SPONTANEOUS_JOB_ID : input.jobId}/${crypto.randomUUID()}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from(CV_BUCKET)
      .upload(cvPath, cv as File, { contentType: "application/pdf", upsert: false });
    if (uploadError) throw uploadError;

    const { error: insertError } = await supabase.from("applications").insert({
      job_id: input.jobId,
      job_title: jobTitle,
      full_name: input.fullName,
      rut: input.rut,
      email: input.email,
      phone: input.phone,
      city: input.city,
      salary_expectation: input.salaryExpectation,
      availability: input.availability || "Inmediata",
      cv_url: cvPath,
      linkedin_profile: input.linkedinProfile || null,
    });

    if (insertError) {
      // No dejar CVs huérfanos si la fila no se guardó.
      await supabase.storage.from(CV_BUCKET).remove([cvPath]);
      if (insertError.code === "23505") {
        return jsonError("Ya registramos una postulación con este RUT para esta vacante.", 409);
      }
      throw insertError;
    }
  } catch (err) {
    return internalError("No se pudo registrar la postulación", err);
  }

  return NextResponse.json({ success: true });
}
