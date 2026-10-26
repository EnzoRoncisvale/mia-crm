"use client";

import React, { useState } from "react";
import { X, Calendar, UserPlus, Target, CheckSquare, Plus } from "lucide-react";
import { Appointment, Lead, NicheConfig } from "@/types/crm";

interface NewItemModalProps {
  isOpen: boolean;
  type: "agendamento" | "lead" | "cliente" | "tarefa" | null;
  onClose: () => void;
  onAddAppointment: (app: Appointment) => void;
  onAddLead: (lead: Lead) => void;
  currentNiche: NicheConfig;
}

export default function NewItemModal({
  isOpen,
  type,
  onClose,
  onAddAppointment,
  onAddLead,
  currentNiche,
}: NewItemModalProps) {
  if (!isOpen || !type) return null;

  // Form states
  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [time, setTime] = useState("16:00");
  const [price, setPrice] = useState("120");
  const [channel, setChannel] = useState<"whatsapp" | "instagram">("whatsapp");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "agendamento" || type === "cliente") {
      const initials = name
        ? name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()
        : "NC";

      const newApp: Appointment = {
        id: `app-${Date.now()}`,
        clientName: name || "Novo Cliente",
        clientInitials: initials,
        service: service || `${currentNiche.serviceLabel} Padrão`,
        time: time,
        endTime: `${parseInt(time.split(":")[0])}:45`,
        price: parseFloat(price) || 100,
        status: "agendado",
      };
      onAddAppointment(newApp);
    } else if (type === "lead") {
      const newLead: Lead = {
        id: `lead-${Date.now()}`,
        name: name || "Lead Interessado",
        message: message || "Olá, gostaria de mais informações!",
        channel: channel,
        status: "novo",
        timeAgo: "agora mesmo",
      };
      onAddLead(newLead);
    }

    onClose();
  };

  const titles = {
    agendamento: `Novo Agendamento (${currentNiche.serviceLabel})`,
    lead: "Novo Lead / Oportunidade",
    cliente: `Cadastrar Novo ${currentNiche.clientLabel}`,
    tarefa: "Nova Tarefa para a Equipe",
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full border border-zinc-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-[#111111] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#FFC107] text-black">
              {type === "agendamento" && <Calendar size={16} />}
              {type === "lead" && <Target size={16} />}
              {type === "cliente" && <UserPlus size={16} />}
              {type === "tarefa" && <CheckSquare size={16} />}
            </div>
            <h3 className="font-bold text-sm">{titles[type]}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-zinc-700 mb-1">
              Nome do {currentNiche.clientLabel}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Gabriela Duarte"
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#FFC107] focus:bg-white"
            />
          </div>

          {(type === "agendamento" || type === "cliente") && (
            <>
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  {currentNiche.serviceLabel}
                </label>
                <input
                  type="text"
                  required
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  placeholder="Ex: Alongamento de Cílios / Consulta"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#FFC107] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">
                    Horário de Início
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#FFC107] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">
                    Valor Estimado (R$)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#FFC107] focus:bg-white"
                  />
                </div>
              </div>
            </>
          )}

          {type === "lead" && (
            <>
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Canal de Origem
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setChannel("whatsapp")}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                      channel === "whatsapp"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                        : "border-zinc-200 text-zinc-600"
                    }`}
                  >
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel("instagram")}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                      channel === "instagram"
                        ? "bg-rose-50 border-rose-500 text-rose-700"
                        : "border-zinc-200 text-zinc-600"
                    }`}
                  >
                    Instagram
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Mensagem / Interesse do Lead
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ex: Gostaria de saber os valores do pacote..."
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#FFC107] focus:bg-white"
                />
              </div>
            </>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-zinc-600 hover:bg-zinc-100 rounded-xl font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#FFC107] hover:bg-[#E5AC06] text-black font-bold rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Plus size={15} />
              <span>Salvar no MIA CRM</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
