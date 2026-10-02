import type { Metadata } from "next";
import BlogExplorer from "@/components/blog/BlogExplorer";
import JsonLd from "@/components/seo/JsonLd";
import { BLOG_CATEGORIES, blogPosts } from "@/lib/content/blog";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Blog e Insights",
  description:
    "Artículos técnicos, guías normativas y análisis sobre gestión de personas, seguridad laboral y sostenibilidad organizacional en Chile.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog & Insights | Estribor Consultores",
    description: "Guías sobre Ley Karin, reclutamiento, seguridad laboral y sostenibilidad en Chile.",
    url: "/blog",
  },
};

export default function BlogPage() {
  const posts = [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <div className="pt-28 md:pt-32 pb-16 bg-brand-bg min-h-screen">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />

      <div className="bg-brand-navy text-white py-16 mb-12 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center md:text-left">
          <span className="text-brand-gold text-xs font-bold tracking-widest uppercase block mb-3 font-sans">
            Recursos y Conocimiento
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 font-titles">Blog & Insights</h1>
          <p className="text-sm sm:text-base text-brand-gray max-w-xl font-light leading-relaxed">
            Explora nuestros artículos técnicos, guías normativas y análisis sobre capital humano, seguridad y
            sostenibilidad organizacional.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BlogExplorer posts={posts} categories={BLOG_CATEGORIES} />
      </div>
    </div>
  );
}
