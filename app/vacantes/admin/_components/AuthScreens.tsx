"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { KeyRound, Loader2, Lock, ShieldCheck } from "lucide-react";
import type { AdminSession } from "../_hooks/useAdminSession";

const inputClass =
  "w-full px-4 py-2.5 border border-brand-gray/20 rounded-xl bg-brand-bg/50 text-brand-navy text-xs focus:outline-none focus:border-brand-gold transition-colors";
const labelClass = "text-[10px] font-bold text-brand-navy uppercase mb-1.5";
const submitClass =
  "w-full bg-brand-navy hover:bg-brand-blue-med disabled:bg-brand-navy/60 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5";
const secondaryClass = "w-full text-center text-xs font-semibold text-brand-navy/60 hover:text-brand-navy transition-colors mt-2";

export function LoadingScreen() {
  return (
    <div className="pt-32 pb-24 flex items-center justify-center min-h-screen bg-brand-bg" role="status">
      <Loader2 aria-hidden="true" className="h-10 w-10 text-brand-gold animate-spin" />
      <span className="sr-only">Cargando panel</span>
    </div>
  );
}

function AuthCard({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <div className="pt-32 pb-24 flex items-center justify-center min-h-screen bg-brand-bg px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-brand-gray/10 p-8 rounded-3xl shadow-xl max-w-md w-full text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-gold"></div>
        {icon ?? (
          <div className="w-12 h-12 rounded-xl bg-brand-navy/5 text-brand-navy flex items-center justify-center mx-auto mb-6">
            <Lock aria-hidden="true" className="h-6 w-6" />
          </div>
        )}
        {children}
      </motion.div>
    </div>
  );
}

function Message({ tone, children, className = "p-2 rounded-lg" }: { tone: "error" | "success"; children: ReactNode; className?: string }) {
  return tone === "error" ? (
    <p role="alert" className={`text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 text-center ${className}`}>
      {children}
    </p>
  ) : (
    <p role="status" className={`text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 text-center ${className}`}>
      {children}
    </p>
  );
}

function PasswordFields({ session, idPrefix, required = "" }: { session: AdminSession; idPrefix: string; required?: string }) {
  return (
    <>
      <div className="flex flex-col">
        <label htmlFor={`${idPrefix}-new`} className={labelClass}>
          Nueva Contraseña{required}
        </label>
        <input
          id={`${idPrefix}-new`}
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
        <label htmlFor={`${idPrefix}-confirm`} className={labelClass}>
          Confirmar Nueva Contraseña{required}
        </label>
        <input
          id={`${idPrefix}-confirm`}
          type="password"
          required
          autoComplete="new-password"
          value={session.confirmNewPassword}
          onChange={(e) => session.setConfirmNewPassword(e.target.value)}
          placeholder={required ? "Repite la nueva contraseña" : "Repite la contraseña"}
          className={inputClass}
        />
      </div>
    </>
  );
}

