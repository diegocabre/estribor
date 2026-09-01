"use client";

import { use, useState, useEffect } from "react";
import { Job } from "@/components/jobsData";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, MapPin, Briefcase, Share2, Calendar, FileText, Send, CheckCircle2, Loader2, Lock, ListTodo, Award, CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function VacanteDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [fullName, setFullName] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [salary, setSalary] = useState("");
  const [availability, setAvailability] = useState("Inmediata");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvName, setCvName] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchJob = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", resolvedParams.id)
      .single();

    if (!error && data) {
      setJob({
        id: data.id,
        title: data.title,
        area: data.area,
        location: data.location,
        type: data.type,
        description: data.description,
        requirements: data.requirements,
        functions: data.functions,
        confidential: data.confidential,
        active: data.active,
        createdAt: data.created_at
      });
    } else {
      console.error("Error al obtener vacante de Supabase:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJob();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 text-center min-h-screen">
        <Loader2 className="h-10 w-10 text-brand-gold animate-spin mx-auto mb-4" />
        <p className="text-xs text-brand-gray-dark">Cargando detalles de la vacante...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="pt-32 pb-24 text-center min-h-screen">
        <h1 className="text-2xl font-bold text-brand-navy mb-4">Oferta de Empleo no encontrada</h1>
        <p className="text-sm text-brand-gray-dark mb-8">El enlace de la vacante no existe o la vacante ha sido cerrada.</p>
        <Link
          href="/vacantes"
          className="inline-flex items-center gap-2 bg-brand-navy text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          Volver a Vacantes
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Postula a la vacante: ${job.title} en Estribor Consultores`,
        url: shareUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOnWhatsApp = () => {
    const shareUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Hola! Te comparto esta vacante de Estribor Consultores: ${job.title}. Puedes postular aquí: `);
    window.open(`https://api.whatsapp.com/send?text=${text}${shareUrl}`, "_blank");
  };

  const shareOnLinkedIn = () => {
    const shareUrl = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, "_blank");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
      setCvName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      if (!privacyConsent) {
        throw new Error("Debes autorizar el tratamiento de tus datos personales conforme a la Política de Privacidad.");
      }

      let cvUrl = "";

      if (!cvFile) {
        throw new Error("Por favor, adjunta tu CV en formato PDF.");
      }

      // 1. Upload CV to Supabase Storage Bucket
      const fileExt = cvFile.name.split(".").pop();
      const fileName = `job-${job.id}-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("cvs")
        .upload(fileName, cvFile, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Error al subir el CV: ${uploadError.message}`);
      }

      // 2. Get Public URL
      const { data: urlData } = supabase.storage
        .from("cvs")
        .getPublicUrl(fileName);
      
      cvUrl = urlData.publicUrl;

      // 3. Insert Application into Database
      const { error: insertError } = await supabase
        .from("applications")
        .insert([
          {
            job_id: job.id,
            job_title: job.title,
            full_name: fullName,
            rut: rut,
            email: email,
            phone: phone,
            city: city,
            salary_expectation: salary,
            availability: availability,
            cv_url: cvUrl,
            linkedin_profile: linkedin || null
          }
        ]);

      if (insertError) {
        throw new Error(`Error al registrar postulación: ${insertError.message}`);
      }

      setStatus("success");
      setFullName("");
      setRut("");
      setEmail("");
      setPhone("");
      setCity("");
      setSalary("");
      setCvFile(null);
      setCvName("");
      setLinkedin("");
      setPrivacyConsent(false);
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMsg(err.message || "Ocurrió un error inesperado al enviar la postulación.");
    }
  };

  return (
    <div className="pt-24 pb-16 bg-brand-bg min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back and share header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            href="/vacantes"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-navy hover:text-brand-gold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Portal de Vacantes
          </Link>
          
          <div className="flex gap-2">
            <button
              onClick={shareOnWhatsApp}
              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-all hover:bg-emerald-100 flex items-center gap-1.5"
            >
              WhatsApp
            </button>
            <button
              onClick={shareOnLinkedIn}
              className="px-3 py-1.5 bg-sky-50 text-sky-700 border border-sky-200 rounded-lg text-xs font-bold transition-all hover:bg-sky-100 flex items-center gap-1.5"
            >
              LinkedIn
            </button>
            <button
              onClick={handleShare}
              className="px-3 py-1.5 bg-brand-navy text-white rounded-lg text-xs font-bold transition-all hover:bg-brand-blue-med flex items-center gap-1.5"
            >
              <Share2 className="h-3.5 w-3.5" />
              {copied ? "Copiado!" : "Copiar Enlace"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Vacancy Details (7 columns) */}
          <div className="lg:col-span-7 bg-white border border-brand-gray/10 p-6 sm:p-10 rounded-3xl shadow-sm space-y-8 relative overflow-hidden">
            {/* Side accent bar */}
            <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${job.active ? "bg-brand-gold" : "bg-emerald-500"}`}></div>

            {/* Closed Process Banner */}
            {!job.active && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3.5 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-950">Proceso de Selección Cerrado con Éxito</h3>
                  <p className="text-xs text-emerald-800 font-light leading-relaxed">
                    Esta convocatoria de talento ha concluido satisfactoriamente y la vacante ya fue cubierta.
                  </p>
                </div>
              </div>
            )}

            {/* Info header */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold text-brand-navy bg-brand-gold/15 px-3 py-1 rounded-full uppercase tracking-wider">
                  {job.area}
                </span>

                {job.active ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Convocatoria Abierta
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    Proceso Cerrado con Éxito
                  </span>
                )}

                {job.confidential ? (
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                    <Lock className="h-3 w-3" />
                    Búsqueda Confidencial
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-brand-blue-light bg-brand-blue-light/10 border border-brand-blue-light/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Estribor
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-titles">{job.title}</h1>
              
              <div className="flex flex-wrap gap-4 text-xs text-brand-gray-dark font-medium border-b border-brand-gray/10 pb-4">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" />
                  <span>{job.type}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-brand-navy uppercase tracking-wider flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand-gold" />
                Misión del Cargo
              </h2>
              <p className="text-sm text-brand-gray-dark font-light leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Functions */}
            {job.functions && (
              <div className="space-y-3">
                <h2 className="text-sm font-bold text-brand-navy uppercase tracking-wider flex items-center gap-2">
                  <ListTodo className="h-4 w-4 text-brand-gold" />
                  Funciones y Responsabilidades
                </h2>
                <ul className="space-y-2.5">
                  {job.functions.split(". ").filter(Boolean).map((func, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-brand-gray-dark font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-2"></span>
                      <span>{func.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-brand-navy uppercase tracking-wider flex items-center gap-2">
                <Award className="h-4 w-4 text-brand-gold" />
                Requisitos Excluyentes
              </h2>
              <ul className="space-y-2.5">
                {job.requirements.split(", ").map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-brand-gray-dark font-light">
                    <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{req.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Application Column (5 columns) */}
          <div className="lg:col-span-5 bg-white border border-brand-gray/10 p-6 sm:p-8 rounded-3xl shadow-sm relative">
            {!job.active ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-xs">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
                  Búsqueda Finalizada
                </span>

                <h2 className="text-xl font-bold text-brand-navy mb-3 font-titles">
                  Proceso Cerrado con Éxito
                </h2>

                <p className="text-xs text-brand-gray-dark font-light leading-relaxed mb-6">
                  Agradecemos el gran interés de todos los postulantes. Esta búsqueda ha finalizado con la contratación exitosa del candidato seleccionado y ya no recibe nuevas postulaciones.
                </p>

                <div className="p-4 rounded-2xl bg-brand-bg/60 border border-brand-gray/15 text-left mb-6 space-y-2">
                  <h4 className="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-brand-gold" />
                    ¿Quieres ser considerado en futuras búsquedas?
                  </h4>
                  <p className="text-xs text-brand-gray-dark font-light leading-relaxed">
                    Súmate a nuestra base de talentos enviando tus antecedentes en la postulación espontánea o revisa otras convocatorias vigentes.
                  </p>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/vacantes"
                    className="w-full inline-flex items-center justify-center bg-brand-navy hover:bg-brand-blue-med text-white text-xs font-bold py-3.5 px-6 rounded-xl transition-all shadow-md gap-2"
                  >
                    <span>Ver Convocatorias Abiertas</span>
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Link>

                  <Link
                    href="/vacantes#espontanea"
                    className="w-full inline-flex items-center justify-center bg-white hover:bg-slate-50 text-brand-navy border border-brand-gray/30 text-xs font-bold py-3.5 px-6 rounded-xl transition-all gap-2"
                  >
                    <span>Postulación Espontánea (Enviar CV)</span>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-brand-navy mb-4 font-titles">Postular a la vacante</h2>
                
                <AnimatePresence mode="wait">
                  {status === "success" ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-10"
                    >
                      <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
                      <h3 className="text-xl font-bold text-brand-navy mb-2">¡Postulación Enviada!</h3>
                      <p className="text-xs text-brand-gray-dark font-light max-w-sm mx-auto mb-6 leading-relaxed">
                        Agradecemos tu interés. Tus antecedentes han sido guardados con éxito en la base de datos de Supabase para la vacante <strong className="font-semibold text-brand-navy">{job.title}</strong>. Los consultores a cargo revisarán tu CV a la brevedad.
                      </p>
                      <Link
                        href="/vacantes"
                        className="inline-flex bg-brand-navy hover:bg-brand-blue-med text-white text-xs font-bold py-3 px-6 rounded-xl transition-colors"
                      >
                        Ver Otras Vacantes
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.form
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-brand-navy uppercase mb-1">Nombre Completo *</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Ej. Camila Alvear"
                          className="border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="text-[10px] font-bold text-brand-navy uppercase mb-1">RUT *</label>
                          <input
                            type="text"
                            required
                            value={rut}
                            onChange={(e) => setRut(e.target.value)}
                            placeholder="12.345.678-9"
                            className="border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold transition-colors"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[10px] font-bold text-brand-navy uppercase mb-1">Teléfono *</label>
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Ej. +56 9 1234 5678"
                            className="border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="text-[10px] font-bold text-brand-navy uppercase mb-1">Correo Electrónico *</label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ejemplo@correo.com"
                            className="border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold transition-colors"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[10px] font-bold text-brand-navy uppercase mb-1">Ciudad *</label>
                          <input
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Ej. Puerto Montt"
                            className="border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold transition-colors"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-brand-navy uppercase mb-1">Cargo al que Postula</label>
                        <input
                          type="text"
                          readOnly
                          value={job.title}
                          className="border border-brand-gray/15 rounded-lg px-3 py-2 text-xs bg-brand-bg/60 text-brand-navy/60 font-semibold focus:outline-none cursor-not-allowed"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="text-[10px] font-bold text-brand-navy uppercase mb-1">Pretensión de Renta (CLP) *</label>
                          <input
                            type="text"
                            required
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            placeholder="Ej. 1.800.000"
                            className="border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold transition-colors"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-[10px] font-bold text-brand-navy uppercase mb-1">Disponibilidad *</label>
                          <select
                            value={availability}
                            onChange={(e) => setAvailability(e.target.value)}
                            className="border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold transition-colors cursor-pointer"
                          >
                            <option value="Inmediata">Inmediata</option>
                            <option value="15 días">Aviso 15 días</option>
                            <option value="30 días">Aviso 30 días</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-brand-navy uppercase mb-1">Perfil de LinkedIn (Opcional)</label>
                        <input
                          type="url"
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          placeholder="https://linkedin.com/in/nombre"
                          className="border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold transition-colors"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-brand-navy uppercase mb-1">Adjuntar CV (PDF) *</label>
                        <div className="relative border border-dashed border-brand-gray/30 rounded-lg p-3 bg-brand-bg/25 flex flex-col items-center justify-center cursor-pointer hover:bg-brand-bg/50 transition-colors">
                          <input
                            type="file"
                            accept=".pdf"
                            required
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <span className="text-[10px] text-brand-gray-dark font-medium select-none">
                            {cvName || "Subir archivo PDF"}
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
                          Autorizo el tratamiento de mis antecedentes y CV para fines exclusivos de este proceso de selección conforme a la{" "}
                          <Link href="/privacidad" target="_blank" className="text-brand-electric underline font-semibold hover:text-brand-navy">
                            Política de Privacidad
                          </Link>
                          . <span className="text-rose-500 font-bold">*</span>
                        </label>
                      </div>

                      {status === "error" && errorMsg && (
                        <p className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-100 p-2 rounded-lg text-center">
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
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Enviando Postulación...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Enviar Postulación
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
