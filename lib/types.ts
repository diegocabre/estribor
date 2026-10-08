// Tipos de dominio compartidos entre cliente, servidor y rutas /api.

export interface Job {
  id: string;
  title: string;
  area: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  functions: string;
  confidential: boolean;
  active: boolean;
  createdAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  rut: string;
  email: string;
  phone: string;
  city: string;
  salaryExpectation: string;
  availability: string;
  /** Ruta del archivo en el bucket privado `cvs` (o URL antigua en registros previos). */
  cvFileName: string;
  linkedinProfile?: string;
  appliedAt: string;
}

export interface JobArea {
  id?: string;
  name: string;
}

export interface BookedSlot {
  date: string;
  time: string;
}

export interface BlogPost {
  title: string;
  slug: string;
  description: string;
  /** Fecha visible, p. ej. "1 de Julio, 2026". */
  date: string;
  /** Fecha ISO de publicación, usada en sitemap y JSON-LD. */
  publishedAt: string;
  category: string;
  readTime: string;
  content: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  /** Ruta en /public, en WebP de ~760 px de ancho. */
  photo: string;
  /** "direccion" se muestra destacado; "consultor" va en la grilla del equipo consultor. */
  group: "direccion" | "consultor";
}

/** Fila de la tabla `jobs` tal como la devuelve Supabase. */
export interface JobRow {
  id: string;
  title: string;
  area: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  functions: string;
  confidential: boolean;
  active: boolean;
  created_at: string;
}

export function mapJobRow(row: JobRow): Job {
  return {
    id: row.id,
    title: row.title,
    area: row.area,
    location: row.location,
    type: row.type,
    description: row.description,
    requirements: row.requirements,
    functions: row.functions,
    confidential: row.confidential,
    active: row.active,
    createdAt: row.created_at,
  };
}

export type ApiResult<T = Record<string, never>> =
  | ({ success: true } & T)
  | { success: false; error: string };
