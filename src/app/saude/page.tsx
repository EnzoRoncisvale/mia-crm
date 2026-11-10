"use client";

import React from "react";
import DedicatedNicheLandingPage, { ServiceProposal } from "@/components/DedicatedNicheLandingPage";
import FooterCorporate from "@/components/FooterCorporate";

const SAUDE_PROPOSALS: ServiceProposal[] = [
  {
    id: "pkg-saude-nutri",
    title: "Plano Vitalidade: Consulta Integrativa + Acompanhamento 45 Dias",
    subtitle: "Emagrecimento saudável, disposição física e regulação hormonal sem dietas restritivas",
    tag: "Mais Procurado 🥗",
    highlight: true,
    priceOriginal: 480,
    pricePromo: 349,
    installments: "3x de R$ 116,33 sem juros",
    durationTotal: "45 dias de acompanhamento",
    rating: "5.0",
    reviewsCount: 114,
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
    title: "Protocolo Coluna Livre de Dor: Avaliação + 3 Sessões Físio",
    subtitle: "Diagnóstico e tratamento da causa raiz de dores lombares, hérnias e cervical",
    tag: "Alívio Rápido 🩺",
    priceOriginal: 540,
    pricePromo: 399,
    installments: "3x de R$ 133,00 sem juros",
    durationTotal: "3 sessões de 50 min",
    rating: "4.9",
    reviewsCount: 88,
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
    title: "Ciclo Equilíbrio & Clareza Mental (4 Encontros)",
    subtitle: "Sessões terapêuticas para controle de ansiedade, estresse e alinhamento de vida",
    tag: "Saúde Mental 🧠",
    priceOriginal: 800,
    pricePromo: 580,
    installments: "4x de R$ 145,00 sem juros",
    durationTotal: "4 encontros semanais",
    rating: "5.0",
    reviewsCount: 67,
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

export default function SaudePage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <DedicatedNicheLandingPage
        nicheType="saude"
        heroBadge="Espaço Especializado em Saúde Integrativa & Bem-Estar"
        heroTitle="Recupere sua disposição, equilíbrio e qualidade de vida."
        heroSubtitle="Abordagem acolhedora com a Tayná que une nutrição funcional, fisioterapia para alívio de dores e saúde emocional preventiva."
        heroAccentColor="#E11D48"
        proposals={SAUDE_PROPOSALS}
      />
      <FooterCorporate />
    </div>
  );
}
