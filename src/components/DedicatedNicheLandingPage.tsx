"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar, Clock, CheckCircle2, Phone, ArrowRight, ShieldCheck,
  Star, Check, ChevronRight, ArrowLeft, MessageSquare, Award, Zap, Sparkles
} from "lucide-react";
import { Appointment } from "@/types/crm";

export interface ServiceProposal {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  highlight?: boolean;
  priceOriginal: number;
  pricePromo: number;
  installments: string;
  durationTotal: string;
  rating: string;
  reviewsCount: number;
  includedItems: string[];
  exclusiveBonuses: string[];
  suitableFor: string;
}

interface DedicatedNicheLandingPageProps {
  nicheType: "estetica" | "saude";
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroAccentColor: string;
  proposals: ServiceProposal[];
  onBookAppointment?: (app: Appointment) => void;
}

const TIME_SLOTS = [
  "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
];

export default function DedicatedNicheLandingPage({
  nicheType,
  heroBadge,
  heroTitle,
  heroSubtitle,
  heroAccentColor,
  proposals,
  onBookAppointment,
}: DedicatedNicheLandingPageProps) {
  const [selectedPackage, setSelectedPackage] = useState<ServiceProposal | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Dias disponíveis
  const [availableDays, setAvailableDays] = useState<{ iso: string; weekday: string; dayNumber: string; monthName: string }[]>([]);
  const [selectedDayIso, setSelectedDayIso] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("14:00");

  // Form states
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientNotes, setClientNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const days = [];
    const today = new Date();
    const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (d.getDay() === 0) continue;

      const iso = d.toISOString().slice(0, 10);
      days.push({
        iso,
        weekday: i === 0 ? "Hoje" : i === 1 ? "Amanhã" : weekdays[d.getDay()],
        dayNumber: String(d.getDate()).padStart(2, "0"),
        monthName: months[d.getMonth()]
      });
    }

    setAvailableDays(days);
    if (days.length > 0) {
      setSelectedDayIso(days[0].iso);
    }
  }, []);

  const handleOpenBooking = (pkg: ServiceProposal) => {
    setSelectedPackage(pkg);
    setCurrentStep(1);
  };

  const handleFinishBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage || !clientName || !clientPhone) return;

    setIsSubmitting(true);

    const initials = clientName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    const newAppointment: Appointment = {
      id: `cli-${nicheType}-${Date.now()}`,
      clientName,
      clientInitials: initials || "CL",
      service: `[${nicheType === "estetica" ? "Estética" : "Saúde"}] ${selectedPackage.title}`,
      time: selectedTime,
      endTime: "15:30",
      date: selectedDayIso,
      price: selectedPackage.pricePromo,
      status: "confirmado",
    };

    if (onBookAppointment) {
      onBookAppointment(newAppointment);
    }

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("mia_appointments");
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(newAppointment);
        localStorage.setItem("mia_appointments", JSON.stringify(list));
      } catch (err) {
        console.error(err);
      }
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentStep(3);
    }, 600);
  };

  const selectedDayObj = availableDays.find((d) => d.iso === selectedDayIso);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-[#FFC107] selection:text-black">
      {/* Header com navegação para voltar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <a
            href="/agendar"
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-xl transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar à Apresentação</span>
          </a>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-zinc-500 hidden sm:inline">
            Clínica & Espaço Tayná
          </span>
          <a
            href="/"
            className="px-3 py-1.5 text-xs font-bold bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl transition-all"
          >
            Painel Admin →
          </a>
        </div>
      </header>

      {/* Hero da Página Específica */}
      <section className="bg-gradient-to-b from-white via-amber-50/20 to-zinc-50 pt-10 pb-12 px-4 border-b border-zinc-200/60">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF8E7] text-zinc-900 border border-[#FFC107]/60 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC107]" />
            <span>{heroBadge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
            {heroTitle}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto">
            {heroSubtitle}
          </p>

          <div className="flex items-center justify-center gap-4 text-xs font-bold text-zinc-500 pt-2">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Atendimento Exclusivo 1 para 1
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Procedimentos Seguros e Certificados
            </span>
          </div>
        </div>
      </section>

      {/* Grid de Serviços e Propostas com Marcação de Horário */}
      <section className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-200/80 pb-4">
          <div>
            <h2 className="text-xl font-black text-zinc-900 tracking-tight">
              Tabela de Tratamentos & Condições Exclusivas
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Escolha uma opção para visualizar o que está incluso e reservar sua vaga na agenda da Tayná.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-zinc-100 text-zinc-700">
            {proposals.length} opções disponíveis
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {proposals.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all bg-white border relative ${
                pkg.highlight
                  ? "border-[#FFC107] shadow-xl ring-2 ring-[#FFC107]/20"
                  : "border-zinc-200/80 shadow-xs hover:border-zinc-300 hover:shadow-md"
              }`}
            >
              {pkg.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#111111] text-[#FFC107] text-[10px] font-black rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-current" />
                  <span>Mais Recomendado</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2 pt-1">
                  <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80">
                    {pkg.tag}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-50/60 px-2 py-0.5 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{pkg.rating}</span>
                    <span className="text-zinc-400 font-normal">({pkg.reviewsCount})</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-black text-lg text-zinc-950 leading-snug">
                    {pkg.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                    {pkg.subtitle}
                  </p>
                </div>

                {/* Bloco de Preço */}
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/70 space-y-1">
                  <div className="text-[11px] text-zinc-400 line-through">
                    De R$ {pkg.priceOriginal.toFixed(2).replace(".", ",")}
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-zinc-950">
                      R$ {pkg.pricePromo.toFixed(2).replace(".", ",")}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Economia R$ {(pkg.priceOriginal - pkg.pricePromo).toFixed(0)}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500 font-medium">
                    {pkg.installments}
                  </div>
                </div>

                {/* Itens Inclusos */}
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] font-black uppercase tracking-wider text-zinc-400">
                    O que está incluso:
                  </div>
                  <div className="space-y-2">
                    {pkg.includedItems.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-zinc-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-tight">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bônus */}
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-1.5">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>Bônus Exclusivo da Sessão:</span>
                  </div>
                  {pkg.exclusiveBonuses.map((bonus, idx) => (
                    <div key={idx} className="text-[11px] font-bold text-zinc-800 leading-snug">
                      {bonus}
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-zinc-500 pt-1">
                  <strong>Indicado para:</strong> {pkg.suitableFor}
                </div>
              </div>

              {/* Botão de Agendamento */}
              <div className="pt-6 border-t border-zinc-100 mt-6 space-y-2">
                <button
                  onClick={() => handleOpenBooking(pkg)}
                  className={`w-full py-3 px-4 rounded-2xl text-xs sm:text-sm font-extrabold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                    pkg.highlight
                      ? "bg-[#FFC107] hover:bg-[#ffb300] text-black shadow-md"
                      : "bg-zinc-900 hover:bg-black text-white"
                  }`}
                >
                  <span>Agendar Este Procedimento</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <div className="flex items-center justify-center gap-3 text-[10px] text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {pkg.durationTotal}
                  </span>
                  <span>•</span>
                  <span>Pagamento facilitado no local</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL DE AGENDAMENTO DE HORÁRIO */}
      {selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-zinc-100 space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                  {currentStep === 1 ? "Passo 1 de 2: Escolha o Dia e Horário" : currentStep === 2 ? "Passo 2 de 2: Seus Dados" : "Horário Reservado!"}
                </span>
                <h3 className="text-base font-black text-zinc-900 mt-1">
                  {selectedPackage.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPackage(null)}
                className="text-zinc-400 hover:text-zinc-800 p-1.5 rounded-xl hover:bg-zinc-100 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* PASSO 1: CALENDÁRIO */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-extrabold text-zinc-800 mb-2 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#FFC107]" />
                    <span>1. Escolha o dia do seu atendimento:</span>
                  </label>

                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {availableDays.map((day) => {
                      const isSelected = selectedDayIso === day.iso;
                      return (
                        <button
                          key={day.iso}
                          type="button"
                          onClick={() => setSelectedDayIso(day.iso)}
                          className={`flex flex-col items-center justify-center p-3 rounded-2xl min-w-[70px] border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-zinc-900 text-white border-zinc-900 shadow-md ring-2 ring-[#FFC107]"
                              : "bg-zinc-50 border-zinc-200/80 text-zinc-700 hover:bg-zinc-100"
                          }`}
                        >
                          <span className={`text-[10px] font-bold ${isSelected ? "text-amber-400" : "text-zinc-400"}`}>
                            {day.weekday}
                          </span>
                          <span className="text-base font-black my-0.5">
                            {day.dayNumber}
                          </span>
                          <span className="text-[9px] uppercase font-bold text-zinc-400">
                            {day.monthName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-zinc-800 mb-2 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#FFC107]" />
                    <span>2. Escolha o horário de início:</span>
                  </label>

                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-44 overflow-y-auto p-1">
                    {TIME_SLOTS.map((time) => {
                      const isSelected = selectedTime === time;
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 px-1 text-center rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#FFC107] border-[#FFC107] text-black shadow-xs font-black scale-105"
                              : "bg-white border-zinc-200/80 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-zinc-400 font-semibold block text-[10px]">Data selecionada:</span>
                    <span className="font-extrabold text-zinc-900">
                      {selectedDayObj?.weekday}, {selectedDayObj?.dayNumber} de {selectedDayObj?.monthName} às {selectedTime}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-zinc-400 font-semibold block text-[10px]">Valor:</span>
                    <span className="font-black text-sm text-zinc-950">
                      R$ {selectedPackage.pricePromo.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPackage(null)}
                    className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-800"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-2.5 bg-[#FFC107] hover:bg-[#ffb300] text-black font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Continuar</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>
              </div>
            )}

            {/* PASSO 2: FORM DE DADOS */}
            {currentStep === 2 && (
              <form onSubmit={handleFinishBooking} className="space-y-4">
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-extrabold text-zinc-800 mb-1">
                      Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Beatriz Lima Ramos"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                    />
                  </div>

                  <div>
                    <label className="block font-extrabold text-zinc-800 mb-1">
                      WhatsApp para Confirmação *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(11) 98765-4321"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                    />
                    <span className="text-[10px] text-zinc-400 mt-1 block">
                      Enviaremos o lembrete e localização da clínica neste WhatsApp.
                    </span>
                  </div>

                  <div>
                    <label className="block font-extrabold text-zinc-800 mb-1">
                      E-mail (Opcional)
                    </label>
                    <input
                      type="email"
                      placeholder="beatriz@exemplo.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                    />
                  </div>

                  <div>
                    <label className="block font-extrabold text-zinc-800 mb-1">
                      Observação / Dúvida prévia:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Tenho pele sensível / gostaria de tirar dúvidas..."
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                    />
                  </div>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-[11px] text-amber-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Resumo da Reserva:</span>
                  </div>
                  <div className="text-zinc-700">
                    <strong>{selectedPackage.title}</strong> — {selectedDayObj?.weekday}, {selectedDayObj?.dayNumber} de {selectedDayObj?.monthName} às <strong>{selectedTime}</strong>.
                  </div>
                  <div className="text-emerald-700 font-bold">
                    Investimento: R$ {selectedPackage.pricePromo.toFixed(2).replace(".", ",")} ({selectedPackage.installments}).
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-800 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-[#FFC107] hover:bg-[#ffb300] text-black font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Reservando...</span>
                    ) : (
                      <>
                        <span>Finalizar Agendamento</span>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* PASSO 3: SUCESSO */}
            {currentStep === 3 && (
              <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-black text-zinc-950">
                    Agendamento Confirmado com Sucesso!
                  </h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Muito obrigado, <strong>{clientName}</strong>! Sua vaga para <strong>{selectedPackage.title}</strong> já foi registrada na agenda da Tayná.
                  </p>
                </div>

                <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl max-w-md mx-auto text-left text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-semibold">Horário:</span>
                    <span className="font-extrabold text-emerald-700">
                      {selectedDayObj?.weekday}, {selectedDayObj?.dayNumber} de {selectedDayObj?.monthName} às {selectedTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-semibold">Valor com Desconto:</span>
                    <span className="font-bold text-zinc-900">
                      R$ {selectedPackage.pricePromo.toFixed(2).replace(".", ",")} ({selectedPackage.installments})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-semibold">WhatsApp de Contato:</span>
                    <span className="font-mono text-zinc-800">{clientPhone}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                  <a
                    href={`https://wa.me/5511999999999?text=Olá%20Tayná!%20Acabei%20de%20agendar%20meu%20horário%20para%20${encodeURIComponent(selectedPackage.title)}%20no%20dia%20${selectedDayObj?.dayNumber}/${selectedDayObj?.monthName}%20às%20${selectedTime}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Falar com a Tayná no WhatsApp</span>
                  </a>

                  <button
                    onClick={() => {
                      setSelectedPackage(null);
                      setCurrentStep(1);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Concluir
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
