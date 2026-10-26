"use client";

import React, { useState } from "react";
import { X, Calendar, UserPlus, Target, CheckSquare, Plus, AlertTriangle, ShieldCheck } from "lucide-react";
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
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [document, setDocument] = useState("");
  const [service, setService] = useState("");
  const [time, setTime] = useState("16:00");
  const [price, setPrice] = useState("120");
  const [channel, setChannel] = useState<"whatsapp" | "instagram">("whatsapp");
  const [message, setMessage] = useState("");

  // Niche specific fields (Seção 3.1 do Escopo)
  const [nicheField1, setNicheField1] = useState("");
  const [nicheField2, setNicheField2] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent, allowConflict = false) => {
    e.preventDefault();
    setSubmitting(true);
    setConflictWarning(null);

    try {
      if (type === "agendamento") {
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
          endTime: `${parseInt(time.split(":")[0]) || 16}:45`,
          price: parseFloat(price) || 100,
          status: "agendado",
        };

        const res = await fetch("/api/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientName: newApp.clientName,
            clientInitials: newApp.clientInitials,
            service: newApp.service,
            time: newApp.time,
            endTime: newApp.endTime,
            price: newApp.price,
            status: newApp.status,
            nicheId: currentNiche.id,
            createTransaction: true,
            allowConflict: allowConflict,
          }),
        });

        const resJson = await res.json();

        // 3.3 Tratar conflito de horário
        if (res.status === 409 && resJson.isConflict) {
          setConflictWarning(resJson.error);
          setSubmitting(false);
          return;
        }

        onAddAppointment(newApp);
        onClose();
      } else if (type === "cliente") {
        await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            phone,
            document,
            nicheId: currentNiche.id,
            notes: `Campo nicho 1: ${nicheField1} | Campo nicho 2: ${nicheField2}`,
          }),
        });
        onClose();
      } else if (type === "lead") {
        const newLead: Lead = {
          id: `lead-${Date.now()}`,
          name: name || "Lead Interessado",
          message: message || "Interesse em agendamento",
          channel: channel,
          status: "novo",
          timeAgo: "Agora mesmo",
        };

        await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newLead.name,
            message: newLead.message,
            channel: newLead.channel,
            status: newLead.status,
            nicheId: currentNiche.id,
          }),
        });

        onAddLead(newLead);
        onClose();
      }
    } catch (err) {
      console.error("Erro ao salvar item:", err);
    } finally {
      setSubmitting(false);
    }
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

        <form onSubmit={(e) => handleSubmit(e, false)} className="p-5 space-y-3.5 text-xs">
          {/* Conflict Warning Box (Seção 3.3) */}
          {conflictWarning && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <span className="font-semibold text-xs">{conflictWarning}</span>
              </div>
              <button
                type="button"
                onClick={(e) => handleSubmit(e as any, true)}
                className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Sim, autorizar Encaixe Especial
              </button>
            </div>
          )}

          <div>
            <label className="block font-semibold text-zinc-700 mb-1">
              Nome do {currentNiche.clientLabel} *
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

          {(type === "cliente" || type === "lead") && (
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Telefone / WhatsApp
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#FFC107]"
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cliente@email.com"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#FFC107]"
                />
              </div>
            </div>
          )}

          {/* Campos Personalizados por Nicho (Seção 3.1 do Escopo) */}
          {type === "cliente" && (
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2">
              <span className="text-[11px] font-bold text-zinc-600 block">
                Campos Específicos para: {currentNiche.name}
              </span>
              {currentNiche.id === "contabilidade" ? (
                <>
                  <input
                    type="text"
                    placeholder="CNPJ da Empresa"
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs"
                  />
                  <select
                    value={nicheField1}
                    onChange={(e) => setNicheField1(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs"
                  >
                    <option value="">Selecione o Regime Tributário</option>
                    <option value="simples">Simples Nacional</option>
                    <option value="lucro_presumido">Lucro Presumido</option>
                    <option value="mei">MEI</option>
                  </select>
                </>
              ) : currentNiche.id === "imoveis_construcao" ? (
                <>
                  <input
                    type="text"
                    placeholder="Tipo de Imóvel (Apartamento, Casa, Terreno)"
                    value={nicheField1}
                    onChange={(e) => setNicheField1(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Faixa de Valor Pretendida (R$)"
                    value={nicheField2}
                    onChange={(e) => setNicheField2(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs"
                  />
                </>
              ) : (
                <input
                  type="text"
                  placeholder="Preferências de Atendimento / Notas do Nicho"
                  value={nicheField1}
                  onChange={(e) => setNicheField1(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs"
                />
              )}
            </div>
          )}

          {type === "agendamento" && (
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
                <label className="block font-semibold text-zinc-700 mb-1">Canal de Origem</label>
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
                  rows={2}
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
              disabled={submitting}
              className="px-5 py-2 bg-[#FFC107] hover:bg-[#E5AC06] text-black font-bold rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Plus size={15} />
              <span>{submitting ? "Salvando..." : "Salvar no MIA CRM"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
