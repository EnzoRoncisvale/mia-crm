"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { NicheConfig } from "@/types/crm";

interface DashboardKpisProps {
  currentNiche: NicheConfig;
  onNavigateModule?: (module: string) => void;
}

export default function DashboardKpis({
  currentNiche,
  onNavigateModule,
}: DashboardKpisProps) {
  const [revenueText, setRevenueText] = useState("R$ 8.450,00");

  useEffect(() => {
    async function loadFinancialKpi() {
      try {
        const res = await fetch("/api/financial/summary?month=2026-10");
        const json = await res.json();
        if (json.success && json.data) {
          const formatted = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(json.data.totalRevenue);
          setRevenueText(formatted);
        }
      } catch (err) {
        console.error("Erro ao carregar KPI faturamento:", err);
      }
    }
    loadFinancialKpi();
  }, []);

  const kpis = [
    {
      id: "clientes",
      title: `${currentNiche.clientLabel}s ativos`,
      value: "128",
      growth: "+ 12%",
      isPositive: true,
      icon: Users,
      module: "clientes",
    },
    {
      id: "agendamentos",
      title: "Agendamentos hoje",
      value: "9",
      growth: "+ 38%",
      isPositive: true,
      icon: Calendar,
      module: "agenda",
    },
    {
      id: "atendimentos",
      title: "Atendimentos hoje",
      value: "14",
      growth: "+ 18%",
      isPositive: true,
      icon: CheckCircle2,
      module: "agenda",
    },
    {
      id: "tarefas",
      title: "Tarefas pendentes",
      value: "7",
      growth: "+ 2%",
      isPositive: false,
      icon: Clock,
      module: "tarefas",
    },
    {
      id: "faturamento",
      title: "Faturamento do mês",
      value: revenueText,
      growth: "+ 18.4%",
      isPositive: true,
      icon: DollarSign,
      highlight: true,
      module: "financeiro",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            onClick={() => onNavigateModule && onNavigateModule(kpi.module)}
            className={`rounded-2xl p-4 transition-all duration-200 border cursor-pointer ${
              kpi.highlight
                ? "bg-gradient-to-br from-[#1A1A1A] to-[#111111] text-white border-black/40 shadow-md col-span-2 sm:col-span-1 hover:border-[#FFC107]"
                : "bg-white text-zinc-900 border-zinc-200/80 shadow-xs hover:border-[#FFC107]/60"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-xs font-medium truncate ${
                  kpi.highlight ? "text-zinc-300" : "text-zinc-500"
                }`}
              >
                {kpi.title}
              </span>
              <div
                className={`p-1.5 rounded-lg ${
                  kpi.highlight
                    ? "bg-[#FFC107]/20 text-[#FFC107]"
                    : "bg-[#FFF8E7] text-[#111111]"
                }`}
              >
                <Icon size={16} />
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <span
                className={`font-bold tracking-tight ${
                  kpi.highlight ? "text-lg sm:text-xl text-white" : "text-xl sm:text-2xl"
                }`}
              >
                {kpi.value}
              </span>

              <div
                className={`flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md ${
                  kpi.highlight
                    ? "bg-[#FFC107]/20 text-[#FFC107]"
                    : kpi.isPositive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                <TrendingUp size={12} />
                <span>{kpi.growth}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
