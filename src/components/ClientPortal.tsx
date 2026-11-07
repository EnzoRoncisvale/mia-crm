"use client";

import React, { useState } from "react";
import {
  Sparkles, HeartPulse, Calculator, Calendar, Clock, CheckCircle2,
  Phone, ArrowRight, ShieldCheck, MapPin, Award, Star, MessageSquare
} from "lucide-react";
import { Appointment } from "@/types/crm";

interface ClientPortalProps {
  onBackToAdmin?: () => void;
  onBookAppointment?: (app: Appointment) => void;
}

const PROCEDURES_BY_NICHE = {
  estetica: [
    { id: "e1", title: "Limpeza de Pele Profunda", duration: "60 min", price: 180, tag: "Mais Procurado", desc: "Higienização profunda com extração por sucção, vapor de ozônio e máscara calmante revitalizante." },
    { id: "e2", title: "Harmonização & Peeling Químico", duration: "45 min", price: 320, tag: "Destaque", desc: "Renovação celular intensa para suavizar manchas, uniformizar o tom e estimular o colágeno." },
    { id: "e3", title: "Drenagem Linfática Facial & Corporal", duration: "50 min", price: 150, tag: "Relax", desc: "Redução de inchaço, desintoxicação tecidual e melhora da circulação geral." },
    { id: "e4", title: "Protocolo Glow & Hidratação de Diamante", duration: "40 min", price: 210, tag: "Express", desc: "Esfoliação com ponta de diamante para viço instantâneo e recuperação da elasticidade." },
  ],
  saude: [
    { id: "s1", title: "Consulta Nutricional Integrativa", duration: "60 min", price: 250, tag: "Avaliação Completa", desc: "Bioimpedância completa, plano alimentar personalizado e análise metabólica detalhada." },
    { id: "s2", title: "Sessão de Fisioterapia & Reabilitação", duration: "50 min", price: 180, tag: "Individualizada", desc: "Alívio de dores posturais, reabilitação musculoesquelética e exercícios funcionais guiados." },
    { id: "s3", title: "Terapia & Saúde Emocional", duration: "50 min", price: 200, tag: "Online / Presencial", desc: "Acompanhamento focado em equilíbrio pessoal, ansiedade e qualidade de vida." },
    { id: "s4", title: "Check-up Preventivo de Bem-Estar", duration: "45 min", price: 220, tag: "Preventivo", desc: "Mapeamento dos hábitos de sono, estresse e orientações de rotina saudável." },
  ],
  contabilidade: [
    { id: "c1", title: "Diagnóstico Fiscal & Abertura de Empresa", duration: "45 min", price: 0, tag: "Cortesia", desc: "Enquadramento tributário ideal (Simples Nacional, Lucro Presumido), economia tributária e emissão de CNPJ." },
    { id: "c2", title: "Assessoria Contábil Mensal para Clínicas", duration: "Contínuo", price: 490, tag: "Especializado", desc: "Gestão fiscal e contábil completa para médicos, biomédicos e profissionais da saúde/estética." },
    { id: "c3", title: "Consultoria de BPO Financeiro & Fluxo de Caixa", duration: "60 min", price: 350, tag: "Gestão", desc: "Estruturação das contas a pagar, conciliação bancária e dashboards de faturamento." },
  ]
};

