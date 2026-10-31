"use client";

import React, { useState, useEffect } from "react";
import {
  Megaphone, Plus, Play, Pause, CheckCircle2, Clock, Users,
  Send, Sparkles, Filter, AlertTriangle, Eye, RefreshCw, X, MessageSquare, ChevronRight
} from "lucide-react";
import { NicheConfig } from "@/types/crm";

export interface Campaign {
  id: string;
  name: string;
  targetAudience: "inativos_30d" | "inativos_60d" | "todos_clientes" | "leads_perdidos" | "clientes_vip";
  targetCount: number;
  messageTemplate: string;
  status: "rascunho" | "agendada" | "em_andamento" | "concluida" | "pausada";
  sentCount: number;
  responseCount: number;
  conversionCount: number;
  revenueGenerated: number;
  intervalSeconds: number; // Intervalo anti-banimento
  scheduledAt?: string;
  createdAt: string;
}

interface CampaignsModuleProps {
  currentNiche: NicheConfig;
}

const STORAGE_KEY = "mia_crm_campaigns";

const AUDIENCE_LABELS: Record<Campaign["targetAudience"], { label: string; desc: string; countApprox: number }> = {
  inativos_30d: { label: "Clientes inativos há +30 dias", desc: "Quem não compra nem agenda há pelo menos 1 mês", countApprox: 24 },
  inativos_60d: { label: "Clientes inativos há +60 dias", desc: "Clientes frios que precisam de oferta especial para retorno", countApprox: 48 },
  todos_clientes: { label: "Toda a base de clientes", desc: "Todos os contatos cadastrados no sistema", countApprox: 82 },
  leads_perdidos: { label: "Leads que não fecharam", desc: "Contatos que demonstraram interesse mas não converteram", countApprox: 19 },
  clientes_vip: { label: "Clientes VIP ⭐", desc: "Clientes frequentes com maior ticket médio", countApprox: 12 },
};

