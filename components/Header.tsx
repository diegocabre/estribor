"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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
    { name: "Blog", href: "/blog" },
    { name: "Portal Empleo", href: "/vacantes" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-2 border-b border-brand-gray/10"
          : "bg-white shadow-sm border-b border-brand-gray/10 py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[72px] md:min-h-[88px]">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center focus:outline-none group py-1"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Ir al inicio"
          >
            <div className={`relative transition-all duration-300 overflow-hidden hover:scale-105 ${
              scrolled
                ? "w-16 h-16 md:w-20 md:h-20"
                : "w-20 h-20 md:w-24 md:h-24"
            }`}>
              <Image
                src="/logo_icon.png"
                alt="Estribor Logo"
                fill
                sizes="(max-width: 640px) 80px, 96px"
                priority
                className="object-contain"
              />
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`text-base font-semibold transition-colors duration-200 relative group py-2 ${
                    isActive
                      ? "text-brand-electric"
                      : "text-brand-navy hover:text-brand-electric"
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-brand-electric transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </a>
              );
            })}
            <a
              href="/contacto"
              className={`px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 ${
                pathname === "/contacto"
                  ? "bg-brand-blue-med text-white"
                  : "bg-brand-electric hover:bg-brand-blue-med text-white"
              }`}
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
              {mobileMenuOpen ? (
                <X className="h-7 w-7" />
              ) : (
                <Menu className="h-7 w-7" />
              )}
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
              {navItems.map((item, index) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <motion.a
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-3 rounded-md text-base font-medium transition-all ${
                      isActive
                        ? "bg-brand-electric/10 text-brand-electric font-semibold border-l-4 border-brand-electric pl-2.5"
                        : "text-brand-navy hover:bg-brand-bg hover:text-brand-electric"
                    }`}
                  >
                    {item.name}
                  </motion.a>
                );
              })}
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
