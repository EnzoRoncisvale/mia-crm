"use client";

import React, { useState } from "react";
import {
  Search,
  Bell,
  Menu,
  Plus,
  ChevronDown,
  Layers,
  Sparkles,
  Calendar,
  UserPlus,
  CheckSquare,
  Shield,
  Bot,
} from "lucide-react";
import { NicheConfig, UserRole, USER_ROLES } from "@/types/crm";
import { NICHES } from "@/data/mockData";

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  currentNiche: NicheConfig;
  onSelectNiche: (niche: NicheConfig) => void;
  onOpenNewItem: (type: "agendamento" | "lead" | "cliente" | "tarefa") => void;
  onOpenMiaAssistant: () => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export default function Header({
  onOpenMobileSidebar,
  currentNiche,
  onSelectNiche,
  onOpenNewItem,
  onOpenMiaAssistant,
  currentRole,
  onSelectRole,
}: HeaderProps) {
  const [showNicheDropdown, setShowNicheDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNewDropdown, setShowNewDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-zinc-200/80 px-4 md:px-6 flex items-center justify-between shadow-xs">
      {/* Left: Mobile hamburger + Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-zinc-700 hover:bg-zinc-100 transition-colors"
          aria-label="Abrir Menu"
        >
          <Menu size={22} />
        </button>

        <div className="relative w-full max-w-md hidden sm:block">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="text"
            placeholder="Buscar clientes, serviços, processos, financeiro..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#FFC107] focus:bg-white transition-all placeholder:text-zinc-400"
          />
        </div>
      </div>

      {/* Right: Role Switcher, Niche Switcher, Quick New, Assistant */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Switcher (RBAC - Seção 2.2) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-100 text-zinc-800 rounded-xl hover:bg-zinc-200 transition-colors"
            title="Alternar Papel de Usuário (RBAC)"
          >
            <Shield size={13} className="text-zinc-600" />
            <span className="hidden xl:inline font-normal text-zinc-500">Perfil:</span>
            <span className="font-bold">{USER_ROLES[currentRole].label}</span>
            <ChevronDown size={13} className="text-zinc-500" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-zinc-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 border-b border-zinc-100 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Níveis de Acesso (RBAC)
              </div>
              {Object.values(USER_ROLES).map((roleInfo) => (
                <button
                  key={roleInfo.role}
                  onClick={() => {
                    onSelectRole(roleInfo.role);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex flex-col hover:bg-zinc-50 transition-colors ${
                    roleInfo.role === currentRole ? "bg-[#FFF8E7] font-bold text-black" : "text-zinc-700"
                  }`}
                >
                  <span className="font-bold">{roleInfo.label}</span>
                  <span className="text-[10px] text-zinc-400">{roleInfo.description}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Niche Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNicheDropdown(!showNicheDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-[#FFF8E7] text-zinc-800 border border-[#FFC107]/40 rounded-xl hover:bg-[#FFC107]/20 transition-colors shadow-2xs"
            title="Alternar Nicho de Atuação"
          >
            <Layers size={14} className="text-[#FFC107]" />
            <span className="hidden md:inline font-medium text-zinc-500">Nicho:</span>
            <span className="font-semibold">{currentNiche.name}</span>
            <ChevronDown size={14} className="text-zinc-500" />
          </button>

          {showNicheDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-zinc-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 max-h-96 overflow-y-auto">
              <div className="px-3 py-1.5 border-b border-zinc-100 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                15 Nichos de Atuação do MIA
              </div>
              {NICHES.map((niche) => (
                <button
                  key={niche.id}
                  onClick={() => {
                    onSelectNiche(niche);
                    setShowNicheDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-zinc-50 transition-colors ${
                    niche.id === currentNiche.id
                      ? "bg-[#FFF8E7] font-semibold text-black"
                      : "text-zinc-600"
                  }`}
                >
                  <span>{niche.name}</span>
                  {niche.id === currentNiche.id && (
                    <span className="w-2 h-2 rounded-full bg-[#FFC107]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick New Button */}
        <div className="relative">
          <button
            onClick={() => setShowNewDropdown(!showNewDropdown)}
            className="flex items-center gap-1.5 bg-[#FFC107] hover:bg-[#E5AC06] text-[#111111] font-bold px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm shadow-sm transition-all active:scale-95"
          >
            <Plus size={16} className="stroke-[2.5]" />
            <span>Novo</span>
            <ChevronDown size={14} />
          </button>

          {showNewDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
              <button
                onClick={() => {
                  onOpenNewItem("agendamento");
                  setShowNewDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 text-zinc-700 hover:bg-zinc-50"
              >
                <Calendar size={15} className="text-[#FFC107]" />
                <span>Novo Agendamento</span>
              </button>
              <button
                onClick={() => {
                  onOpenNewItem("lead");
                  setShowNewDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 text-zinc-700 hover:bg-zinc-50"
              >
                <Sparkles size={15} className="text-[#FFC107]" />
                <span>Novo Lead</span>
              </button>
              <button
                onClick={() => {
                  onOpenNewItem("cliente");
                  setShowNewDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 text-zinc-700 hover:bg-zinc-50"
              >
                <UserPlus size={15} className="text-[#FFC107]" />
                <span>Cadastrar Cliente</span>
              </button>
              <button
                onClick={() => {
                  onOpenNewItem("tarefa");
                  setShowNewDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 text-zinc-700 hover:bg-zinc-50"
              >
                <CheckSquare size={15} className="text-[#FFC107]" />
                <span>Nova Tarefa</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
