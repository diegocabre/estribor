"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, Clock } from "lucide-react";
import type { BlogPost } from "@/lib/types";

/** Filtro por categoría y grilla de artículos. Los artículos llegan desde el servidor. */
export default function BlogExplorer({ posts, categories }: { posts: BlogPost[]; categories: string[] }) {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredPosts = selectedCategory === "Todos" ? posts : posts.filter((post) => post.category === selectedCategory);

  return (
    <>
      <div
        role="group"
        aria-label="Filtrar artículos por categoría"
        className="flex flex-wrap items-center gap-2 mb-10 border-b border-brand-gray/10 pb-4"
      >
        <span className="text-xs font-bold text-brand-navy uppercase mr-2 tracking-wider">Filtrar por:</span>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            aria-pressed={selectedCategory === category}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all duration-200 ${
              selectedCategory === category
                ? "bg-brand-gold text-brand-navy border-brand-gold shadow-sm"
                : "border-brand-gray/20 text-brand-navy hover:bg-white bg-white/50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, idx) => (
            <article
              key={post.slug}
              style={{ animationDelay: `${idx * 0.08}s` }}
              className="animate-rise-in bg-white border border-brand-gray/15 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between text-[10px] text-brand-gray-dark font-semibold mb-4">
                  <span className="text-brand-navy bg-brand-gold/15 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-brand-navy mb-3 line-clamp-2 hover:text-brand-gold transition-colors duration-200">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="text-sm text-brand-gray-dark font-light leading-relaxed line-clamp-3">{post.description}</p>
              </div>

              <div className="p-6 sm:p-8 bg-brand-bg/30 border-t border-brand-gray/5 flex justify-between items-center mt-auto">
                <div className="flex items-center gap-1.5 text-xs text-brand-gray-dark font-light">
                  <Calendar aria-hidden="true" className="h-4 w-4" />
                  <time dateTime={post.publishedAt}>{post.date}</time>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  aria-label={`Leer artículo: ${post.title}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-electric hover:text-brand-navy transition-colors group"
                >
                  Leer artículo
                  <ArrowRight
                    aria-hidden="true"
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-brand-gray/10 rounded-2xl">
          <BookOpen aria-hidden="true" className="h-12 w-12 text-brand-gray mx-auto mb-4" />
          <h2 className="text-lg font-bold text-brand-navy">No se encontraron artículos</h2>
          <p className="text-sm text-brand-gray-dark font-light">Intenta seleccionando otra categoría.</p>
        </div>
      )}
    </>
  );
}
