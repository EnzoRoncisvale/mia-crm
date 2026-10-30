"use client";

import React, { useState } from "react";
import {
  Plus,
  LayoutGrid,
  List,
  Search,
  DollarSign,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  Phone,
  Filter,
} from "lucide-react";
import { Lead, NicheConfig } from "@/types/crm";

interface LeadsKanbanModuleProps {
  leads: Lead[];
  currentNiche: NicheConfig;
  onOpenNewLead: () => void;
  onUpdateLeadStatus: (leadId: string, nextStatus: Lead["status"]) => void;
  onWhatsAppLead?: (lead: Lead) => void;
}

export type KanbanColumnId = "novo" | "contato_feito" | "em_negociacao" | "proposta" | "convertido" | "perdido";

interface ColumnDef {
  id: KanbanColumnId;
  title: string;
  badgeColor: string;
  headerBorder: string;
}

const COLUMNS: ColumnDef[] = [
  {
    id: "novo",
    title: "Novos Leads",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    headerBorder: "border-t-blue-500",
  },
  {
    id: "contato_feito",
    title: "Primeiro Contato",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    headerBorder: "border-t-purple-500",
  },
  {
    id: "em_negociacao",
    title: "Em Negociação",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    headerBorder: "border-t-[#FFC107]",
  },
  {
    id: "proposta",
    title: "Proposta Enviada",
    badgeColor: "bg-orange-100 text-orange-800 border-orange-200",
    headerBorder: "border-t-orange-500",
  },
  {
    id: "convertido",
    title: "Ganha / Fechado",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    headerBorder: "border-t-emerald-500",
  },
  {
    id: "perdido",
    title: "Perdido",
    badgeColor: "bg-zinc-100 text-zinc-600 border-zinc-200",
    headerBorder: "border-t-zinc-400",
  },
];

