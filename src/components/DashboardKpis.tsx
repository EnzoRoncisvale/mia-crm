"use client";

import React from "react";
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
}

export default function DashboardKpis({ currentNiche }: DashboardKpisProps) {
  const kpis = [
    {
      id: "clientes",
      title: `${currentNiche.clientLabel}s ativos`,
      value: "128",
      growth: "+ 12%",
      isPositive: true,
      icon: Users,
    },
    {
      id: "agendamentos",
      title: "Agendamentos hoje",
      value: "9",
      growth: "+ 38%",
      isPositive: true,
      icon: Calendar,
    },
    {
      id: "atendimentos",
      title: "Atendimentos hoje",
      value: "14",
      growth: "+ 18%",
      isPositive: true,
      icon: CheckCircle2,
    },
    {
      id: "tarefas",
      title: "Tarefas pendentes",
      value: "7",
      growth: "+ 2%",
      isPositive: false,
      icon: Clock,
    },
    {
      id: "faturamento",
      title: "Faturamento do mês",
      value: "R$ 8.450,00",
      growth: "+ 15%",
      isPositive: true,
      icon: DollarSign,
      highlight: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            className={`rounded-2xl p-4 transition-all duration-200 border ${
              kpi.highlight
                ? "bg-gradient-to-br from-[#1A1A1A] to-[#111111] text-white border-black/40 shadow-md col-span-2 sm:col-span-1"
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
