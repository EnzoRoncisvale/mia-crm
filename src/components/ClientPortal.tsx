"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles, HeartPulse, Calculator, Calendar, Clock, CheckCircle2,
  Phone, ArrowRight, ShieldCheck, MapPin, Award, Star, MessageSquare,
  User, Check, ChevronRight, AlertCircle, ArrowLeft, Info
} from "lucide-react";
import { Appointment } from "@/types/crm";

interface ClientPortalProps {
  onBackToAdmin?: () => void;
  onBookAppointment?: (app: Appointment) => void;
}

interface ServiceItem {
  id: string;
  title: string;
  category: "estetica" | "saude" | "contabilidade";
  duration: string;
  price: number;
  tag: string;
  rating: string;
  reviewsCount: number;
  desc: string;
  benefits: string[];
}

const ALL_SERVICES: ServiceItem[] = [
  // ESTÉTICA
  {
    id: "e1",
    category: "estetica",
    title: "Limpeza de Pele Profunda + Peeling Ultrassônico",
    duration: "60 min",
    price: 180,
    tag: "Mais Procurado 🔥",
    rating: "4.9",
    reviewsCount: 128,
    desc: "Higienização profunda dos poros com extração por sucção, vapor de ozônio, esfoliação ultrassônica e máscara calmante revitalizante.",
    benefits: ["Remove cravos e impurezas", "Reduz oleosidade excessiva", "Pele iluminada e macia"]
  },
  {
    id: "e2",
    category: "estetica",
    title: "Harmonização & Peeling de Diamante Glow",
    duration: "45 min",
    price: 320,
    tag: "Resultado Imediato ✨",
    rating: "5.0",
    reviewsCount: 94,
    desc: "Microdermoabrasão suave com aplicação de sérum tensor de ácido hialurônico para uniformização do tom e viço.",
    benefits: ["Suaviza linhas de expressão", "Uniformiza o tom da pele", "Estimula síntese de colágeno"]
  },
  {
    id: "e3",
    category: "estetica",
    title: "Drenagem Linfática Facial & Corporal Anti-Inchaço",
    duration: "50 min",
    price: 150,
    tag: "Relax & Desintoxicação",
    rating: "4.8",
    reviewsCount: 76,
    desc: "Manobras rítmicas suaves para acelerar a drenagem de toxinas, amenizar retenção hídrica e aliviar o cansaço.",
    benefits: ["Alívio imediato do inchaço", "Melhora circulação periférica", "Sensação profunda de relaxamento"]
  },
  {
    id: "e4",
    category: "estetica",
    title: "Design de Sobrancelhas + Lash Lifting",
    duration: "45 min",
    price: 130,
    tag: "Olhar Marcante",
    rating: "4.9",
    reviewsCount: 110,
    desc: "Mapeamento facial personalizado, alinhamento simétrico e curvatura natural dos cílios com hidratação de queratina.",
    benefits: ["Destaque para o olhar", "Cílios curvados por até 6 semanas", "Não necessita rímel"]
  },

  // SAÚDE & BEM-ESTAR
  {
    id: "s1",
    category: "saude",
    title: "Consulta Nutricional Integrativa + Bioimpedância",
    duration: "60 min",
    price: 250,
    tag: "Avaliação Completa 🥗",
    rating: "5.0",
    reviewsCount: 85,
    desc: "Exame de composição corporal em aparelho tetrapolar, rastreamento metabólico e elaboração de cardápio prático sem restrições severas.",
    benefits: ["Plano alimentar sob medida", "Análise de % de gordura e músculo", "Suporte via WhatsApp pós-consulta"]
  },
  {
    id: "s2",
    category: "saude",
    title: "Sessão de Fisioterapia & Alívio de Dores na Coluna",
    duration: "50 min",
    price: 180,
    tag: "Tratamento da Dor 🩺",
    rating: "4.9",
    reviewsCount: 62,
    desc: "Diagnóstico biomecânico, liberação miofascial e terapia manual focada na causa raiz de dores lombares e cervicais.",
    benefits: ["Alívio imediato da tensão muscular", "Correção postural ativa", "Exercícios para prevenção em casa"]
  },
  {
    id: "s3",
    category: "saude",
    title: "Sessão de Terapia & Saúde Emocional",
    duration: "50 min",
    price: 200,
    tag: "Acolhimento & Equilíbrio 🧠",
    rating: "5.0",
    reviewsCount: 53,
    desc: "Espaço confidencial com psicóloga para manejo de estresse, ansiedade, autoconhecimento e equilíbrio de rotina.",
    benefits: ["Atendimento presencial ou online", "Ambiente acolhedor e seguro", "Estratégias de clareza mental"]
  },

  // CONTABILIDADE
  {
    id: "c1",
    category: "contabilidade",
    title: "Diagnóstico Fiscal & Planejamento para PJ / Médicos",
    duration: "45 min",
    price: 0,
    tag: "100% Gratuito / Cortesia 📊",
    rating: "5.0",
    reviewsCount: 42,
    desc: "Análise minuciosa para redução legal de tributos (Fator R, Simples Nacional vs Lucro Presumido) para clínicas e prestadores.",
    benefits: ["Descubra como pagar menos imposto legalmente", "Checkup de pendências de CNPJ", "Sem compromisso de contratação"]
  },
  {
    id: "c2",
    category: "contabilidade",
    title: "Assessoria Contábil Mensal Especializada",
    duration: "Mensal",
    price: 490,
    tag: "Tranquilidade Total",
    rating: "4.9",
    reviewsCount: 39,
    desc: "Emissão de notas fiscais, folha de pagamento, cálculo de guias de impostos e relatórios contábeis mensais no prazo.",
    benefits: ["Evita multas fiscais da Receita Federal", "Atendimento direto com contador especialista", "Plataforma de documentos digitais"]
  }
];

