"use client";

import { useState, useEffect } from "react";
import { Job, JobApplication } from "@/components/jobsData";
import { supabase } from "@/lib/supabase";
import { Lock, Plus, Edit2, Archive, CheckCircle2, XCircle, Trash2, LogOut, Download, Users, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Forgot password & Recovery states
  const [forgotMode, setForgotMode] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoverySuccessMsg, setRecoverySuccessMsg] = useState("");
  const [isRecovering, setIsRecovering] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  
  // Internal change password states
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [changePasswordSuccessMsg, setChangePasswordSuccessMsg] = useState("");
  const [changePasswordErrorMsg, setChangePasswordErrorMsg] = useState("");

  // Dashboard states
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [activeTab, setActiveTab] = useState<"jobs" | "apps">("jobs");
  
  // Form modal states
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  
  // Form fields
  const [title, setTitle] = useState("");
  const [area, setArea] = useState("Gestión de Personas");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Full-time");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [functions, setFunctions] = useState("");
  const [confidential, setConfidential] = useState(false);

  // Check auth session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setLoadingAuth(false);
      
      if (session) {
        fetchData();
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovering(true);
      }
      setIsAuthenticated(!!session);
      if (session) {
        fetchData();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchData = async () => {
    // 1. Fetch all jobs
    const { data: jobsData, error: jobsError } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (!jobsError && jobsData) {
      const mapped = jobsData.map((j: any) => ({
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
      setJobs(mapped);
    }

    // 2. Fetch all applications
    const { data: appsData, error: appsError } = await supabase
      .from("applications")
      .select("*")
      .order("applied_at", { ascending: false });

    if (!appsError && appsData) {
      const mapped = appsData.map((a: any) => ({
        id: a.id,
        jobId: a.job_id,
        jobTitle: a.job_title,
        fullName: a.full_name,
        rut: a.rut,
        email: a.email,
        phone: a.phone,
        city: a.city,
        salaryExpectation: a.salary_expectation,
        availability: a.availability,
        cvFileName: a.cv_url,
        linkedinProfile: a.linkedin_profile,
        appliedAt: a.applied_at
      }));
      setApplications(mapped);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message || "Credenciales inválidas. Por favor verifique.");
    } else {
      setIsAuthenticated(true);
      fetchData();
    }
    setActionLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
    setJobs([]);
    setApplications([]);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg("");
    setRecoverySuccessMsg("");

    const { error } = await supabase.auth.resetPasswordForEmail(recoveryEmail, {
      redirectTo: `${window.location.origin}/vacantes/admin`,
    });

    if (error) {
      setErrorMsg(error.message || "Error al enviar el correo de recuperación.");
    } else {
      setRecoverySuccessMsg("Correo de recuperación enviado con éxito. Revisa tu bandeja de entrada.");
    }
    setActionLoading(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setActionLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setErrorMsg(error.message || "Error al actualizar la contraseña.");
    } else {
      alert("Contraseña restablecida con éxito. Por favor inicia sesión con tu nueva contraseña.");
      await supabase.auth.signOut();
      setIsRecovering(false);
      setIsAuthenticated(false);
      setNewPassword("");
      setConfirmNewPassword("");
      setEmail("");
      setPassword("");
    }
    setActionLoading(false);
  };

  const handleChangePasswordInternal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setChangePasswordErrorMsg("Las contraseñas no coinciden.");
      return;
    }
    if (newPassword.length < 6) {
      setChangePasswordErrorMsg("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setActionLoading(true);
    setChangePasswordErrorMsg("");
    setChangePasswordSuccessMsg("");

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setChangePasswordErrorMsg(error.message || "Error al actualizar la contraseña.");
    } else {
      setChangePasswordSuccessMsg("Contraseña actualizada con éxito.");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => {
        setShowChangePasswordModal(false);
        setChangePasswordSuccessMsg("");
      }, 2000);
    }
    setActionLoading(false);
  };

  const handleOpenCreateModal = () => {
    setEditingJob(null);
    setTitle("");
    setArea("Gestión de Personas");
    setLocation("");
    setType("Full-time");
    setDescription("");
    setRequirements("");
    setFunctions("");
    setConfidential(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (job: Job) => {
    setEditingJob(job);
    setTitle(job.title);
    setArea(job.area);
    setLocation(job.location);
    setType(job.type);
    setDescription(job.description);
    setRequirements(job.requirements);
    setFunctions(job.functions || "");
    setConfidential(job.confidential);
    setShowModal(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      if (editingJob) {
        // Edit in Supabase
        const { error } = await supabase
          .from("jobs")
          .update({
            title,
            area,
            location,
            type,
            description,
            requirements,
            functions,
            confidential
          })
          .eq("id", editingJob.id);

        if (error) throw error;
      } else {
        // Create in Supabase
        const { error } = await supabase
          .from("jobs")
          .insert([
            {
              title,
              area,
              location,
              type,
              description,
              requirements,
              functions,
              confidential,
              active: true
            }
          ]);

        if (error) throw error;
      }

      await fetchData();
      setShowModal(false);
    } catch (err: any) {
      alert(`Error al guardar la vacante: ${err.message}`);
    }
    setActionLoading(false);
  };

  const toggleJobStatus = async (job: Job) => {
    try {
      const { error } = await supabase
        .from("jobs")
        .update({ active: !job.active })
        .eq("id", job.id);
      if (error) throw error;
      await fetchData();
    } catch (err: any) {
      alert(`Error al cambiar el estado: ${err.message}`);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta vacante de la base de datos de forma permanente?")) {
      try {
        const { error } = await supabase
          .from("jobs")
          .delete()
          .eq("id", id);
        if (error) throw error;
        await fetchData();
      } catch (err: any) {
        alert(`Error al eliminar la vacante: ${err.message}`);
      }
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar permanentemente esta postulación de la base de datos?")) {
      try {
        const { error } = await supabase
          .from("applications")
          .delete()
          .eq("id", id);
        if (error) throw error;
        await fetchData();
      } catch (err: any) {
        alert(`Error al eliminar la postulación: ${err.message}`);
      }
    }
  };

  if (loadingAuth) {
    return (
      <div className="pt-32 pb-24 flex items-center justify-center min-h-screen bg-brand-bg">
        <Loader2 className="h-10 w-10 text-brand-gold animate-spin" />
      </div>
    );
  }

  if (isRecovering) {
    return (
      <div className="pt-32 pb-24 flex items-center justify-center min-h-screen bg-brand-bg px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-brand-gray/10 p-8 rounded-3xl shadow-xl max-w-md w-full text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-gold"></div>
          
          <div className="w-12 h-12 rounded-xl bg-brand-navy/5 text-brand-navy flex items-center justify-center mx-auto mb-6">
            <Lock className="h-6 w-6" />
          </div>

          <h2 className="text-xl font-bold text-brand-navy mb-2 font-titles">Establecer Nueva Contraseña</h2>
          <p className="text-xs text-brand-gray-dark font-light mb-6">
            Por favor ingresa tu nueva contraseña corporativa.
          </p>

          <form onSubmit={handleUpdatePassword} className="space-y-4 text-left">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-brand-navy uppercase mb-1.5">Nueva Contraseña</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-2.5 border border-brand-gray/20 rounded-xl bg-brand-bg/50 text-brand-navy text-xs focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-brand-navy uppercase mb-1.5">Confirmar Nueva Contraseña</label>
              <input
                type="password"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Repite la contraseña"
                className="w-full px-4 py-2.5 border border-brand-gray/20 rounded-xl bg-brand-bg/50 text-brand-navy text-xs focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>

            {errorMsg && (
              <p className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 p-2 rounded-lg text-center">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full bg-brand-navy hover:bg-brand-blue-med disabled:bg-brand-navy/60 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Actualizar Contraseña
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (forgotMode) {
      return (
        <div className="pt-32 pb-24 flex items-center justify-center min-h-screen bg-brand-bg px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-brand-gray/10 p-8 rounded-3xl shadow-xl max-w-md w-full text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-gold"></div>
            
            <div className="w-12 h-12 rounded-xl bg-brand-navy/5 text-brand-navy flex items-center justify-center mx-auto mb-6">
              <Lock className="h-6 w-6" />
            </div>

            <h2 className="text-xl font-bold text-brand-navy mb-2 font-titles">Recuperar Contraseña</h2>
            <p className="text-xs text-brand-gray-dark font-light mb-6">
              Ingresa tu correo corporativo y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            <form onSubmit={handleForgotPassword} className="space-y-4 text-left">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-brand-navy uppercase mb-1.5">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="consultor@estribor.cl"
                  className="w-full px-4 py-2.5 border border-brand-gray/20 rounded-xl bg-brand-bg/50 text-brand-navy text-xs focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>

              {errorMsg && (
                <p className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 p-2 rounded-lg text-center">
                  {errorMsg}
                </p>
              )}

              {recoverySuccessMsg && (
                <p className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 p-2 rounded-lg text-center">
                  {recoverySuccessMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full bg-brand-navy hover:bg-brand-blue-med disabled:bg-brand-navy/60 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Enviar Enlace de Recuperación
              </button>

              <button
                type="button"
                onClick={() => {
                  setForgotMode(false);
                  setErrorMsg("");
                  setRecoverySuccessMsg("");
                }}
                className="w-full text-center text-xs font-semibold text-brand-navy/60 hover:text-brand-navy transition-colors mt-2"
              >
                Volver al Inicio de Sesión
              </button>
            </form>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="pt-32 pb-24 flex items-center justify-center min-h-screen bg-brand-bg px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-brand-gray/10 p-8 rounded-3xl shadow-xl max-w-md w-full text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-gold"></div>
          
          <div className="w-12 h-12 rounded-xl bg-brand-navy/5 text-brand-navy flex items-center justify-center mx-auto mb-6">
            <Lock className="h-6 w-6" />
          </div>

          <h2 className="text-xl font-bold text-brand-navy mb-2 font-titles">Administración Estribor</h2>
          <p className="text-xs text-brand-gray-dark font-light mb-6">
            Inicia sesión con tu correo y contraseña corporativa para acceder a la base de datos de vacantes y postulantes (JWT Secure).
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-brand-navy uppercase mb-1.5">Correo Electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="consultor@estribor.cl"
                className="w-full px-4 py-2.5 border border-brand-gray/20 rounded-xl bg-brand-bg/50 text-brand-navy text-xs focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[10px] font-bold text-brand-navy uppercase">Contraseña</label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotMode(true);
                    setErrorMsg("");
                    setRecoverySuccessMsg("");
                  }}
                  className="text-[10px] font-semibold text-brand-gold hover:text-brand-gold/80 transition-colors"
                >
                  ¿Olvidó su contraseña?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-brand-gray/20 rounded-xl bg-brand-bg/50 text-brand-navy text-xs focus:outline-none focus:border-brand-gold transition-colors"
              />
            </div>

            {errorMsg && (
              <p className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 p-2 rounded-lg text-center">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full bg-brand-navy hover:bg-brand-blue-med disabled:bg-brand-navy/60 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Ingresar al Panel
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-brand-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-gray/10 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-brand-navy font-titles">Panel de Control</h1>
            <p className="text-xs text-brand-gray-dark font-light mt-1">Gestión administrativa de ofertas de empleo y selección de personal.</p>
          </div>
          
          <div className="flex gap-3">
            <Link
              href="/vacantes"
              target="_blank"
              className="px-4 py-2.5 border border-brand-navy text-brand-navy rounded-xl text-xs font-bold hover:bg-brand-navy hover:text-white transition-colors flex items-center justify-center"
            >
              Ver Portal Público
            </Link>
            <button
              onClick={() => {
                setChangePasswordErrorMsg("");
                setChangePasswordSuccessMsg("");
                setNewPassword("");
                setConfirmNewPassword("");
                setShowChangePasswordModal(true);
              }}
              className="px-4 py-2.5 border border-brand-navy text-brand-navy hover:bg-brand-bg rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Lock className="h-4 w-4" />
              Cambiar Clave
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Salir
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex border-b border-brand-gray/10 mb-8 gap-4">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === "jobs" ? "text-brand-gold" : "text-brand-navy/60 hover:text-brand-navy"
            }`}
          >
            Ofertas Publicadas ({jobs.length})
            {activeTab === "jobs" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold"></span>}
          </button>
          <button
            onClick={() => setActiveTab("apps")}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === "apps" ? "text-brand-gold" : "text-brand-navy/60 hover:text-brand-navy"
            }`}
          >
            Postulaciones Recibidas ({applications.length})
            {activeTab === "apps" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold"></span>}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "jobs" ? (
          <div className="space-y-4">
            
            {/* Action Bar */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-brand-gray/10 shadow-sm">
              <span className="text-xs text-brand-gray-dark font-medium">Búsquedas activas listas para reclutar.</span>
              <button
                onClick={handleOpenCreateModal}
                className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Plus className="h-4 w-4" />
                Crear Vacante
              </button>
            </div>

            {/* Jobs Table */}
            <div className="bg-white border border-brand-gray/10 rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-brand-bg/50 border-b border-brand-gray/10 text-brand-navy font-bold uppercase tracking-wider">
                    <th className="p-4">Cargo</th>
                    <th className="p-4">Área</th>
                    <th className="p-4">Ubicación</th>
                    <th className="p-4">Tipo</th>
                    <th className="p-4">Confidencial</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-gray/5 text-brand-navy font-light">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-brand-bg/20 transition-colors">
                      <td className="p-4 font-bold">{job.title}</td>
                      <td className="p-4">{job.area}</td>
                      <td className="p-4">{job.location}</td>
                      <td className="p-4">{job.type}</td>
                      <td className="p-4">
                        {job.confidential ? (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Sí</span>
                        ) : (
                          <span className="text-[10px] font-bold text-brand-gray-dark bg-brand-bg px-2 py-0.5 rounded-full">No</span>
                        )}
                      </td>
                      <td className="p-4">
                        {job.active ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 inline-flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Activa
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100 inline-flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            Cerrada
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => toggleJobStatus(job)}
                            className="p-1.5 hover:bg-brand-bg rounded-lg text-brand-navy transition-colors"
                            title={job.active ? "Cerrar vacante" : "Reabrir vacante"}
                          >
                            <Archive className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(job)}
                            className="p-1.5 hover:bg-brand-bg rounded-lg text-brand-blue-light transition-colors"
                            title="Editar vacante"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors"
                            title="Eliminar vacante"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {jobs.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center p-12 text-brand-gray-dark font-light">
                        No hay ofertas publicadas. Haz clic en "Crear Vacante" para publicar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Table wrapper */}
            <div className="bg-white border border-brand-gray/10 rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-brand-bg/50 border-b border-brand-gray/10 text-brand-navy font-bold uppercase tracking-wider">
                    <th className="p-4">Postulante</th>
                    <th className="p-4">RUT</th>
                    <th className="p-4">Puesto al que Postula</th>
                    <th className="p-4">Contacto</th>
                    <th className="p-4">Pretensión</th>
                    <th className="p-4">F. Aplicación</th>
                    <th className="p-4">CV</th>
                    <th className="p-4 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-gray/5 text-brand-navy font-light">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-brand-bg/20 transition-colors">
                      <td className="p-4 font-bold">
                        <div>{app.fullName}</div>
                        <div className="text-[10px] text-brand-gray-dark mt-0.5">{app.city}</div>
                      </td>
                      <td className="p-4 font-mono">{app.rut}</td>
                      <td className="p-4 font-semibold text-brand-navy">{app.jobTitle}</td>
                      <td className="p-4">
                        <div>{app.email}</div>
                        <div className="text-[10px] text-brand-gray-dark mt-0.5">{app.phone}</div>
                        {app.linkedinProfile && (
                          <a
                            href={app.linkedinProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[9px] font-bold text-brand-blue-light hover:underline block mt-0.5"
                          >
                            Ver LinkedIn
                          </a>
                        )}
                      </td>
                      <td className="p-4 font-semibold">{app.salaryExpectation}</td>
                      <td className="p-4">{new Date(app.appliedAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        {app.cvFileName ? (
                          <a
                            href={app.cvFileName}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-brand-navy text-white rounded flex items-center gap-1 hover:bg-brand-blue-med transition-colors text-[9px] w-fit"
                          >
                            <Download className="h-3 w-3" />
                            Ver CV
                          </a>
                        ) : (
                          <span className="text-[10px] text-brand-gray-dark">Sin Archivo</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDeleteApplication(app.id)}
                          className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors"
                          title="Eliminar registro"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {applications.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center p-12 text-brand-gray-dark font-light">
                        <Users className="h-10 w-10 text-brand-gray mx-auto mb-3" />
                        No se han recibido postulaciones en este período.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Creation/Edition Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border-t-8 border-brand-gold"
          >
            <div className="p-8">
              <h2 className="text-2xl font-bold text-brand-navy mb-6 font-titles">
                {editingJob ? "Editar Vacante" : "Publicar Nueva Vacante"}
              </h2>

              <form onSubmit={handleSaveJob} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-brand-navy uppercase mb-1">Título de la Vacante *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ej. Consultor SST"
                      className="border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-brand-navy uppercase mb-1">Área *</label>
                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold"
                    >
                      <option value="Gestión de Personas">Gestión de Personas</option>
                      <option value="Seguridad y Salud en el Trabajo">Seguridad y Salud en el Trabajo</option>
                      <option value="Sostenibilidad Organizacional">Sostenibilidad Organizacional</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-brand-navy uppercase mb-1">Ubicación / Ciudad *</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Ej. Puerto Montt"
                      className="border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-brand-navy uppercase mb-1">Tipo de Cargo *</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Híbrido">Híbrido</option>
                      <option value="Remoto">Remoto</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 py-2">
                  <input
                    type="checkbox"
                    id="confidential"
                    checked={confidential}
                    onChange={(e) => setConfidential(e.target.checked)}
                    className="h-4.5 w-4.5 text-brand-gold border-brand-gray/30 rounded focus:ring-brand-gold cursor-pointer"
                  />
                  <label htmlFor="confidential" className="text-xs text-brand-navy font-semibold cursor-pointer select-none flex items-center gap-1">
                    Marcar como Búsqueda Confidencial
                  </label>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-brand-navy uppercase mb-1">Misión / Descripción General *</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe de qué trata el puesto..."
                    className="border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold resize-none"
                  ></textarea>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-brand-navy uppercase mb-1">Responsabilidades / Funciones * (Separar por puntos para viñetas)</label>
                  <textarea
                    rows={3}
                    required
                    value={functions}
                    onChange={(e) => setFunctions(e.target.value)}
                    placeholder="Ej. Ejecutar auditorías preventivas en plantas. Redactar informes de control."
                    className="border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold resize-none"
                  ></textarea>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-brand-navy uppercase mb-1">Requisitos Excluyentes * (Separar por comas para viñetas)</label>
                  <textarea
                    rows={2}
                    required
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Ej. 10 años de experiencia, Título de Ingeniero SNS, Residencia local"
                    className="border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold resize-none"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-brand-gray/10">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-brand-gray/20 rounded-xl text-xs hover:bg-brand-bg text-brand-navy font-bold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="bg-brand-navy hover:bg-brand-blue-med text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {editingJob ? "Guardar Cambios" : "Publicar Vacante"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-md w-full shadow-2xl relative border-t-8 border-brand-gold overflow-hidden"
          >
            <div className="p-8">
              <h2 className="text-2xl font-bold text-brand-navy mb-6 font-titles flex items-center gap-2">
                <Lock className="h-6 w-6 text-brand-gold" />
                Cambiar Contraseña
              </h2>

              <form onSubmit={handleChangePasswordInternal} className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-brand-navy uppercase mb-1">Nueva Contraseña *</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-brand-navy uppercase mb-1">Confirmar Nueva Contraseña *</label>
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Repita la nueva contraseña"
                    className="border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold"
                  />
                </div>

                {changePasswordErrorMsg && (
                  <p className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 p-2 rounded-lg text-center">
                    {changePasswordErrorMsg}
                  </p>
                )}

                {changePasswordSuccessMsg && (
                  <p className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 p-2 rounded-lg text-center">
                    {changePasswordSuccessMsg}
                  </p>
                )}

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-brand-gray/10">
                  <button
                    type="button"
                    onClick={() => setShowChangePasswordModal(false)}
                    className="px-4 py-2 border border-brand-gray/20 rounded-xl text-xs hover:bg-brand-bg text-brand-navy font-bold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="bg-brand-navy hover:bg-brand-blue-med text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Actualizar
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
