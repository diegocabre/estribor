"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import Honeypot from "@/components/Honeypot";
import LegalFormConsent from "@/components/LegalFormConsent";
import { trackConversion } from "@/lib/analytics";

const EMPTY_FORM = { name: "", email: "", phone: "", company: "", role: "", message: "" };

type FormStatus = "idle" | "loading" | "success" | "error";

const inputClass =
  "border border-brand-gray/30 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-electric bg-brand-bg/20 text-brand-navy font-sans";
const labelClass = "text-xs font-bold text-brand-navy mb-1.5 uppercase tracking-wide";

/** Formulario "Enviar Mensaje Directo" (Modalidad 1). */
export default function ContactForm() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!privacyAccepted) {
      setStatus("error");
      setErrorMessage("Por favor, acepta la Política de Privacidad para poder enviar tu mensaje.");
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, privacyAccepted, marketingAccepted, website: honeypot }),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        trackConversion("formulario_contacto_enviado");
        setStatus("success");
        setFormData(EMPTY_FORM);
        setPrivacyAccepted(false);
        setMarketingAccepted(false);
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Ocurrió un error al enviar el mensaje. Por favor, inténtalo de nuevo.");
      }
    } catch (err) {
      console.error("Error al enviar el formulario:", err);
      setStatus("error");
      setErrorMessage("No se pudo conectar con el servidor. Por favor, comprueba tu conexión de red.");
    }
  };

  return (
    <>
      {status === "success" ? (
        <div
          key="contact-success"
          className="animate-scale-in flex flex-col items-center text-center py-12"
          role="status"
        >
          <CheckCircle2 aria-hidden="true" className="h-14 w-14 text-emerald-500 mb-4 motion-safe:animate-bounce" />
          <h4 className="text-xl font-bold text-brand-navy mb-2">¡Mensaje Enviado con Éxito!</h4>
          <p className="text-sm text-brand-gray-dark max-w-sm font-light mb-6">
            Agradecemos tu interés. Uno de nuestros consultores especializados responderá a tu solicitud a la brevedad.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="bg-brand-navy hover:bg-brand-blue-med text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm"
          >
            Enviar otro mensaje
          </button>
        </div>
      ) : (
        <form key="contact-form" onSubmit={handleSubmit} className="animate-fade-in space-y-4 relative">
          <Honeypot value={honeypot} onChange={setHoneypot} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="form-name" className={labelClass}>
                Nombre *
              </label>
              <input
                type="text"
                name="name"
                id="form-name"
                required
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="Ej. Juan Pérez"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="form-email" className={labelClass}>
                Correo *
              </label>
              <input
                type="email"
                name="email"
                id="form-email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="ejemplo@empresa.cl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="form-phone" className={labelClass}>
                Teléfono
              </label>
              <input
                type="tel"
                name="phone"
                id="form-phone"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass}
                placeholder="+56 9 1234 5678"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="form-company" className={labelClass}>
                Empresa
              </label>
              <input
                type="text"
                name="company"
                id="form-company"
                autoComplete="organization"
                value={formData.company}
                onChange={handleChange}
                className={inputClass}
                placeholder="Nombre de tu empresa"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="form-message" className={labelClass}>
              Mensaje o Consulta *
            </label>
            <textarea
              name="message"
              id="form-message"
              rows={4}
              required
              minLength={10}
              maxLength={5000}
              value={formData.message}
              onChange={handleChange}
              className={`${inputClass} resize-none`}
              placeholder="Cuéntanos brevemente tus requerimientos..."
            ></textarea>
          </div>

          <LegalFormConsent
            privacyAccepted={privacyAccepted}
            onPrivacyChange={setPrivacyAccepted}
            marketingAccepted={marketingAccepted}
            onMarketingChange={setMarketingAccepted}
            showMarketingOption={false}
          />

          {status === "error" && errorMessage && (
            <div role="alert" className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-brand-navy hover:bg-brand-blue-med disabled:bg-brand-navy/50 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            {status === "loading" ? (
              <>
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                Enviando Mensaje...
              </>
            ) : (
              <>
                <Send aria-hidden="true" className="h-4 w-4" />
                Enviar Mensaje
              </>
            )}
          </button>
        </form>
      )}
    </>
  );
}
