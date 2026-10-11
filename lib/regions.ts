// Regiones de Chile con su nombre oficial, de norte a sur. Se usan en el panel de vacantes
// y como addressRegion del JobPosting.
export const CHILE_REGIONS = [
  "Región de Arica y Parinacota",
  "Región de Tarapacá",
  "Región de Antofagasta",
  "Región de Atacama",
  "Región de Coquimbo",
  "Región de Valparaíso",
  "Región Metropolitana de Santiago",
  "Región del Libertador General Bernardo O'Higgins",
  "Región del Maule",
  "Región de Ñuble",
  "Región del Biobío",
  "Región de La Araucanía",
  "Región de Los Ríos",
  "Región de Los Lagos",
  "Región de Aysén del General Carlos Ibáñez del Campo",
  "Región de Magallanes y de la Antártica Chilena",
] as const;

export type ChileRegion = (typeof CHILE_REGIONS)[number];

/** Donde está la mayoría de las vacantes; también el valor de las publicadas antes de existir el campo. */
export const DEFAULT_REGION: ChileRegion = "Región de Los Lagos";
