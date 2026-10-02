import type { Metadata, Viewport } from "next";
import { Open_Sans, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ConsentAnalytics from "@/components/analytics/ConsentAnalytics";
import CookieBanner from "@/components/CookieBanner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/seo/JsonLd";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { SITE_NAME, SITE_URL, localBusinessJsonLd, organizationJsonLd } from "@/lib/seo";

// Fuentes variables: un archivo por familia cubre todos los pesos usados (300–800).
const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const DESCRIPTION =
  "Consultora boutique especializada en Gestión de Personas, Seguridad y Salud en el Trabajo, y Sostenibilidad Organizacional en Chile. Navega con seguridad hacia la excelencia operacional.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Seguridad, Gestión y Sostenibilidad`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: SITE_NAME,
    url: "/",
    title: `${SITE_NAME} | Seguridad, Gestión y Sostenibilidad`,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Seguridad, Gestión y Sostenibilidad`,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export const viewport: Viewport = {
  themeColor: "#0F1D33",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CL" className={`${openSans.variable} ${plusJakartaSans.variable} h-full antialiased scroll-smooth`}>
      <head>
        {/* Sin JavaScript, el contenido animado con <Reveal> debe verse igual. */}
        <noscript>
          <style>{`.reveal{opacity:1!important;animation:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#F4F5F6] text-[#0F1D33]">
        <JsonLd data={[organizationJsonLd(), localBusinessJsonLd()]} />
        <Header />
        <main id="contenido" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer />
        <WhatsAppWidget />
        <CookieBanner />
        <ConsentAnalytics />
      </body>
    </html>
  );
}