export function RecoveryScreen({ session }: { session: AdminSession }) {
  return (
    <AuthCard>
      <h1 className="text-xl font-bold text-brand-navy mb-2 font-titles">Establecer Nueva Contraseña</h1>
      <p className="text-xs text-brand-gray-dark font-light mb-6">Por favor ingresa tu nueva contraseña corporativa.</p>

      <form onSubmit={session.handleUpdatePassword} className="space-y-4 text-left">
        <PasswordFields session={session} idPrefix="recovery" />
        {session.errorMsg && <Message tone="error">{session.errorMsg}</Message>}
        <button type="submit" disabled={session.actionLoading} className={submitClass}>
          {session.actionLoading ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
          Actualizar Contraseña
        </button>
      </form>
    </AuthCard>
  );
}

export function ForgotPasswordScreen({ session }: { session: AdminSession }) {
  return (
    <AuthCard>
      <h1 className="text-xl font-bold text-brand-navy mb-2 font-titles">Recuperar Contraseña</h1>
      <p className="text-xs text-brand-gray-dark font-light mb-6">
        Ingresa tu correo corporativo y te enviaremos un enlace para restablecer tu contraseña.
      </p>

      <form onSubmit={session.handleForgotPassword} className="space-y-4 text-left">
        <div className="flex flex-col">
          <label htmlFor="recovery-email" className={labelClass}>
            Correo Electrónico
          </label>
          <input
            id="recovery-email"
            type="email"
            required
            autoComplete="email"
            value={session.recoveryEmail}
            onChange={(e) => session.setRecoveryEmail(e.target.value)}
            placeholder="consultor@estribor.cl"
            className={inputClass}
          />
        </div>

        {session.errorMsg && <Message tone="error">{session.errorMsg}</Message>}
        {session.recoverySuccessMsg && <Message tone="success">{session.recoverySuccessMsg}</Message>}

        <button type="submit" disabled={session.actionLoading} className={submitClass}>
          {session.actionLoading ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
          Enviar Enlace de Recuperación
        </button>

        <button type="button" onClick={() => session.showForgotMode(false)} className={secondaryClass}>
          Volver al Inicio de Sesión
        </button>
      </form>
    </AuthCard>
  );
}

export function LoginScreen({ session }: { session: AdminSession }) {
  return (
    <AuthCard>
      <h1 className="text-xl font-bold text-brand-navy mb-2 font-titles">Administración Estribor</h1>
      <p className="text-xs text-brand-gray-dark font-light mb-6">
        Inicia sesión con tu correo y contraseña corporativa para acceder a la base de datos de vacantes y postulantes
        (JWT Secure).
      </p>

      <form onSubmit={session.handleLogin} className="space-y-4 text-left">
        <div className="flex flex-col">
          <label htmlFor="login-email" className={labelClass}>
            Correo Electrónico
          </label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="username"
            value={session.email}
            onChange={(e) => session.setEmail(e.target.value)}
            placeholder="consultor@estribor.cl"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="login-password" className="text-[10px] font-bold text-brand-navy uppercase">
              Contraseña
            </label>
            <button
              type="button"
              onClick={() => session.showForgotMode(true)}
              className="text-[10px] font-semibold text-brand-gold-dark hover:text-brand-navy transition-colors"
            >
              ¿Olvidó su contraseña?
            </button>
          </div>
          <input
            id="login-password"
            type="password"
            required
            autoComplete="current-password"
            value={session.password}
            onChange={(e) => session.setPassword(e.target.value)}
            placeholder="••••••••"
            className={inputClass}
          />
        </div>

        {session.errorMsg && <Message tone="error">{session.errorMsg}</Message>}

        <button type="submit" disabled={session.actionLoading} className={submitClass}>
          {session.actionLoading ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
          Ingresar al Panel
        </button>
      </form>
    </AuthCard>
  );
}

export function FirstLoginPasswordScreen({ session }: { session: AdminSession }) {
  const user = session.currentUser;
  return (
    <AuthCard
      icon={
        <>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-brand-gold flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <KeyRound aria-hidden="true" className="h-7 w-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 mb-3">
            <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
            Primer Inicio de Sesión
          </div>
        </>
      }
    >
      <h1 className="text-xl font-bold text-brand-navy mb-2 font-titles">Actualiza tu Contraseña</h1>
      <p className="text-xs text-brand-gray-dark font-light mb-6">
        Hola <strong className="text-brand-navy">{user?.user_metadata?.full_name || user?.email}</strong>. Por motivos
        de seguridad corporativa, debes cambiar tu contraseña provisional antes de acceder al panel de administración.
      </p>

      <form onSubmit={session.handleFirstLoginPasswordChange} className="space-y-4 text-left">
        <PasswordFields session={session} idPrefix="first-login" required=" *" />
        {session.errorMsg && (
          <Message tone="error" className="p-2.5 rounded-xl">
            {session.errorMsg}
          </Message>
        )}
        <button type="submit" disabled={session.actionLoading} className={submitClass}>
          {session.actionLoading ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
          Actualizar Contraseña e Ingresar
        </button>
        <button type="button" onClick={session.handleLogout} className={secondaryClass}>
          Cerrar Sesión
        </button>
      </form>
    </AuthCard>
  );
}