export default function CampaignsModule({ currentNiche }: CampaignsModuleProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [targetAudience, setTargetAudience] = useState<Campaign["targetAudience"]>("inativos_30d");
  const [messageTemplate, setMessageTemplate] = useState("");
  const [intervalSeconds, setIntervalSeconds] = useState(25);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setCampaigns(JSON.parse(saved));
          return;
        } catch (e) {
          console.error(e);
        }
      }
    }

    // Campanhas modelo se vazio
    const initial: Campaign[] = [
      {
        id: "camp-1",
        name: `Reativação de Primavera — ${currentNiche.serviceLabel}s`,
        targetAudience: "inativos_30d",
        targetCount: 24,
        messageTemplate: `Olá {{primeiro_nome}}, tudo bem? Notamos que faz um tempinho desde seu último atendimento aqui. Preparamos uma condição exclusiva de 15% OFF para você retornar esta semana! Podemos reservar seu horário?`,
        status: "concluida",
        sentCount: 24,
        responseCount: 11,
        conversionCount: 6,
        revenueGenerated: 890.0,
        intervalSeconds: 20,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "camp-2",
        name: "Resgate de Orçamentos Não Fechados",
        targetAudience: "leads_perdidos",
        targetCount: 19,
        messageTemplate: `Oi {{primeiro_nome}}! Lembra do orçamento de ${currentNiche.serviceLabel} que você solicitou? Conseguimos estender a condição especial com parcelamento sem juros até sexta-feira. Quer que eu te envie os detalhes?`,
        status: "em_andamento",
        sentCount: 12,
        responseCount: 5,
        conversionCount: 2,
        revenueGenerated: 420.0,
        intervalSeconds: 30,
        createdAt: new Date().toISOString(),
      },
    ];
    setCampaigns(initial);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    }
  };

  const saveCampaigns = (updated: Campaign[]) => {
    setCampaigns(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !messageTemplate.trim()) {
      alert("Por favor, preencha o nome da campanha e a mensagem.");
      return;
    }

    const newCamp: Campaign = {
      id: `camp-${Date.now()}`,
      name,
      targetAudience,
      targetCount: AUDIENCE_LABELS[targetAudience].countApprox,
      messageTemplate,
      status: "agendada",
      sentCount: 0,
      responseCount: 0,
      conversionCount: 0,
      revenueGenerated: 0,
      intervalSeconds,
      createdAt: new Date().toISOString(),
    };

    const updated = [newCamp, ...campaigns];
    saveCampaigns(updated);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setTargetAudience("inativos_30d");
    setMessageTemplate("");
    setIntervalSeconds(25);
  };

  const handleToggleStatus = (camp: Campaign) => {
    const updated = campaigns.map((c) => {
      if (c.id === camp.id) {
        if (c.status === "em_andamento") {
          return { ...c, status: "pausada" as const };
        } else if (c.status === "pausada" || c.status === "agendada") {
          return { ...c, status: "em_andamento" as const };
        }
      }
      return c;
    });
    saveCampaigns(updated);
  };

  // Sugestão de Copy da IA MIA
  const handleGenerateAiCopy = () => {
    const suggestions: Record<Campaign["targetAudience"], string> = {
      inativos_30d: `Olá {{primeiro_nome}}, tudo bem? Estamos com saudades! Preparamos um benefício VIP para você renovar seu(sua) ${currentNiche.serviceLabel} esta semana. Gostaria de ver os horários livres?`,
      inativos_60d: `Oi {{primeiro_nome}}, faz um tempinho que não nos falamos! Para comemorar este mês, liberamos um cupom especial de 20% para você voltar. Posso garantir sua vaga?`,
      todos_clientes: `Olá {{primeiro_nome}}, tudo bem? Temos uma novidade imperdível no nosso catálogo de ${currentNiche.name.toLowerCase()}! Responda SIM para receber a condição exclusiva em primeira mão.`,
      leads_perdidos: `Oi {{primeiro_nome}}! Passando rapidinho para saber se você ainda precisa daquele serviço de ${currentNiche.serviceLabel}. Reabrimos algumas vagas promocionais para esta semana!`,
      clientes_vip: `Olá {{primeiro_nome}}, como nosso cliente VIP especial, você tem prioridade na agenda deste mês para novos procedimentos. Gostaria de escolher seu dia com antecedência?`,
    };
    setMessageTemplate(suggestions[targetAudience]);
  };

  // Métricas Totais
  const totalEnviadas = campaigns.reduce((acc, c) => acc + c.sentCount, 0);
  const totalRespostas = campaigns.reduce((acc, c) => acc + c.responseCount, 0);
  const totalReceita = campaigns.reduce((acc, c) => acc + c.revenueGenerated, 0);
  const taxaResposta = totalEnviadas > 0 ? ((totalRespostas / totalEnviadas) * 100).toFixed(1) : "0";

  return (
    <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Megaphone className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-zinc-900">
              Campanhas & Disparos WhatsApp
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
              Anti-Ban
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Reative clientes sumidos, recupere propostas e gere vendas recorrentes via WhatsApp com cadência segura.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="px-3.5 py-2 bg-[#FFC107] hover:bg-[#ffb300] text-black font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>+ Criar Nova Campanha</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/70">
          <div className="text-[11px] font-semibold text-zinc-500">Disparos Realizados</div>
          <div className="text-lg font-black text-zinc-900 mt-0.5">{totalEnviadas}</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Mensagens enviadas</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/70">
          <div className="text-[11px] font-semibold text-zinc-500">Taxa de Resposta</div>
          <div className="text-lg font-black text-blue-600 mt-0.5">{taxaResposta}%</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">{totalRespostas} clientes responderam</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/70">
          <div className="text-[11px] font-semibold text-zinc-500">Receita Recuperada</div>
          <div className="text-lg font-black text-emerald-600 mt-0.5">
            R$ {totalReceita.toFixed(2).replace(".", ",")}
          </div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Vendas via reativação</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/70">
          <div className="text-[11px] font-semibold text-zinc-500">Proteção Anti-Ban</div>
          <div className="text-lg font-black text-emerald-600 mt-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Ativa
          </div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Intervalos randômicos 20–45s</div>
        </div>
      </div>

      {/* Lista de Campanhas */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
          Campanhas Ativas & Histórico
        </h3>

        {campaigns.length === 0 ? (
          <div className="text-center py-12 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
            <Megaphone className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-zinc-700">Nenhuma campanha criada ainda</h4>
            <p className="text-[11px] text-zinc-400 max-w-sm mx-auto mt-1 mb-3">
              Crie sua primeira campanha para reativar clientes que não compram há mais de 30 dias.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#FFC107] text-black text-xs font-bold rounded-xl"
            >
              Criar Campanha
            </button>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 border border-zinc-100 rounded-2xl overflow-hidden">
            {campaigns.map((camp) => {
              const progress = camp.targetCount > 0 ? (camp.sentCount / camp.targetCount) * 100 : 0;
              const audience = AUDIENCE_LABELS[camp.targetAudience];

              return (
                <div
                  key={camp.id}
                  className="p-4 hover:bg-zinc-50/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Dados da Campanha */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-zinc-900">{camp.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          camp.status === "em_andamento"
                            ? "bg-blue-100 text-blue-700 animate-pulse"
                            : camp.status === "concluida"
                            ? "bg-emerald-100 text-emerald-700"
                            : camp.status === "pausada"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {camp.status === "em_andamento"
                          ? "Disparando..."
                          : camp.status === "concluida"
                          ? "Concluída"
                          : camp.status === "pausada"
                          ? "Pausada"
                          : "Agendada"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1 text-zinc-600 font-medium">
                        <Users className="w-3 h-3 text-zinc-400" />
                        Público: {audience.label} ({camp.targetCount} contatos)
                      </span>
                      <span>•</span>
                      <span>Intervalo: {camp.intervalSeconds}s</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-semibold">
                        Receita: R$ {camp.revenueGenerated.toFixed(2).replace(".", ",")}
                      </span>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="w-full max-w-md">
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1">
                        <span>Progresso de envios</span>
                        <span className="font-bold">
                          {camp.sentCount} / {camp.targetCount} ({progress.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedCampaign(camp)}
                      className="px-3 py-1.5 text-xs font-semibold bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded-xl border border-zinc-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" /> Ver Mensagem
                    </button>

                    {camp.status !== "concluida" && (
                      <button
                        onClick={() => handleToggleStatus(camp)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer ${
                          camp.status === "em_andamento"
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                            : "bg-[#FFC107] text-black hover:bg-[#ffb300]"
                        }`}
                      >
                        {camp.status === "em_andamento" ? (
                          <>
                            <Pause className="w-3 h-3" /> Pausar
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current" /> Iniciar Disparos
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL: CRIAR NOVA CAMPANHA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-zinc-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">
                    Nova Campanha de Reativação WhatsApp
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Defina o público-alvo, a mensagem personalizada e o intervalo
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4">
              {/* Nome da Campanha */}
              <div>
                <label className="text-[11px] font-bold text-zinc-700 block mb-1">
                  Nome da Campanha
                </label>
                <input
                  type="text"
                  required
                  placeholder={`Ex: Reativação Clientes de Outubro — ${currentNiche.serviceLabel}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                />
              </div>

              {/* Segmentação do Público-Alvo */}
              <div>
                <label className="text-[11px] font-bold text-zinc-700 block mb-1">
                  Público-Alvo Alvo (Segmentação Inteligente)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(Object.keys(AUDIENCE_LABELS) as Campaign["targetAudience"][]).map((key) => {
                    const info = AUDIENCE_LABELS[key];
                    const isSelected = targetAudience === key;
                    return (
                      <div
                        key={key}
                        onClick={() => setTargetAudience(key)}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? "border-purple-600 bg-purple-50/50 shadow-xs"
                            : "border-zinc-200 bg-zinc-50/50 hover:border-zinc-300"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
                          <span>{info.label}</span>
                          <span className="text-[10px] text-purple-700 font-extrabold bg-purple-100 px-1.5 py-0.5 rounded-md">
                            ~{info.countApprox}
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">{info.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mensagem Template */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-zinc-700">
                    Mensagem Personalizada do WhatsApp
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateAiCopy}
                    className="text-[10px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200"
                  >
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    Gerar Copy com IA MIA
                  </button>
                </div>

                <textarea
                  rows={4}
                  required
                  placeholder="Olá {{primeiro_nome}}, tudo bem? Notamos que..."
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  className="w-full text-xs p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107] font-sans"
                />
                <p className="text-[10px] text-zinc-400 mt-1">
                  Variáveis dinâmicas aceitas: <code className="text-zinc-600 font-bold">{"{{primeiro_nome}}"}</code>, <code className="text-zinc-600 font-bold">{"{{empresa}}"}</code>.
                </p>
              </div>

              {/* Cadência Anti-Ban */}
              <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-2xl flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] text-amber-900 flex-1">
                  <div className="font-bold">Regra de Segurança Anti-Bloqueio</div>
                  <div className="text-amber-800 text-[10px] mt-0.5">
                    Os envios ocorrem sequencialmente com intervalos para simular digitação humana e manter seu número seguro.
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold text-amber-900">Intervalo por mensagem:</span>
                    <select
                      value={intervalSeconds}
                      onChange={(e) => setIntervalSeconds(Number(e.target.value))}
                      className="bg-white border border-amber-300 rounded-lg text-xs py-0.5 px-2 text-zinc-800 font-bold"
                    >
                      <option value={15}>15 segundos (Rápido)</option>
                      <option value={25}>25 segundos (Recomendado)</option>
                      <option value={40}>40 segundos (Ultra Seguro)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Botões do Rodapé */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FFC107] hover:bg-[#ffb300] text-black font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Salvar e Agendar Campanha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VER MENSAGEM / DETALHES */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-xs font-bold text-zinc-900">
                Preview da Mensagem — {selectedCampaign.name}
              </h3>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="text-zinc-400 hover:text-zinc-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulação Balão WhatsApp */}
            <div className="p-4 bg-[#e5ddd5] rounded-2xl">
              <div className="bg-white rounded-2xl rounded-tl-xs p-3 text-xs text-zinc-800 shadow-xs space-y-1.5 max-w-[90%]">
                <p className="whitespace-pre-line leading-relaxed">
                  {selectedCampaign.messageTemplate.replace(/\{\{primeiro_nome\}\}/g, "Maria")}
                </p>
                <div className="text-[9px] text-zinc-400 text-right flex items-center justify-end gap-1">
                  <span>10:42</span>
                  <span className="text-blue-500 font-bold">✓✓</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCampaign(null)}
                className="px-4 py-1.5 bg-zinc-900 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Fechar Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
