"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import Honeypot from "@/components/Honeypot";
import { trackConversion } from "@/lib/analytics";

const inputClass =
  "border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold transition-colors";
const labelClass = "text-[10px] font-bold text-brand-navy uppercase mb-1";

type Status = "idle" | "submitting" | "success" | "error";

export default function JobApplicationForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const [fullName, setFullName] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [salary, setSalary] = useState("");
  const [availability, setAvailability] = useState("Inmediata");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [linkedin, setLinkedin] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      if (!privacyConsent) {
        throw new Error(
          "Debes autorizar el tratamiento de tus datos personales conforme a la Política de Privacidad."
        );
      }
      if (!cvFile) throw new Error("Por favor, adjunta tu CV en formato PDF.");

      // El servidor valida, sube el CV al bucket privado y registra la postulación.
      const form = new FormData();
      form.append("jobId", jobId);
      form.append("fullName", fullName);
      form.append("rut", rut);
      form.append("email", email);
      form.append("phone", phone);
      form.append("city", city);
      form.append("salaryExpectation", salary);
      form.append("availability", availability);
      form.append("linkedinProfile", linkedin);
      form.append("privacyAccepted", String(privacyConsent));
      form.append("website", honeypot);
      form.append("cv", cvFile);

      const response = await fetch("/api/postulaciones", { method: "POST", body: form });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        throw new Error(result.error || "No se pudo enviar la postulación.");
      }

      trackConversion("postulacion_enviada", { tipo: "vacante" });
      setStatus("success");
      setFullName("");
      setRut("");
      setEmail("");
      setPhone("");
      setCity("");
      setSalary("");
      setCvFile(null);
      setLinkedin("");
      setPrivacyConsent(false);
    } catch (err) {
      setStatus("error");
      setErrorMsg((err as Error).message || "Ocurrió un error inesperado al enviar la postulación.");
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold text-brand-navy mb-4 font-titles">Postular a la vacante</h2>

      <>
        {status === "success" ? (
          <div
            key="success"
            className="animate-scale-in text-center py-10"
            role="status"
          >
            <CheckCircle2 aria-hidden="true" className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-brand-navy mb-2">¡Postulación Enviada!</h3>
            <p className="text-xs text-brand-gray-dark font-light max-w-sm mx-auto mb-6 leading-relaxed">
              Agradecemos tu interés. Tus antecedentes han sido guardados con éxito para la vacante{" "}
              <strong className="font-semibold text-brand-navy">{jobTitle}</strong>. Los consultores a cargo revisarán
              tu CV a la brevedad.
            </p>
            <Link
              href="/vacantes"
              className="inline-flex bg-brand-navy hover:bg-brand-blue-med text-white text-xs font-bold py-3 px-6 rounded-xl transition-colors"
            >
              Ver Otras Vacantes
            </Link>
          </div>
        ) : (
          <form key="form" onSubmit={handleSubmit} className="animate-fade-in space-y-4 relative">
            <Honeypot value={honeypot} onChange={setHoneypot} />

            <div className="flex flex-col">
              <label htmlFor="app-name" className={labelClass}>
                Nombre Completo *
              </label>
              <input
                id="app-name"
                type="text"
                required
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. Camila Alvear"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="app-rut" className={labelClass}>
                  RUT *
                </label>
                <input
                  id="app-rut"
                  type="text"
                  required
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                  placeholder="12.345.678-9"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="app-phone" className={labelClass}>
                  Teléfono *
                </label>
                <input
                  id="app-phone"
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
                <label htmlFor="app-email" className={labelClass}>
                  Correo Electrónico *
                </label>
                <input
                  id="app-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="app-city" className={labelClass}>
                  Ciudad *
                </label>
                <input
                  id="app-city"
                  type="text"
                  required
                  autoComplete="address-level2"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ej. Puerto Montt"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="app-job" className={labelClass}>
                Cargo al que Postula
              </label>
              <input
                id="app-job"
                type="text"
                readOnly
                value={jobTitle}
                className="border border-brand-gray/15 rounded-lg px-3 py-2 text-xs bg-brand-bg/60 text-brand-navy/60 font-semibold focus:outline-none cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="app-salary" className={labelClass}>
                  Pretensión de Renta (CLP) *
                </label>
                <input
                  id="app-salary"
                  type="text"
                  required
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="Ej. 1.800.000"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="app-availability" className={labelClass}>
                  Disponibilidad *
                </label>
                <select
                  id="app-availability"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="Inmediata">Inmediata</option>
                  <option value="15 días">Aviso 15 días</option>
                  <option value="30 días">Aviso 30 días</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="app-linkedin" className={labelClass}>
                Perfil de LinkedIn (Opcional)
              </label>
              <input
                id="app-linkedin"
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/nombre"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="app-cv" className={labelClass}>
                Adjuntar CV (PDF) *
              </label>
              <div className="relative border border-dashed border-brand-gray/30 rounded-lg p-3 bg-brand-bg/25 flex flex-col items-center justify-center cursor-pointer hover:bg-brand-bg/50 transition-colors focus-within:border-brand-gold">
                <input
                  id="app-cv"
                  type="file"
                  accept=".pdf,application/pdf"
                  required
                  onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <span aria-hidden="true" className="text-[10px] text-brand-gray-dark font-medium select-none">
                  {cvFile?.name || "Subir archivo PDF"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1 text-left">
              <input
                type="checkbox"
                id="privacy-consent-job"
                required
                checked={privacyConsent}
                onChange={(e) => setPrivacyConsent(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 rounded border-brand-gray/30 text-brand-navy accent-brand-navy cursor-pointer"
              />
              <label htmlFor="privacy-consent-job" className="text-[10px] text-brand-gray-dark cursor-pointer leading-tight">
                Autorizo el tratamiento de mis antecedentes y CV para fines exclusivos de este proceso de selección
                conforme a la{" "}
                <Link
                  href="/privacidad"
                  target="_blank"
                  className="text-brand-electric underline font-semibold hover:text-brand-navy"
                >
                  Política de Privacidad
                </Link>
                . <span className="text-rose-500 font-bold">*</span>
              </label>
            </div>

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
              className="w-full bg-brand-navy hover:bg-brand-blue-med disabled:bg-brand-navy/60 text-white font-bold py-3.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm mt-2"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                  Enviando Postulación...
                </>
              ) : (
                <>
                  <Send aria-hidden="true" className="h-4 w-4" />
                  Enviar Postulación
                </>
              )}
            </button>
          </form>
        )}
      </>
    </>
  );
}
