import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.estriborconsultores.cl";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/vacantes/admin/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
