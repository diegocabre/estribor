import type { Metadata } from "next";
import ContactoInicio from "@/components/ContactoInicio";
import Hero from "@/components/Hero";
import PorQueEstribor from "@/components/PorQueEstribor";
import QueHacemos from "@/components/QueHacemos";
import QuienesSomos from "@/components/QuienesSomos";
import Sectores from "@/components/Sectores";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Server Component: solo el formulario de contacto hidrata en el cliente.
export default function Home() {
  return (
    <>
      <Hero />
      <QueHacemos />
      <PorQueEstribor />
      <Sectores />
      <QuienesSomos />
      <ContactoInicio />
    </>
  );
}
