import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = "Estribor Consultores: seguridad, personas y sostenibilidad";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Estribor Consultores",
    title: "Seguridad, personas y sostenibilidad para la industria chilena",
  });
}
