import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import ShareArticleButton from "@/components/blog/ShareArticleButton";
import JsonLd from "@/components/seo/JsonLd";
import { blogPosts, getPostBySlug } from "@/lib/content/blog";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Los artículos se generan en el build; un slug desconocido responde 404 real.
export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      section: post.category,
    },
  };
}

/** Convierte **negrita** en <strong>; el resto queda como texto (sin HTML arbitrario). */
function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-brand-navy">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="pt-36 md:pt-44 pb-16 bg-brand-bg min-h-screen">
      <JsonLd data={articleJsonLd(post)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-navy hover:text-brand-gold transition-colors"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Volver al Blog
          </Link>
          <ShareArticleButton title={post.title} text={post.description} />
        </div>

        <article className="bg-white border border-brand-gray/15 rounded-3xl p-6 sm:p-12 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-gold"></div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-brand-gray-dark font-semibold mb-6">
            <span className="text-brand-navy bg-brand-gold/15 px-3 py-1 rounded-full uppercase tracking-wider">
              {post.category}
            </span>
            <div className="flex items-center gap-1.5">
              <Calendar aria-hidden="true" className="h-4 w-4" />
              <time dateTime={post.publishedAt}>{post.date}</time>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock aria-hidden="true" className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-navy leading-tight tracking-tight mb-8 font-titles">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-brand-navy/90 font-light leading-relaxed italic border-l-4 border-brand-gold/40 pl-4 mb-8 bg-brand-bg/20 py-2 pr-2 rounded-r-xl">
            {post.description}
          </p>

          <div className="space-y-6 text-brand-navy/90 font-light leading-relaxed text-sm sm:text-base">
            {post.content.map((paragraph, idx) => {
              if (paragraph.startsWith("###")) {
                return (
                  <h2 key={idx} className="text-xl font-bold text-brand-navy pt-6 mb-2 font-titles">
                    {paragraph.replace("###", "").trim()}
                  </h2>
                );
              }
              if (/^(\d+\.|-)\s/.test(paragraph)) {
                return (
                  <div key={idx} className="pl-4 border-l-2 border-brand-gold/25 py-0.5">
                    <p className="font-light">{renderInline(paragraph)}</p>
                  </div>
                );
              }
              return <p key={idx}>{renderInline(paragraph)}</p>;
            })}
          </div>

          <aside className="mt-12 p-8 bg-brand-navy text-white rounded-2xl relative overflow-hidden shadow-md">
            <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 w-48 h-48 bg-brand-gold rounded-full blur-2xl"></div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-2 font-titles">¿Quieres aplicar esto en tu organización?</h2>
                <p className="text-xs text-brand-gray font-light max-w-md">
                  Agenda una sesión de diagnóstico gratuita de 15 minutos con nuestros consultores expertos para evaluar
                  tus requerimientos y planificar tu rumbo.
                </p>
              </div>
              <Link
                href="/#agenda"
                className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy px-6 py-3 rounded-xl text-xs font-bold transition-all shrink-0 hover:scale-[1.02] flex items-center gap-2"
              >
                Agendar Diagnóstico
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </article>
      </div>
    </div>
  );
}
