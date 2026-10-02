"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Job } from "@/lib/types";
import ApplicationsPanel from "./_components/ApplicationsPanel";
import {
  FirstLoginPasswordScreen,
  ForgotPasswordScreen,
  LoadingScreen,
  LoginScreen,
  RecoveryScreen,
} from "./_components/AuthScreens";
import DashboardHeader from "./_components/DashboardHeader";
import JobsPanel from "./_components/JobsPanel";
import { useAdminData } from "./_hooks/useAdminData";
import { useAdminSession } from "./_hooks/useAdminSession";
import { useApplicationFilters } from "./_hooks/useApplicationFilters";
import { exportApplicationsToExcel } from "./_lib/export-applications";

// Los modales se descargan solo al abrirlos.
const JobFormModal = dynamic(() => import("./_components/JobFormModal"));
const AreasManagerModal = dynamic(() => import("./_components/AreasManagerModal"));
const ChangePasswordModal = dynamic(() => import("./_components/ChangePasswordModal"));

type Tab = "jobs" | "apps";

export default function AdminPage() {
  // Si el servidor rechaza la sesión (401/403), se cierra la sesión y se muestra el motivo.
  const forceSignOutRef = useRef<(reason: string) => void>(() => undefined);
  const handleUnauthorized = useCallback((reason: string) => forceSignOutRef.current(reason), []);

  const data = useAdminData({ onUnauthorized: handleUnauthorized });
  const session = useAdminSession({ onReady: data.fetchData, onSignedOut: data.reset });
  const filters = useApplicationFilters(data.applications, data.jobs);

  useEffect(() => {
    forceSignOutRef.current = session.forceSignOut;
  });

  const [activeTab, setActiveTab] = useState<Tab>("jobs");
  const [jobModal, setJobModal] = useState<{ open: boolean; job: Job | null }>({ open: false, job: null });
  const [showAreasManager, setShowAreasManager] = useState(false);

  const openEditModal = (job: Job) => {
    data.ensureArea(job.area);
    setJobModal({ open: true, job });
  };

  const handleExport = async () => {
    if (filters.filteredApplications.length === 0) {
      alert("No hay postulaciones para exportar con los filtros seleccionados.");
      return;
    }
    await exportApplicationsToExcel(filters.filteredApplications);
  };

  if (session.loadingAuth) return <LoadingScreen />;
  if (session.isRecovering) return <RecoveryScreen session={session} />;
  if (!session.isAuthenticated) {
    return session.forgotMode ? <ForgotPasswordScreen session={session} /> : <LoginScreen session={session} />;
  }
  if (session.mustChangePasswordOnLogin) return <FirstLoginPasswordScreen session={session} />;

  const appsCount = filters.hasActiveFilters
    ? `${filters.filteredApplications.length}/${data.applications.length}`
    : data.applications.length;

  const tabClass = (tab: Tab) =>
    `pb-4 text-sm font-bold transition-all relative ${
      activeTab === tab ? "text-brand-gold-dark" : "text-brand-navy/60 hover:text-brand-navy"
    }`;

  return (
    <div className="pt-36 md:pt-44 pb-16 bg-brand-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardHeader
          isRecruiter={data.isRecruiter}
          userEmail={session.currentUser?.email}
          onChangePassword={session.openChangePasswordModal}
          onLogout={session.handleLogout}
        />

        <div role="tablist" aria-label="Secciones del panel" className="flex border-b border-brand-gray/10 mb-8 gap-4">
          <button
            type="button"
            role="tab"
            id="tab-jobs"
            aria-selected={activeTab === "jobs"}
            aria-controls="panel-jobs"
            onClick={() => setActiveTab("jobs")}
            className={tabClass("jobs")}
          >
            Ofertas Publicadas ({data.jobs.length})
            {activeTab === "jobs" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold"></span>}
          </button>
          <button
            type="button"
            role="tab"
            id="tab-apps"
            aria-selected={activeTab === "apps"}
            aria-controls="panel-apps"
            onClick={() => setActiveTab("apps")}
            className={tabClass("apps")}
          >
            Postulaciones Recibidas ({appsCount})
            {activeTab === "apps" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold"></span>}
          </button>
        </div>

        <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
          {activeTab === "jobs" ? (
            <JobsPanel
              jobs={data.jobs}
              areasCount={data.areas.length}
              isRecruiter={data.isRecruiter}
              onManageAreas={() => setShowAreasManager(true)}
              onCreate={() => setJobModal({ open: true, job: null })}
              onEdit={openEditModal}
              onToggle={data.toggleJobStatus}
              onDelete={data.deleteJob}
            />
          ) : (
            <ApplicationsPanel
              applications={data.applications}
              filters={filters}
              isRecruiter={data.isRecruiter}
              onExport={handleExport}
              onOpenCv={data.openCv}
              onDelete={data.deleteApplication}
            />
          )}
        </div>
      </div>

      {jobModal.open && (
        <JobFormModal data={data} editingJob={jobModal.job} onClose={() => setJobModal({ open: false, job: null })} />
      )}
      {session.showChangePasswordModal && <ChangePasswordModal session={session} />}
      {showAreasManager && <AreasManagerModal data={data} onClose={() => setShowAreasManager(false)} />}
    </div>
  );
}
