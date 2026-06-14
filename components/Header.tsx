"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Servicios", href: "/servicios" },
    { name: "Misión y Visión", href: "/mision-vision" },
    { name: "Equipo", href: "/equipo" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-2 border-b border-brand-gray/10"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Name */}
          <a href="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
            <div className="relative h-12 w-12 sm:h-14 sm:w-14 overflow-hidden transition-transform duration-300 hover:scale-105">
              <Image
                src="/logo.png"
                alt="Estribor Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-xl sm:text-2xl font-bold tracking-wider text-brand-navy leading-none font-sans">
                ESTRIBOR
              </span>
              <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-brand-gray leading-none mt-1">
                CONSULTORES
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-brand-navy hover:text-brand-electric transition-colors duration-200 relative group py-2"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-electric transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            <a
              href="/contacto"
              className="bg-brand-electric hover:bg-brand-blue-med text-white px-5 py-2.5 rounded-md text-sm font-semibold tracking-wide transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              Contáctanos
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-brand-navy hover:text-brand-electric focus:outline-none p-2 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6 animate-pulse" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden bg-white border-t border-brand-gray/10 shadow-lg overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navItems.map((item, index) => (
                <motion.a
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-md text-base font-medium text-brand-navy hover:bg-brand-bg hover:text-brand-electric transition-all"
                >
                  {item.name}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.05 }}
                className="pt-4 px-3"
              >
                <a
                  href="/contacto"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-brand-electric hover:bg-brand-blue-med text-white px-5 py-3 rounded-md text-base font-semibold transition-colors shadow-sm"
                >
                  Contáctanos
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
