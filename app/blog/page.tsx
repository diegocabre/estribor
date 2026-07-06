"use client";

import { useState } from "react";
import { blogPosts } from "@/components/blogData";
import { ArrowRight, Calendar, Clock, BookOpen } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const categories = ["Todos", "Gestión de Personas", "Sostenibilidad"];

  const filteredPosts = selectedCategory === "Todos"
    ? blogPosts
    : blogPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="pt-24 pb-16 bg-brand-bg min-h-screen">
      {/* Page Header */}
      <div className="bg-brand-navy text-white py-16 mb-12 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center md:text-left">
          <span className="text-brand-gold text-xs font-bold tracking-widest uppercase block mb-3 font-sans">
            Recursos y Conocimiento
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 font-titles">
            Blog & Insights
          </h1>
          <p className="text-sm sm:text-base text-brand-gray max-w-xl font-light leading-relaxed">
            Explora nuestros artículos técnicos, guías normativas y análisis sobre capital humano, seguridad y sostenibilidad organizacional.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-10 border-b border-brand-gray/10 pb-4">
          <span className="text-xs font-bold text-brand-navy uppercase mr-2 tracking-wider">Filtrar por:</span>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
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

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, idx) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className="bg-white border border-brand-gray/15 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="p-6 sm:p-8">
                  {/* Category & Stats */}
                  <div className="flex items-center justify-between text-[10px] text-brand-gray-dark font-semibold mb-4">
                    <span className="text-brand-gold bg-brand-gold/15 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-brand-navy mb-3 line-clamp-2 hover:text-brand-gold transition-colors duration-200">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-brand-gray-dark font-light leading-relaxed line-clamp-3">
                    {post.description}
                  </p>
                </div>

                {/* Footer read link */}
                <div className="p-6 sm:p-8 bg-brand-bg/30 border-t border-brand-gray/5 flex justify-between items-center mt-auto">
                  <div className="flex items-center gap-1.5 text-xs text-brand-gray-dark font-light">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue-light hover:text-brand-navy transition-colors group"
                  >
                    Leer artículo
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-brand-gray/10 rounded-2xl">
            <BookOpen className="h-12 w-12 text-brand-gray mx-auto mb-4" />
            <h3 className="text-lg font-bold text-brand-navy">No se encontraron artículos</h3>
            <p className="text-sm text-brand-gray-dark font-light">Intenta seleccionando otra categoría.</p>
          </div>
        )}

      </div>
    </div>
  );
}
