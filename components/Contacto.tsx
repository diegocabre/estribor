"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Send, CheckCircle2, Loader2 } from "lucide-react";

export default function Contacto() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          role: "",
          message: "",
        });
        if (data.warning) {
          console.warn("Advertencia de Resend:", data.warning);
        }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contacto" className="py-20 bg-brand-bg relative overflow-hidden">
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#7D7E80/5_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Contact Information (5 columns) */}
          <div className="lg:col-span-5 flex flex-col h-full justify-between">
            <div>
              <span className="text-brand-electric text-xs font-bold tracking-widest uppercase block mb-3">
                Hablemos
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy tracking-tight mb-6">
                ¿Listo para Coordinar tu Próximo Rumbo?
              </h2>
              <p className="text-base text-brand-gray font-light leading-relaxed mb-8">
                Ponte en contacto con nosotros para analizar las necesidades específicas de tu empresa y diseñar una solución a la medida de tu organización.
              </p>

              {/* Info Items */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-electric/10 flex items-center justify-center text-brand-electric shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-brand-navy">Teléfono</h3>
                    <a
                      href="tel:+56987654321"
                      className="text-sm text-brand-gray hover:text-brand-electric transition-colors"
                    >
                      +56 9 8765 4321
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-electric/10 flex items-center justify-center text-brand-electric shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-brand-navy">Correo Electrónico</h3>
                    <a
                      href="mailto:contacto@estribor.cl"
                      className="text-sm text-brand-gray hover:text-brand-electric transition-colors"
                    >
                      contacto@estribor.cl
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-electric/10 flex items-center justify-center text-brand-electric shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-brand-navy">Ubicación</h3>
                    <p className="text-sm text-brand-gray">
                      Santiago, Chile. Cobertura a nivel nacional.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Styled Compass Graphic Card */}
            <div className="mt-12 bg-white/60 border border-brand-gray/10 p-6 rounded-2xl relative overflow-hidden backdrop-blur-sm hidden lg:block select-none">
              <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-12 opacity-10 pointer-events-none">
                <CompassGraphic className="w-48 h-48 text-brand-navy" />
              </div>
              <h4 className="text-brand-navy font-bold text-sm mb-2">Presencia en todo el territorio</h4>
              <p className="text-xs text-brand-gray font-light leading-relaxed">
                Nuestras asesorías técnicas y de cumplimiento normativo se adaptan a las particularidades geográficas e industriales de cada región en el país.
              </p>
            </div>
          </div>

          {/* Contact Form Card (7 columns) */}
          <div className="lg:col-span-7 bg-white border border-brand-gray/10 p-6 sm:p-10 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center py-12"
                >
                  <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-6 animate-bounce" />
                  <h3 className="text-2xl font-bold text-brand-navy mb-2">¡Mensaje Enviado con Éxito!</h3>
                  <p className="text-sm text-brand-gray max-w-sm font-light mb-6">
                    Agradecemos tu interés en Estribor Consultores. Uno de nuestros asesores especializados se contactará contigo a la brevedad.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="bg-brand-navy hover:bg-brand-blue-med text-white px-6 py-2.5 rounded-md font-semibold text-sm transition-colors shadow-sm"
                  >
                    Enviar otro mensaje
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 animate-fadeIn"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <label
                        htmlFor="name"
                        className="text-xs font-bold text-brand-navy mb-2 uppercase tracking-wide"
                      >
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="border border-brand-gray/20 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand-electric transition-colors bg-brand-bg/30 text-brand-navy font-sans"
                        placeholder="Ej. Juan Pérez"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label
                        htmlFor="email"
                        className="text-xs font-bold text-brand-navy mb-2 uppercase tracking-wide"
                      >
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="border border-brand-gray/20 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand-electric transition-colors bg-brand-bg/30 text-brand-navy font-sans"
                        placeholder="ejemplo@empresa.cl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="flex flex-col">
                      <label
                        htmlFor="phone"
                        className="text-xs font-bold text-brand-navy mb-2 uppercase tracking-wide"
                      >
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="border border-brand-gray/20 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand-electric transition-colors bg-brand-bg/30 text-brand-navy font-sans"
                        placeholder="Ej. +56 9 1234 5678"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label
                        htmlFor="company"
                        className="text-xs font-bold text-brand-navy mb-2 uppercase tracking-wide"
                      >
                        Empresa
                      </label>
                      <input
                        type="text"
                        name="company"
                        id="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="border border-brand-gray/20 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand-electric transition-colors bg-brand-bg/30 text-brand-navy font-sans"
                        placeholder="Ej. Estribor SpA"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label
                        htmlFor="role"
                        className="text-xs font-bold text-brand-navy mb-2 uppercase tracking-wide"
                      >
                        Cargo
                      </label>
                      <input
                        type="text"
                        name="role"
                        id="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="border border-brand-gray/20 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand-electric transition-colors bg-brand-bg/30 text-brand-navy font-sans"
                        placeholder="Ej. Subgerente RRHH"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="message"
                      className="text-xs font-bold text-brand-navy mb-2 uppercase tracking-wide"
                    >
                      Mensaje *
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="border border-brand-gray/20 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-brand-electric transition-colors bg-brand-bg/30 text-brand-navy font-sans resize-none"
                      placeholder="Escribe tu mensaje aquí..."
                    ></textarea>
                  </div>

                  {status === "error" && errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-rose-50 border border-rose-200 rounded-md text-rose-800 text-xs font-semibold"
                    >
                      {errorMessage}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-brand-electric hover:bg-brand-blue-med disabled:bg-brand-electric/50 text-white font-bold py-4 rounded-md transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform hover:-translate-y-0.5 duration-200"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Enviar Mensaje
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

// Small helper for compass silhouette in info card
function CompassGraphic({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className={className}
    >
      <circle cx="50" cy="50" r="45" strokeDasharray="2 2" />
      <circle cx="50" cy="50" r="38" />
      <path d="M50 5 L50 95 M5 50 L95 50" />
      <polygon points="50,50 53,20 50,10 47,20" fill="currentColor" />
      <polygon points="50,50 53,80 50,90 47,80" fill="currentColor" opacity="0.5" />
      <polygon points="50,50 80,53 90,50 80,47" fill="currentColor" />
      <polygon points="50,50 20,53 10,50 20,47" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
