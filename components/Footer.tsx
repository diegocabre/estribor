import Image from "next/image";
import Link from "next/link";
import { Linkedin, Mail, MessageCircle } from "lucide-react";
import { CookieSettingsButton, ScrollToTopButton } from "@/components/footer/FooterButtons";
import { legalConfig } from "@/lib/legalConfig";

const LINKS = [
  { name: "Servicios", href: "/servicios" },
  { name: "Nosotros", href: "/equipo" },
  { name: "Misión y visión", href: "/mision-vision" },
  { name: "Sectores", href: "/#sectores" },
  { name: "Blog", href: "/blog" },
  { name: "Portal de empleo", href: "/vacantes" },
];

const socialClass =
  "w-10 h-10 rounded-full border border-white/20 hover:bg-brand-gold hover:border-brand-gold hover:text-brand-navy text-white flex items-center justify-center transition-colors";

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white/75 pt-14 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex mb-5" aria-label="Estribor Consultores, ir al inicio">
              <span className="relative block h-24 w-24 rounded-full bg-white overflow-hidden transition-transform duration-300 hover:scale-105">
                <Image src="/logo.webp" alt="" fill sizes="96px" className="object-contain p-2" />
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm mb-6">
              Consultora en gestión de personas, seguridad y salud en el trabajo, sostenibilidad y comunicaciones corporativas.
              Desde Puerto Varas, para empresas de todo Chile.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/company/estribor-consultores"
                target="_blank"
                rel="noopener noreferrer"
                className={socialClass}
                aria-label="LinkedIn de Estribor Consultores (se abre en una pestaña nueva)"
              >
                <Linkedin aria-hidden="true" className="h-4 w-4" />
              </a>
              <a
                href={legalConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={socialClass}
                aria-label="WhatsApp de Estribor Consultores (se abre en una pestaña nueva)"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
              </a>
              <a href={`mailto:${legalConfig.contactEmail}`} className={socialClass} aria-label={`Escribir a ${legalConfig.contactEmail}`}>
                <Mail aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-sm font-bold text-white mb-4">Estribor</h3>
            <ul className="space-y-2 text-sm">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-brand-gold transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-sm font-bold text-white mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm mb-6">
              <li>
                <a href={`mailto:${legalConfig.contactEmail}`} className="hover:text-brand-gold transition-colors">
                  {legalConfig.contactEmail}
                </a>
              </li>
              <li>
                <a href={`tel:${legalConfig.phone.replace(/\s/g, "")}`} className="hover:text-brand-gold transition-colors">
                  {legalConfig.phone}
                </a>
              </li>
              <li>Puerto Varas, Región de Los Lagos</li>
            </ul>
            <Link
              href="/contacto"
              className="inline-flex bg-brand-gold hover:bg-brand-gold/90 text-brand-navy text-sm font-bold px-5 py-2.5 rounded-md transition-colors"
            >
              Agendar reunión
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-white/70 text-center lg:text-left">
          <div className="flex flex-col gap-1">
            <p>
              &copy; {new Date().getFullYear()} {legalConfig.companyName}. Todos los derechos reservados.
            </p>
            <p>
              Desarrollado por{" "}
              <a href="https://diegocabre.vercel.app" target="_blank" rel="nofollow noopener" className="hover:text-brand-gold transition-colors">
                Diego Cabré<span className="sr-only"> (abre en otra pestaña)</span>
              </a>{" "}
              <span aria-hidden="true">&middot;</span>{" "}
              <a href="https://www.solucionesdys.cl" target="_blank" rel="nofollow noopener" className="hover:text-brand-gold transition-colors">
                Soluciones DyS<span className="sr-only"> (abre en otra pestaña)</span>
              </a>
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-x-4 gap-y-2">
            <Link href="/privacidad" className="hover:text-brand-gold transition-colors">
              Privacidad
            </Link>
            <Link href="/terminos" className="hover:text-brand-gold transition-colors">
              Términos
            </Link>
            <Link href="/privacidad#cookies" className="hover:text-brand-gold transition-colors">
              Cookies
            </Link>
            <CookieSettingsButton />
            <ScrollToTopButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
