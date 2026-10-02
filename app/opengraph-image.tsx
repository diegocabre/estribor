import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Estribor Consultores: Seguridad, Gestión y Sostenibilidad";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Estribor Consultores",
    title: "Navega con seguridad hacia la excelencia operacional",
  });
}
