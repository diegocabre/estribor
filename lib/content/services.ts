// Las cuatro áreas de servicio. El id es el ancla de cada área en /servicios (p. ej. /servicios#comunicaciones).
export const SERVICE_AREAS = [
  { id: "personas", title: "Gestión de personas", image: "/images/home/personas.webp" },
  { id: "seguridad", title: "Seguridad y salud en el trabajo", image: "/images/home/sst.webp" },
  { id: "sostenibilidad", title: "Sostenibilidad", image: "/images/home/sostenibilidad.webp" },
  { id: "comunicaciones", title: "Comunicaciones corporativas", image: "/images/home/comunicaciones.webp" },
] as const;

// Opciones del select "Área de interés" del formulario de contacto (se valida en lib/validation.ts).
export const CONTACT_AREAS = [
  "Gestión de personas",
  "Seguridad y salud en el trabajo",
  "Sostenibilidad",
  "Comunicaciones corporativas",
  "Otro",
] as const;
