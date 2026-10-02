"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { name: "Servicios", href: "/servicios" },
  { name: "Misión y Visión", href: "/mision-vision" },
  { name: "Equipo", href: "/equipo" },
  { name: "Blog", href: "/blog" },
  { name: "Portal Empleo", href: "/vacantes" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Escape cierra el menú móvil.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-2 border-b border-brand-gray/10"
          : "bg-white shadow-sm border-b border-brand-gray/10 py-3"
      }`}
    >
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-brand-navy focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Saltar al contenido
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[72px] md:min-h-[88px]">
          <Link href="/" className="flex items-center group py-1" onClick={closeMenu} aria-label="Estribor Consultores, ir al inicio">
            <div
              className={`relative transition-all duration-300 overflow-hidden hover:scale-105 ${
                scrolled ? "w-16 h-16 md:w-20 md:h-20" : "w-20 h-20 md:w-24 md:h-24"
              }`}
            >
              <Image
                src="/logo.webp"
                alt=""
                fill
                sizes="(max-width: 768px) 80px, 96px"
                loading="eager"
                className="object-contain"
              />
            </div>
          </Link>

          <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-base font-semibold transition-colors duration-200 relative group py-2 ${
                    active ? "text-brand-electric" : "text-brand-navy hover:text-brand-electric"
                  }`}
                >
                  {item.name}
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-0 left-0 h-0.5 bg-brand-electric transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              );
            })}
            <Link
              href="/contacto"
              aria-current={pathname === "/contacto" ? "page" : undefined}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 ${
                pathname === "/contacto" ? "bg-brand-blue-med text-white" : "bg-brand-electric hover:bg-brand-blue-med text-white"
              }`}
            >
              Contáctanos
            </Link>
          </nav>

          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="text-brand-navy hover:text-brand-electric p-2 transition-colors duration-200"
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X aria-hidden="true" className="h-7 w-7" /> : <Menu aria-hidden="true" className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Navegación móvil"
          className="animate-drawer-in md:hidden bg-white border-t border-brand-gray/10 shadow-lg overflow-hidden"
        >
          <div className="px-4 pt-2 pb-6 space-y-1">
            {NAV_ITEMS.map((item, index) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMenu}
                  aria-current={active ? "page" : undefined}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  className={`animate-slide-in-left block px-3 py-3 rounded-md text-base font-medium transition-all ${
                    active
                      ? "bg-brand-electric/10 text-brand-electric font-semibold border-l-4 border-brand-electric pl-2.5"
                      : "text-brand-navy hover:bg-brand-bg hover:text-brand-electric"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="animate-rise-in pt-4 px-3" style={{ animationDelay: `${NAV_ITEMS.length * 0.05}s` }}>
              <Link
                href="/contacto"
                onClick={closeMenu}
                className="block w-full text-center bg-brand-electric hover:bg-brand-blue-med text-white px-5 py-3 rounded-md text-base font-semibold transition-colors shadow-sm"
              >
                Contáctanos
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
