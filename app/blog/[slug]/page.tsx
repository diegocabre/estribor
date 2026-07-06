"use client";

import { use } from "react";
import { blogPosts } from "@/components/blogData";
import { ArrowLeft, Calendar, Clock, ArrowRight, Share2 } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    return (
      <div className="pt-32 pb-24 text-center min-h-screen">
        <h1 className="text-2xl font-bold text-brand-navy mb-4">Artículo no encontrado</h1>
        <p className="text-sm text-brand-gray-dark mb-8">El enlace al que intentas acceder no existe.</p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 bg-brand-navy text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          Volver al Blog
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Enlace copiado al portapapeles.");
    }
  };

  return (
    <div className="pt-24 pb-16 bg-brand-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumbs & Back */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-navy hover:text-brand-gold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Blog
          </Link>
          
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs text-brand-navy hover:text-brand-gold transition-colors font-bold"
          >
            <Share2 className="h-4 w-4" />
            Compartir Artículo
          </button>
        </div>

        {/* Article Wrapper */}
        <article className="bg-white border border-brand-gray/15 rounded-3xl p-6 sm:p-12 shadow-sm relative overflow-hidden">
          {/* Subtle gold accent border on top */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-gold"></div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-brand-gray-dark font-semibold mb-6">
            <span className="text-brand-navy bg-brand-gold/15 px-3 py-1 rounded-full uppercase tracking-wider">
              {post.category}
            </span>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl font-extrabold text-brand-navy leading-tight tracking-tight mb-8 font-titles">
            {post.title}
          </h1>

          {/* Intro text */}
          <p className="text-base sm:text-lg text-brand-navy/90 font-light leading-relaxed italic border-l-4 border-brand-gold/40 pl-4 mb-8 bg-brand-bg/20 py-2 pr-2 rounded-r-xl">
            {post.description}
          </p>

          {/* Body Content */}
          <div className="space-y-6 text-brand-navy/90 font-light leading-relaxed text-sm sm:text-base">
            {post.content.map((paragraph, idx) => {
              // Parse headers if they start with markdown syntax
              if (paragraph.startsWith("###")) {
                return (
                  <h3 key={idx} className="text-xl font-bold text-brand-navy pt-6 mb-2 font-titles">
                    {paragraph.replace("###", "").trim()}
                  </h3>
                );
              }
              if (paragraph.startsWith("1.") || paragraph.startsWith("2.") || paragraph.startsWith("3.") || paragraph.startsWith("4.") || paragraph.startsWith("-")) {
                return (
                  <div key={idx} className="pl-4 border-l-2 border-brand-gold/25 py-0.5">
                    <p className="font-light">{paragraph}</p>
                  </div>
                );
              }
              return <p key={idx}>{paragraph}</p>;
            })}
          </div>

          {/* Strategic Action Box (CTA) */}
          <div className="mt-12 p-8 bg-brand-navy text-white rounded-2xl relative overflow-hidden shadow-md">
            <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 w-48 h-48 bg-brand-gold rounded-full blur-2xl"></div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-lg font-bold text-white mb-2 font-titles">¿Quieres aplicar esto en tu organización?</h4>
                <p className="text-xs text-brand-gray font-light max-w-md">
                  Agenda una sesión de diagnóstico gratuita de 15 minutos con nuestros consultores expertos para evaluar tus requerimientos y planificar tu rumbo.
                </p>
              </div>
              <Link
                href="/#agenda"
                className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy px-6 py-3 rounded-xl text-xs font-bold transition-all shrink-0 hover:scale-[1.02] flex items-center gap-2"
              >
                Agendar Diagnóstico
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </article>

      </div>
    </div>
  );
}
