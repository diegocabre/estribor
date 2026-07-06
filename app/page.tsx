"use client";

import Hero from "@/components/Hero";
import QuienesSomos from "@/components/QuienesSomos";
import PorQueEstribor from "@/components/PorQueEstribor";
import Servicios from "@/components/Servicios";
import Sectores from "@/components/Sectores";
import CasosExperiencia from "@/components/CasosExperiencia";
import AgendaReunion from "@/components/AgendaReunion";
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

      {/* Nuestros Servicios Section */}
      <Servicios />

      {/* Sectores Section */}
      <Sectores />

      {/* Casos de Experiencia Section */}
      <CasosExperiencia />

      {/* Agenda tu Reunión Section */}
      <AgendaReunion />

      {/* Contacto Section */}
      <Contacto />
    </>
  );
}
