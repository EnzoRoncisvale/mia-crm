"use client";

import React, { useState } from "react";
import {
  Sparkles,
  X,
  Send,
  Calendar,
  MessageSquare,
  FileText,
  CheckSquare,
  Bot,
  Zap,
  ChevronDown,
  DollarSign,
  User,
  ShieldAlert,
} from "lucide-react";
import { UserRole } from "@/types/crm";

interface MiaAssistantWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  onQuickAction: (actionType: string) => void;
  currentRole?: UserRole;
}

interface Message {
  id: string;
  sender: "mia" | "user";
  text: string;
  time: string;
  actionCard?: {
    title: string;
    description: string;
    buttonText: string;
    onClickType: string;
  };
}

export default function MiaAssistantWidget({
  isOpen,
  onToggle,
  onQuickAction,
  currentRole = "admin_empresa",
}: MiaAssistantWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "mia",
      text: "Olá, Thayná! 🐝 Sou a MIA, sua secretária inteligente. Estou conectada ao banco de dados em tempo real. Como posso facilitar o seu trabalho hoje?",
      time: "Agora",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [credits, setCredits] = useState(142);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || inputValue;
    if (!messageText.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: messageText,
      time: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setIsTyping(true);

    // Decrement 1 AI credit
    setCredits((prev) => Math.max(0, prev - 1));

    const lower = messageText.toLowerCase();
    let responseText = "";
    let actionCard: Message["actionCard"] = undefined;

    try {
      // 1. Pergunta sobre faturamento / financeiro
      if (
        lower.includes("fatur") ||
        lower.includes("financeir") ||
        lower.includes("saldo") ||
        lower.includes("quanto ganh") ||
        lower.includes("receita")
      ) {
        // Regra de Permissão (Seção 6.2 do Escopo): Comercial não vê faturamento global
        if (currentRole === "comercial") {
          responseText =
            "🔒 Acesso Restrito: Como seu usuário está no papel Comercial, seu acesso aos dados financeiros globais é bloqueado pelas diretrizes de segurança (RBAC) do MIA CRM.";
        } else {
          const res = await fetch("/api/financial/summary?month=2026-10");
          const json = await res.json();
          if (json.success && json.data) {
            const sum = json.data;
            const rev = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
              sum.totalRevenue
            );
            const exp = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
              sum.totalExpenses
            );
            const bal = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
              sum.netBalance
            );

            responseText = `Consultando o banco de dados em tempo real: Neste mês registramos ${rev} em entradas recebidas e ${exp} em custos/despesas. O saldo líquido atual em caixa é de ${bal} (margem de ${sum.profitMargin}%).`;
            actionCard = {
              title: "Painel do Fluxo de Caixa",
              description: `A receber previsto: R$ ${sum.pendingReceivables.toFixed(2)}`,
              buttonText: "Abrir Módulo Financeiro",
              onClickType: "financeiro",
            };
          } else {
            responseText = "Consultei o banco, mas não há transações consolidadas para este período.";
          }
        }
      }
      // 2. Pergunta sobre agendamentos / agenda
      else if (lower.includes("agend") || lower.includes("horário") || lower.includes("marcar")) {
        const res = await fetch("/api/appointments");
        const json = await res.json();
        const apps = json.data || [];
        const count = apps.length;

        if (count > 0) {
          const sample = apps
            .slice(0, 3)
            .map((a: any) => `${a.time} - ${a.clientName} (${a.service})`)
            .join("; ");
          responseText = `Você possui ${count} agendamento(s) cadastrados no sistema. Próximos horários: ${sample}.`;
        } else {
          responseText = "Não encontrei agendamentos pendentes para hoje no banco de dados.";
        }

        actionCard = {
          title: "Novo Agendamento Rápido",
          description: "Bloqueio automático de conflitos ativo.",
          buttonText: "Abrir Calendário",
          onClickType: "agendar",
        };
      }
      // 3. Pergunta sobre leads / novas oportunidades
      else if (lower.includes("lead") || lower.includes("oportunid") || lower.includes("contato")) {
        const res = await fetch("/api/leads");
        const json = await res.json();
        const leads = json.data || [];

        responseText = `Atualmente temos ${leads.length} leads registrados no funil. O contato mais recente é de ${
          leads[0]?.name || "nenhum"
        } via ${leads[0]?.channel || "canal"}.`;

        actionCard = {
          title: "Funil de Vendas",
          description: "Acompanhe negociações e follow-ups.",
          buttonText: "Ver Lista de Leads",
          onClickType: "leads",
        };
      }
      // 4. Pergunta sobre processos / checklists
      else if (lower.includes("process") || lower.includes("checklist") || lower.includes("etapa")) {
        const res = await fetch("/api/processes");
        const json = await res.json();
        const procs = json.data || [];

        responseText = `Temos ${procs.length} processos operacionais em andamento. O principal é "${
          procs[0]?.title || "Abertura de Processo"
        }" na etapa ${procs[0]?.currentStep || 1}.`;

        actionCard = {
          title: "Workflows Operacionais",
          description: "Modelos padronizados por nicho.",
          buttonText: "Ver Processos",
          onClickType: "processos",
        };
      }
      // Resposta Geral Inteligente
      else {
        responseText = `Entendido! Estou conectada aos módulos de Clientes, Agenda, Serviços, Processos e Financeiro. Você pode me pedir para verificar o faturamento do mês, listar agendamentos de hoje ou conferir os leads pendentes.`;
      }
    } catch (err) {
      console.error("Erro na consulta da MIA:", err);
      responseText = "Tive um pequeno contratempo ao consultar o banco local, mas já estou recuperada.";
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `mia-${Date.now()}`,
        sender: "mia",
        text: responseText,
        time: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        actionCard,
      },
    ]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-6 right-6 z-40 bg-[#111111] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2.5 border-2 border-[#FFC107] group cursor-pointer"
        >
          <div className="relative">
            <span className="text-xl">🐝</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#FFC107] rounded-full animate-ping" />
          </div>
          <span className="hidden sm:inline font-bold text-xs tracking-wide">
            Falar com a <span className="text-[#FFC107]">MIA</span>
          </span>
          <span className="text-[10px] bg-[#FFC107] text-black font-extrabold px-1.5 py-0.5 rounded-full">
            IA
          </span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-zinc-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Top Bar */}
          <div className="bg-[#111111] text-white px-4 py-3.5 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FFC107] text-black font-bold flex items-center justify-center text-lg shadow-sm">
                🐝
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm">
                  <span>MIA Assistente</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[10px] text-zinc-400">
                  Secretária IA Conectada ao SQLite
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-[11px] text-[#FFC107] bg-white/10 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                <Zap size={12} />
                <span>{credits} créditos</span>
              </div>
              <button
                onClick={onToggle}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Suggestions Chips */}
          <div className="p-2.5 bg-zinc-50 border-b border-zinc-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => handleSendMessage("Quanto faturamos este mês?")}
              className="px-2.5 py-1 rounded-full bg-white border border-zinc-200 hover:border-[#FFC107] text-zinc-700 whitespace-nowrap font-medium transition-colors"
            >
              💰 Faturamento do Mês
            </button>
            <button
              onClick={() => handleSendMessage("Quais os agendamentos de hoje?")}
              className="px-2.5 py-1 rounded-full bg-white border border-zinc-200 hover:border-[#FFC107] text-zinc-700 whitespace-nowrap font-medium transition-colors"
            >
              📅 Agendamentos
            </button>
            <button
              onClick={() => handleSendMessage("Quais os processos em andamento?")}
              className="px-2.5 py-1 rounded-full bg-white border border-zinc-200 hover:border-[#FFC107] text-zinc-700 whitespace-nowrap font-medium transition-colors"
            >
              ⚡ Processos
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FAF6F0]/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#111111] text-white rounded-br-xs"
                      : "bg-white text-zinc-900 border border-zinc-200/80 shadow-2xs rounded-bl-xs"
                  }`}
                >
                  {msg.text}
                </div>

                {/* Optional Action Card */}
                {msg.actionCard && (
                  <div className="mt-2 w-full max-w-[85%] bg-white rounded-2xl p-3 border border-[#FFC107]/50 shadow-xs space-y-1.5">
                    <div className="font-bold text-xs text-zinc-900 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-[#FFC107]" />
                      {msg.actionCard.title}
                    </div>
                    <p className="text-[11px] text-zinc-500">{msg.actionCard.description}</p>
                    <button
                      onClick={() => onQuickAction(msg.actionCard!.onClickType)}
                      className="w-full mt-1 py-1.5 bg-[#FFC107] hover:bg-[#E5AC06] text-black font-bold text-[11px] rounded-xl shadow-2xs transition-all text-center"
                    >
                      {msg.actionCard.buttonText}
                    </button>
                  </div>
                )}

                <span className="text-[9px] text-zinc-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1 text-xs text-zinc-400 bg-white px-3 py-2 rounded-2xl w-fit shadow-2xs border border-zinc-100">
                <span>MIA consultando banco...</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFC107] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFC107] animate-bounce [animation-delay:0.2s]" />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-zinc-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Pergunte à MIA sobre faturamento, agenda ou clientes..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-[#FFC107]"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-2.5 bg-[#FFC107] hover:bg-[#E5AC06] text-black rounded-xl disabled:opacity-50 transition-all cursor-pointer"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
