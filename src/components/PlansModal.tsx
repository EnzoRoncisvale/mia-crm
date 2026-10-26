"use client";

import React from "react";
import { X, Check, Zap, Crown, Sparkles } from "lucide-react";
import { PLAN_TIERS } from "@/data/mockData";

interface PlansModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PlansModal({ isOpen, onClose }: PlansModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-zinc-200 shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-[#111111] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg"
          >
            <X size={20} />
          </button>

          <div className="text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFC107]/20 text-[#FFC107] text-xs font-bold mb-2">
              <Sparkles size={13} />
              <span>Planos & Assinaturas MIA CRM</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Mais tempo para o que realmente importa.
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              O sistema completo de gestão de clientes com Inteligência Artificial, criado para facilitar sua rotina.
            </p>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5 bg-zinc-50">
          {PLAN_TIERS.map((plan) => {
            const isProfessional = plan.id === "profissional";
            const isBusiness = plan.id === "business";

            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 border ${
                  isProfessional
                    ? "bg-[#FFF8E7] border-2 border-[#FFC107] shadow-lg relative -translate-y-1"
                    : isBusiness
                    ? "bg-[#111111] text-white border-zinc-800"
                    : "bg-white border-zinc-200"
                }`}
              >
                {/* Popular Pill */}
                {isProfessional && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFC107] text-black font-extrabold text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                    Mais Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3
                      className={`font-bold text-sm tracking-wide ${
                        isBusiness ? "text-[#FFC107]" : "text-zinc-900"
                      }`}
                    >
                      {plan.name}
                    </h3>
                    {isProfessional && (
                      <Crown size={16} className="text-[#FFC107]" />
                    )}
                  </div>

                  <p
                    className={`text-[11px] mb-4 min-h-[32px] ${
                      isBusiness ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    {plan.tagline}
                  </p>

                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-xs font-semibold">R$</span>
                    <span
                      className={`text-3xl font-extrabold tracking-tight ${
                        isBusiness ? "text-white" : "text-zinc-900"
                      }`}
                    >
                      {plan.price.toFixed(2).replace(".", ",")}
                    </span>
                    <span
                      className={`text-xs ${
                        isBusiness ? "text-zinc-400" : "text-zinc-500"
                      }`}
                    >
                      {plan.period}
                    </span>
                  </div>

                  {/* Highlights */}
                  <div
                    className={`p-2.5 rounded-xl mb-4 text-xs font-medium space-y-1 ${
                      isBusiness
                        ? "bg-white/10 text-zinc-200"
                        : "bg-black/5 text-zinc-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Equipe:</span>
                      <span className="font-bold">
                        {plan.usersLimit === 1
                          ? "1 usuário"
                          : `Até ${plan.usersLimit} usuários`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Contatos ativos:</span>
                      <span className="font-bold">
                        Até {plan.contactsLimit.toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#FFC107]">
                      <span className="flex items-center gap-1 font-semibold">
                        <Zap size={11} /> Créditos de IA:
                      </span>
                      <span className="font-bold">
                        {plan.aiCreditsLimit}/mês
                      </span>
                    </div>
                  </div>

                  {/* Feature checklist */}
                  <ul className="space-y-2 mb-6 text-[11px]">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check
                          size={14}
                          className={`shrink-0 mt-0.5 ${
                            isBusiness || isProfessional
                              ? "text-[#FFC107]"
                              : "text-emerald-600"
                          }`}
                        />
                        <span
                          className={
                            isBusiness ? "text-zinc-300" : "text-zinc-700"
                          }
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={onClose}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                    isProfessional
                      ? "bg-[#FFC107] hover:bg-[#E5AC06] text-black shadow-md"
                      : isBusiness
                      ? "bg-[#FFC107] hover:bg-[#E5AC06] text-black"
                      : "bg-[#111111] hover:bg-black text-white"
                  }`}
                >
                  {isProfessional ? "Plano Atual (Profissional)" : `Escolher ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
