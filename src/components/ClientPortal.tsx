"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles, HeartPulse, Calendar, Clock, CheckCircle2,
  Phone, ArrowRight, ShieldCheck, Star, Check, ChevronRight,
  ArrowLeft, MessageSquare, FileText, Gift, Award, Zap, ChevronDown
} from "lucide-react";
import { Appointment } from "@/types/crm";

interface ClientPortalProps {
  onBackToAdmin?: () => void;
  onBookAppointment?: (app: Appointment) => void;
}

interface ProposalPackage {
  id: string;
  category: "estetica" | "saude";
  title: string;
  subtitle: string;
  tag: string;
  highlight?: boolean;
  priceOriginal: number;
  pricePromo: number;
  installments: string;
  durationTotal: string;
  sessionsCount: number;
  rating: string;
  reviewsCount: number;
  description: string;
  includedItems: string[];
  exclusiveBonuses: string[];
  suitableFor: string;
}

const PROPOSAL_PACKAGES: ProposalPackage[] = [
  // PROPOSTAS DE BELEZA & ESTÉTICA
  {
    id: "pkg-estetica-glow",
    category: "estetica",
    title: "Protocolo Glow & Revitalização Facial Total",
    subtitle: "Tratamento intensivo para renovação celular, fechamento de poros e viço radiante",
    tag: "Mais Vendido ✨",
    highlight: true,
    priceOriginal: 520,
    pricePromo: 379,
    installments: "3x de R$ 126,33 sem juros",
    durationTotal: "90 min",
    sessionsCount: 1,
    rating: "5.0",
    reviewsCount: 142,
    description: "Combinação exclusiva de Limpeza de Pele Profunda com extração ultrassônica + Peeling de Diamante + Máscara Led Regeneradora e hidratação com Ácido Hialurônico.",
    includedItems: [
      "Higienização com vapor de ozônio e emoliência sem dor",
      "Extração profunda de cravos por sucção a vácuo",
      "Peeling de Diamante para remoção da camada córnea e manchas superficiais",
      "Aplicação de Sérum Tensor com Nanotecnologia Hialurônica",
      "Máscara de Ouro / Fototerapia Led Calmante"
    ],
    exclusiveBonuses: [
      "🎁 Bônus 1: Drenagem linfática facial relaxante (Valor R$ 90 grátis)",
      "🎁 Bônus 2: Consultoria Home Care para cuidados em casa"
    ],
    suitableFor: "Peles opacas, com oleosidade, poros abertos ou que buscam efeito imediato para eventos."
  },
  {
    id: "pkg-estetica-olhar",
    category: "estetica",
    title: "Combo Olhar Marcante: Lash Lifting + Sobrancelhas",
    subtitle: "Destaque e naturalidade para o rosto sem necessidade de rímel diário",
    tag: "Queridinho das Clientes 💖",
    priceOriginal: 240,
    pricePromo: 189,
    installments: "2x de R$ 94,50 sem juros",
    durationTotal: "60 min",
    sessionsCount: 1,
    rating: "4.9",
    reviewsCount: 98,
    description: "Curvatura dos cílios naturais com nutrição à base de queratina e aminoácidos, associada ao alinhamento com design personalizado respeitando seu visagismo.",
    includedItems: [
      "Mapeamento facial e alinhamento milimétrico das sobrancelhas",
      "Depilação com cera hipoalergênica ou pinça de precisão",
      "Lash Lifting orgânico para curvatura máxima dos cílios",
      "Tintura especial de cílios efeito rímel 24h",
      "Aplicação de sérum vitamínico fortalecedor de fios"
    ],
    exclusiveBonuses: [
      "🎁 Bônus: Escovinha higiênica e óleo de hidratação pós-procedimento"
    ],
    suitableFor: "Mulheres que buscam praticidade na rotina matinal com olhar naturalmente expressivo."
  },
  {
    id: "pkg-estetica-corpo",
    category: "estetica",
    title: "Ciclo Silhouette: 5 Sessões de Drenagem & Modeladora",
    subtitle: "Redução de medidas, alívio de retenção e melhora do contorno corporal",
    tag: "Pacote Tratamento 🌿",
    priceOriginal: 850,
    pricePromo: 620,
    installments: "4x de R$ 155,00 sem juros",
    durationTotal: "5 sessões de 50 min",
    sessionsCount: 5,
    rating: "4.9",
    reviewsCount: 76,
    description: "Tratamento corporal completo que combina drenagem linfática manual com manobras modeladoras vigorosas e pantalas anatômicas de madeira.",
    includedItems: [
      "5 sessões individuais de 50 minutos cada",
      "Massagem modeladora nos focos de celulite e gordura localizada",
      "Drenagem desintoxicante para eliminação de líquidos retidos",
      "Cremes termoativos com cafeína e centella asiática",
      "Acompanhamento quinzenal de medidas corporais"
    ],
    exclusiveBonuses: [
      "🎁 Bônus: 1 Sessão de esfoliação corporal detox na 1ª visita"
    ],
    suitableFor: "Pós-operatório, pernas cansadas, inchaço pré-menstrual ou redução de medidas."
  },

  // PROPOSTAS DE SAÚDE & BEM-ESTAR
  {
    id: "pkg-saude-nutri",
    category: "saude",
    title: "Plano Vitalidade: Consulta Integrativa + Acompanhamento 45 Dias",
    subtitle: "Emagrecimento saudável, disposição física e regulação hormonal sem dietas restritivas",
    tag: "Mais Procurado 🥗",
    highlight: true,
    priceOriginal: 480,
    pricePromo: 349,
    installments: "3x de R$ 116,33 sem juros",
    durationTotal: "45 dias de acompanhamento",
    sessionsCount: 2,
    rating: "5.0",
    reviewsCount: 114,
    description: "Abordagem completa da sua saúde: desde exame de bioimpedância de última geração até o plano alimentar personalizado adaptado à sua rotina real.",
    includedItems: [
      "Consulta inicial presencial de 60 minutos",
      "Exame de Bioimpedância Tetrapolar (% gordura, massa magra, hidratação e idade metabólica)",
      "Cardápio personalizado de fácil execução (sem ingredientes caros)",
      "Retorno com nova pesagem e reajuste de metas em 30 a 45 dias",
      "Suporte direto para dúvidas de receitas e compras no WhatsApp"
    ],
    exclusiveBonuses: [
      "🎁 Bônus 1: Guia Digital de Marmitas Saudáveis & Práticas",
      "🎁 Bônus 2: Lista de substituições inteligentes para restaurantes"
    ],
    suitableFor: "Quem quer perder peso com saúde, melhorar exames de sangue ou ganhar massa muscular."
  },
  {
    id: "pkg-saude-coluna",
    category: "saude",
    title: "Protocolo Coluna Livre de Dor: Avaliação + 3 Sessões Físio",
    subtitle: "Diagnóstico e tratamento da causa raiz de dores lombares, hérnias e cervical",
    tag: "Alívio Rápido 🩺",
    priceOriginal: 540,
    pricePromo: 399,
    installments: "3x de R$ 133,00 sem juros",
    durationTotal: "3 sessões de 50 min",
    sessionsCount: 3,
    rating: "4.9",
    reviewsCount: 88,
    description: "Tratamento de fisioterapia integrativa combinando terapia manual articular, liberação miofascial profunda e exercícios terapêuticos direcionados.",
    includedItems: [
      "Avaliação postural e biomecânica detalhada na 1ª sessão",
      "3 sessões completas com atendimento exclusivo 1 para 1",
      "Liberação miofascial instrumental e manual",
      "Ventosa terapia e termoterapia quando indicado",
      "Prescrição de rotina de 5 minutos de exercícios para fazer em casa"
    ],
    exclusiveBonuses: [
      "🎁 Bônus: Cartilha em vídeo com exercícios posturais para trabalho sentado"
    ],
    suitableFor: "Pessoas que trabalham no computador, sentem dores na lombar, torcicolo ou tensão."
  },
  {
    id: "pkg-saude-mente",
    category: "saude",
    title: "Ciclo Equilíbrio & Clareza Mental (4 Encontros)",
    subtitle: "Sessões terapêuticas para controle de ansiedade, estresse e alinhamento de vida",
    tag: "Saúde Mental 🧠",
    priceOriginal: 800,
    pricePromo: 580,
    installments: "4x de R$ 145,00 sem juros",
    durationTotal: "4 encontros semanais",
    sessionsCount: 4,
    rating: "5.0",
    reviewsCount: 67,
    description: "Espaço acolhedor e seguro de escuta profissional para desacelerar pensamentos, organizar prioridades e desenvolver inteligência emocional.",
    includedItems: [
      "4 sessões de 50 minutos (presenciais ou online à sua escolha)",
      "Mapeamento dos gatilhos de sobrecarga e estresse diário",
      "Ferramentas práticas de regulação emocional e respiração",
      "Acompanhamento do plano de evolução semanal",
      "Total sigilo profissional de acordo com código ético"
    ],
    exclusiveBonuses: [
      "🎁 Bônus: Áudios guiados de relaxamento e higiene do sono"
    ],
    suitableFor: "Pessoas sob pressão no trabalho, mães sobrecarregadas ou crises de ansiedade."
  }
];

