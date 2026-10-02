import type { Metadata } from "next";
import CasosExperiencia from "@/components/CasosExperiencia";
import Contacto from "@/components/Contacto";
import Hero from "@/components/Hero";
import PorQueEstribor from "@/components/PorQueEstribor";
import QuienesSomos from "@/components/QuienesSomos";
import Sectores from "@/components/Sectores";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Server Component: solo Contacto (formulario y agenda) hidrata en el cliente.
export default function Home() {
  return (
    <>
      <Hero />
      <QuienesSomos />
      <PorQueEstribor />
      <Sectores />
      <CasosExperiencia />
      {/* Formulario a la izquierda y agenda a la derecha */}
      <Contacto />
    </>
  );
}
