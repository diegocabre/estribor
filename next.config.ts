import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const isPreview = process.env.VERCEL_ENV === "preview";

// Orígenes externos que el sitio usa de verdad. Agregar aquí cualquier servicio nuevo.
const CLARITY = "https://www.clarity.ms https://*.clarity.ms https://c.bing.com";
const SUPABASE = "https://*.supabase.co wss://*.supabase.co";
const VERCEL_SCRIPTS = "https://va.vercel-scripts.com";
// Barra de comentarios de Vercel, solo en despliegues de preview.
const VERCEL_LIVE = isPreview ? "https://vercel.live" : "";

// 'unsafe-inline' en scripts es necesario mientras las páginas sean estáticas: Next inyecta
// scripts inline y un nonce obligaría a renderizar todo en cada solicitud.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""} ${CLARITY} ${VERCEL_SCRIPTS} ${VERCEL_LIVE}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://*.supabase.co ${CLARITY}`,
  "font-src 'self' data:",
  `connect-src 'self' ${SUPABASE} ${CLARITY} ${VERCEL_SCRIPTS} https://vitals.vercel-insights.com ${VERCEL_LIVE}`,
  `frame-src 'self' ${VERCEL_LIVE}`,
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  isDev ? "" : "upgrade-insecure-requests",
]
  .filter(Boolean)
  .map((d) => d.replace(/\s+/g, " ").trim())
  .join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // El panel y la API nunca deben quedar en cachés compartidas.
      { source: "/vacantes/admin", headers: [{ key: "Cache-Control", value: "no-store" }, { key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
    ];
  },
};

export default nextConfig;
