"use client";

import Link from "next/link";
import { Lock, LogOut, ShieldCheck, UserCheck } from "lucide-react";

interface DashboardHeaderProps {
  isRecruiter: boolean;
  userEmail?: string;
  onChangePassword: () => void;
  onLogout: () => void;
}

export default function DashboardHeader({ isRecruiter, userEmail, onChangePassword, onLogout }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-brand-gray/10 pb-6 mb-8">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl font-extrabold text-brand-navy font-titles">Panel de Control</h1>
          {isRecruiter ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <UserCheck aria-hidden="true" className="h-3.5 w-3.5 text-amber-600" />
              Reclutamiento y Selección
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 text-emerald-600" />
              Administrador General
            </span>
          )}
        </div>
        <p className="text-xs text-brand-gray-dark font-light mt-1">
          {isRecruiter
            ? `Sesión iniciada como ${userEmail || "Reclutador"} — Permisos: Creación de vacantes y revisión de candidatos.`
            : `Gestión administrativa de ofertas de empleo y selección de personal.`}
        </p>
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
          type="button"
          onClick={onChangePassword}
          className="px-4 py-2.5 border border-brand-navy text-brand-navy hover:bg-brand-bg rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <Lock aria-hidden="true" className="h-4 w-4" />
          Cambiar Clave
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="px-4 py-2.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <LogOut aria-hidden="true" className="h-4 w-4" />
          Salir
        </button>
      </div>
    </div>
  );
}
