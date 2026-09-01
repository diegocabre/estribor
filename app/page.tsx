"use client";

import Hero from "@/components/Hero";
import QuienesSomos from "@/components/QuienesSomos";
import PorQueEstribor from "@/components/PorQueEstribor";
import Sectores from "@/components/Sectores";
import CasosExperiencia from "@/components/CasosExperiencia";
import Contacto from "@/components/Contacto";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* ¿Quiénes somos? Section */}
      <QuienesSomos />

      {/* ¿Por qué Estribor? Section */}
      <PorQueEstribor />

      {/* Sectores Section */}
      <Sectores />

      {/* Casos de Experiencia Section */}
      <CasosExperiencia />

      {/* ¿Quieres contactarnos? Section (Formulario Izquierda + Agenda Derecha) */}
      <Contacto />
    </>
  );
}
