"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

export default function ShareArticleButton({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, text, url: window.location.href }).catch(() => undefined);
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 text-xs text-brand-navy hover:text-brand-gold transition-colors font-bold"
    >
      <Share2 aria-hidden="true" className="h-4 w-4" />
      <span aria-live="polite">{copied ? "Enlace copiado" : "Compartir Artículo"}</span>
    </button>
  );
}
