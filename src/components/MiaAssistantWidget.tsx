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
} from "lucide-react";

interface MiaAssistantWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  onQuickAction: (actionType: string) => void;
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
}: MiaAssistantWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "mia",
      text: "Olá, Thayná! 🐝 Sou a MIA, sua secretária inteligente. Como posso facilitar o seu trabalho hoje?",
      time: "Agora",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [credits, setCredits] = useState(142);

  const handleSendMessage = (textToSend?: string) => {
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

    // Simulate MIA AI response
    setTimeout(() => {
      let responseText = "";
      let actionCard: Message["actionCard"] = undefined;

      const lower = messageText.toLowerCase();

      if (lower.includes("agend") || lower.includes("horário") || lower.includes("marcar")) {
        responseText =
          "Perfeito! Identifiquei uma solicitação de agendamento. Você pode preencher os detalhes ou me informar o nome do cliente e horário:";
        actionCard = {
          title: "Novo Agendamento Rápido",
          description: "Horários vagos hoje: 16:00 e 17:30.",
          buttonText: "Abrir Calendário",
          onClickType: "agendar",
        };
      } else if (lower.includes("resum") || lower.includes("atendimento")) {
        responseText =
          "Aqui está o resumo dos atendimentos de hoje: 5 clientes atendidos, totalizando R$ 665,00 em procedimentos. Sem atrasos registrados!";
        actionCard = {
          title: "Relatório de Produtividade Diária",
          description: "Taxa de comparecimento: 100%.",
          buttonText: "Ver Detalhes do Faturamento",
          onClickType: "financeiro",
        };
      } else if (lower.includes("whatsapp") || lower.includes("mensagem")) {
        responseText =
          "Tenho 3 modelos de lembrete prontos para disparar via WhatsApp com confirmação automática para os clientes de amanhã.";
        actionCard = {
          title: "Disparar Lembretes de Amanhã",
          description: "4 clientes agendados para terça-feira.",
          buttonText: "Disparar via WhatsApp",
          onClickType: "whatsapp",
        };
      } else if (lower.includes("tarefa") || lower.includes("fazer")) {
        responseText =
          "Você tem 7 tarefas pendentes. A mais prioritária é: 'Confirmar agendamentos de amanhã via WhatsApp' até às 17h.";
        actionCard = {
          title: "Checklist Diário",
          description: "1 concluída de 8 totais.",
          buttonText: "Ver Quadro de Tarefas",
          onClickType: "tarefas",
        };
      } else {
        responseText = `Entendido! Processei sua solicitação sobre "${messageText}". Já registrei no sistema e estou acompanhando para você.`;
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
    }, 900);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-6 right-6 z-40 bg-[#111111] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2.5 border-2 border-[#FFC107] group"
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

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[92vw] sm:w-[400px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-zinc-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
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
                  Secretária inteligente online
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-[11px] text-[#FFC107] bg-white/10 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                <Zap size={11} />
                <span>{credits} créditos</span>
              </div>
              <button
                onClick={onToggle}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="bg-[#FFF8E7] px-3 py-2 border-b border-[#FFC107]/20 flex items-center gap-1.5 overflow-x-auto text-xs whitespace-nowrap">
            <button
              onClick={() => handleSendMessage("Agendar um horário para cliente")}
              className="px-2.5 py-1 bg-white border border-[#FFC107]/40 rounded-lg text-zinc-800 font-medium hover:bg-[#FFC107] hover:text-black transition-colors flex items-center gap-1"
            >
              <Calendar size={12} className="text-[#FFC107]" />
              <span>Agendar horário</span>
            </button>
            <button
              onClick={() => handleSendMessage("Enviar mensagem pelo WhatsApp")}
              className="px-2.5 py-1 bg-white border border-[#FFC107]/40 rounded-lg text-zinc-800 font-medium hover:bg-[#FFC107] hover:text-black transition-colors flex items-center gap-1"
            >
              <MessageSquare size={12} className="text-emerald-600" />
              <span>Mensagem WhatsApp</span>
            </button>
            <button
              onClick={() => handleSendMessage("Resumir atendimentos de hoje")}
              className="px-2.5 py-1 bg-white border border-[#FFC107]/40 rounded-lg text-zinc-800 font-medium hover:bg-[#FFC107] hover:text-black transition-colors flex items-center gap-1"
            >
              <FileText size={12} className="text-blue-600" />
              <span>Resumir</span>
            </button>
            <button
              onClick={() => handleSendMessage("Ver próximas tarefas")}
              className="px-2.5 py-1 bg-white border border-[#FFC107]/40 rounded-lg text-zinc-800 font-medium hover:bg-[#FFC107] hover:text-black transition-colors flex items-center gap-1"
            >
              <CheckSquare size={12} className="text-amber-600" />
              <span>Tarefas</span>
            </button>
          </div>

          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs ${
                    msg.sender === "user"
                      ? "bg-[#111111] text-white rounded-br-xs"
                      : "bg-white border border-zinc-200 text-zinc-800 rounded-bl-xs shadow-2xs"
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>

                  {/* Interactive card returned by MIA */}
                  {msg.actionCard && (
                    <div className="mt-2.5 p-2.5 bg-[#FFF8E7] rounded-xl border border-[#FFC107]/40 text-left">
                      <div className="font-bold text-zinc-900 text-[11px]">
                        {msg.actionCard.title}
                      </div>
                      <p className="text-[10px] text-zinc-600 mt-0.5">
                        {msg.actionCard.description}
                      </p>
                      <button
                        onClick={() => onQuickAction(msg.actionCard!.onClickType)}
                        className="mt-2 w-full py-1 px-2 bg-[#FFC107] hover:bg-[#E5AC06] text-black font-semibold rounded-lg text-[10px] transition-colors"
                      >
                        {msg.actionCard.buttonText}
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-zinc-400 mt-1 px-1">
                  {msg.time}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-2 bg-white border border-zinc-200 rounded-2xl w-20 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFC107] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFC107] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFC107] animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
          </div>

          {/* Prompt Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-zinc-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Peça algo para a MIA (ex: Agendar cliente)..."
              className="flex-1 text-xs bg-zinc-100 border border-zinc-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#FFC107] focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="p-2.5 bg-[#FFC107] hover:bg-[#E5AC06] disabled:opacity-50 text-black font-bold rounded-xl transition-all shadow-xs"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
