"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import Honeypot from "@/components/Honeypot";
import LegalFormConsent from "@/components/LegalFormConsent";
import { trackConversion } from "@/lib/analytics";

const SPONTANEOUS_AREAS = [
  { value: "Gestión de Personas", label: "Gestión de Personas / DO / Reclutamiento" },
  { value: "Seguridad y Salud en el Trabajo", label: "Seguridad y Salud en el Trabajo (SST)" },
  { value: "Sostenibilidad Organizacional", label: "Sostenibilidad Organizacional / ESG" },
  { value: "Operaciones / Producción", label: "Operaciones / Producción" },
  { value: "Administración / Finanzas", label: "Administración / Finanzas" },
];

const inputClass =
  "border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold transition-colors";
const labelClass = "text-[10px] font-bold text-brand-navy uppercase mb-1";

type Status = "idle" | "submitting" | "success" | "error";

export default function SpontaneousApplicationForm() {
  const [name, setName] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [salary, setSalary] = useState("");
  const [area, setArea] = useState(SPONTANEOUS_AREAS[0].value);
  const [cv, setCv] = useState<File | null>(null);
  const [privacy, setPrivacy] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      if (!cv) throw new Error("Por favor, adjunta tu CV en formato PDF.");

      // El servidor valida el RUT, revisa duplicados, sube el CV al bucket privado y registra la postulación.
      const form = new FormData();
      form.append("jobId", "spontaneous");
      form.append("area", area);
      form.append("fullName", name);
      form.append("rut", rut);
      form.append("email", email);
      form.append("phone", phone);
      form.append("city", city);
      form.append("salaryExpectation", salary);
      form.append("availability", "Inmediata");
      form.append("privacyAccepted", String(privacy));
      form.append("website", honeypot);
      form.append("cv", cv);

      const response = await fetch("/api/postulaciones", { method: "POST", body: form });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        throw new Error(result.error || "No se pudo enviar la postulación.");
      }

      trackConversion("postulacion_enviada", { tipo: "espontanea" });
      setStatus("success");
      setName("");
      setRut("");
      setEmail("");
      setPhone("");
      setCity("");
      setSalary("");
      setCv(null);
      setPrivacy(false);
    } catch (err) {
      setStatus("error");
      setErrorMsg((err as Error).message || "Ocurrió un error inesperado al enviar la postulación.");
    }
  };

  return (
    <div
      id="espontanea"
      className="lg:col-span-4 bg-white border border-brand-gray/10 p-6 sm:p-8 rounded-2xl shadow-sm scroll-mt-28"
    >
      <h2 className="text-lg font-bold text-brand-navy mb-3">Postulación Espontánea</h2>
      <p className="text-xs text-brand-gray-dark font-light leading-relaxed mb-6">
        ¿No encontraste un cargo afín a tu perfil? Déjanos tu currículum para sumarte a nuestra base de datos. Nos
        pondremos en contacto contigo cuando surjan búsquedas alineadas a tu experiencia.
      </p>

      <>
        {status === "success" ? (
          <div
            key="success"
            className="animate-scale-in text-center py-8"
            role="status"
          >
            <CheckCircle2 aria-hidden="true" className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="font-bold text-brand-navy mb-2">¡Ingreso Exitoso!</h3>
            <p className="text-xs text-brand-gray-dark font-light max-w-xs mx-auto mb-6 leading-relaxed">
              Hemos incorporado tu CV a nuestra base de datos de selección estratégica.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="bg-brand-navy text-white text-xs font-bold py-2 px-4 rounded-lg hover:bg-brand-blue-med transition-colors"
            >
              Postular de nuevo
            </button>
          </div>
        ) : (
          <form key="form" onSubmit={handleSubmit} className="animate-fade-in space-y-4 relative" noValidate={false}>
            <Honeypot value={honeypot} onChange={setHoneypot} />

            <div className="flex flex-col">
              <label htmlFor="spont-name" className={labelClass}>
                Nombre Completo *
              </label>
              <input
                id="spont-name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="spont-rut" className={labelClass}>
                RUT *
              </label>
              <input
                id="spont-rut"
                type="text"
                required
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                placeholder="12.345.678-9"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="spont-email" className={labelClass}>
                  Correo Electrónico *
                </label>
                <input
                  id="spont-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="juan.perez@correo.com"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="spont-phone" className={labelClass}>
                  Teléfono *
                </label>
                <input
                  id="spont-phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej. +56 9 1234 5678"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="spont-city" className={labelClass}>
                  Ciudad *
                </label>
                <input
                  id="spont-city"
                  type="text"
                  required
                  autoComplete="address-level2"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ej. Puerto Varas"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="spont-salary" className={labelClass}>
                  Pretensión Renta (CLP) *
                </label>
                <input
                  id="spont-salary"
                  type="text"
                  required
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="Ej. 1.500.000"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="spont-area" className={labelClass}>
                Área de Interés *
              </label>
              <select
                id="spont-area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                {SPONTANEOUS_AREAS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="spont-cv" className={labelClass}>
                Adjuntar CV (PDF) *
              </label>
              <div className="relative border border-dashed border-brand-gray/30 rounded-lg p-4 bg-brand-bg/20 flex flex-col items-center justify-center cursor-pointer hover:bg-brand-bg/40 transition-colors focus-within:border-brand-gold">
                <input
                  id="spont-cv"
                  type="file"
                  accept=".pdf,application/pdf"
                  required
                  onChange={(e) => setCv(e.target.files?.[0] ?? null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <span aria-hidden="true" className="text-[10px] text-brand-gray-dark font-medium select-none">
                  {cv?.name || "Haga clic para subir archivo"}
                </span>
              </div>
            </div>

            <LegalFormConsent privacyAccepted={privacy} onPrivacyChange={setPrivacy} />

            {status === "error" && errorMsg && (
              <p
                role="alert"
                className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-100 p-2 rounded-lg text-center"
              >
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full bg-brand-navy hover:bg-brand-blue-med disabled:bg-brand-navy/60 text-white font-bold py-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Send aria-hidden="true" className="h-4 w-4" />
                  Enviar Currículum
                </>
              )}
            </button>
          </form>
        )}
      </>
    </div>
  );
}