const TIME_SLOTS = [
  "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
];

export default function ClientPortal({ onBackToAdmin, onBookAppointment }: ClientPortalProps) {
  // Apenas os 2 nichos solicitados: Beleza & Estética e Saúde & Bem-estar
  const [activeTab, setActiveTab] = useState<"estetica" | "saude">("estetica");

  // Modal de Agendamento da Proposta
  const [selectedPackage, setSelectedPackage] = useState<ProposalPackage | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1); // 1: Data/Hora, 2: Dados, 3: Sucesso

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
      if (d.getDay() === 0) continue; // Pula domingos

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

  const handleOpenBooking = (pkg: ProposalPackage) => {
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
      id: `cli-portal-${Date.now()}`,
      clientName,
      clientInitials: initials || "CL",
      service: `[Proposta] ${selectedPackage.title}`,
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
  const currentProposals = PROPOSAL_PACKAGES.filter((p) => p.category === activeTab);

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
              <span>Espaço de Propostas & Atendimento</span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Condições Especiais
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Escolha uma proposta abaixo para ver os benefícios e garantir seu horário
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

      {/* Hero com os 2 Nichos (Beleza & Estética e Saúde & Bem-estar) */}
      <section className="bg-gradient-to-b from-white via-amber-50/20 to-zinc-50 pt-10 pb-12 px-4 border-b border-zinc-200/60">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF8E7] text-zinc-900 border border-[#FFC107]/60 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC107]" />
            <span>Condições Exclusivas de Tratamento com a Tayná</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
            Escolha o cuidado ideal para você.
          </h1>

          <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto">
            Selecione uma das categorias abaixo para conhecer as propostas completas de procedimentos e garantir sua vaga com condição exclusiva.
          </p>

          {/* Os 2 Botões de Nicho Direcionando para as Propostas */}
          <div className="flex items-center justify-center gap-3 max-w-md mx-auto pt-4">
            <button
              onClick={() => setActiveTab("estetica")}
              className={`flex-1 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                activeTab === "estetica"
                  ? "bg-white border-[#FFC107] text-zinc-950 shadow-lg ring-2 ring-[#FFC107]/30 scale-102"
                  : "bg-white/80 border-zinc-200 text-zinc-600 hover:border-zinc-300"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Beleza & Estética</span>
            </button>

            <button
              onClick={() => setActiveTab("saude")}
              className={`flex-1 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                activeTab === "saude"
                  ? "bg-white border-rose-500 text-zinc-950 shadow-lg ring-2 ring-rose-500/30 scale-102"
                  : "bg-white/80 border-zinc-200 text-zinc-600 hover:border-zinc-300"
              }`}
            >
              <HeartPulse className="w-4 h-4 text-rose-500" />
              <span>Saúde & Bem-estar</span>
            </button>
          </div>
        </div>
      </section>

      {/* Landing Page das Propostas do Nicho Selecionado */}
      <section className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        {/* Header da Seção de Propostas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFC107]" />
              <h2 className="text-xl font-black text-zinc-900 tracking-tight">
                {activeTab === "estetica" ? "Propostas & Pacotes de Estética" : "Propostas & Planos de Saúde Integrativa"}
              </h2>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              {activeTab === "estetica"
                ? "Protocolos personalizados com tecnologia de ponta e produtos de alta performance."
                : "Acompanhamentos focados em diagnóstico preciso, bem-estar e qualidade de vida."}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 bg-zinc-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Garantia de Satisfação & Atendimento 1 para 1</span>
          </div>
        </div>

        {/* Lista de Cards de Propostas (Estilo Landing Page Premium) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {currentProposals.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all bg-white border relative ${
                pkg.highlight
                  ? "border-[#FFC107] shadow-xl ring-2 ring-[#FFC107]/20"
                  : "border-zinc-200/80 shadow-xs hover:border-zinc-300 hover:shadow-md"
              }`}
            >
              {/* Badge Topo */}
              {pkg.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#111111] text-[#FFC107] text-[10px] font-black rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-current" />
                  <span>Proposta Mais Recomendada</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Meta Header */}
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

                {/* Título & Descrição */}
                <div>
                  <h3 className="font-black text-lg text-zinc-950 leading-snug">
                    {pkg.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                    {pkg.subtitle}
                  </p>
                </div>

                {/* Box de Preço e Parcelamento */}
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/70 space-y-1">
                  <div className="text-[11px] text-zinc-400 line-through">
                    De R$ {pkg.priceOriginal.toFixed(2).replace(".", ",")}
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-zinc-950">
                      R$ {pkg.pricePromo.toFixed(2).replace(".", ",")}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Economize R$ {(pkg.priceOriginal - pkg.pricePromo).toFixed(0)}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500 font-medium">
                    {pkg.installments}
                  </div>
                </div>

                {/* O que está incluso na proposta */}
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

                {/* Bônus Exclusivos */}
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-1.5">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>Bônus Exclusivos Desta Proposta:</span>
                  </div>
                  {pkg.exclusiveBonuses.map((bonus, idx) => (
                    <div key={idx} className="text-[11px] font-bold text-zinc-800 leading-snug">
                      {bonus}
                    </div>
                  ))}
                </div>

                {/* Indicado Para */}
                <div className="text-[11px] text-zinc-500 pt-1">
                  <strong>Indicado para:</strong> {pkg.suitableFor}
                </div>
              </div>

              {/* Botão de Ação CTA */}
              <div className="pt-6 border-t border-zinc-100 mt-6 space-y-2">
                <button
                  onClick={() => handleOpenBooking(pkg)}
                  className={`w-full py-3 px-4 rounded-2xl text-xs sm:text-sm font-extrabold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                    pkg.highlight
                      ? "bg-[#FFC107] hover:bg-[#ffb300] text-black shadow-md"
                      : "bg-zinc-900 hover:bg-black text-white"
                  }`}
                >
                  <span>Aceitar Proposta & Agendar</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <div className="flex items-center justify-center gap-3 text-[10px] text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {pkg.durationTotal}
                  </span>
                  <span>•</span>
                  <span>Sem taxa de adesão</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL DE AGENDAMENTO DA PROPOSTA (CALENDÁRIO + DADOS) */}
      {selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-zinc-100 space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                  {currentStep === 1 ? "Etapa 1 de 2: Data e Horário" : currentStep === 2 ? "Etapa 2 de 2: Dados de Confirmação" : "Proposta Confirmada!"}
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

            {/* ETAPA 1: SELEÇÃO DE DIA E HORÁRIO */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-extrabold text-zinc-800 mb-2 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#FFC107]" />
                    <span>1. Selecione o melhor dia para iniciar seu tratamento:</span>
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

                {/* Resumo da Proposta */}
                <div className="p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-zinc-400 font-semibold block text-[10px]">Data e Horário:</span>
                    <span className="font-extrabold text-zinc-900">
                      {selectedDayObj?.weekday}, {selectedDayObj?.dayNumber} de {selectedDayObj?.monthName} às {selectedTime}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-zinc-400 font-semibold block text-[10px]">Valor da Proposta:</span>
                    <span className="font-black text-sm text-zinc-950">
                      R$ {selectedPackage.pricePromo.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>

                {/* Avançar */}
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
                    <span>Preencher Meus Dados</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>
              </div>
            )}

            {/* ETAPA 2: DADOS DO CLIENTE */}
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
                      placeholder="Ex: Amanda Rezende"
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
                      A Tayná e a IA MIA enviarão o comprovante do agendamento neste número.
                    </span>
                  </div>

                  <div>
                    <label className="block font-extrabold text-zinc-800 mb-1">
                      E-mail (Opcional)
                    </label>
                    <input
                      type="email"
                      placeholder="amanda@exemplo.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                    />
                  </div>

                  <div>
                    <label className="block font-extrabold text-zinc-800 mb-1">
                      Observação ou preferência de atendimento:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Quero tirar dúvidas sobre o bônus / já fiz procedimento antes..."
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                    />
                  </div>
                </div>

                {/* Box de Resumo da Proposta */}
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-[11px] text-amber-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Resumo da Proposta:</span>
                  </div>
                  <div className="text-zinc-700">
                    <strong>{selectedPackage.title}</strong> — {selectedDayObj?.weekday}, {selectedDayObj?.dayNumber} de {selectedDayObj?.monthName} às <strong>{selectedTime}</strong>.
                  </div>
                  <div className="text-emerald-700 font-bold">
                    Valor: R$ {selectedPackage.pricePromo.toFixed(2).replace(".", ",")} ({selectedPackage.installments}).
                  </div>
                </div>

                {/* Botões */}
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
                      <span>Garantindo vaga...</span>
                    ) : (
                      <>
                        <span>Garantir Proposta & Vaga</span>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ETAPA 3: SUCESSO */}
            {currentStep === 3 && (
              <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-black text-zinc-950">
                    Proposta Aceita & Horário Reservado!
                  </h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Parabéns, <strong>{clientName}</strong>! Sua condição especial para <strong>{selectedPackage.title}</strong> foi registrada no sistema da Tayná.
                  </p>
                </div>

                <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl max-w-md mx-auto text-left text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-semibold">Início:</span>
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
                    href={`https://wa.me/5511999999999?text=Olá%20Tayná!%20Acabei%20de%20garantir%20a%20proposta%20${encodeURIComponent(selectedPackage.title)}%20para%20o%20dia%20${selectedDayObj?.dayNumber}/${selectedDayObj?.monthName}%20às%20${selectedTime}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Confirmar com a Tayná no WhatsApp</span>
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
