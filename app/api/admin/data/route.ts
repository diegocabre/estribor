import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/admin-auth";
import { internalError } from "@/lib/security";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { mapJobRow, type JobApplication, type JobRow } from "@/lib/types";

interface ApplicationRow {
  id: string;
  job_id: string;
  job_title: string;
  full_name: string;
  rut: string;
  email: string;
  phone: string;
  city: string;
  salary_expectation: string;
  availability: string | null;
  cv_url: string;
  linkedin_profile: string | null;
  applied_at?: string | null;
  created_at?: string | null;
}

const mapApplication = (a: ApplicationRow): JobApplication => ({
  id: a.id,
  jobId: a.job_id,
  jobTitle: a.job_title,
  fullName: a.full_name,
  rut: a.rut,
  email: a.email,
  phone: a.phone,
  city: a.city,
  salaryExpectation: a.salary_expectation,
  availability: a.availability || "Inmediata",
  cvFileName: a.cv_url,
  linkedinProfile: a.linkedin_profile ?? undefined,
  appliedAt: a.applied_at || a.created_at || "",
});

// Todas las lecturas del panel pasan por aquí, así `applications` no necesita políticas para clientes.
export async function GET(request: NextRequest) {
  const auth = await requireStaff(request);
  if (!auth.ok) return auth.response;

  try {
    const supabase = getSupabaseAdmin();
    const [areasRes, jobsRes, appsRes] = await Promise.all([
      supabase.from("job_areas").select("id, name").order("name", { ascending: true }),
      supabase.from("jobs").select("*").order("created_at", { ascending: false }),
      supabase.from("applications").select("*"),
    ]);

    if (jobsRes.error) throw jobsRes.error;
    if (appsRes.error) throw appsRes.error;

    const applications = (appsRes.data as ApplicationRow[])
      .map(mapApplication)
      .sort((a, b) => b.appliedAt.localeCompare(a.appliedAt));

    return NextResponse.json(
      {
        success: true,
        role: auth.session.role,
        areas: areasRes.error ? [] : areasRes.data,
        jobs: (jobsRes.data as JobRow[]).map(mapJobRow),
        applications,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    return internalError("No se pudieron cargar los datos del panel", err);
  }
}
