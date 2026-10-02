import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/content/blog";
import { getPublicJobs } from "@/lib/jobs";
import { SITE_URL } from "@/lib/seo";

// Se regenera cada hora y al instante cuando el panel cambia una vacante (revalidatePath).
export const revalidate = 3600;

const STATIC_ROUTES: { path: string; changeFrequency: "daily" | "weekly" | "monthly" | "yearly"; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/servicios", changeFrequency: "monthly", priority: 0.9 },
  { path: "/vacantes", changeFrequency: "daily", priority: 0.8 },
  { path: "/contacto", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/equipo", changeFrequency: "monthly", priority: 0.6 },
  { path: "/mision-vision", changeFrequency: "yearly", priority: 0.6 },
  { path: "/privacidad", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terminos", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await getPublicJobs();

  const staticEntries = STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    changeFrequency,
    priority,
  }));

  const blogEntries = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  // Solo vacantes abiertas: las cerradas llevan noindex en su página.
  const jobEntries = jobs
    .filter((job) => job.active)
    .map((job) => ({
      url: `${SITE_URL}/vacantes/${job.id}`,
      lastModified: new Date(job.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [...staticEntries, ...blogEntries, ...jobEntries];
}
