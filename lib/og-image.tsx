import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

// El logo no depende de la solicitud: se lee una sola vez.
const logoSrc = readFile(join(process.cwd(), "public", "logo-512.png"), "base64").then(
  (data) => `data:image/png;base64,${data}`
);

/** Imagen social 1200×630 con la identidad de la marca (azul marino y dorado). */
export async function renderOgImage({ title, eyebrow }: { title: string; eyebrow: string }) {
  const logo = await logoSrc;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0F1D33",
          color: "#FFFFFF",
          padding: "72px",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "720px" }}>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: "#C9A05C", textTransform: "uppercase", marginBottom: 28 }}>
            {eyebrow}
          </div>
          <div style={{ display: "flex", fontSize: title.length > 60 ? 52 : 64, fontWeight: 700, lineHeight: 1.15 }}>{title}</div>
          <div style={{ display: "flex", marginTop: 40, fontSize: 28, color: "#B0B8C4" }}>estriborconsultores.cl</div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse (satori) no admite next/image */}
        <img src={logo} width={300} height={319} alt="" style={{ filter: "brightness(0) invert(1)", opacity: 0.9 }} />
      </div>
    ),
    OG_SIZE
  );
}
