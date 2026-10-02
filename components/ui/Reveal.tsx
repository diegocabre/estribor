"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type RevealTag = "div" | "article" | "li" | "section";

interface RevealProps {
  as?: RevealTag;
  /** Transformación inicial, p. ej. "translateX(-50px)" o "scale(0.98)". */
  from?: string;
  /** Retraso en segundos (para escalonar tarjetas). */
  delay?: number;
  /** Margen del viewport antes de animar, como en IntersectionObserver. */
  rootMargin?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Aparición al entrar en pantalla con IntersectionObserver + CSS (clase .reveal en globals.css).
 * Reemplaza a framer-motion en las secciones estáticas: pesa unos cientos de bytes y permite
 * que la sección que lo usa siga siendo un Server Component.
 */
export default function Reveal({
  as: Tag = "div",
  from = "translateY(30px)",
  delay = 0,
  rootMargin = "0px 0px -50px 0px",
  className = "",
  children,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () => {
      el.dataset.visible = "true";
    };

    if (!("IntersectionObserver" in window)) {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  const style = { "--reveal-from": from, "--reveal-delay": `${delay}s` } as CSSProperties;

  return (
    <Tag ref={ref as never} className={`reveal ${className}`} style={style}>
      {children}
    </Tag>
  );
}