const TIME_SLOTS = [
  "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
];

export default function ClientPortal({ onBackToAdmin, onBookAppointment }: ClientPortalProps) {
  const [activeTab, setActiveTab] = useState<"estetica" | "saude" | "contabilidade">("estetica");
  
  // Fluxo de agendamento em passos (Step-by-step UX)
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1); // 1: Dia/Hora, 2: Dados, 3: Sucesso

  // Próximos 14 dias gerados dinamicamente
  const [availableDays, setAvailableDays] = useState<{ iso: string; weekday: string; dayNumber: string; monthName: string; isToday: boolean }[]>([]);
  const [selectedDayIso, setSelectedDayIso] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("14:00");

  // Dados do formulário do cliente
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientNotes, setClientNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Gera calendário interativo dos próximos 14 dias
    const days = [];
    const today = new Date();
    const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      // Pula domingo para consultório/escritório
      if (d.getDay() === 0) continue;

      const iso = d.toISOString().slice(0, 10);
      days.push({
        iso,
        weekday: i === 0 ? "Hoje" : i === 1 ? "Amanhã" : weekdays[d.getDay()],
        dayNumber: String(d.getDate()).padStart(2, "0"),
        monthName: months[d.getMonth()],
        isToday: i === 0
      });
    }

    setAvailableDays(days);
    if (days.length > 0) {
      setSelectedDayIso(days[0].iso);
    }
  }, []);

  const handleStartBooking = (service: ServiceItem) => {
    setSelectedService(service);
    setCurrentStep(1);
  };

  const handleFinishBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !clientName || !clientPhone) return;

    setIsSubmitting(true);

    const initials = clientName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    const newAppointment: Appointment = {
      id: `cli-portal-${Date.now()}`,
      clientName,
      clientInitials: initials || "CL",
      service: selectedService.title,
      time: selectedTime,
      endTime: "15:00",
      date: selectedDayIso,
      price: selectedService.price,
      status: "confirmado",
    };

    if (onBookAppointment) {
      onBookAppointment(newAppointment);
    }

    // Salva também direto no localStorage
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
      setCurrentStep(3); // Tela de Sucesso
    }, 700);
  };

  const selectedDayObj = availableDays.find((d) => d.iso === selectedDayIso);

  const filteredServices = ALL_SERVICES.filter((s) => s.category === activeTab);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-[#FFC107] selection:text-black">
      {/* Topo / Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#111111] text-[#FFC107] font-black text-sm flex items-center justify-center shadow-xs">
            MIA
          </div>
          <div>
            <div className="text-sm font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
              <span>Portal de Agendamento Online</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Vagas Abertas
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Escolha seu procedimento e confirme em menos de 1 minuto
            </p>
          </div>
        </div>

        {onBackToAdmin && (
          <button
            onClick={onBackToAdmin}
            className="px-3.5 py-1.5 text-xs font-bold bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1"
          >
            <span>Painel da Tayná (Admin)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </header>

      {/* Hero Interativo com Seletor de Categorias */}
      <section className="bg-gradient-to-b from-white via-amber-50/25 to-zinc-50 pt-10 pb-12 px-4 border-b border-zinc-200/60">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF8E7] text-zinc-900 border border-[#FFC107]/60 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC107]" />
            <span>Atendimento Personalizado & Confirmação por WhatsApp</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
            Cuidando da sua <span className="underline decoration-[#FFC107] decoration-wavy">saúde, beleza</span> e negócios.
          </h1>

          <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto">
            Sem telefonemas ou esperas. Escolha o serviço desejado abaixo, selecione o melhor dia e horário na agenda e receba o lembrete direto no celular.
          </p>

          {/* Abas Modernas com Pills de Nicho */}
          <div className="flex items-center justify-center gap-2 max-w-lg mx-auto pt-4">
            <button
              onClick={() => setActiveTab("estetica")}
              className={`flex-1 py-3 px-3 rounded-2xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer border ${
                activeTab === "estetica"
                  ? "bg-white border-[#FFC107] text-zinc-950 shadow-md ring-2 ring-[#FFC107]/20"
                  : "bg-white/80 border-zinc-200 text-zinc-600 hover:border-zinc-300"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Beleza & Estética</span>
            </button>

            <button
              onClick={() => setActiveTab("saude")}
              className={`flex-1 py-3 px-3 rounded-2xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer border ${
                activeTab === "saude"
                  ? "bg-white border-rose-500 text-zinc-950 shadow-md ring-2 ring-rose-500/20"
                  : "bg-white/80 border-zinc-200 text-zinc-600 hover:border-zinc-300"
              }`}
            >
              <HeartPulse className="w-4 h-4 text-rose-500" />
              <span>Saúde & Bem-estar</span>
            </button>

            <button
              onClick={() => setActiveTab("contabilidade")}
              className={`flex-1 py-3 px-3 rounded-2xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer border ${
                activeTab === "contabilidade"
                  ? "bg-white border-blue-500 text-zinc-950 shadow-md ring-2 ring-blue-500/20"
                  : "bg-white/80 border-zinc-200 text-zinc-600 hover:border-zinc-300"
              }`}
            >
              <Calculator className="w-4 h-4 text-blue-600" />
              <span>Contabilidade</span>
            </button>
          </div>
        </div>
      </section>

      {/* Grid de Serviços */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-black text-zinc-900 tracking-tight">
              Serviços & Procedimentos Disponíveis
            </h2>
            <p className="text-xs text-zinc-500">
              Selecione um item para ver detalhes e escolher a data ideal
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-zinc-100 text-zinc-700">
            {filteredServices.length} opções
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs hover:border-[#FFC107] hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Header do Card */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80">
                    {service.tag}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-50/50 px-2 py-0.5 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{service.rating}</span>
                    <span className="text-zinc-400 font-normal">({service.reviewsCount})</span>
                  </div>
                </div>

                <h3 className="font-black text-base text-zinc-900 group-hover:text-amber-800 transition-colors leading-snug">
                  {service.title}
                </h3>

                <p className="text-xs text-zinc-600 leading-relaxed">
                  {service.desc}
                </p>

                {/* Benefícios rápidos */}
                <div className="space-y-1.5 pt-1">
                  {service.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-zinc-600">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rodapé do Card com Preço e Ação */}
              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-zinc-400 font-bold uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {service.duration}
                  </div>
                  <div className="text-xl font-black text-zinc-950 mt-0.5">
                    {service.price === 0 ? "Gratuito" : `R$ ${service.price.toFixed(2).replace(".", ",")}`}
                  </div>
                </div>

                <button
                  onClick={() => handleStartBooking(service)}
                  className="px-5 py-2.5 bg-[#FFC107] hover:bg-[#ffb300] text-black font-extrabold text-xs rounded-2xl shadow-xs transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  <span>Agendar Horário</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL MODERNO DE AGENDAMENTO (CALENDÁRIO + DADOS DO CLIENTE) */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-zinc-100 space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Header do Modal com Barra de Etapas */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                  {currentStep === 1 ? "Etapa 1 de 2: Data e Horário" : currentStep === 2 ? "Etapa 2 de 2: Seus Dados" : "Agendamento Concluído"}
                </span>
                <h3 className="text-base font-black text-zinc-900 mt-1">
                  {selectedService.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="text-zinc-400 hover:text-zinc-800 p-1.5 rounded-xl hover:bg-zinc-100 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* ETAPA 1: ESCOLHA VISUAL DO DIA E HORÁRIO */}
            {currentStep === 1 && (
              <div className="space-y-5">
                {/* 1. Seleção de Dia (Carrossel Horizontal de Dias) */}
                <div>
                  <label className="block text-xs font-extrabold text-zinc-800 mb-2 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#FFC107]" />
                    <span>1. Escolha o melhor dia:</span>
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

                {/* 2. Seleção de Horário (Grade de Slots) */}
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

                {/* Resumo da Escolha */}
                <div className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-zinc-400 font-semibold block text-[10px]">Data selecionada:</span>
                    <span className="font-extrabold text-zinc-900">
                      {selectedDayObj?.weekday}, {selectedDayObj?.dayNumber} de {selectedDayObj?.monthName} às {selectedTime}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-zinc-400 font-semibold block text-[10px]">Valor do atendimento:</span>
                    <span className="font-black text-sm text-zinc-950">
                      {selectedService.price === 0 ? "Cortesia" : `R$ ${selectedService.price.toFixed(2).replace(".", ",")}`}
                    </span>
                  </div>
                </div>

                {/* Botão para Avançar */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
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

            {/* ETAPA 2: DADOS DO CLIENTE & CONFIRMAÇÃO */}
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
                      placeholder="Ex: Mariana Silva Gonçalves"
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
                      Enviaremos o lembrete e instruções do procedimento por aqui.
                    </span>
                  </div>

                  <div>
                    <label className="block font-extrabold text-zinc-800 mb-1">
                      E-mail (Opcional)
                    </label>
                    <input
                      type="email"
                      placeholder="mariana@exemplo.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                    />
                  </div>

                  <div>
                    <label className="block font-extrabold text-zinc-800 mb-1">
                      Alguma observação ou necessidade especial?
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Tenho pele sensível / prefiro profissional mulher / é minha primeira vez..."
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                    />
                  </div>
                </div>

                {/* Box de Resumo Final */}
                <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-2xl text-[11px] text-amber-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Resumo do Horário Selecionado:</span>
                  </div>
                  <div className="text-zinc-700">
                    <strong>{selectedService.title}</strong> — {selectedDayObj?.weekday}, {selectedDayObj?.dayNumber} de {selectedDayObj?.monthName} às <strong>{selectedTime}</strong> ({selectedService.duration})
                  </div>
                  <div className="text-[10px] text-zinc-500 pt-1">
                    Pagamento realizado diretamente no local no dia do procedimento.
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-800 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Calendário
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-[#FFC107] hover:bg-[#ffb300] text-black font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Confirmando...</span>
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

            {/* ETAPA 3: TELA DE SUCESSO / CONFIRMAÇÃO */}
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
                    Muito obrigado, <strong>{clientName}</strong>! Sua vaga foi reservada no sistema.
                  </p>
                </div>

                <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl max-w-md mx-auto text-left text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-semibold">Procedimento:</span>
                    <span className="font-bold text-zinc-900">{selectedService.title}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-semibold">Data e Horário:</span>
                    <span className="font-extrabold text-emerald-700">
                      {selectedDayObj?.weekday}, {selectedDayObj?.dayNumber} de {selectedDayObj?.monthName} às {selectedTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-semibold">WhatsApp informado:</span>
                    <span className="font-mono text-zinc-800">{clientPhone}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                  <a
                    href={`https://wa.me/5511999999999?text=Olá!%20Acabei%20de%20agendar%20meu%20horário%20para%20${encodeURIComponent(selectedService.title)}%20às%20${selectedTime}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Falar com Atendimento no WhatsApp</span>
                  </a>

                  <button
                    onClick={() => {
                      setSelectedService(null);
                      setCurrentStep(1);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Fechar
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
