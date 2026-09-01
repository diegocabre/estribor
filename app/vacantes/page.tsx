"use client";

import { useState, useEffect } from "react";
import { Job, initialJobs } from "@/components/jobsData";
import { supabase } from "@/lib/supabase";
import { Search, MapPin, Briefcase, Building, Send, ChevronRight, Loader2, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function VacantesPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState("Todos");
  const [selectedLocation, setSelectedLocation] = useState("Todos");
  const [selectedType, setSelectedType] = useState("Todos");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [loading, setLoading] = useState(true);

  // Spontaneous application states
  const [spontName, setSpontName] = useState("");
  const [spontRut, setSpontRut] = useState("");
  const [spontEmail, setSpontEmail] = useState("");
  const [spontPhone, setSpontPhone] = useState("");
  const [spontCity, setSpontCity] = useState("");
  const [spontSalary, setSpontSalary] = useState("");
  const [spontArea, setSpontArea] = useState("Gestión de Personas");
  const [spontCv, setSpontCv] = useState<File | null>(null);
  const [spontCvName, setSpontCvName] = useState("");
  const [spontStatus, setSpontStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      // Map database snake_case to camelCase
      const mappedJobs = data.map((j: any) => ({
        id: j.id,
        title: j.title,
        area: j.area,
        location: j.location,
        type: j.type,
        description: j.description,
        requirements: j.requirements,
        functions: j.functions,
        confidential: j.confidential,
        active: j.active,
        createdAt: j.created_at
      }));
      // Sort so active jobs are on top, closed jobs at the bottom, both ordered by date
      mappedJobs.sort((a, b) => {
        if (a.active === b.active) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return a.active ? -1 : 1;
      });
      setJobs(mappedJobs);
    } else {
      console.warn("Utilizando datos iniciales de vacantes.");
      const initialSorted = [...initialJobs].sort((a, b) => {
        if (a.active === b.active) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return a.active ? -1 : 1;
      });
      setJobs(initialSorted);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Extract unique filter options
  const areas = ["Todos", ...Array.from(new Set(jobs.map((j) => j.area)))];
  const locations = ["Todos", ...Array.from(new Set(jobs.map((j) => j.location)))];
  const types = ["Todos", ...Array.from(new Set(jobs.map((j) => j.type)))];

  // Filtering logic
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || 
                          job.description.toLowerCase().includes(search.toLowerCase());
    const matchesArea = selectedArea === "Todos" || job.area === selectedArea;
    const matchesLoc = selectedLocation === "Todos" || job.location === selectedLocation;
    const matchesType = selectedType === "Todos" || job.type === selectedType;
    const matchesStatus = 
      selectedStatus === "Todos" || 
      (selectedStatus === "Activas" && job.active) || 
      (selectedStatus === "Cerradas" && !job.active);
    return matchesSearch && matchesArea && matchesLoc && matchesType && matchesStatus;
  });

  const handleSpontaneousSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSpontStatus("submitting");
    setErrorMsg("");

    try {
      let cvUrl = "";
      
      if (!spontCv) {
        throw new Error("Por favor, adjunta tu CV en formato PDF.");
      }

      // Validar si ya se postuló espontáneo con este RUT
      const { data: existingApp, error: checkError } = await supabase
        .from("applications")
        .select("id")
        .eq("job_id", "spontaneous")
        .eq("rut", spontRut);

      if (checkError) {
        throw new Error(`Error al verificar postulación previa: ${checkError.message}`);
      }

      if (existingApp && existingApp.length > 0) {
        throw new Error("Ya te has registrado en nuestra postulación espontánea con este RUT. Tu perfil ya está en nuestra base de datos.");
      }

      // 1. Upload CV to Supabase Storage Bucket
      const fileExt = spontCv.name.split(".").pop();
      const fileName = `spontaneous-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("cvs")
        .upload(fileName, spontCv, {
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
            job_id: "spontaneous",
            job_title: `Postulación Espontánea - ${spontArea}`,
            full_name: spontName,
            rut: spontRut,
            email: spontEmail,
            phone: spontPhone,
            city: spontCity,
            salary_expectation: spontSalary,
            availability: "Inmediata",
            cv_url: cvUrl
          }
        ]);

      if (insertError) {
        throw new Error(`Error al guardar la postulación: ${insertError.message}`);
      }

      setSpontStatus("success");
      setSpontName("");
      setSpontRut("");
      setSpontEmail("");
      setSpontPhone("");
      setSpontCity("");
      setSpontSalary("");
      setSpontCv(null);
      setSpontCvName("");
    } catch (err: any) {
      console.error(err);
      setSpontStatus("error");
      setErrorMsg(err.message || "Ocurrió un error inesperado al enviar la postulación.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSpontCv(e.target.files[0]);
      setSpontCvName(e.target.files[0].name);
    }
  };

  return (
    <div className="pt-24 pb-16 bg-brand-bg min-h-screen">
      {/* Header Banner */}
      <div className="bg-brand-navy text-white py-16 mb-12 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-brand-gold text-xs font-bold tracking-widest uppercase block mb-3 font-sans">
              Desarrollo Profesional
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 font-titles">
              Trabaja con Nuestros Clientes
            </h1>
            <p className="text-sm sm:text-base text-brand-gray max-w-xl font-light leading-relaxed">
              Administramos procesos de selección y reclutamiento estratégico para empresas líderes de la industria y producción en todo Chile.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="/vacantes/admin"
              className="inline-flex items-center gap-2 text-xs text-brand-gold hover:text-white bg-white/5 hover:bg-white/10 border border-brand-gold/30 hover:border-brand-gold px-4 py-2.5 rounded-xl font-semibold transition-all shadow-sm"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Acceso Administrador / Reclutador</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Job Search & List Area (8 columns) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Search and Filters Panel */}
            <div className="bg-white border border-brand-gray/10 p-6 rounded-2xl shadow-sm space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-gray-dark" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar cargos (ej. Consultor, Jefe)..."
                  className="w-full pl-12 pr-4 py-3.5 border border-brand-gray/20 rounded-xl bg-brand-bg/25 text-brand-navy text-sm focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {/* Area filter */}
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-brand-navy uppercase mb-1.5">Área de Trabajo</label>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="border border-brand-gray/20 rounded-xl px-3 py-2.5 text-xs bg-brand-bg/10 text-brand-navy focus:outline-none focus:border-brand-gold cursor-pointer"
                  >
                    {areas.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-brand-navy uppercase mb-1.5">Ubicación</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="border border-brand-gray/20 rounded-xl px-3 py-2.5 text-xs bg-brand-bg/10 text-brand-navy focus:outline-none focus:border-brand-gold cursor-pointer"
                  >
                    {locations.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                {/* Type Filter */}
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-brand-navy uppercase mb-1.5">Tipo de Cargo</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="border border-brand-gray/20 rounded-xl px-3 py-2.5 text-xs bg-brand-bg/10 text-brand-navy focus:outline-none focus:border-brand-gold cursor-pointer"
                  >
                    {types.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-brand-navy uppercase mb-1.5">Estado</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border border-brand-gray/20 rounded-xl px-3 py-2.5 text-xs bg-brand-bg/10 text-brand-navy focus:outline-none focus:border-brand-gold cursor-pointer"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Activas">Convocatorias Abiertas</option>
                    <option value="Cerradas">Procesos Cerrados</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Vacancies List */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-16 bg-white border border-brand-gray/10 rounded-2xl">
                  <Loader2 className="h-10 w-10 text-brand-gold animate-spin mx-auto mb-4" />
                  <p className="text-xs text-brand-gray-dark">Cargando vacantes en tiempo real...</p>
                </div>
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className={`p-6 sm:p-8 rounded-2xl shadow-sm transition-all duration-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border ${
                      job.active
                        ? "bg-white border-brand-gray/10 hover:border-brand-gold/40 hover:shadow-md"
                        : "bg-slate-50/90 border-emerald-200/60 hover:border-emerald-300"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold text-brand-navy bg-brand-gold/15 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {job.area}
                        </span>

                        {job.active ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Convocatoria Abierta
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            Proceso Cerrado con Éxito
                          </span>
                        )}

                        {job.confidential && (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                            <Lock className="h-3 w-3" />
                            Búsqueda Confidencial
                          </span>
                        )}
                      </div>

                      <h3 className={`text-xl font-bold ${job.active ? "text-brand-navy" : "text-slate-800"}`}>
                        {job.title}
                      </h3>

                      <div className="flex flex-wrap gap-4 text-xs text-brand-gray-dark font-medium">
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

                    <Link
                      href={`/vacantes/${job.id}`}
                      className={`inline-flex items-center justify-center text-xs font-bold py-3.5 px-6 rounded-xl transition-all shrink-0 gap-1.5 ${
                        job.active
                          ? "bg-brand-navy hover:bg-brand-blue-med text-white shadow-sm"
                          : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-sm"
                      }`}
                    >
                      <span>{job.active ? "Postular / Detalle" : "Ver Proceso"}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-white border border-brand-gray/10 rounded-2xl">
                  <Building className="h-12 w-12 text-brand-gray mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-brand-navy">No encontramos vacantes</h3>
                  <p className="text-sm text-brand-gray-dark font-light">Intenta ajustando los filtros de búsqueda.</p>
                </div>
              )}
            </div>
          </div>

          {/* Spontaneous Application Form (4 columns) */}
          <div id="espontanea" className="lg:col-span-4 bg-white border border-brand-gray/10 p-6 sm:p-8 rounded-2xl shadow-sm scroll-mt-28">
            <h3 className="text-lg font-bold text-brand-navy mb-3">Postulación Espontánea</h3>
            <p className="text-xs text-brand-gray-dark font-light leading-relaxed mb-6">
              ¿No encontraste un cargo afín a tu perfil? Déjanos tu currículum para sumarte a nuestra base de datos. Nos pondremos en contacto contigo cuando surjan búsquedas alineadas a tu experiencia.
            </p>

            <AnimatePresence mode="wait">
              {spontStatus === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                  <h4 className="font-bold text-brand-navy mb-2">¡Ingreso Exitoso!</h4>
                  <p className="text-xs text-brand-gray-dark font-light max-w-xs mx-auto mb-6 leading-relaxed">
                    Hemos incorporado tu CV a nuestra base de datos de selección estratégica en Supabase.
                  </p>
                  <button
                    onClick={() => setSpontStatus("idle")}
                    className="bg-brand-navy text-white text-xs font-bold py-2 px-4 rounded-lg hover:bg-brand-blue-med transition-colors"
                  >
                    Postular de nuevo
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSpontaneousSubmit}
                  className="space-y-4"
                >
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-brand-navy uppercase mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      value={spontName}
                      onChange={(e) => setSpontName(e.target.value)}
                      placeholder="Ej. Juan Pérez"
                      className="border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold transition-colors"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-brand-navy uppercase mb-1">RUT *</label>
                    <input
                      type="text"
                      required
                      value={spontRut}
                      onChange={(e) => setSpontRut(e.target.value)}
                      placeholder="12.345.678-9"
                      className="border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-brand-navy uppercase mb-1">Correo Electrónico *</label>
                      <input
                        type="email"
                        required
                        value={spontEmail}
                        onChange={(e) => setSpontEmail(e.target.value)}
                        placeholder="juan.perez@correo.com"
                        className="border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold transition-colors"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-brand-navy uppercase mb-1">Teléfono *</label>
                      <input
                        type="tel"
                        required
                        value={spontPhone}
                        onChange={(e) => setSpontPhone(e.target.value)}
                        placeholder="Ej. +56 9 1234 5678"
                        className="border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-brand-navy uppercase mb-1">Ciudad *</label>
                      <input
                        type="text"
                        required
                        value={spontCity}
                        onChange={(e) => setSpontCity(e.target.value)}
                        placeholder="Ej. Puerto Varas"
                        className="border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold transition-colors"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-brand-navy uppercase mb-1">Pretensión Renta (CLP) *</label>
                      <input
                        type="text"
                        required
                        value={spontSalary}
                        onChange={(e) => setSpontSalary(e.target.value)}
                        placeholder="Ej. 1.500.000"
                        className="border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-brand-navy uppercase mb-1">Área de Interés *</label>
                    <select
                      value={spontArea}
                      onChange={(e) => setSpontArea(e.target.value)}
                      className="border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold transition-colors cursor-pointer"
                    >
                      <option value="Gestión de Personas">Gestión de Personas / DO / Reclutamiento</option>
                      <option value="Seguridad y Salud en el Trabajo">Seguridad y Salud en el Trabajo (SST)</option>
                      <option value="Sostenibilidad Organizacional">Sostenibilidad Organizacional / ESG</option>
                      <option value="Operaciones / Producción">Operaciones / Producción</option>
                      <option value="Administración / Finanzas">Administración / Finanzas</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-brand-navy uppercase mb-1">Adjuntar CV (PDF) *</label>
                    <div className="relative border border-dashed border-brand-gray/30 rounded-lg p-4 bg-brand-bg/20 flex flex-col items-center justify-center cursor-pointer hover:bg-brand-bg/40 transition-colors">
                      <input
                        type="file"
                        accept=".pdf"
                        required
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <span className="text-[10px] text-brand-gray-dark font-medium select-none">
                        {spontCvName || "Haga clic para subir archivo"}
                      </span>
                    </div>
                  </div>

                  {spontStatus === "error" && errorMsg && (
                    <p className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-100 p-2 rounded-lg text-center">
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={spontStatus === "submitting"}
                    className="w-full bg-brand-navy hover:bg-brand-blue-med disabled:bg-brand-navy/60 text-white font-bold py-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    {spontStatus === "submitting" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Enviar Currículum
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