export default function LeadsKanbanModule({
  leads,
  currentNiche,
  onOpenNewLead,
  onUpdateLeadStatus,
  onWhatsAppLead,
}: LeadsKanbanModuleProps) {
  const [viewMode, setViewMode] = useState<"kanban" | "lista">("kanban");
  const [searchTerm, setSearchTerm] = useState("");
  const [channelFilter, setChannelFilter] = useState<"todos" | "whatsapp" | "instagram">("todos");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Filtragem
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel =
      channelFilter === "todos" || lead.channel === channelFilter;
    return matchesSearch && matchesChannel;
  });

  // Métricas do Funil
  const totalLeads = leads.length;
  const totalGanhos = leads.filter((l) => l.status === "convertido").length;
  const taxaConversao = totalLeads > 0 ? Math.round((totalGanhos / totalLeads) * 100) : 0;
  const valorPipeline = leads
    .filter((l) => l.status !== "perdido")
    .reduce((acc, curr) => acc + (curr.value || 150), 0);

  // Mover etapa
  const moveNext = (lead: Lead) => {
    const currentIndex = COLUMNS.findIndex((c) => c.id === lead.status);
    if (currentIndex >= 0 && currentIndex < COLUMNS.length - 1) {
      onUpdateLeadStatus(lead.id, COLUMNS[currentIndex + 1].id);
    }
  };

  const movePrev = (lead: Lead) => {
    const currentIndex = COLUMNS.findIndex((c) => c.id === lead.status);
    if (currentIndex > 0) {
      onUpdateLeadStatus(lead.id, COLUMNS[currentIndex - 1].id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Pipeline KPIs */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8E7] text-[#111111] border border-[#FFC107]/40 text-xs font-bold mb-2">
              <Sparkles size={13} className="text-[#FFC107]" />
              <span>Funil de Vendas · {currentNiche.name}</span>
            </div>
            <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">
              Pipeline de Oportunidades & Conversão
            </h2>
            <p className="text-xs text-zinc-500">
              Acompanhe potenciais clientes da chegada até o fechamento com visão Kanban.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Alternar Visualização */}
            <div className="flex bg-zinc-100 rounded-xl p-1 border border-zinc-200">
              <button
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "kanban"
                    ? "bg-white text-zinc-900 shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <LayoutGrid size={14} />
                <span>Quadro Kanban</span>
              </button>
              <button
                onClick={() => setViewMode("lista")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === "lista"
                    ? "bg-white text-zinc-900 shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <List size={14} />
                <span>Lista</span>
              </button>
            </div>

            <button
              onClick={onOpenNewLead}
              className="px-4 py-2 bg-[#FFC107] hover:bg-[#E5AC06] text-black font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus size={15} />
              <span>Novo Lead</span>
            </button>
          </div>
        </div>

        {/* KPIs em cards inspirados no icantbelievecrm */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
          <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
            <span className="text-[11px] font-semibold text-zinc-500">Total em Aberto</span>
            <div className="text-xl font-extrabold text-zinc-900 mt-0.5">
              {leads.filter((l) => l.status !== "convertido" && l.status !== "perdido").length}
            </div>
          </div>
          <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
            <span className="text-[11px] font-semibold text-zinc-500">Pipeline Estimado</span>
            <div className="text-xl font-extrabold text-zinc-900 mt-0.5">
              R$ {valorPipeline.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
            <span className="text-[11px] font-semibold text-zinc-500">Ganhos / Convertidos</span>
            <div className="text-xl font-extrabold text-emerald-600 mt-0.5 flex items-center gap-1.5">
              <CheckCircle2 size={18} />
              <span>{totalGanhos}</span>
            </div>
          </div>
          <div className="p-3 bg-[#FFF8E7] rounded-2xl border border-[#FFC107]/30">
            <span className="text-[11px] font-semibold text-amber-900">Taxa de Conversão</span>
            <div className="text-xl font-extrabold text-amber-950 mt-0.5">
              {taxaConversao}%
            </div>
          </div>
        </div>

        {/* Barra de Filtros e Busca */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-zinc-100 text-xs">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou interesse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107] text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-[11px] font-medium flex items-center gap-1">
              <Filter size={12} /> Canal:
            </span>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
            >
              <option value="todos">Todos canais</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="instagram">Instagram</option>
            </select>
          </div>
        </div>
      </div>

      {/* Conteúdo: Visualização Kanban ou Lista */}
      {viewMode === "kanban" ? (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1100px] items-start">
            {COLUMNS.map((col) => {
              const colLeads = filteredLeads.filter((l) => l.status === col.id);
              const colValue = colLeads.reduce((acc, l) => acc + (l.value || 150), 0);

              return (
                <div
                  key={col.id}
                  className={`w-72 shrink-0 bg-white rounded-3xl border border-zinc-200 shadow-xs flex flex-col border-t-4 ${col.headerBorder}`}
                >
                  {/* Cabeçalho da Coluna */}
                  <div className="p-3.5 border-b border-zinc-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-xs text-zinc-900">{col.title}</h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${col.badgeColor}`}
                        >
                          {colLeads.length}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-semibold block mt-0.5">
                        R$ {colValue.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                      </span>
                    </div>

                    {col.id === "novo" && (
                      <button
                        onClick={onOpenNewLead}
                        className="p-1 rounded-lg bg-zinc-100 hover:bg-[#FFC107] text-zinc-700 hover:text-black transition-colors"
                        title="Adicionar lead"
                      >
                        <Plus size={14} />
                      </button>
                    )}
                  </div>

                  {/* Cards da Coluna */}
                  <div className="p-3 space-y-3 min-h-[350px] max-h-[620px] overflow-y-auto">
                    {colLeads.length === 0 ? (
                      <div className="h-32 border-2 border-dashed border-zinc-100 rounded-2xl flex flex-col items-center justify-center text-zinc-300 text-xs">
                        <span>Sem oportunidades</span>
                      </div>
                    ) : (
                      colLeads.map((lead) => (
                        <div
                          key={lead.id}
                          onClick={() => setSelectedLead(lead)}
                          className="p-3.5 bg-zinc-50/70 hover:bg-white border border-zinc-200/90 hover:border-[#FFC107] rounded-2xl transition-all shadow-2xs hover:shadow-sm cursor-pointer space-y-2 group"
                        >
                          {/* Top: Nome e Canal */}
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-xs text-zinc-900 group-hover:text-amber-900 transition-colors line-clamp-1">
                              {lead.name}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 shrink-0 ${
                                lead.channel === "whatsapp"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}
                            >
                              {lead.channel === "whatsapp" ? (
                                <MessageCircle size={10} />
                              ) : (
                                <span className="text-[10px]">📸</span>
                              )}
                              <span>{lead.channel === "whatsapp" ? "WhatsApp" : "Instagram"}</span>
                            </span>
                          </div>

                          {/* Mensagem / Interesse */}
                          <p className="text-[11px] text-zinc-600 line-clamp-2 leading-relaxed italic bg-white/70 p-2 rounded-xl border border-zinc-100">
                            "{lead.message}"
                          </p>

                          {/* Valor e Data */}
                          <div className="flex items-center justify-between text-[11px] pt-1">
                            <span className="font-extrabold text-zinc-900 flex items-center gap-0.5">
                              R$ {(lead.value || 150).toFixed(2).replace(".", ",")}
                            </span>
                            <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                              <Clock size={10} /> {lead.timeAgo}
                            </span>
                          </div>

                          {/* Ações Rápidas de Movimentação do Card */}
                          <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-between gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                movePrev(lead);
                              }}
                              disabled={col.id === "novo"}
                              className="p-1 rounded-lg text-zinc-400 hover:text-black hover:bg-zinc-200 disabled:opacity-20 disabled:hover:bg-transparent"
                              title="Recuar etapa"
                            >
                              <ArrowLeft size={13} />
                            </button>

                            {onWhatsAppLead && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onWhatsAppLead(lead);
                                }}
                                className="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                              >
                                <MessageCircle size={11} />
                                <span>Conversar</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveNext(lead);
                              }}
                              disabled={col.id === "perdido"}
                              className="p-1 rounded-lg text-zinc-400 hover:text-black hover:bg-zinc-200 disabled:opacity-20 disabled:hover:bg-transparent"
                              title="Avançar etapa"
                            >
                              <ArrowRight size={13} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Visualização em Lista Clássica */
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs divide-y divide-zinc-100">
          {filteredLeads.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-xs">
              Nenhum lead encontrado com esses filtros.
            </div>
          ) : (
            filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50 px-3 rounded-2xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#111111] text-[#FFC107] font-bold text-xs flex items-center justify-center">
                    {lead.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-zinc-900">{lead.name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                        {COLUMNS.find((c) => c.id === lead.status)?.title || lead.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 max-w-md truncate">"{lead.message}"</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="font-extrabold text-xs text-zinc-900">
                    R$ {(lead.value || 150).toFixed(2).replace(".", ",")}
                  </span>
                  {onWhatsAppLead && (
                    <button
                      onClick={() => onWhatsAppLead(lead)}
                      className="px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-600"
                    >
                      <MessageCircle size={13} />
                      WhatsApp
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal de Detalhe da Oportunidade */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full border border-zinc-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-zinc-900">Oportunidade de Venda</h3>
                <span className="text-[11px] text-zinc-400">Nicho: {currentNiche.name}</span>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-zinc-400 hover:text-black p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-zinc-50 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-400">Nome do Contato</span>
                <div className="font-extrabold text-sm text-zinc-900">{selectedLead.name}</div>
              </div>

              <div className="p-3.5 bg-zinc-50 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-400">Interesse / Mensagem</span>
                <p className="text-xs text-zinc-700 italic">"{selectedLead.message}"</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-zinc-50 rounded-2xl">
                  <span className="text-[10px] text-zinc-400 block font-semibold">Canal</span>
                  <span className="font-bold capitalize text-zinc-900">{selectedLead.channel}</span>
                </div>
                <div className="p-3 bg-zinc-50 rounded-2xl">
                  <span className="text-[10px] text-zinc-400 block font-semibold">Valor Estimado</span>
                  <span className="font-bold text-emerald-600">
                    R$ {(selectedLead.value || 150).toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>

              {/* Seletor de Fase do Funil */}
              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-bold text-zinc-700 block">Fase do Funil:</label>
                <select
                  value={selectedLead.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as Lead["status"];
                    onUpdateLeadStatus(selectedLead.id, newStatus);
                    setSelectedLead({ ...selectedLead, status: newStatus });
                  }}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                >
                  {COLUMNS.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-zinc-100">
              <button
                onClick={() => setSelectedLead(null)}
                className="flex-1 py-2 text-xs font-bold text-zinc-600 border border-zinc-200 rounded-xl hover:bg-zinc-50"
              >
                Fechar
              </button>
              {onWhatsAppLead && (
                <button
                  onClick={() => {
                    const lead = selectedLead;
                    setSelectedLead(null);
                    onWhatsAppLead(lead);
                  }}
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                >
                  <MessageCircle size={14} />
                  Abrir WhatsApp
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
