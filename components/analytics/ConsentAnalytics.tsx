"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CONSENT_EVENT, hasAnalyticsConsent } from "@/lib/analytics";

const subscribe = (onChange: () => void) => {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
};

// Solo letras y números: el id se interpola dentro de un script inline.
const clarityId = (process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "").replace(/[^a-z0-9]/gi, "");

/**
 * Carga Microsoft Clarity, Vercel Analytics y Speed Insights solo después de que el usuario
 * acepta las cookies analíticas. Antes de eso no se descarga ni se ejecuta ningún script de medición.
 */
export default function ConsentAnalytics() {
  const allowed = useSyncExternalStore(subscribe, hasAnalyticsConsent, () => false);
  if (!allowed) return null;

  return (
    <>
      {clarityId && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");window.clarity("consent");`}
        </Script>
      )}
      <Analytics />
      <SpeedInsights />
    </>
  );
}
