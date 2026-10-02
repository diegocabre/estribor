"use client";

import { Loader2, Lock } from "lucide-react";
import type { AdminSession } from "../_hooks/useAdminSession";
import ModalShell from "./ModalShell";

const inputClass =
  "border border-brand-gray/20 rounded-lg px-3 py-2 text-xs bg-brand-bg/30 text-brand-navy focus:outline-none focus:border-brand-gold";
const labelClass = "text-[10px] font-bold text-brand-navy uppercase mb-1";

export default function ChangePasswordModal({ session }: { session: AdminSession }) {
  const close = () => session.setShowChangePasswordModal(false);

  return (
    <ModalShell
      labelledBy="change-password-title"
      onClose={close}
      className="bg-white rounded-3xl max-w-md w-full shadow-2xl relative border-t-8 border-brand-gold overflow-hidden"
    >
      <div className="p-8">
        <h2 id="change-password-title" className="text-2xl font-bold text-brand-navy mb-6 font-titles flex items-center gap-2">
          <Lock aria-hidden="true" className="h-6 w-6 text-brand-gold" />
          Cambiar Contraseña
        </h2>

        <form onSubmit={session.handleChangePasswordInternal} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="change-new" className={labelClass}>
              Nueva Contraseña *
            </label>
            <input
              id="change-new"
              type="password"
              required
              autoComplete="new-password"
              value={session.newPassword}
              onChange={(e) => session.setNewPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="change-confirm" className={labelClass}>
              Confirmar Nueva Contraseña *
            </label>
            <input
              id="change-confirm"
              type="password"
              required
              autoComplete="new-password"
              value={session.confirmNewPassword}
              onChange={(e) => session.setConfirmNewPassword(e.target.value)}
              placeholder="Repita la nueva contraseña"
              className={inputClass}
            />
          </div>

          {session.changePasswordErrorMsg && (
            <p role="alert" className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 p-2 rounded-lg text-center">
              {session.changePasswordErrorMsg}
            </p>
          )}

          {session.changePasswordSuccessMsg && (
            <p role="status" className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 p-2 rounded-lg text-center">
              {session.changePasswordSuccessMsg}
            </p>
          )}

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-brand-gray/10">
            <button
              type="button"
              onClick={close}
              className="px-4 py-2 border border-brand-gray/20 rounded-xl text-xs hover:bg-brand-bg text-brand-navy font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={session.actionLoading}
              className="bg-brand-navy hover:bg-brand-blue-med text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              {session.actionLoading ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </ModalShell>
  );
}
