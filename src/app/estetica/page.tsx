"use client";

import React from "react";
import DedicatedNicheLandingPage, { ServiceProposal } from "@/components/DedicatedNicheLandingPage";
import FooterCorporate from "@/components/FooterCorporate";

const ESTETICA_PROPOSALS: ServiceProposal[] = [
  {
    id: "pkg-estetica-glow",
    title: "Protocolo Glow & Revitalização Facial Total",
    subtitle: "Tratamento intensivo para renovação celular, fechamento de poros e viço radiante",
    tag: "Mais Vendido ✨",
    highlight: true,
    priceOriginal: 520,
    pricePromo: 379,
    installments: "3x de R$ 126,33 sem juros",
    durationTotal: "90 min",
    rating: "5.0",
    reviewsCount: 142,
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
    title: "Combo Olhar Marcante: Lash Lifting + Sobrancelhas",
    subtitle: "Destaque e naturalidade para o rosto sem necessidade de rímel diário",
    tag: "Queridinho das Clientes 💖",
    priceOriginal: 240,
    pricePromo: 189,
    installments: "2x de R$ 94,50 sem juros",
    durationTotal: "60 min",
    rating: "4.9",
    reviewsCount: 98,
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
    title: "Ciclo Silhouette: 5 Sessões de Drenagem & Modeladora",
    subtitle: "Redução de medidas, alívio de retenção e melhora do contorno corporal",
    tag: "Pacote Tratamento 🌿",
    priceOriginal: 850,
    pricePromo: 620,
    installments: "4x de R$ 155,00 sem juros",
    durationTotal: "5 sessões de 50 min",
    rating: "4.9",
    reviewsCount: 76,
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
  }
];

export default function EsteticaPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <DedicatedNicheLandingPage
        nicheType="estetica"
        heroBadge="Espaço Especializado em Beleza & Estética Avançada"
        heroTitle="Realce sua beleza natural com cuidados exclusivos."
        heroSubtitle="Protocolos de alta performance desenvolvidos pela profissional Tayná para devolver viço, saúde e harmonia ao seu rosto e corpo."
        heroAccentColor="#FFC107"
        proposals={ESTETICA_PROPOSALS}
      />
      <FooterCorporate />
    </div>
  );
}
