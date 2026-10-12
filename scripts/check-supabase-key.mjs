// Verifica SUPABASE_SERVICE_ROLE_KEY de .env.local sin mostrarla.
// Uso: node scripts/check-supabase-key.mjs
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((line) => /^[A-Z_]+=/.test(line))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i), line.slice(i + 1)];
    })
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const raw = env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const key = raw.trim().replace(/^["']|["']$/g, "");
const urlRef = url?.match(/https:\/\/([a-z0-9]+)\./)?.[1];

if (!key) {
  console.log("✗ SUPABASE_SERVICE_ROLE_KEY no está en .env.local");
  process.exit(1);
}
if (raw !== key) console.log("⚠ La clave tenía comillas o espacios de más: quítalos también en Vercel.");

// Tipo de clave
if (key.startsWith("sb_secret_")) {
  console.log("• Tipo: clave secreta (formato nuevo sb_secret_) ✓");
} else if (key.startsWith("sb_publishable_")) {
  console.log("✗ Tipo: clave PUBLICABLE (es la pública, no la secreta). Copia la 'secret'.");
} else if (key.split(".").length === 3) {
  try {
    const payload = JSON.parse(Buffer.from(key.split(".")[1], "base64url").toString());
    console.log(`• Tipo: JWT con role="${payload.role}" del proyecto "${payload.ref}"`);
    if (payload.role !== "service_role") console.log("✗ No es la service_role (parece la anon). Copia la 'service_role'.");
    if (payload.ref && payload.ref !== urlRef) console.log(`✗ Es de otro proyecto: la URL usa "${urlRef}".`);
  } catch {
    console.log("✗ Tiene forma de JWT pero no se puede leer: probablemente está cortada.");
  }
} else {
  console.log(`✗ No parece una clave de API de Supabase (largo ${key.length}). ¿Copiaste el "JWT Secret"? Ese no sirve.`);
}

// Prueba real contra la API
const res = await fetch(`${url}/rest/v1/bookings?select=date&limit=1`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
});
console.log(res.ok ? `✓ Supabase acepta la clave (HTTP ${res.status}).` : `✗ Supabase rechaza la clave (HTTP ${res.status}): ${(await res.text()).slice(0, 120)}`);
