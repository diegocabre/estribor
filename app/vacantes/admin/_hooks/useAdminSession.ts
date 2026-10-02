"use client";

import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { errorMessage } from "../_lib/admin-api";

interface SessionCallbacks {
  /** Se llama cuando hay una sesión lista para cargar datos. */
  onReady: () => void;
  /** Se llama al cerrar sesión, para limpiar los datos del panel. */
  onSignedOut: () => void;
}

const mustChange = (user: User | null) => user?.user_metadata?.must_change_password === true;

/** Estado y acciones de Supabase Auth del panel: login, recuperación y cambios de contraseña. */
export function useAdminSession({ onReady, onSignedOut }: SessionCallbacks) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mustChangePasswordOnLogin, setMustChangePasswordOnLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Recuperación de contraseña
  const [forgotMode, setForgotMode] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoverySuccessMsg, setRecoverySuccessMsg] = useState("");
  const [isRecovering, setIsRecovering] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Cambio de contraseña dentro del panel
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [changePasswordSuccessMsg, setChangePasswordSuccessMsg] = useState("");
  const [changePasswordErrorMsg, setChangePasswordErrorMsg] = useState("");

  // Los callbacks cambian en cada render; la suscripción se crea una sola vez.
  const callbacks = useRef({ onReady, onSignedOut });
  useEffect(() => {
    callbacks.current = { onReady, onSignedOut };
  });

  useEffect(() => {
    const applySession = (user: User | null) => {
      setIsAuthenticated(!!user);
      setCurrentUser(user);
      setMustChangePasswordOnLogin(mustChange(user));
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      applySession(session?.user ?? null);
      setLoadingAuth(false);
      if (session) callbacks.current.onReady();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") setIsRecovering(true);
      applySession(session?.user ?? null);
      if (session) callbacks.current.onReady();
    });

    return () => subscription.unsubscribe();
  }, []);

  const clearPasswords = () => {
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        setErrorMsg("Tu cuenta fue registrada pero requiere confirmación de correo.");
      } else {
        setErrorMsg("Credenciales inválidas. Por favor verifique.");
      }
    } else {
      setIsAuthenticated(true);
      setCurrentUser(data.user);
      if (mustChange(data.user)) {
        setMustChangePasswordOnLogin(true);
      } else {
        setMustChangePasswordOnLogin(false);
        callbacks.current.onReady();
      }
    }
    setActionLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setMustChangePasswordOnLogin(false);
    setEmail("");
    setPassword("");
    clearPasswords();
    callbacks.current.onSignedOut();
  };

  /** Cierra la sesión mostrando un motivo en el login (p. ej. cuenta sin rol de staff). */
  const forceSignOut = async (reason: string) => {
    await handleLogout();
    setErrorMsg(reason);
  };

  const validateNewPassword = (setError: (msg: string) => void) => {
    if (newPassword !== confirmNewPassword) {
      setError("Las contraseñas no coinciden.");
      return false;
    }
    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }
    return true;
  };

  const handleFirstLoginPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateNewPassword(setErrorMsg)) return;
    if (newPassword === "Password.123") {
      setErrorMsg("Por seguridad, debes elegir una contraseña distinta a la provisional.");
      return;
    }

    setActionLoading(true);
    setErrorMsg("");
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
        data: {
          ...currentUser?.user_metadata,
          must_change_password: false,
          password_updated_at: new Date().toISOString(),
        },
      });
      if (error) throw error;

      setCurrentUser(data.user);
      setMustChangePasswordOnLogin(false);
      clearPasswords();
      alert("¡Contraseña actualizada exitosamente! Bienvenida al panel de control.");
      callbacks.current.onReady();
    } catch (err) {
      setErrorMsg(errorMessage(err) || "Error al actualizar la contraseña.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg("");
    setRecoverySuccessMsg("");

    const { error } = await supabase.auth.resetPasswordForEmail(recoveryEmail, {
      redirectTo: `${window.location.origin}/vacantes/admin`,
    });

    // Mismo mensaje exista o no la cuenta: no revela qué correos están registrados.
    if (error) {
      setErrorMsg("No se pudo enviar el correo de recuperación. Intenta nuevamente en unos minutos.");
    } else {
      setRecoverySuccessMsg("Si el correo está registrado, recibirás un enlace de recuperación en tu bandeja de entrada.");
    }
    setActionLoading(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateNewPassword(setErrorMsg)) return;
    setActionLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setErrorMsg(error.message || "Error al actualizar la contraseña.");
    } else {
      alert("Contraseña restablecida con éxito. Por favor inicia sesión con tu nueva contraseña.");
      await supabase.auth.signOut();
      setIsRecovering(false);
      setIsAuthenticated(false);
      clearPasswords();
      setEmail("");
      setPassword("");
    }
    setActionLoading(false);
  };

  const openChangePasswordModal = () => {
    setChangePasswordErrorMsg("");
    setChangePasswordSuccessMsg("");
    clearPasswords();
    setShowChangePasswordModal(true);
  };

  const handleChangePasswordInternal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateNewPassword(setChangePasswordErrorMsg)) return;
    setActionLoading(true);
    setChangePasswordErrorMsg("");
    setChangePasswordSuccessMsg("");

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setChangePasswordErrorMsg(error.message || "Error al actualizar la contraseña.");
    } else {
      setChangePasswordSuccessMsg("Contraseña actualizada con éxito.");
      clearPasswords();
      setTimeout(() => {
        setShowChangePasswordModal(false);
        setChangePasswordSuccessMsg("");
      }, 2000);
    }
    setActionLoading(false);
  };

  const showForgotMode = (value: boolean) => {
    setForgotMode(value);
    setErrorMsg("");
    setRecoverySuccessMsg("");
  };

  return {
    isAuthenticated,
    currentUser,
    mustChangePasswordOnLogin,
    loadingAuth,
    actionLoading,
    errorMsg,
    isRecovering,
    forgotMode,
    showForgotMode,
    email,
    setEmail,
    password,
    setPassword,
    recoveryEmail,
    setRecoveryEmail,
    recoverySuccessMsg,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    showChangePasswordModal,
    setShowChangePasswordModal,
    changePasswordSuccessMsg,
    changePasswordErrorMsg,
    handleLogin,
    handleLogout,
    forceSignOut,
    handleFirstLoginPasswordChange,
    handleForgotPassword,
    handleUpdatePassword,
    openChangePasswordModal,
    handleChangePasswordInternal,
  };
}

export type AdminSession = ReturnType<typeof useAdminSession>;
