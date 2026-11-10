"use client";

import React, { useState } from "react";
import { Lock, Mail, User, CheckCircle2, AlertCircle, X, ArrowRight, ShieldCheck } from "lucide-react";
import { useClientAuth } from "@/context/ClientAuthContext";

interface ClientAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  serviceTitle?: string;
}

export default function ClientAuthModal({
  isOpen,
  onClose,
  onSuccess,
  serviceTitle,
}: ClientAuthModalProps) {
  const { login, register } = useClientAuth();
  const [mode, setMode] = useState<"login" | "register">("register");

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    if (mode === "login") {
      const res = login(email, password);
      setIsSubmitting(false);
      if (res.success) {
        onSuccess();
      } else {
        setErrorMsg(res.error || "Erro ao autenticar.");
      }
    } else {
      const res = register(name, email, password, confirmPassword);
      setIsSubmitting(false);
      if (res.success) {
        onSuccess();
      } else {
        setErrorMsg(res.error || "Erro ao criar conta.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-zinc-100 space-y-4 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-[#FFF8E7] text-[#FFC107] flex items-center justify-center font-bold">
              <Lock className="w-4 h-4 text-[#FFC107]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-zinc-900">
                {mode === "register" ? "Criar Conta de Paciente" : "Entrar na sua Conta"}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {serviceTitle ? `Para agendar: ${serviceTitle}` : "Identificação rápida para agendamentos"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-800 p-1 rounded-xl"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Alternador de Modo: Login / Cadastro */}
        <div className="flex p-1 bg-zinc-100 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === "register"
                ? "bg-white text-zinc-950 shadow-xs"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Primeira Vez (Cadastrar)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === "login"
                ? "bg-white text-zinc-950 shadow-xs"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Já tenho conta (Entrar)
          </button>
        </div>

        {/* Mensagem de Erro */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-red-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {mode === "register" && (
            <div>
              <label className="block font-extrabold text-zinc-800 mb-1">
                Nome Completo *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Beatriz Lima Ramos"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-extrabold text-zinc-800 mb-1">
              E-mail *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
              />
            </div>
          </div>

          <div>
            <label className="block font-extrabold text-zinc-800 mb-1">
              Senha {mode === "register" && "(mínimo 6 dígitos)"} *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
              />
            </div>
          </div>

          {mode === "register" && (
            <div>
              <label className="block font-extrabold text-zinc-800 mb-1">
                Confirmação de Senha *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#FFC107] hover:bg-[#ffb300] text-black font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Verificando...</span>
              ) : mode === "register" ? (
                <>
                  <span>Criar Cadastro & Continuar</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </>
              ) : (
                <>
                  <span>Entrar & Continuar</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-zinc-100 text-[11px] text-zinc-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Seus dados estão protegidos pela política de privacidade e LGPD</span>
        </div>
      </div>
    </div>
  );
}
