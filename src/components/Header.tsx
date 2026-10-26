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
} from "lucide-react";
import { NicheConfig } from "@/types/crm";
import { NICHES } from "@/data/mockData";

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  currentNiche: NicheConfig;
  onSelectNiche: (niche: NicheConfig) => void;
  onOpenNewItem: (type: "agendamento" | "lead" | "cliente" | "tarefa") => void;
  onOpenMiaAssistant: () => void;
}

export default function Header({
  onOpenMobileSidebar,
  currentNiche,
  onSelectNiche,
  onOpenNewItem,
  onOpenMiaAssistant,
}: HeaderProps) {
  const [showNicheDropdown, setShowNicheDropdown] = useState(false);
  const [showNewDropdown, setShowNewDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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
            placeholder="Buscar clientes, leads, agendamentos, tarefas..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#FFC107] focus:bg-white transition-all placeholder:text-zinc-400"
          />
        </div>
      </div>

      {/* Right: Niche Switcher, Quick New, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Niche Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNicheDropdown(!showNicheDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-[#FFF8E7] text-zinc-800 border border-[#FFC107]/40 rounded-xl hover:bg-[#FFC107]/20 transition-colors shadow-2xs"
            title="Alternar Nicho de Atuação"
          >
            <Layers size={14} className="text-[#FFC107]" />
            <span className="hidden md:inline font-medium text-zinc-500">
              Nicho:
            </span>
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
            className="flex items-center gap-1.5 bg-[#FFC107] hover:bg-[#E5AC06] text-[#111111] font-semibold px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm shadow-sm transition-all active:scale-95"
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
                <span>Criar Tarefa</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-zinc-600 hover:bg-zinc-100 transition-colors"
            aria-label="Notificações"
          >
            <Bell size={19} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FFC107] ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-zinc-200 rounded-2xl shadow-xl p-3 z-50 text-xs animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100 mb-2 font-semibold">
                <span>Notificações Recentes</span>
                <span className="text-[10px] text-[#FFC107] font-bold">
                  3 novas
                </span>
              </div>
              <div className="space-y-2 text-zinc-600">
                <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                  <p className="font-semibold text-zinc-900">Novo Lead via WhatsApp</p>
                  <p className="text-[11px] text-zinc-500">
                    Beatriz Oliveira enviou uma mensagem há 12 min.
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                  <p className="font-semibold text-zinc-900">Próximo Agendamento</p>
                  <p className="text-[11px] text-zinc-500">
                    Ana Maria Silva às 09:00 (Alongamento de Unhas).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-zinc-200">
          <div className="w-8 h-8 rounded-full bg-[#111111] text-[#FFC107] flex items-center justify-center font-bold text-xs ring-2 ring-[#FFC107]/30">
            TO
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-zinc-900 leading-tight">
              Thayná Oliveira
            </div>
            <div className="text-[10px] text-zinc-500 font-medium">
              Administradora
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
