"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

/** Botones para compartir una vacante por WhatsApp, LinkedIn o copiando el enlace. */
export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator
        .share({ title, text: `Postula a la vacante: ${title} en Estribor Consultores`, url: shareUrl })
        .catch(() => undefined);
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOnWhatsApp = () => {
    const shareUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      `Hola! Te comparto esta vacante de Estribor Consultores: ${title}. Puedes postular aquí: `
    );
    window.open(`https://api.whatsapp.com/send?text=${text}${shareUrl}`, "_blank", "noopener,noreferrer");
  };

  const shareOnLinkedIn = () => {
    const shareUrl = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={shareOnWhatsApp}
        aria-label="Compartir vacante por WhatsApp"
        className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-all hover:bg-emerald-100 flex items-center gap-1.5"
      >
        WhatsApp
      </button>
      <button
        type="button"
        onClick={shareOnLinkedIn}
        aria-label="Compartir vacante en LinkedIn"
        className="px-3 py-1.5 bg-sky-50 text-sky-700 border border-sky-200 rounded-lg text-xs font-bold transition-all hover:bg-sky-100 flex items-center gap-1.5"
      >
        LinkedIn
      </button>
      <button
        type="button"
        onClick={handleShare}
        className="px-3 py-1.5 bg-brand-navy text-white rounded-lg text-xs font-bold transition-all hover:bg-brand-blue-med flex items-center gap-1.5"
      >
        <Share2 aria-hidden="true" className="h-3.5 w-3.5" />
        <span aria-live="polite">{copied ? "Copiado!" : "Copiar Enlace"}</span>
      </button>
    </div>
  );
}
