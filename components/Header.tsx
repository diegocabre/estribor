"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SERVICE_AREAS } from "@/lib/content/services";
import { legalConfig } from "@/lib/legalConfig";

const SERVICE_LINKS = SERVICE_AREAS.map((area) => ({ name: area.title, href: `/servicios#${area.id}` }));

const NAV_ITEMS = [
  { name: "Servicios", href: "/servicios", children: SERVICE_LINKS },
  { name: "Sectores", href: "/#sectores" },
  { name: "Nosotros", href: "/equipo" },
  { name: "Recursos", href: "/blog" },
  { name: "Portal de empleo", href: "/vacantes" },
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
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-brand-gray/10 transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-brand-navy focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Saltar al contenido
      </a>

      {/* Barra superior: el alto total del header (32 + 80 px en desktop) es el que compensan las páginas con pt-28. */}
      <div className="hidden md:block bg-brand-navy text-white/80 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between gap-6">
          <p>Puerto Varas · Región de Los Lagos · Asesoramos empresas en todo Chile</p>
          <div className="flex items-center gap-5">
            <a href={`mailto:${legalConfig.contactEmail}`} className="hover:text-brand-gold transition-colors">
              {legalConfig.contactEmail}
            </a>
            <a href={legalConfig.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors">
              WhatsApp {legalConfig.phone}
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 md:h-20">
          <Link href="/" className="flex items-center group py-1" onClick={closeMenu} aria-label="Estribor Consultores, ir al inicio">
            <div className="relative w-16 h-16 transition-transform duration-300 hover:scale-105">
              <Image src="/logo.webp" alt="" fill sizes="64px" loading="eager" className="object-contain" />
            </div>
          </Link>

          <nav aria-label="Navegación principal" className="hidden md:flex items-center gap-5 lg:gap-8">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              const link = (
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold transition-colors duration-200 py-2 ${
                    active ? "text-brand-electric" : "text-brand-navy hover:text-brand-electric"
                  }`}
                >
                  {item.name}
                  {item.children && <ChevronDown aria-hidden="true" className="h-4 w-4" />}
                </Link>
              );
              if (!item.children) return <div key={item.name}>{link}</div>;

              // Desplegable: se abre con hover o al recorrerlo con el teclado (focus-within).
              return (
                <div key={item.name} className="relative group">
                  {link}
                  <div className="invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-[opacity,transform,visibility] duration-150 ease-out absolute left-0 top-full pt-2">
                    <ul className="w-72 bg-white border border-brand-gray/20 rounded-xl shadow-lg p-2">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-brand-navy hover:bg-brand-bg hover:text-brand-electric transition-colors"
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
            <Link
              href="/contacto"
              aria-current={pathname === "/contacto" ? "page" : undefined}
              className="whitespace-nowrap px-5 py-2.5 rounded-lg text-sm font-bold bg-brand-gold hover:bg-brand-gold/90 text-brand-navy transition-colors shadow-sm"
            >
              Agendar reunión
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
          className="animate-drawer-in md:hidden bg-white border-t border-brand-gray/10 shadow-lg overflow-y-auto max-h-[calc(100dvh-6rem)]"
        >
          <div className="px-4 pt-2 pb-6 space-y-1">
            {NAV_ITEMS.map((item, index) => {
              const active = isActive(item.href);
              return (
                <div key={item.name} style={{ animationDelay: `${index * 0.05}s` }} className="animate-slide-in-left">
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className={`block px-3 py-3 rounded-md text-base font-medium transition-all ${
                      active
                        ? "bg-brand-electric/10 text-brand-electric font-semibold"
                        : "text-brand-navy hover:bg-brand-bg hover:text-brand-electric"
                    }`}
                  >
                    {item.name}
                  </Link>
                  {item.children && (
                    <ul className="ml-3 border-l border-brand-gray/30 pl-3">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={closeMenu}
                            className="block px-3 py-2 rounded-md text-sm text-brand-gray-dark hover:bg-brand-bg hover:text-brand-electric"
                          >
                            {child.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
            <div className="animate-rise-in pt-4 px-3" style={{ animationDelay: `${NAV_ITEMS.length * 0.05}s` }}>
              <Link
                href="/contacto"
                onClick={closeMenu}
                className="block w-full text-center bg-brand-gold hover:bg-brand-gold/90 text-brand-navy px-5 py-3 rounded-md text-base font-bold transition-colors shadow-sm"
              >
                Agendar reunión
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
