"use client";

import React, { useState, useEffect } from "react";
import {
  X, User, Phone, Mail, Calendar, DollarSign,
  Clock, Star, TrendingUp, MessageCircle, ChevronRight,
} from "lucide-react";
import { Appointment, NicheConfig } from "@/types/crm";

interface ClientData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  document?: string;
  notes?: string;
  status: string;
  niche_id?: string;
  created_at: string;
}

interface ClientProfileProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
  currentNiche: NicheConfig;
  onSendWhatsApp?: (appointment: Appointment) => void;
}

const STATUS_BADGE: Record<string, string> = {
  confirmado: "bg-emerald-50 text-emerald-700 border-emerald-200",
  em_andamento: "bg-amber-50 text-amber-700 border-amber-200",
  agendado: "bg-blue-50 text-blue-700 border-blue-200",
  concluido: "bg-zinc-100 text-zinc-600 border-zinc-200",
  cancelado: "bg-red-50 text-red-600 border-red-200",
};

const STATUS_LABEL: Record<string, string> = {
  confirmado: "Confirmado",
  em_andamento: "Em atendimento",
  agendado: "Agendado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export default function ClientProfile({
  isOpen,
  onClose,
  clientName,
  currentNiche,
  onSendWhatsApp,
}: ClientProfileProps) {
  const [client, setClient] = useState<ClientData | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !clientName) return;

    setLoading(true);

    Promise.all([
      fetch("/api/clients").then((r) => r.json()),
      fetch("/api/appointments").then((r) => r.json()),
    ])
      .then(([clientsData, appsData]) => {
        // Encontra o cliente pelo nome
        const allClients: ClientData[] = clientsData.data || clientsData.clients || [];
        const found = allClients.find(
          (c) => c.name.toLowerCase() === clientName.toLowerCase()
        );
        setClient(found || null);

        // Filtra agendamentos do cliente
        const allApps: Appointment[] = appsData.data || appsData.appointments || [];
        const clientApps = allApps.filter(
          (a) => a.clientName.toLowerCase() === clientName.toLowerCase()
        );
        setAppointments(clientApps);
      })
      .catch(() => {
        setClient(null);
        setAppointments([]);
      })
      .finally(() => setLoading(false));
  }, [isOpen, clientName]);

  if (!isOpen) return null;

  // KPIs do cliente
  const totalGasto = appointments
    .filter((a) => a.status !== "cancelado")
    .reduce((sum, a) => sum + (a.price || 0), 0);

  const totalAtendimentos = appointments.filter(
    (a) => a.status === "concluido" || a.status === "confirmado"
  ).length;

  const ticketMedio = totalAtendimentos > 0 ? totalGasto / totalAtendimentos : 0;

  const ultimoAtendimento = appointments
    .filter((a) => a.date)
    .sort((a, b) => (b.date! > a.date! ? 1 : -1))[0];

  const servicoFavorito = appointments.reduce(
    (acc: Record<string, number>, a) => {
      acc[a.service] = (acc[a.service] || 0) + 1;
      return acc;
    },
    {}
  );
  const servicoMaisUsado =
    Object.entries(servicoFavorito).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  // Iniciais do cliente
  const initials = clientName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-zinc-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#111111] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFC107] text-black font-extrabold text-lg flex items-center justify-center">
              {initials}
            </div>
            <div>
              <h3 className="font-bold text-base">{clientName}</h3>
              <p className="text-[11px] text-zinc-400">{currentNiche.clientLabel} · {currentNiche.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-2 border-[#FFC107] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 border-b border-zinc-100">
                <div className="p-3 bg-zinc-50 rounded-2xl text-center">
                  <div className="text-lg font-extrabold text-zinc-900">
                    R$ {totalGasto.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5 font-medium">Total gasto</div>
                </div>
                <div className="p-3 bg-zinc-50 rounded-2xl text-center">
                  <div className="text-lg font-extrabold text-zinc-900">{appointments.length}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5 font-medium">Atendimentos</div>
                </div>
                <div className="p-3 bg-zinc-50 rounded-2xl text-center">
                  <div className="text-lg font-extrabold text-zinc-900">
                    R$ {ticketMedio.toFixed(0)}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5 font-medium">Ticket médio</div>
                </div>
                <div className="p-3 bg-[#FFF8E7] border border-[#FFC107]/30 rounded-2xl text-center">
                  <div className="text-lg font-extrabold text-zinc-900">
                    {totalAtendimentos >= 5 ? "⭐ VIP" : totalAtendimentos >= 3 ? "🌟 Fiel" : "🆕 Novo"}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5 font-medium">Nível</div>
                </div>
              </div>

              {/* Contato */}
              <div className="p-5 border-b border-zinc-100 space-y-3">
                <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wide">Contato</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {client?.phone ? (
                    <div className="flex items-center gap-2.5 text-xs text-zinc-700">
                      <Phone size={14} className="text-zinc-400 shrink-0" />
                      <span>{client.phone}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 text-xs text-zinc-400 italic">
                      <Phone size={14} className="shrink-0" />
                      <span>Telefone não cadastrado</span>
                    </div>
                  )}
                  {client?.email ? (
                    <div className="flex items-center gap-2.5 text-xs text-zinc-700">
                      <Mail size={14} className="text-zinc-400 shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 text-xs text-zinc-400 italic">
                      <Mail size={14} className="shrink-0" />
                      <span>E-mail não cadastrado</span>
                    </div>
                  )}
                </div>

                {/* Serviço favorito + último atendimento */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center gap-2.5 text-xs text-zinc-700">
                    <Star size={14} className="text-[#FFC107] shrink-0" />
                    <span className="truncate"><strong>Favorito:</strong> {servicoMaisUsado}</span>
                  </div>
                  {ultimoAtendimento && (
                    <div className="flex items-center gap-2.5 text-xs text-zinc-700">
                      <Clock size={14} className="text-zinc-400 shrink-0" />
                      <span>
                        <strong>Último:</strong>{" "}
                        {new Date(ultimoAtendimento.date! + "T12:00:00").toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Observações */}
                {client?.notes && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                    📝 {client.notes}
                  </div>
                )}
              </div>

              {/* Histórico de atendimentos */}
              <div className="p-5">
                <h4 className="text-xs font-bold text-zinc-700 uppercase tracking-wide mb-3">
                  Histórico de Atendimentos ({appointments.length})
                </h4>

                {appointments.length === 0 ? (
                  <div className="text-center py-8 text-zinc-400">
                    <Calendar size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Nenhum atendimento registrado</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {appointments
                      .sort((a, b) => {
                        if (a.date && b.date) return b.date > a.date ? 1 : -1;
                        return 0;
                      })
                      .map((app) => (
                        <div
                          key={app.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-zinc-100 bg-zinc-50/60 hover:bg-zinc-50 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="text-center min-w-[50px]">
                              <div className="text-xs font-bold text-zinc-900">{app.time}</div>
                              {app.date && (
                                <div className="text-[10px] text-zinc-400">
                                  {new Date(app.date + "T12:00:00").toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "short",
                                  })}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-zinc-900 truncate">
                                {app.service}
                              </div>
                              <div className="text-[10px] text-zinc-500 font-semibold">
                                R$ {app.price.toFixed(2).replace(".", ",")}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${
                                STATUS_BADGE[app.status] || STATUS_BADGE.agendado
                              }`}
                            >
                              {STATUS_LABEL[app.status] || app.status}
                            </span>
                            {onSendWhatsApp && (
                              <button
                                onClick={() => onSendWhatsApp(app)}
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors"
                                title="Enviar WhatsApp"
                              >
                                <MessageCircle size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-100 flex gap-2.5 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-zinc-200 text-zinc-700 font-semibold text-xs rounded-2xl hover:bg-zinc-50 transition-colors"
          >
            Fechar
          </button>
          {onSendWhatsApp && appointments.length > 0 && (
            <button
              onClick={() => onSendWhatsApp(appointments[0])}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl transition-colors"
            >
              <MessageCircle size={14} />
              Enviar WhatsApp
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
