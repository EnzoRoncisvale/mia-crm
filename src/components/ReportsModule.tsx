"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  DollarSign,
  Download,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { NicheConfig } from "@/types/crm";

interface ReportsModuleProps {
  currentNiche: NicheConfig;
}

// Dados de gargalo / tempo médio em cada etapa (inspirado no AtritoPanel do icantbelievecrm)
const BOTTLENECK_DATA = [
  { etapa: "Novos", diasMedios: 0.5, metaDias: 1, cor: "#3B82F6" },
  { etapa: "1º Contato", diasMedios: 1.2, metaDias: 2, cor: "#8B5CF6" },
  { etapa: "Negociação", diasMedios: 4.8, metaDias: 3, cor: "#F59E0B" }, // Alerta de gargalo
  { etapa: "Proposta", diasMedios: 6.5, metaDias: 4, cor: "#F97316" }, // Gargalo crítico
  { etapa: "Fechado", diasMedios: 0, metaDias: 0, cor: "#10B981" },
];

// Motivos de Perda (inspirado no PerdasPanel)
const LOST_REASONS_DATA = [
  { name: "Preço / Sem Orçamento", value: 42, color: "#EF4444" },
  { name: "Optou por Concorrente", value: 24, color: "#F59E0B" },
  { name: "Parou de Responder", value: 20, color: "#6B7280" },
  { name: "Horário Indisponível", value: 14, color: "#3B82F6" },
];

// Previsão Ponderada por Etapa (inspirado no PrevisaoPanel)
const FORECAST_STAGES = [
  { etapa: "Novos Leads", leads: 8, valorTotal: 3200, prob: 15, previsto: 480 },
  { etapa: "Primeiro Contato", leads: 6, valorTotal: 4100, prob: 30, previsto: 1230 },
  { etapa: "Em Negociação", leads: 5, valorTotal: 6800, prob: 60, previsto: 4080 },
  { etapa: "Proposta Enviada", leads: 4, valorTotal: 5900, prob: 85, previsto: 5015 },
];

// Ranking de Serviços Mais Lucrativos do Nicho
const TOP_SERVICES = [
  { nome: "Alongamento / Procedimento VIP", totalFeito: 28, receita: 5040, ticket: 180 },
  { nome: "Manutenção & Retorno", totalFeito: 34, receita: 2720, ticket: 80 },
  { nome: "Design & Estética Facial", totalFeito: 22, receita: 1980, ticket: 90 },
  { nome: "Pacote Mensal Completo", totalFeito: 7, receita: 2450, ticket: 350 },
];

