import type { Metadata } from "next";
import { legalConfig } from "@/lib/legalConfig";
import type { BlogPost, Job } from "@/lib/types";

// Datos estructurados (schema.org) construidos solo con datos reales de lib/legalConfig.ts.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.estriborconsultores.cl").replace(/\/$/, "");
export const SITE_NAME = legalConfig.brandName;
export const DEFAULT_OG_IMAGE = "/opengraph-image";

export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** Metadata de una página: título (la plantilla agrega la marca), descripción, canonical y Open Graph. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | ${SITE_NAME}`, description, url: path },
    twitter: { title: `${title} | ${SITE_NAME}`, description },
  };
}

const ORG_ID = `${SITE_URL}/#organization`;
const SAME_AS = ["https://www.linkedin.com/company/estribor-consultores"];

const address = {
  "@type": "PostalAddress",
  streetAddress: "Parque Westfalia 1",
  addressLocality: "Puerto Varas",
  addressRegion: "Los Lagos",
  addressCountry: "CL",
};

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    legalName: legalConfig.companyName,
    url: SITE_URL,
    logo: absoluteUrl("/logo-512.png"),
    email: legalConfig.contactEmail,
    telephone: legalConfig.phone,
    address,
    sameAs: SAME_AS,
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#localbusiness`,
    name: SITE_NAME,
    url: SITE_URL,
    image: absoluteUrl("/logo-512.png"),
    email: legalConfig.contactEmail,
    telephone: legalConfig.phone,
    address,
    areaServed: { "@type": "Country", name: "Chile" },
    parentOrganization: { "@id": ORG_ID },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

const EMPLOYMENT_TYPES: Record<string, string> = {
  "full-time": "FULL_TIME",
  "part-time": "PART_TIME",
  "por proyecto": "CONTRACTOR",
  contractor: "CONTRACTOR",
  temporal: "TEMPORARY",
  "práctica": "INTERN",
};

/** JobPosting para Google Empleos. Solo se emite para vacantes abiertas. */
export function jobPostingJsonLd(job: Job) {
  const posted = new Date(job.createdAt);
  const validThrough = new Date(posted.getTime() + 60 * 24 * 60 * 60 * 1000);
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: [job.description, job.functions && `Funciones: ${job.functions}`, job.requirements && `Requisitos: ${job.requirements}`]
      .filter(Boolean)
      .join("\n\n"),
    datePosted: posted.toISOString().slice(0, 10),
    validThrough: validThrough.toISOString(),
    employmentType: EMPLOYMENT_TYPES[job.type.toLowerCase()] ?? "FULL_TIME",
    directApply: true,
    url: absoluteUrl(`/vacantes/${job.id}`),
    // En búsquedas confidenciales, Estribor publica en nombre del cliente.
    hiringOrganization: {
      "@type": "Organization",
      name: job.confidential ? `${SITE_NAME} (búsqueda confidencial)` : SITE_NAME,
      sameAs: SITE_URL,
      logo: absoluteUrl("/logo-512.png"),
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: "CL",
      },
    },
  };
}

export function articleJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    articleSection: post.category,
    inLanguage: "es-CL",
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    image: absoluteUrl(`/blog/${post.slug}/opengraph-image`),
    author: { "@type": "Organization", "@id": ORG_ID, name: SITE_NAME },
    publisher: { "@type": "Organization", "@id": ORG_ID, name: SITE_NAME, logo: { "@type": "ImageObject", url: absoluteUrl("/logo-512.png") } },
  };
}
