"use client";

import React, { useState } from "react";
import {
  Users,
  ShieldCheck,
  Plus,
  Mail,
  Phone,
  CheckCircle2,
  Lock,
  UserCheck,
  Search,
  Sparkles,
} from "lucide-react";
import { NicheConfig, UserRole, USER_ROLES } from "@/types/crm";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: "ativo" | "convidado" | "inativo";
  avatarInitials: string;
}

const INITIAL_TEAM: TeamMember[] = [
  {
    id: "tm-1",
    name: "Thayná Administradora",
    email: "thayna@miacrm.com.br",
    phone: "(11) 98111-2233",
    role: "admin_empresa",
    status: "ativo",
    avatarInitials: "TA",
  },
  {
    id: "tm-2",
    name: "Carlos Gerente",
    email: "carlos@miacrm.com.br",
    phone: "(11) 98222-3344",
    role: "gerente",
    status: "ativo",
    avatarInitials: "CG",
  },
  {
    id: "tm-3",
    name: "Juliana Atendente",
    email: "juliana@miacrm.com.br",
    phone: "(11) 98333-4455",
    role: "atendente",
    status: "ativo",
    avatarInitials: "JA",
  },
  {
    id: "tm-4",
    name: "Lucas Comercial",
    email: "lucas@miacrm.com.br",
    phone: "(11) 98444-5566",
    role: "comercial",
    status: "ativo",
    avatarInitials: "LC",
  },
];

interface TeamRBACModuleProps {
  currentNiche: NicheConfig;
  currentRole: UserRole;
}

export default function TeamRBACModule({ currentNiche, currentRole }: TeamRBACModuleProps) {
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("atendente");

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const initials = newName
      .split(" ")
      .map((p) => p[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    const created: TeamMember = {
      id: `tm-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim() || "(11) 90000-0000",
      role: newRole,
      status: "ativo",
      avatarInitials: initials || "MB",
    };

    setTeam((prev) => [created, ...prev]);
    setIsModalOpen(false);
    setNewName("");
    setNewEmail("");
    setNewPhone("");
  };

  const filteredTeam = team.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8E7] text-[#111111] border border-[#FFC107]/40 text-xs font-bold mb-2">
            <ShieldCheck size={13} className="text-[#FFC107]" />
            <span>Segurança & Permissões · {currentNiche.name}</span>
          </div>
          <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">
            Gestão de Equipe & Níveis de Acesso (RBAC)
          </h2>
          <p className="text-xs text-zinc-500">
            Cadastre atendentes, vendedores e gerentes controlando as rotas e visualizações permitidas.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#FFC107] hover:bg-[#E5AC06] text-black font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-auto"
        >
          <Plus size={15} />
          <span>Convidar Colaborador</span>
        </button>
      </div>

      {/* Grid de Membros */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
          <div className="relative max-w-sm flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar colaborador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
            />
          </div>

          <span className="text-xs text-zinc-500 font-semibold">
            {filteredTeam.length} membros na equipe
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTeam.map((member) => {
            const roleInfo = USER_ROLES[member.role];
            return (
              <div
                key={member.id}
                className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/60 hover:bg-white hover:border-[#FFC107]/60 transition-all shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#111111] text-[#FFC107] font-extrabold text-xs flex items-center justify-center shrink-0">
                      {member.avatarInitials}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-zinc-900">{member.name}</h4>
                      <p className="text-[11px] text-zinc-500">{member.email}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#FFF8E7] text-amber-900 border border-[#FFC107]/30 shrink-0">
                    {roleInfo.label}
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-zinc-100 text-[11px] text-zinc-600">
                  <span className="font-bold text-zinc-800">Escopo de Permissão:</span>{" "}
                  {roleInfo.description}
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-100">
                  <span className="flex items-center gap-1">
                    <Phone size={11} /> {member.phone}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <CheckCircle2 size={12} /> Ativo no Sistema
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Convidar Colaborador */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full border border-zinc-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="font-bold text-sm text-zinc-900">Adicionar Membro à Equipe</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-black p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Letícia Lima"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">E-mail de Acesso *</label>
                <input
                  type="email"
                  required
                  placeholder="leticia@empresa.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">WhatsApp / Telefone</label>
                <input
                  type="text"
                  placeholder="(11) 98888-7777"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Nível de Acesso (Cargo) *</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                >
                  <option value="atendente">Atendente / Recepção</option>
                  <option value="comercial">Comercial / Vendas</option>
                  <option value="gerente">Gerente / Supervisor</option>
                  <option value="financeiro">Financeiro</option>
                  <option value="admin_empresa">Administrador da Empresa</option>
                </select>
              </div>

              <div className="flex gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 text-xs font-bold text-zinc-600 border border-zinc-200 rounded-xl hover:bg-zinc-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#FFC107] hover:bg-[#E5AC06] text-black text-xs font-bold rounded-xl transition-colors"
                >
                  Confirmar Acesso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
