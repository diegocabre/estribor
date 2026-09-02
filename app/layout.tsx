import type { Metadata } from "next";
import { Open_Sans, Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import CookieBanner from "@/components/CookieBanner";
import MicrosoftClarity from "@/components/MicrosoftClarity";

const openSans = Open_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.estriborconsultores.cl"
  ),
  title: "Estribor Consultores | Seguridad, Gestión y Sostenibilidad",
  description: "Consultora boutique especializada en Gestión de Personas, Seguridad y Salud en el Trabajo, y Sostenibilidad Organizacional en Chile. Navega con seguridad hacia la excelencia operacional.",
  keywords: [
    "recursos humanos chile",
    "reclutamiento y selección",
    "seguridad y salud en el trabajo",
    "ley karin chile",
    "sostenibilidad organizacional",
    "indicadores esg",
    "evaluaciones de desempeño",
    "hunting ejecutivo",
    "auditoría sst",
    "acuicultura chile"
  ],
  authors: [{ name: "Estribor Consultores" }],
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${openSans.variable} ${plusJakartaSans.variable} ${cormorantGaramond.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#F4F5F6] text-[#0F1D33]">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppWidget />
        <CookieBanner />
        <MicrosoftClarity />
        <SpeedInsights />
      </body>
    </html>
  );
}
