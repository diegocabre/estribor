import { createClient } from "@supabase/supabase-js";

// Cliente público (clave anon). Solo para lecturas públicas y Auth del panel.
// Toda escritura sensible pasa por rutas /api con lib/supabase-admin.ts.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === "production" && process.env.VERCEL_ENV === "production") {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
  console.warn(
    "Advertencia: faltan las credenciales públicas de Supabase. Se usarán placeholders fuera de producción."
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);