export default function ClientPortal({ onBackToAdmin, onBookAppointment }: ClientPortalProps) {
  const [activeTab, setActiveTab] = useState<"estetica" | "saude" | "contabilidade">("estetica");
  const [selectedService, setSelectedService] = useState<{ title: string; price: number; duration: string } | null>(null);

  // Form de Agendamento Rápido
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [selectedDate, setSelectedDate] = useState("Hoje");
  const [selectedTime, setSelectedTime] = useState("14:00");
  const [bookedSuccess, setBookedSuccess] = useState(false);

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !clientName || !clientPhone) return;

    if (onBookAppointment) {
      const initials = clientName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
      onBookAppointment({
        id: `cli-portal-${Date.now()}`,
        clientName,
        clientInitials: initials || "CL",
        service: selectedService.title,
        time: selectedTime,
        endTime: "15:00",
        price: selectedService.price,
        status: "confirmado",
        date: new Date().toISOString().slice(0, 10),
      });
    }

    setBookedSuccess(true);
    setTimeout(() => {
      setBookedSuccess(false);
      setSelectedService(null);
      setClientName("");
      setClientPhone("");
    }, 2800);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-[#FFC107] selection:text-black">
      {/* Topo / Navbar do Portal */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#111111] text-[#FFC107] font-black text-sm flex items-center justify-center shadow-xs">
            MIA
          </div>
          <div>
            <div className="text-sm font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
              <span>Espaço do Cliente</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Agenda Aberta
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Estética Facial & Corporal • Saúde Integrativa • Assessoria Contábil
            </p>
          </div>
        </div>

        {onBackToAdmin && (
          <button
            onClick={onBackToAdmin}
            className="px-3.5 py-1.5 text-xs font-bold bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Painel da Tayná (Admin) →
          </button>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-amber-50/20 to-zinc-50 pt-12 pb-16 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF8E7] text-zinc-900 border border-[#FFC107]/50 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC107]" />
            <span>Atendimento Premium & Cuidado Integrado</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
            Excelência em <span className="underline decoration-[#FFC107] decoration-wavy decoration-from-font">Saúde, Estética</span> e Gestão.
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Agende seu procedimento estético, consulta de saúde preventiva ou assessoria contábil de forma rápida, sem filas e com confirmação direta pelo WhatsApp.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#servicos"
              className="px-6 py-3 bg-[#FFC107] hover:bg-[#ffb300] text-black font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Escolher Horário
            </a>
            <a
              href="https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20tirar%20uma%20dúvida%20sobre%20os%20atendimentos."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-white hover:bg-zinc-100 text-zinc-800 font-bold text-xs sm:text-sm rounded-2xl border border-zinc-200/80 shadow-xs transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-600" /> Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Seção dos 3 Nichos */}
      <section id="servicos" className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Filtro dos 3 Nichos */}
        <div className="flex items-center justify-center gap-2 max-w-md mx-auto p-1.5 bg-zinc-200/60 rounded-2xl">
          <button
            onClick={() => setActiveTab("estetica")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "estetica"
                ? "bg-white text-zinc-950 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Beleza & Estética</span>
          </button>

          <button
            onClick={() => setActiveTab("saude")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "saude"
                ? "bg-white text-zinc-950 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
            <span>Saúde & Bem-estar</span>
          </button>

          <button
            onClick={() => setActiveTab("contabilidade")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "contabilidade"
                ? "bg-white text-zinc-950 shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-blue-600" />
            <span>Contabilidade</span>
          </button>
        </div>

        {/* Catálogo de Procedimentos/Serviços */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROCEDURES_BY_NICHE[activeTab].map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs hover:border-[#FFC107] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    {item.tag}
                  </span>
                  <span className="text-xs text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.duration}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm sm:text-base text-zinc-900">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-zinc-400 font-bold uppercase">Investimento</div>
                  <div className="text-lg font-black text-zinc-950">
                    {item.price === 0 ? "Gratuito" : `R$ ${item.price.toFixed(2).replace(".", ",")}`}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedService(item)}
                  className="px-4 py-2 bg-[#FFC107] hover:bg-[#ffb300] text-black font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Agendar</span>
                  <ArrowRight className="w-3 h-3 stroke-[3]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL DE AGENDAMENTO RÁPIDO DO CLIENTE */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-zinc-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-sm font-extrabold text-zinc-900">
                  Confirmar Agendamento
                </h3>
                <p className="text-[11px] text-zinc-400">
                  {selectedService.title} • {selectedService.duration}
                </p>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="text-zinc-400 hover:text-zinc-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {bookedSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-900">
                  Agendamento Solicitado com Sucesso!
                </h4>
                <p className="text-xs text-emerald-700">
                  Nossa equipe e a IA MIA receberam sua solicitação no sistema e entrarão em contato no WhatsApp informado.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Seu Nome Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Beatriz Albuquerque"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">WhatsApp de Contato *</label>
                  <input
                    type="tel"
                    required
                    placeholder="(11) 99999-8888"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Dia Preferido</label>
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-bold"
                    >
                      <option value="Hoje">Hoje</option>
                      <option value="Amanhã">Amanhã</option>
                      <option value="Segunda">Segunda-feira</option>
                      <option value="Terça">Terça-feira</option>
                      <option value="Quarta">Quarta-feira</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">Horário</label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-bold"
                    >
                      <option value="09:00">09:00</option>
                      <option value="11:00">11:00</option>
                      <option value="14:00">14:00</option>
                      <option value="16:00">16:00</option>
                      <option value="18:00">18:00</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl flex items-center justify-between">
                  <span className="font-semibold text-zinc-600">Total a Pagar no Local:</span>
                  <span className="font-black text-sm text-zinc-950">
                    {selectedService.price === 0 ? "Gratuito" : `R$ ${selectedService.price.toFixed(2).replace(".", ",")}`}
                  </span>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
                    className="flex-1 py-2 text-zinc-600 font-bold border border-zinc-200 rounded-xl hover:bg-zinc-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#FFC107] hover:bg-[#ffb300] text-black font-extrabold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Confirmar Vaga
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
