"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Filter,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Search,
  PieChart as PieIcon,
  BarChart3,
  CreditCard,
  Wallet,
  Building2,
  AlertCircle,
  RefreshCw,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import {
  Transaction,
  FinancialSummary,
  TransactionType,
  PaymentMethod,
  TransactionStatus,
  FINANCIAL_CATEGORIES,
} from "@/types/financial";
import { NicheConfig } from "@/types/crm";

interface FinancialModuleProps {
  currentNiche: NicheConfig;
  onRefreshKpis?: () => void;
}

export default function FinancialModule({
  currentNiche,
  onRefreshKpis,
}: FinancialModuleProps) {
  // State
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewTxModalOpen, setIsNewTxModalOpen] = useState(false);
  const [defaultTxType, setDefaultTxType] = useState<TransactionType>("entrada");

  // Filters
  const [filterType, setFilterType] = useState<"all" | "entrada" | "saida">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "pago" | "pendente">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("2026-10");
  const [activeChartTab, setActiveChartTab] = useState<"billing" | "daily">("billing");

  // Fetch summary and transactions
  const loadData = async () => {
    try {
      setLoading(true);
      const [sumRes, txRes] = await Promise.all([
        fetch(`/api/financial/summary?month=${selectedMonth}`),
        fetch(`/api/financial/transactions`),
      ]);

      const sumData = await sumRes.json();
      const txData = await txRes.json();

      if (sumData.success) {
        setSummary(sumData.data);
      }
      if (txData.success) {
        setTransactions(txData.data);
      }
      if (onRefreshKpis) {
        onRefreshKpis();
      }
    } catch (err) {
      console.error("Erro ao carregar dados financeiros:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedMonth]);

  // Open modal with preselected type
  const handleOpenModal = (type: TransactionType) => {
    setDefaultTxType(type);
    setIsNewTxModalOpen(true);
  };

  // Toggle status (pago <-> pendente)
  const handleToggleStatus = async (tx: Transaction) => {
    const newStatus: TransactionStatus = tx.status === "pago" ? "pendente" : "pago";
    try {
      const res = await fetch(`/api/financial/transactions?id=${tx.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  // Delete transaction
  const handleDeleteTransaction = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir este lançamento financeiro?")) {
      return;
    }
    try {
      const res = await fetch(`/api/financial/transactions?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      console.error("Erro ao excluir transação:", err);
    }
  };

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (filterType !== "all" && tx.type !== filterType) return false;
      if (filterStatus !== "all" && tx.status !== filterStatus) return false;
      if (filterCategory !== "all" && tx.category !== filterCategory) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesDesc = tx.description.toLowerCase().includes(query);
        const matchesClient = tx.clientName?.toLowerCase().includes(query) || false;
        const matchesCat = tx.category.toLowerCase().includes(query);
        if (!matchesDesc && !matchesClient && !matchesCat) return false;
      }
      return true;
    });
  }, [transactions, filterType, filterStatus, filterCategory, searchQuery]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action Controls */}
      <div className="bg-white rounded-3xl p-5 md:p-6 border border-zinc-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8E7] text-[#111111] border border-[#FFC107]/40 text-xs font-bold mb-2">
            <Wallet size={13} className="text-[#FFC107]" />
            <span>Módulo Financeiro & Gestão de Fluxo de Caixa</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-zinc-900">
            Fluxo de Caixa & Faturamento
          </h1>
          <p className="text-xs md:text-sm text-zinc-500 mt-1">
            Controle de entradas, saídas, previsões de recebimento e gráficos analíticos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Month selector */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-[#FFC107]"
          >
            <option value="2026-10">Outubro 2026</option>
            <option value="2026-09">Setembro 2026</option>
            <option value="2026-08">Agosto 2026</option>
            <option value="2026-07">Julho 2026</option>
          </select>

          <button
            onClick={() => handleOpenModal("entrada")}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <ArrowUpRight size={15} />
            <span>+ Nova Entrada</span>
          </button>

          <button
            onClick={() => handleOpenModal("saida")}
            className="px-4 py-2.5 bg-[#111111] hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <ArrowDownLeft size={15} className="text-red-400" />
            <span>- Nova Saída</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Entradas */}
        <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-500">Entradas (Receitas)</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowUpRight size={18} />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-extrabold text-emerald-700 tracking-tight">
            {formatCurrency(summary?.totalRevenue || 0)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-600 font-semibold">
            <span className="px-1.5 py-0.5 rounded bg-emerald-50">+ 18.4%</span>
            <span className="text-zinc-400 font-normal">vs mês anterior</span>
          </div>
        </div>

        {/* Total Saídas */}
        <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-500">Saídas (Despesas)</span>
            <div className="p-2 rounded-xl bg-red-50 text-red-600">
              <ArrowDownLeft size={18} />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-extrabold text-red-600 tracking-tight">
            {formatCurrency(summary?.totalExpenses || 0)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-zinc-500 font-normal">
            <span>Custos operacionais e insumos</span>
          </div>
        </div>

        {/* Saldo Líquido */}
        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#111111] text-white rounded-2xl p-4 border border-black/40 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-300">Saldo em Caixa</span>
            <div className="p-2 rounded-xl bg-[#FFC107]/20 text-[#FFC107]">
              <Wallet size={18} />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-extrabold text-[#FFC107] tracking-tight">
            {formatCurrency(summary?.netBalance || 0)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-zinc-300">
            <span>Margem líquida: </span>
            <strong className="text-white font-bold">{summary?.profitMargin || 0}%</strong>
          </div>
        </div>

        {/* A Receber (Previsão) */}
        <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-500">A Receber</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Clock size={18} />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-extrabold text-blue-600 tracking-tight">
            {formatCurrency(summary?.pendingReceivables || 0)}
          </div>
          <div className="mt-2 text-[11px] text-zinc-400">
            Entradas agendadas pendentes
          </div>
        </div>

        {/* A Pagar (Previsão) */}
        <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-zinc-500">A Pagar</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <AlertCircle size={18} />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-extrabold text-amber-600 tracking-tight">
            {formatCurrency(summary?.pendingPayables || 0)}
          </div>
          <div className="mt-2 text-[11px] text-zinc-400">
            Contas a vencer no período
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Chart (Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 md:p-6 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
            <div>
              <h3 className="font-bold text-base text-zinc-900 flex items-center gap-2">
                <BarChart3 size={18} className="text-[#FFC107]" />
                {activeChartTab === "billing"
                  ? "Histórico de Faturamento & Custos Mensais"
                  : "Fluxo Diário de Caixa (Mês Ativo)"}
              </h3>
              <p className="text-xs text-zinc-500">
                {activeChartTab === "billing"
                  ? "Comparativo mês a mês entre entradas brutas, saídas e lucro líquido gerado"
                  : "Acompanhamento diário da movimentação financeira e saldo do caixa"}
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-xl">
              <button
                onClick={() => setActiveChartTab("billing")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeChartTab === "billing"
                    ? "bg-white text-zinc-900 shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                Faturamento Mensal
              </button>
              <button
                onClick={() => setActiveChartTab("daily")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeChartTab === "daily"
                    ? "bg-white text-zinc-900 shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                Fluxo Diário
              </button>
            </div>
          </div>

          <div className="h-[320px] w-full pt-4">
            {activeChartTab === "billing" ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={summary?.monthlyBilling || []}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                  <XAxis
                    dataKey="monthLabel"
                    tick={{ fontSize: 11, fill: "#71717A" }}
                    axisLine={{ stroke: "#E4E4E7" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#71717A" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `R$ ${val >= 1000 ? (val / 1000).toFixed(0) + "k" : val}`}
                  />
                  <Tooltip
                    formatter={(val) => [formatCurrency(Number(val)), ""]}
                    contentStyle={{
                      backgroundColor: "#111111",
                      borderRadius: "12px",
                      border: "none",
                      color: "#FFFFFF",
                      fontSize: "12px",
                      padding: "8px 12px",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.3)",
                    }}
                    labelStyle={{ color: "#FFC107", fontWeight: "bold", marginBottom: "4px" }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }}
                  />
                  <Bar
                    dataKey="entradas"
                    name="Entradas (Receitas)"
                    fill="#10B981"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={36}
                  />
                  <Bar
                    dataKey="saidas"
                    name="Saídas (Despesas)"
                    fill="#EF4444"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={36}
                  />
                  <Bar
                    dataKey="lucro"
                    name="Lucro Líquido"
                    fill="#FFC107"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={summary?.dailyCashFlow || []}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorSaidas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#71717A" }}
                    axisLine={{ stroke: "#E4E4E7" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#71717A" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `R$ ${val}`}
                  />
                  <Tooltip
                    formatter={(val) => [formatCurrency(Number(val)), ""]}
                    contentStyle={{
                      backgroundColor: "#111111",
                      borderRadius: "12px",
                      border: "none",
                      color: "#FFFFFF",
                      fontSize: "12px",
                      padding: "8px 12px",
                    }}
                  />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: "11px" }} />
                  <Area
                    type="monotone"
                    dataKey="entradas"
                    name="Entradas"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorEntradas)"
                  />
                  <Area
                    type="monotone"
                    dataKey="saidas"
                    name="Saídas"
                    stroke="#EF4444"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSaidas)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Categories Breakdown Card */}
        <div className="bg-white rounded-3xl p-5 md:p-6 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                <PieIcon size={16} className="text-[#FFC107]" />
                Distribuição de Custos & Receitas
              </h3>
            </div>

            <div className="mt-4 space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
              {summary?.categoriesBreakdown.length ? (
                summary.categoriesBreakdown.map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-700 flex items-center gap-1.5 truncate">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            cat.type === "entrada" ? "bg-emerald-500" : "bg-red-500"
                          }`}
                        />
                        {cat.category}
                      </span>
                      <span className="font-bold text-zinc-900">
                        {formatCurrency(cat.amount)} ({cat.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          cat.type === "entrada" ? "bg-emerald-500" : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-zinc-400">
                  Nenhuma transação registrada neste período.
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Fontes de Receita
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Centros de Despesa
            </span>
          </div>
        </div>
      </div>

      {/* Cash Flow Statement & Transaction Table */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 md:p-6 shadow-xs space-y-4">
        {/* Table Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
          <div>
            <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <span>Extrato do Fluxo de Caixa</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-semibold">
                {filteredTransactions.length} lançamentos
              </span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Histórico detalhado de movimentações, recebimentos e pagamentos.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar por descrição..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-[#FFC107] w-44 sm:w-56"
              />
            </div>

            {/* Type Filter Buttons */}
            <div className="flex items-center p-1 bg-zinc-100 rounded-xl text-xs font-bold">
              <button
                onClick={() => setFilterType("all")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterType === "all" ? "bg-white text-zinc-900 shadow-2xs" : "text-zinc-500"
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilterType("entrada")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterType === "entrada"
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : "text-zinc-500 hover:text-emerald-700"
                }`}
              >
                Entradas
              </button>
              <button
                onClick={() => setFilterType("saida")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filterType === "saida"
                    ? "bg-red-600 text-white shadow-2xs"
                    : "text-zinc-500 hover:text-red-700"
                }`}
              >
                Saídas
              </button>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 focus:outline-hidden"
            >
              <option value="all">Status: Todos</option>
              <option value="pago">Já Pagos</option>
              <option value="pendente">Pendentes</option>
            </select>

            {/* Refresh */}
            <button
              onClick={loadData}
              title="Atualizar dados"
              className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                <th className="py-2.5 px-3">Data</th>
                <th className="py-2.5 px-3">Tipo</th>
                <th className="py-2.5 px-3">Descrição / Cliente</th>
                <th className="py-2.5 px-3">Categoria</th>
                <th className="py-2.5 px-3">Forma Pagto</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Valor (R$)</th>
                <th className="py-2.5 px-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => {
                  const isEntrada = tx.type === "entrada";
                  const isPago = tx.status === "pago";

                  return (
                    <tr key={tx.id} className="hover:bg-zinc-50/80 transition-colors group">
                      {/* Date */}
                      <td className="py-3 px-3 font-medium text-zinc-500 whitespace-nowrap">
                        {tx.date.split("-").reverse().join("/")}
                      </td>

                      {/* Type Badge */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            isEntrada
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {isEntrada ? (
                            <>
                              <ArrowUpRight size={11} /> Entrada
                            </>
                          ) : (
                            <>
                              <ArrowDownLeft size={11} /> Saída
                            </>
                          )}
                        </span>
                      </td>

                      {/* Description & Client */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-zinc-900">{tx.description}</div>
                        {tx.clientName && (
                          <div className="text-[11px] text-zinc-400">
                            Cliente/Favorecido: {tx.clientName}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2 py-1 bg-zinc-100 rounded-lg text-zinc-700 text-[11px] font-medium">
                          {tx.category}
                        </span>
                      </td>

                      {/* Payment Method */}
                      <td className="py-3 px-3 whitespace-nowrap text-zinc-600 font-medium capitalize">
                        {tx.paymentMethod.replace("_", " ")}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(tx)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                            isPago
                              ? "bg-emerald-100/70 text-emerald-800 hover:bg-emerald-200"
                              : "bg-amber-100/70 text-amber-800 hover:bg-amber-200"
                          }`}
                          title="Clique para alternar status (Pago / Pendente)"
                        >
                          {isPago ? (
                            <>
                              <CheckCircle size={12} /> Pago
                            </>
                          ) : (
                            <>
                              <Clock size={12} /> Pendente
                            </>
                          )}
                        </button>
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <span
                          className={`font-extrabold text-sm ${
                            isEntrada ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          {isEntrada ? "+ " : "- "}
                          {formatCurrency(tx.amount)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteTransaction(tx.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir lançamento"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-zinc-400 text-xs">
                    Nenhum lançamento encontrado para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Nova Transação Financeira */}
      {isNewTxModalOpen && (
        <NewTransactionModal
          defaultType={defaultTxType}
          currentNiche={currentNiche}
          onClose={() => setIsNewTxModalOpen(false)}
          onSuccess={async () => {
            setIsNewTxModalOpen(false);
            await loadData();
          }}
        />
      )}
    </div>
  );
}

// Subcomponent: New Transaction Modal
interface NewTransactionModalProps {
  defaultType: TransactionType;
  currentNiche: NicheConfig;
  onClose: () => void;
  onSuccess: () => void;
}

function NewTransactionModal({
  defaultType,
  currentNiche,
  onClose,
  onSuccess,
}: NewTransactionModalProps) {
  const [type, setType] = useState<TransactionType>(defaultType);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(
    defaultType === "entrada"
      ? FINANCIAL_CATEGORIES.entradas[0]
      : FINANCIAL_CATEGORIES.saidas[0]
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [status, setStatus] = useState<TransactionStatus>("pago");
  const [clientName, setClientName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(
      newType === "entrada"
        ? FINANCIAL_CATEGORIES.entradas[0]
        : FINANCIAL_CATEGORIES.saidas[0]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount) {
      setErrorMsg("Preencha a descrição e o valor.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg("");

      const res = await fetch("/api/financial/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          description: description.trim(),
          amount: parseFloat(amount.replace(",", ".")),
          category,
          paymentMethod,
          date,
          status,
          clientName: clientName.trim() || undefined,
          nicheId: currentNiche.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erro ao registrar transação.");
      }

      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || "Falha ao salvar transação.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-lg border border-zinc-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                type === "entrada"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {type === "entrada" ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-zinc-900">
                Novo Lançamento no Fluxo de Caixa
              </h3>
              <p className="text-[11px] text-zinc-500">
                Registrar entrada (receita) ou saída (despesa)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-3 p-1 bg-zinc-100 rounded-2xl">
            <button
              type="button"
              onClick={() => handleTypeChange("entrada")}
              className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                type === "entrada"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <ArrowUpRight size={15} />
              <span>Entrada (Receita)</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("saida")}
              className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                type === "saida"
                  ? "bg-red-600 text-white shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <ArrowDownLeft size={15} />
              <span>Saída (Despesa)</span>
            </button>
          </div>

          {/* Description & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-zinc-700">Descrição do Lançamento *</label>
              <input
                type="text"
                required
                placeholder={
                  type === "entrada"
                    ? "Ex: Procedimento Estético Facial"
                    : "Ex: Compra de Insumos descartáveis"
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-[#FFC107]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Valor (R$) *</label>
              <input
                type="text"
                required
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-[#FFC107]"
              />
            </div>
          </div>

          {/* Category & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Categoria *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-[#FFC107]"
              >
                {(type === "entrada"
                  ? FINANCIAL_CATEGORIES.entradas
                  : FINANCIAL_CATEGORIES.saidas
                ).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Forma de Pagamento *</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-[#FFC107]"
              >
                <option value="pix">Pix</option>
                <option value="cartao_credito">Cartão de Crédito</option>
                <option value="cartao_debito">Cartão de Débito</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="boleto">Boleto Bancário</option>
                <option value="transferencia">Transferência Bancária</option>
              </select>
            </div>
          </div>

          {/* Date & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Data *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-[#FFC107]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Status do Lançamento *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TransactionStatus)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-[#FFC107]"
              >
                <option value="pago">Já Liquidado / Pago</option>
                <option value="pendente">Pendente (A Receber / A Pagar)</option>
              </select>
            </div>
          </div>

          {/* Client / Favored (Optional) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700">
              {type === "entrada" ? `Nome do ${currentNiche.clientLabel} (Opcional)` : "Favorecido / Fornecedor (Opcional)"}
            </label>
            <input
              type="text"
              placeholder={type === "entrada" ? "Ex: Beatriz Santos" : "Ex: Distribuidora de Cosméticos"}
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-[#FFC107]"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-5 py-2.5 text-white font-bold text-xs rounded-xl transition-all shadow-xs ${
                type === "entrada"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {submitting ? "Salvando..." : type === "entrada" ? "Salvar Entrada" : "Salvar Saída"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
