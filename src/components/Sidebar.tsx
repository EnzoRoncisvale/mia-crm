"use client";

import React from "react";
import {
  LayoutDashboard,
  Users,
  Target,
  Calendar,
  Sparkles,
  CheckSquare,
  GitBranch,
  DollarSign,
  FileText,
  MessageCircle,
  BarChart3,
  UserCheck,
  Settings,
  X,
  Crown,
  Shield,
} from "lucide-react";
import { NicheConfig, UserRole, USER_ROLES } from "@/types/crm";

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  currentNiche: NicheConfig;
  onOpenPlans: () => void;
  currentRole?: UserRole;
}

export const MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "clientes", label: "Clientes", icon: Users },
  { id: "leads", label: "Leads & Vendas", icon: Target },
  { id: "propostas", label: "Propostas & Orçamentos", icon: FileText, badge: "Novo" },
  { id: "agenda", label: "Agenda", icon: Calendar },
  { id: "servicos", label: "Catálogo Serviços", icon: Sparkles },
  { id: "tarefas", label: "Tarefas", icon: CheckSquare },
  { id: "processos", label: "Processos & Checklists", icon: GitBranch },
  { id: "financeiro", label: "Financeiro & Caixa", icon: DollarSign },
  { id: "documentos", label: "Documentos & LGPD", icon: FileText },
  { id: "comunicacoes", label: "Comunicações", icon: MessageCircle },
  { id: "relatorios", label: "Relatórios", icon: BarChart3 },
  { id: "equipe", label: "Equipe (RBAC)", icon: UserCheck },
  { id: "configuracoes", label: "Configurações", icon: Settings },
];

export default function Sidebar({
  activeModule,
  setActiveModule,
  isOpenMobile,
  setIsOpenMobile,
  currentNiche,
  onOpenPlans,
  currentRole = "admin_empresa",
}: SidebarProps) {
  const allowed = USER_ROLES[currentRole]?.allowedModules || [];

  return (
    <>
      {/* Overlay Mobile */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#111111] text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Logo MIA */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFC107] flex items-center justify-center font-bold text-black text-xl shadow-md shadow-[#FFC107]/20">
              🐝
            </div>
            <div>
              <div className="flex items-center gap-1 font-bold text-xl tracking-tight leading-none">
                <span>M</span>
                <span className="text-[#FFC107]">i</span>
                <span>A</span>
              </div>
              <span className="text-[10px] tracking-widest text-zinc-400 font-medium uppercase">
                CRM Inteligente
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsOpenMobile(false)}
            className="lg:hidden text-zinc-400 hover:text-white p-1 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Niche & Role Status */}
        <div className="px-4 py-2.5 bg-white/5 border-b border-white/5 flex flex-col gap-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Nicho:</span>
            <span className="font-medium text-[#FFC107] bg-[#FFC107]/10 px-2 py-0.5 rounded-full border border-[#FFC107]/30 truncate max-w-[140px]">
              {currentNiche.name}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-500">Perfil RBAC:</span>
            <span className="text-zinc-300 font-semibold">{USER_ROLES[currentRole].label}</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            const isPermitted = allowed.includes(item.id);

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (isPermitted) {
                    setActiveModule(item.id);
                    setIsOpenMobile(false);
                  } else {
                    alert(
                      `Acesso Restrito: Seu perfil atual (${USER_ROLES[currentRole].label}) não possui permissão para acessar o módulo ${item.label}.`
                    );
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-[#FFC107] text-[#111111] font-bold shadow-sm"
                    : isPermitted
                    ? "text-zinc-300 hover:text-white hover:bg-white/10"
                    : "text-zinc-600 opacity-40 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    size={16}
                    className={isActive ? "text-[#111111]" : isPermitted ? "text-zinc-400" : "text-zinc-600"}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && isPermitted && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? "bg-black/15 text-black"
                        : "bg-white/10 text-[#FFC107]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Upgrade Plan Card / CTA */}
        <div className="p-3 border-t border-white/10 bg-gradient-to-b from-[#1a1a1a] to-[#111111]">
          <div className="p-3 rounded-xl bg-white/5 border border-[#FFC107]/30 text-left">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-[#FFC107] flex items-center gap-1">
                <Crown size={14} /> Plano Profissional
              </span>
              <span className="text-[10px] text-zinc-400 bg-black/40 px-1.5 py-0.5 rounded">
                Ativo
              </span>
            </div>
            <p className="text-[11px] text-zinc-300 mb-2.5">
              Multi-tenant, 15 nichos e assistente IA integrados.
            </p>
            <button
              onClick={onOpenPlans}
              className="w-full py-1.5 bg-[#FFC107] hover:bg-[#E5AC06] text-black font-bold text-xs rounded-lg transition-colors text-center"
            >
              Ver Planos & Cotas
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
