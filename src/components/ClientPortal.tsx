"use client";

import React from "react";
import {
  Sparkles, HeartPulse, CheckCircle2, ShieldCheck, Star,
  Award, ArrowRight, Phone, MapPin, Clock, MessageSquare, ChevronRight,
  UserCheck, Heart, Sparkle
} from "lucide-react";

interface ClientPortalProps {
  onBackToAdmin?: () => void;
}

export default function ClientPortal({ onBackToAdmin }: ClientPortalProps) {
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
              <span>Espaço Tayná • Saúde & Estética Integrada</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Atendimento Personalizado
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Cuidado humanizado, ciência e tecnologia para o seu bem-estar
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

      {/* HERO PRINCIPAL: Apresentação com os 2 Botões de Direcionamento */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-amber-50/25 to-zinc-50 pt-12 pb-16 px-4 border-b border-zinc-200/60">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF8E7] text-zinc-900 border border-[#FFC107]/60 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC107]" />
            <span>Seja muito bem-vinda(o) ao nosso espaço</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
            Sua saúde e autoestima em harmonia com um atendimento único.
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Aqui você encontra um ambiente acolhedor e protocolos clínicos desenhados exclusivamente para você. Escolha abaixo a área desejada para conhecer nossas propostas e garantir seu horário:
          </p>

          {/* OS 2 BOTÕES QUE DIRECIONAM PARA AS PÁGINAS DEDICADAS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-4">
            {/* Botão Beleza & Estética */}
            <a
              href="/estetica"
              className="group p-5 bg-white hover:bg-amber-50/40 rounded-3xl border-2 border-zinc-200/90 hover:border-[#FFC107] shadow-sm hover:shadow-xl transition-all text-left flex flex-col justify-between space-y-3 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  Ver Propostas ✨
                </span>
              </div>

              <div>
                <h2 className="text-base font-black text-zinc-950 group-hover:text-amber-900 transition-colors flex items-center gap-1.5">
                  <span>Beleza & Estética</span>
                  <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
                </h2>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Limpeza de pele profunda, peeling glow, drenagem facial/corporal e lash lifting.
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] font-bold text-amber-600">
                <span>Ver tabela de preços e horários</span>
                <span>→</span>
              </div>
            </a>

            {/* Botão Saúde & Bem-estar */}
            <a
              href="/saude"
              className="group p-5 bg-white hover:bg-rose-50/40 rounded-3xl border-2 border-zinc-200/90 hover:border-rose-500 shadow-sm hover:shadow-xl transition-all text-left flex flex-col justify-between space-y-3 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                  <HeartPulse className="w-5 h-5 text-rose-500" />
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900">
                  Ver Planos 💖
                </span>
              </div>

              <div>
                <h2 className="text-base font-black text-zinc-950 group-hover:text-rose-900 transition-colors flex items-center gap-1.5">
                  <span>Saúde & Bem-estar</span>
                  <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
                </h2>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Nutrição integrativa com bioimpedância, fisioterapia para coluna e saúde emocional.
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] font-bold text-rose-600">
                <span>Ver planos e agendar consulta</span>
                <span>→</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* SEÇÃO 1: SOBRE A PROFISSIONAL TAYNÁ */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center gap-8">
          {/* Avatar / Imagem da Profissional */}
          <div className="relative shrink-0">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-tr from-[#111111] via-zinc-800 to-[#FFC107] text-[#FFC107] font-black text-4xl flex items-center justify-center shadow-lg border-4 border-white">
              TA
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 text-white rounded-2xl shadow-md" title="Certificada & Ativa">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          {/* Biografia e Filosofia da Tayná */}
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-xs font-extrabold">
              <Award className="w-3.5 h-3.5 text-[#FFC107]" />
              <span>Responsável Técnica & Especialista</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              Conheça a Profissional Tayná
            </h2>

            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Com anos de dedicação ao aperfeiçoamento nas áreas de estética avançada e terapias de saúde integrativa, a <strong>Tayná</strong> desenvolveu uma metodologia própria de atendimento. Seu foco não é apenas realizar um procedimento isolado, mas sim compreender o momento de vida, as necessidades biológicas e a rotina de cada paciente.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                <div className="font-extrabold text-zinc-900">+500 Clientes</div>
                <div className="text-[11px] text-zinc-400">Atendimentos humanizados</div>
              </div>
              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                <div className="font-extrabold text-zinc-900">100% Individual</div>
                <div className="text-[11px] text-zinc-400">Sem salas compartilhadas</div>
              </div>
              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                <div className="font-extrabold text-zinc-900">Tecnologia Segura</div>
                <div className="text-[11px] text-zinc-400">Insumos dermatológicos ouro</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: SOBRE OS PROCEDIMENTOS & ESTRUTURA DA CLÍNICA */}
      <section className="bg-zinc-100/70 border-y border-zinc-200/80 py-16 px-4">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Nossa Infraestrutura & Diferenciais
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              Como funcionam os procedimentos na clínica?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-xl mx-auto">
              Cada etapa é pensada para garantir o máximo de biossegurança, conforto e resultados visíveis desde a primeira visita.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF8E7] text-[#FFC107] flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-black text-base text-zinc-900">
                Avaliação Clínica Prévia
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Antes de iniciar qualquer procedimento estético ou sessão de saúde, fazemos uma anamnese para mapear seu histórico de pele, alergias e expectativas reais.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF8E7] text-[#FFC107] flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-black text-base text-zinc-900">
                Protocolos Personalizados
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Não utilizamos receitas prontas. Os produtos, ácidos, ativos de hidratação ou manobras musculares são calibrados de acordo com a resposta do seu organismo.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF8E7] text-[#FFC107] flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-black text-base text-zinc-900">
                Suporte Contínuo Pós-Sessão
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                O cuidado continua em casa. Você recebe orientações pós-procedimento detalhadas e suporte direto via WhatsApp para acompanhar sua recuperação e evolução.
              </p>
            </div>
          </div>

          {/* Banner de Chamada para Ação */}
          <div className="bg-gradient-to-r from-zinc-900 to-black rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                Pronta para iniciar seu cuidado exclusivo?
              </h3>
              <p className="text-xs text-zinc-400 max-w-md">
                Escolha a categoria desejada para conferir as propostas completas de procedimentos e garantir sua vaga.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/estetica"
                className="px-5 py-3 bg-[#FFC107] hover:bg-[#ffb300] text-black font-extrabold text-xs rounded-2xl transition-all shadow-md flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Propostas de Estética
              </a>
              <a
                href="/saude"
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs rounded-2xl border border-white/20 transition-all flex items-center gap-2"
              >
                <HeartPulse className="w-4 h-4 text-rose-400" /> Planos de Saúde
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
