"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import DashboardKpis from "@/components/DashboardKpis";
import TodayAgenda from "@/components/TodayAgenda";
import RecentLeads from "@/components/RecentLeads";
import MiaAssistantWidget from "@/components/MiaAssistantWidget";
import PlansModal from "@/components/PlansModal";
import NewItemModal from "@/components/NewItemModal";
import FinancialModule from "@/components/FinancialModule";
import ProcessesModule from "@/components/ProcessesModule";
import ServicesModule from "@/components/ServicesModule";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import {
  INITIAL_APPOINTMENTS,
  INITIAL_LEADS,
  INITIAL_TASKS,
  NICHES,
} from "@/data/mockData";
import { Appointment, Lead, NicheConfig, TaskItem, UserRole } from "@/types/crm";
import {
  Sparkles,
  Calendar,
  Users,
  Target,
  ArrowRight,
  ShieldCheck,
  Zap,
  Smartphone,
  CheckCircle2,
  DollarSign,
  CheckSquare,
  FileText,
  BarChart3,
  Plus,
  GitBranch,
} from "lucide-react";

export default function Home() {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [currentNiche, setCurrentNiche] = useState<NicheConfig>(NICHES[0]); // Beleza e Estética
  const [currentRole, setCurrentRole] = useState<UserRole>("admin_empresa"); // RBAC (Seção 2.2)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
  const [isMiaAssistantOpen, setIsMiaAssistantOpen] = useState(false);
  const [newItemType, setNewItemType] = useState<
    "agendamento" | "lead" | "cliente" | "tarefa" | null
  >(null);

  // App data states (backed by persistent SQLite API)
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);

  // Load persistent data from API on start
  useEffect(() => {
    async function loadData() {
      try {
        const [appRes, leadRes] = await Promise.all([
          fetch("/api/appointments"),
          fetch("/api/leads"),
        ]);
        const appJson = await appRes.json();
        const leadJson = await leadRes.json();

        if (appJson.success && appJson.data?.length > 0) {
          setAppointments(appJson.data);
        }
        if (leadJson.success && leadJson.data?.length > 0) {
          setLeads(leadJson.data);
        }
      } catch (err) {
        console.warn("Usando dados iniciais locais:", err);
      }
    }
    loadData();
  }, []);

  const handleAddAppointment = (newApp: Appointment) => {
    setAppointments((prev) => [newApp, ...prev]);
  };

  const handleAddLead = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111111] flex flex-col font-sans">
      {/* Sidebar Desktop & Mobile */}
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        isOpenMobile={isMobileSidebarOpen}
        setIsOpenMobile={setIsMobileSidebarOpen}
        currentNiche={currentNiche}
        onOpenPlans={() => setIsPlansModalOpen(true)}
        currentRole={currentRole}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          currentNiche={currentNiche}
          onSelectNiche={setCurrentNiche}
          onOpenNewItem={(type) => setNewItemType(type)}
          onOpenMiaAssistant={() => setIsMiaAssistantOpen(true)}
          currentRole={currentRole}
          onSelectRole={setCurrentRole}
        />

        {/* Page Container */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-white via-white to-[#FFF8E7] rounded-3xl p-5 md:p-6 border border-zinc-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8E7] text-[#111111] border border-[#FFC107]/40 text-xs font-bold mb-2">
                <Sparkles size={13} className="text-[#FFC107]" />
                <span>Nicho ativo: {currentNiche.name}</span>
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-zinc-900">
                Bom dia, Thayná! 👋
              </h1>
              <p className="text-xs md:text-sm text-zinc-500 mt-1">
                Aqui está o resumo em tempo real da sua empresa com backend persistente e workflows.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setActiveModule("processos")}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                  activeModule === "processos"
                    ? "bg-[#111111] text-[#FFC107]"
                    : "bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800"
                }`}
              >
                <GitBranch size={15} className="text-[#FFC107]" />
                <span>Processos & Checklists</span>
              </button>

              <button
                onClick={() => setActiveModule("financeiro")}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                  activeModule === "financeiro"
                    ? "bg-[#111111] text-[#FFC107]"
                    : "bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800"
                }`}
              >
                <DollarSign size={15} className="text-[#FFC107]" />
                <span>Fluxo de Caixa</span>
              </button>

              <button
                onClick={() => setIsMiaAssistantOpen(true)}
                className="px-4 py-2.5 bg-[#111111] text-white hover:bg-black rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 group cursor-pointer"
              >
                <span>🐝 Secretária MIA</span>
                <span className="w-2 h-2 rounded-full bg-[#FFC107] animate-pulse" />
              </button>

              <button
                onClick={() => setNewItemType("agendamento")}
                className="px-4 py-2.5 bg-[#FFC107] hover:bg-[#E5AC06] text-black rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                + Novo Agendamento
              </button>
            </div>
          </div>

          {/* Module: Dashboard */}
          {activeModule === "dashboard" && (
            <>
              {/* Top 5 KPI Cards */}
              <section>
                <DashboardKpis
                  currentNiche={currentNiche}
                  onNavigateModule={(mod) => setActiveModule(mod)}
                />
              </section>

              {/* Two Column Grid: Today's Agenda & Recent Leads */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="h-[430px]">
                  <TodayAgenda
                    appointments={appointments}
                    onViewAll={() => setActiveModule("agenda")}
                    onSelectAppointment={() => {}}
                  />
                </div>

                <div className="h-[430px]">
                  <RecentLeads
                    leads={leads}
                    onViewAll={() => setActiveModule("leads")}
                    onOpenLead={() => {}}
                  />
                </div>
              </section>

              {/* Niche Intelligence & Capabilities Banner */}
              <section className="bg-white rounded-3xl border border-zinc-200/80 p-5 md:p-6 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#FFF8E7] border border-[#FFC107]/40 flex items-center justify-center text-xl">
                      ⚡
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-zinc-900">
                        Campos Inteligentes para {currentNiche.name}
                      </h3>
                      <p className="text-xs text-zinc-500">
                        {currentNiche.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-zinc-100 text-zinc-700 font-semibold px-2.5 py-1 rounded-lg">
                      Rótulo de Clientes: <strong className="text-black">{currentNiche.clientLabel}</strong>
                    </span>
                    <span className="text-xs bg-[#FFF8E7] text-zinc-800 font-semibold px-2.5 py-1 rounded-lg border border-[#FFC107]/40">
                      Rótulo de Serviços: <strong className="text-black">{currentNiche.serviceLabel}</strong>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-1">
                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/60 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-white text-emerald-600 shadow-2xs">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900">Multi-tenant & RBAC</h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        6 níveis de acesso, dados isolados e bloqueio de rotas.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/60 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-white text-blue-600 shadow-2xs">
                      <DollarSign size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900">Fluxo de Caixa & Gráficos</h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Faturamento, previsão a receber/pagar e extrato completo.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/60 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-white text-[#FFC107] shadow-2xs">
                      <Zap size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900">Secretária MIA no SQLite</h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Responde perguntas consultando dados reais do banco.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Module: Processos & Checklists (Seção 3.4) */}
          {activeModule === "processos" && (
            <ProcessesModule currentNiche={currentNiche} />
          )}

          {/* Module: Catálogo de Serviços (Seção 3.2) */}
          {activeModule === "servicos" && (
            <ServicesModule currentNiche={currentNiche} />
          )}

          {/* Module: Financeiro (Fluxo de Caixa & Gráficos de Faturamento) */}
          {activeModule === "financeiro" && (
            <FinancialModule currentNiche={currentNiche} />
          )}

          {/* Module: Clientes */}
          {activeModule === "clientes" && (
            <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                <div>
                  <h2 className="text-base font-bold text-zinc-900">
                    Base de {currentNiche.clientLabel}s
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Cadastro único com campos customizáveis para {currentNiche.name}
                  </p>
                </div>
                <button
                  onClick={() => setNewItemType("cliente")}
                  className="px-3.5 py-2 bg-[#FFC107] text-black font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  + Cadastrar {currentNiche.clientLabel}
                </button>
              </div>

              <div className="divide-y divide-zinc-100">
                {appointments.map((app) => (
                  <div
                    key={app.id}
                    className="py-3 flex items-center justify-between hover:bg-zinc-50 px-2 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#111111] text-[#FFC107] font-bold text-xs flex items-center justify-center">
                        {app.clientInitials}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-zinc-900">
                          {app.clientName}
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          Último procedimento: {app.service}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-zinc-900">
                        R$ {app.price.toFixed(2).replace(".", ",")}
                      </span>
                      <div className="text-[10px] text-emerald-600 font-semibold">
                        {app.status === "confirmado" ? "Ativo" : "Agendado"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Module: Leads */}
          {activeModule === "leads" && (
            <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                <div>
                  <h2 className="text-base font-bold text-zinc-900">
                    Funil de Oportunidades & Leads
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Acompanhamento de conversão e mensagens recebidas
                  </p>
                </div>
                <button
                  onClick={() => setNewItemType("lead")}
                  className="px-3.5 py-2 bg-[#FFC107] text-black font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  + Novo Lead
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-zinc-900">
                          {lead.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFF8E7] text-amber-800 font-semibold">
                          {lead.status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600">"{lead.message}"</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-zinc-200/60 text-[11px] text-zinc-400">
                      <span>Origem: {lead.channel}</span>
                      <span>{lead.timeAgo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Module: Agenda */}
          {activeModule === "agenda" && (
            <WeeklyCalendar
              currentNiche={currentNiche}
              onNewAppointment={() => setNewItemType("agendamento")}
            />
          )}

          {/* Module: Tarefas */}
          {activeModule === "tarefas" && (
            <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                <div>
                  <h2 className="text-base font-bold text-zinc-900">
                    Tarefas & Checklists de Operação
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Organização diária da equipe para o nicho {currentNiche.name}
                  </p>
                </div>
                <button
                  onClick={() => setNewItemType("tarefa")}
                  className="px-3.5 py-2 bg-[#FFC107] text-black font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  + Nova Tarefa
                </button>
              </div>

              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                      task.completed
                        ? "bg-zinc-50 border-zinc-200 opacity-60"
                        : "bg-white border-zinc-200/80 hover:border-[#FFC107]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                          task.completed
                            ? "bg-[#10B981] border-[#10B981] text-white"
                            : "border-zinc-300 bg-white"
                        }`}
                      >
                        {task.completed && <CheckCircle2 size={13} />}
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          task.completed ? "line-through text-zinc-400" : "text-zinc-900"
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-zinc-400">{task.dueDate}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          task.priority === "alta"
                            ? "bg-red-50 text-red-600"
                            : task.priority === "media"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Module: Outros Módulos */}
          {![
            "dashboard",
            "financeiro",
            "clientes",
            "leads",
            "agenda",
            "tarefas",
            "processos",
            "servicos",
          ].includes(activeModule) && (
            <div className="bg-white rounded-3xl border border-zinc-200/80 p-8 shadow-xs text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF8E7] text-[#FFC107] flex items-center justify-center mx-auto text-2xl font-bold">
                🐝
              </div>
              <h2 className="text-base font-bold text-zinc-900 capitalize">
                Módulo de {activeModule}
              </h2>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                Este módulo está conectado à estrutura base do MIA CRM e integrado ao banco de dados SQLite e assistente MIA.
              </p>
              <button
                onClick={() => setActiveModule("dashboard")}
                className="px-4 py-2 bg-[#FFC107] text-black font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Voltar ao Dashboard
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Floating Mia Assistant */}
      <MiaAssistantWidget
        isOpen={isMiaAssistantOpen}
        onToggle={() => setIsMiaAssistantOpen(!isMiaAssistantOpen)}
        onQuickAction={(actionType) => {
          if (actionType === "agendar") setNewItemType("agendamento");
          if (actionType === "financeiro") setActiveModule("financeiro");
          if (actionType === "tarefas") setActiveModule("tarefas");
          if (actionType === "leads") setActiveModule("leads");
          if (actionType === "processos") setActiveModule("processos");
        }}
        currentRole={currentRole}
      />

      {/* Modal: Planos & Preços */}
      <PlansModal
        isOpen={isPlansModalOpen}
        onClose={() => setIsPlansModalOpen(false)}
      />

      {/* Modal: Novo Item */}
      <NewItemModal
        isOpen={newItemType !== null}
        type={newItemType}
        onClose={() => setNewItemType(null)}
        onAddAppointment={handleAddAppointment}
        onAddLead={handleAddLead}
        currentNiche={currentNiche}
      />
    </div>
  );
}
