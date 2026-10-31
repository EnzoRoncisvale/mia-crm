"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, UserPlus, Target, CheckSquare, Plus, AlertTriangle, ChevronDown } from "lucide-react";
import { Appointment, Lead, NicheConfig } from "@/types/crm";

// Gera slots de horário de 30 em 30 min entre 08:00 e 20:00
function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 8; h <= 20; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    if (h < 20) slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

interface ServiceOption {
  id: string;
  name: string;
  price: number;
  duration_minutes: number;
}

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
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [document, setDocument] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [dayOptions, setDayOptions] = useState<{ value: string; label: string }[]>([]);
  const [time, setTime] = useState("09:00");
  const [price, setPrice] = useState("120");
  const [channel, setChannel] = useState<"whatsapp" | "instagram">("whatsapp");
  const [message, setMessage] = useState("");

  // Serviços carregados da API
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // Niche specific fields (Seção 3.1 do Escopo)
  const [nicheField1, setNicheField1] = useState("");
  const [nicheField2, setNicheField2] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  // Gera dias do agendamento no client-side para evitar descompasso de SSR
  useEffect(() => {
    const days: { value: string; label: string }[] = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const isoDate = d.toISOString().slice(0, 10);
      let prefix = "";
      if (i === 0) prefix = "Hoje · ";
      else if (i === 1) prefix = "Amanhã · ";
      else {
        const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
        prefix = `${weekdays[d.getDay()]}, `;
      }
      const formatted = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
      days.push({ value: isoDate, label: `${prefix}${formatted}` });
    }
    setDayOptions(days);
    if (days.length > 0 && !date) {
      setDate(days[0].value);
    }
  }, [isOpen]);

  // Carrega serviços da API quando abre modal de agendamento
  useEffect(() => {
    if (isOpen && type === "agendamento") {
      setLoadingServices(true);
      fetch(`/api/services?nicheId=${currentNiche.id}`)
        .then((r) => r.json())
        .then((data) => {
          const list: ServiceOption[] = (data.data || data.services || []).map((s: ServiceOption & { durationMinutes?: number }) => ({
            id: s.id,
            name: s.name,
            price: s.price,
            duration_minutes: s.duration_minutes ?? s.durationMinutes ?? 45,
          }));
          setServiceOptions(list);
          // pré-seleciona o primeiro serviço
          if (list.length > 0) {
            setService(list[0].name);
            setPrice(String(list[0].price));
          }
        })
        .catch(() => setServiceOptions([]))
        .finally(() => setLoadingServices(false));
    }
  }, [isOpen, type, currentNiche.id]);

  // Reset form ao fechar/abrir
  useEffect(() => {
    if (!isOpen) {
      setName(""); setEmail(""); setPhone(""); setDocument("");
      setService(""); setDate(new Date().toISOString().slice(0, 10)); setTime("09:00"); setPrice("120");
      setMessage(""); setNicheField1(""); setNicheField2("");
      setConflictWarning(null);
    }
  }, [isOpen]);

  if (!isOpen || !type) return null;

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
          date: date,
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
            date: newApp.date,
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
              {/* Dropdown de Serviço */}
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  {currentNiche.serviceLabel}
                </label>
                <div className="relative">
                  <select
                    required
                    value={service}
                    onChange={(e) => {
                      const selected = serviceOptions.find((s) => s.name === e.target.value);
                      setService(e.target.value);
                      if (selected) setPrice(String(selected.price));
                    }}
                    disabled={loadingServices}
                    className="w-full px-3 py-2 pr-9 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:bg-white appearance-none text-xs"
                  >
                    {loadingServices ? (
                      <option>Carregando serviços...</option>
                    ) : serviceOptions.length > 0 ? (
                      <>
                        <option value="">Selecione um serviço</option>
                        {serviceOptions.map((s) => (
                          <option key={s.id} value={s.name}>
                            {s.name} — R$ {s.price.toFixed(2).replace(".", ",")}
                          </option>
                        ))}
                        <option value="__outro">✏️ Outro (digitar manualmente)</option>
                      </>
                    ) : (
                      <>
                        <option value="">Selecione um serviço</option>
                        <option value="Consulta Padrão">Consulta Padrão</option>
                        <option value="Atendimento Especial">Atendimento Especial</option>
                        <option value="__outro">✏️ Outro (digitar manualmente)</option>
                      </>
                    )}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                </div>
                {/* Campo extra se escolher "Outro" */}
                {service === "__outro" && (
                  <input
                    type="text"
                    required
                    placeholder={`Nome do ${currentNiche.serviceLabel}`}
                    onChange={(e) => setService(e.target.value === "" ? "__outro" : e.target.value)}
                    className="mt-2 w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107] text-xs"
                  />
                )}
              </div>

              {/* Grid: Dia do Agendamento + Horário + Valor */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Dropdown de Dia */}
                <div className="sm:col-span-1">
                  <label className="block font-semibold text-zinc-700 mb-1">
                    Data do Agendamento
                  </label>
                  <div className="relative">
                    <select
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 pr-8 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:bg-white appearance-none text-xs"
                    >
                      {dayOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  </div>
                </div>

                {/* Dropdown de Horário */}
                <div className="sm:col-span-1">
                  <label className="block font-semibold text-zinc-700 mb-1">
                    Horário de Início
                  </label>
                  <div className="relative">
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-3 py-2 pr-8 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:bg-white appearance-none text-xs"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  </div>
                </div>

                {/* Valor */}
                <div className="sm:col-span-1">
                  <label className="block font-semibold text-zinc-700 mb-1">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:bg-white text-xs"
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
