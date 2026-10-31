"use client";

import React, { useState } from "react";
import {
  MessageCircle,
  Search,
  Send,
  Phone,
  User,
  Clock,
  Sparkles,
  Paperclip,
  CheckCheck,
  ShieldCheck,
  Tag,
  Filter,
} from "lucide-react";
import { NicheConfig } from "@/types/crm";

interface ChatMessage {
  id: string;
  sender: "client" | "agent";
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  contactName: string;
  avatarText: string;
  phone: string;
  channel: "whatsapp" | "instagram";
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  status: "aberta" | "aguardando" | "resolvida";
  tag: string;
  messages: ChatMessage[];
}

interface CommunicationsInboxModuleProps {
  currentNiche: NicheConfig;
  onOpenNewAppointment?: () => void;
}

const INITIAL_CONVERSATIONS: Conversation[] = [];

export default function CommunicationsInboxModule({
  currentNiche,
  onOpenNewAppointment,
}: CommunicationsInboxModuleProps) {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [selectedConvId, setSelectedConvId] = useState<string>("conv-1");
  const [searchTerm, setSearchTerm] = useState("");
  const [inputText, setInputText] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todas" | "aberta" | "aguardando" | "resolvida">("todas");

  const selectedConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todas" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: "agent",
      text: inputText.trim(),
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedConvId) {
          return {
            ...c,
            lastMessage: newMessage.text,
            lastTime: newMessage.time,
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );

    setInputText("");
  };

  const handleQuickTemplate = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-2">
            <MessageCircle size={13} className="text-emerald-600" />
            <span>Central Omnichannel · {currentNiche.name}</span>
          </div>
          <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">
            Inbox & Atendimento WhatsApp
          </h2>
          <p className="text-xs text-zinc-500">
            Gerencie conversas de WhatsApp e Instagram integradas ao funil de clientes e agenda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-zinc-100 text-zinc-700 font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            WAHA / API Conectada
          </span>
        </div>
      </div>

      {/* Grid Principal: Lista de Conversas + Janela de Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[650px]">
        {/* Coluna Esquerda: Lista de Conversas (4 colunas) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-zinc-200/80 shadow-xs flex flex-col overflow-hidden">
          {/* Busca & Filtro */}
          <div className="p-3.5 border-b border-zinc-100 space-y-2.5">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar conversa ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
              {(["todas", "aberta", "aguardando", "resolvida"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-bold transition-colors whitespace-nowrap ${
                    statusFilter === st
                      ? "bg-[#111111] text-[#FFC107]"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Chats */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-zinc-400 text-xs">
                Nenhuma conversa encontrada.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === selectedConvId;
                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setSelectedConvId(conv.id);
                      setConversations((prev) =>
                        prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
                      );
                    }}
                    className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                      isSelected
                        ? "bg-[#FFF8E7]/70 border-l-4 border-l-[#FFC107]"
                        : "hover:bg-zinc-50"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-2xl bg-[#111111] text-[#FFC107] font-extrabold text-xs flex items-center justify-center">
                        {conv.avatarText}
                      </div>
                      <span
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white ${
                          conv.channel === "whatsapp" ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                      >
                        {conv.channel === "whatsapp" ? "W" : "I"}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-bold text-xs text-zinc-900 truncate">
                          {conv.contactName}
                        </span>
                        <span className="text-[10px] text-zinc-400 shrink-0">{conv.lastTime}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate">{conv.lastMessage}</p>

                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
                          {conv.tag}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span className="ml-auto w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-extrabold flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Coluna Direita: Janela de Chat Ativa (8 colunas) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-zinc-200/80 shadow-xs flex flex-col overflow-hidden">
          {!selectedConv ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-400">
              <div className="w-16 h-16 rounded-3xl bg-zinc-100 flex items-center justify-center mb-3">
                <MessageCircle size={28} className="text-zinc-400" />
              </div>
              <h3 className="font-bold text-sm text-zinc-700">Nenhuma conversa selecionada</h3>
              <p className="text-xs text-zinc-400 max-w-xs mt-1">
                Selecione uma conversa na lista ao lado ou inicie um novo atendimento com seus clientes.
              </p>
            </div>
          ) : (
            <>
              {/* Header da Conversa */}
              <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#111111] text-[#FFC107] font-extrabold text-xs flex items-center justify-center">
                    {selectedConv.avatarText}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-xs text-zinc-900">{selectedConv.contactName}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                        {selectedConv.phone}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400">Canal oficial: WhatsApp</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onOpenNewAppointment && (
                    <button
                      onClick={onOpenNewAppointment}
                      className="px-3 py-1.5 bg-[#FFC107] text-black text-xs font-bold rounded-xl hover:bg-[#E5AC06] transition-colors"
                    >
                      + Agendar Horário
                    </button>
                  )}
                </div>
              </div>

              {/* Área das Mensagens (Scrollable) */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FBFBFA]">
                {selectedConv.messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-zinc-400 text-xs">
                    Inicie a conversa digitando uma mensagem abaixo.
                  </div>
                ) : (
                  selectedConv.messages.map((m) => {
                    const isAgent = m.sender === "agent";
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isAgent ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-2xs ${
                            isAgent
                              ? "bg-[#111111] text-white rounded-tr-xs"
                              : "bg-white text-zinc-900 border border-zinc-200 rounded-tl-xs"
                          }`}
                        >
                          <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                          <div
                            className={`text-[9px] mt-1 text-right flex items-center justify-end gap-1 ${
                              isAgent ? "text-zinc-400" : "text-zinc-400"
                            }`}
                          >
                            <span>{m.time}</span>
                            {isAgent && <CheckCheck size={11} className="text-[#FFC107]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Atalhos Rápidos de Mensagem */}
              <div className="px-4 py-2 border-t border-zinc-100 bg-zinc-50/50 flex items-center gap-2 overflow-x-auto text-[11px]">
                <span className="text-zinc-400 font-bold shrink-0">⚡ Respostas Rápidas:</span>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickTemplate(
                      `Olá, ${selectedConv.contactName.split(" ")[0]}! Nosso horário de atendimento é de segunda a sábado das 09h às 19h.`
                    )
                  }
                  className="px-2.5 py-1 bg-white border border-zinc-200 rounded-lg text-zinc-700 hover:border-[#FFC107] shrink-0"
                >
                  Horário de Funcionamento
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickTemplate(
                      `Olá! Posso agendar sua consulta/sessão para esta semana? Qual seu melhor dia?`
                    )
                  }
                  className="px-2.5 py-1 bg-white border border-zinc-200 rounded-lg text-zinc-700 hover:border-[#FFC107] shrink-0"
                >
                  Oferecer Horário
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickTemplate(
                      `Chave PIX da nossa empresa: contato@miacrm.com.br. Após transferir envie o comprovante!`
                    )
                  }
                  className="px-2.5 py-1 bg-white border border-zinc-200 rounded-lg text-zinc-700 hover:border-[#FFC107] shrink-0"
                >
                  Chave PIX
                </button>
              </div>

              {/* Barra de Envio */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 border-t border-zinc-100 flex items-center gap-2 bg-white"
              >
                <input
                  type="text"
                  placeholder="Digite sua mensagem para o cliente..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#FFC107] hover:bg-[#E5AC06] text-black font-bold text-xs rounded-2xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <span>Enviar</span>
                  <Send size={13} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