export default function ReportsModule({ currentNiche }: ReportsModuleProps) {
  const [period, setPeriod] = useState<"mes" | "trimestre" | "ano">("mes");

  const totalForecast = FORECAST_STAGES.reduce((acc, curr) => acc + curr.previsto, 0);
  const totalPipeline = FORECAST_STAGES.reduce((acc, curr) => acc + curr.valorTotal, 0);

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8E7] text-[#111111] border border-[#FFC107]/40 text-xs font-bold mb-2">
            <Sparkles size={13} className="text-[#FFC107]" />
            <span>Métricas Operacionais · {currentNiche.name}</span>
          </div>
          <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">
            Relatórios Executivos & Análise de Conversão
          </h2>
          <p className="text-xs text-zinc-500">
            Identifique gargalos de atendimento, motivos de perda de clientes e previsão de receita ponderada.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex bg-zinc-100 rounded-xl p-1 border border-zinc-200 text-xs font-bold">
            {(["mes", "trimestre", "ano"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                  period === p ? "bg-white text-zinc-900 shadow-2xs" : "text-zinc-500 hover:text-black"
                }`}
              >
                {p === "mes" ? "Este Mês" : p === "trimestre" ? "Trimestre" : "Ano"}
              </button>
            ))}
          </div>

          <button
            onClick={handleExport}
            className="px-3.5 py-2 bg-[#111111] hover:bg-black text-[#FFC107] text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download size={14} />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>

      {/* 4 Cards de Destaque Executivo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white rounded-3xl border border-zinc-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-zinc-500 flex items-center gap-1">
            <DollarSign size={13} className="text-emerald-600" /> Previsão Ponderada
          </span>
          <div className="text-2xl font-extrabold text-zinc-900">
            R$ {totalForecast.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold block flex items-center gap-0.5">
            <ArrowUpRight size={11} /> 53% probabilidade média
          </span>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-zinc-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-zinc-500 flex items-center gap-1">
            <TrendingUp size={13} className="text-blue-600" /> Pipeline Bruto Total
          </span>
          <div className="text-2xl font-extrabold text-zinc-900">
            R$ {totalPipeline.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-zinc-400 font-semibold block">
            23 oportunidades ativas
          </span>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-zinc-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-zinc-500 flex items-center gap-1">
            <Clock size={13} className="text-amber-600" /> Tempo Médio Fechamento
          </span>
          <div className="text-2xl font-extrabold text-zinc-900">3.8 dias</div>
          <span className="text-[10px] text-amber-700 font-bold block">
            Atrito principal: Proposta
          </span>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-zinc-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-zinc-500 flex items-center gap-1">
            <CheckCircle2 size={13} className="text-purple-600" /> Taxa de Conversão
          </span>
          <div className="text-2xl font-extrabold text-zinc-900">31.4%</div>
          <span className="text-[10px] text-emerald-600 font-bold block">
            +4.2% em relação ao mês anterior
          </span>
        </div>
      </div>

      {/* Grid de Gráficos: Painel de Atrito + Motivos de Perda */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Gráfico 1: Gargalos & Tempo Médio por Fase (7 colunas) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-zinc-900 flex items-center gap-2">
                <span>Tempo Médio em Cada Etapa (Dias)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                  Painel de Gargalos
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Identifique onde os leads passam mais tempo parados antes de avançar.
              </p>
            </div>
          </div>

          <div className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BOTTLENECK_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="etapa" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`${val} dias`, "Tempo Médio"]}
                  contentStyle={{ borderRadius: "1rem", border: "1px solid #E5E7EB", fontSize: "12px" }}
                />
                <Bar dataKey="diasMedios" radius={[8, 8, 0, 0]}>
                  {BOTTLENECK_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Ponto de Atenção Detectado:</span> A etapa de{" "}
              <strong>Proposta Enviada</strong> está com média de 6.5 dias (meta: 4 dias). Recomenda-se enviar
              follow-up de lembrete pelo WhatsApp após 48 horas.
            </div>
          </div>
        </div>

        {/* Gráfico 2: Motivos de Perda de Vendas (5 colunas) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs space-y-3">
          <div className="border-b border-zinc-100 pb-3">
            <h3 className="font-extrabold text-sm text-zinc-900">Motivos de Perda de Clientes</h3>
            <p className="text-[11px] text-zinc-400">Distribuição das causas de negócios perdidos.</p>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={LOST_REASONS_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {LOST_REASONS_DATA.map((entry, index) => (
                    <Cell key={`pie-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [`${val}%`, "Percentual"]} />
                <Legend
                  formatter={(value) => <span className="text-[11px] text-zinc-700 font-semibold">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="p-2.5 bg-zinc-50 rounded-2xl border border-zinc-100 text-[11px] text-zinc-600 text-center">
            💡 <strong>42% das perdas</strong> ocorrem por preço. Criar opções de parcelamento ou serviços de entrada pode reter esses contatos.
          </div>
        </div>
      </div>

      {/* Grid Inferior: Previsão Ponderada por Etapa + Ranking de Serviços */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tabela de Previsão Ponderada */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs space-y-3">
          <div className="border-b border-zinc-100 pb-3">
            <h3 className="font-extrabold text-sm text-zinc-900">Previsão Ponderada de Fechamento</h3>
            <p className="text-[11px] text-zinc-400">
              Valor esperado de conversão ponderado pela probabilidade de cada estágio.
            </p>
          </div>

          <div className="divide-y divide-zinc-100 text-xs">
            {FORECAST_STAGES.map((st, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-zinc-900">{st.etapa}</div>
                  <span className="text-[10px] text-zinc-400">
                    {st.leads} negócios · R$ {st.valorTotal.toLocaleString("pt-BR")}
                  </span>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-emerald-600">
                    R$ {st.previsto.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500">{st.prob}% prob.</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-200 flex items-center justify-between font-extrabold text-xs">
            <span className="text-zinc-700">Total Previsto Ponderado:</span>
            <span className="text-emerald-600 text-sm">
              R$ {totalForecast.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Ranking de Serviços Mais Vendidos do Nicho */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs space-y-3">
          <div className="border-b border-zinc-100 pb-3">
            <h3 className="font-extrabold text-sm text-zinc-900">Top Serviços & Procedimentos</h3>
            <p className="text-[11px] text-zinc-400">Procedimentos que mais geram receita para o negócio.</p>
          </div>

          <div className="divide-y divide-zinc-100 text-xs">
            {TOP_SERVICES.map((svc, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#111111] text-[#FFC107] font-extrabold text-[10px] flex items-center justify-center">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-bold text-zinc-900">{svc.nome}</div>
                    <span className="text-[10px] text-zinc-400">
                      {svc.totalFeito} atendimentos · Ticket R$ {svc.ticket}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-zinc-900">
                    R$ {svc.receita.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
