"use client";

import React, { useState, useEffect } from "react";
import {
  GitBranch,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  User,
  Calendar,
  CheckSquare,
  Sparkles,
  ChevronRight,
  Filter,
} from "lucide-react";
import { ProcessItem, NicheConfig } from "@/types/crm";

interface ProcessesModuleProps {
  currentNiche: NicheConfig;
}

export default function ProcessesModule({ currentNiche }: ProcessesModuleProps) {
  const [processes, setProcesses] = useState<ProcessItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProcess, setSelectedProcess] = useState<ProcessItem | null>(null);
  const [isNewProcessModalOpen, setIsNewProcessModalOpen] = useState(false);

  // New process form states
  const [newTitle, setNewTitle] = useState("");
  const [newClientName, setNewClientName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadProcesses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/processes");
      const data = await res.json();
      if (data.success && data.data) {
        setProcesses(data.data);
        if (!selectedProcess && data.data.length > 0) {
          setSelectedProcess(data.data[0]);
        } else if (selectedProcess) {
          const updated = data.data.find((p: ProcessItem) => p.id === selectedProcess.id);
          if (updated) setSelectedProcess(updated);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar processos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProcesses();
  }, [currentNiche]);

  const handleToggleChecklist = async (processId: string, checklistId: string) => {
    try {
      const res = await fetch(`/api/processes?id=${processId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toggleChecklistId: checklistId }),
      });
      if (res.ok) {
        await loadProcesses();
      }
    } catch (err) {
      console.error("Erro ao alternar checklist:", err);
    }
  };

  const handleCreateProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      setSubmitting(true);
      const defaultSteps = [
        {
          stepNumber: 1,
          name: "Início & Coleta de Requisitos",
          status: "em_andamento" as const,
          responsible: "Equipe Responsável",
          checklists: [
            { id: `c-${Date.now()}-1`, title: "Validação dos dados e documentos", completed: false },
            { id: `c-${Date.now()}-2`, title: "Alinhamento com o cliente", completed: false },
          ],
        },
        {
          stepNumber: 2,
          name: "Execução Operacional / Elaboração",
          status: "pendente" as const,
          responsible: "Operador Especialista",
          checklists: [
            { id: `c-${Date.now()}-3`, title: "Execução do procedimento / análise", completed: false },
            { id: `c-${Date.now()}-4`, title: "Revisão e controle de qualidade", completed: false },
          ],
        },
        {
          stepNumber: 3,
          name: "Finalização, Entrega e Pós-Venda",
          status: "pendente" as const,
          responsible: "Atendimento & Secretária MIA",
          checklists: [
            { id: `c-${Date.now()}-5`, title: "Entrega do resultado / documento", completed: false },
            { id: `c-${Date.now()}-6`, title: "Follow-up de satisfação", completed: false },
          ],
        },
      ];

      const res = await fetch("/api/processes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          clientName: newClientName.trim() || undefined,
          nicheId: currentNiche.id,
          steps: defaultSteps,
        }),
      });

      if (res.ok) {
        setNewTitle("");
        setNewClientName("");
        setIsNewProcessModalOpen(false);
        await loadProcesses();
      }
    } catch (err) {
      console.error("Erro ao criar processo:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-5 md:p-6 border border-zinc-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8E7] text-[#111111] border border-[#FFC107]/40 text-xs font-bold mb-2">
            <GitBranch size={13} className="text-[#FFC107]" />
            <span>Seção 3.4 do Escopo MIA CRM</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-zinc-900">
            Processos & Checklists Reutilizáveis
          </h1>
          <p className="text-xs md:text-sm text-zinc-500 mt-1">
            Workflows operacionais com etapas sequenciais, prazos e checklists para {currentNiche.name}.
          </p>
        </div>

        <button
          onClick={() => setIsNewProcessModalOpen(true)}
          className="px-4 py-2.5 bg-[#FFC107] hover:bg-[#E5AC06] text-black rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
        >
          <Plus size={16} />
          <span>+ Iniciar Novo Processo</span>
        </button>
      </div>

      {/* Main Grid: Processes List & Selected Process Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Processes */}
        <div className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h3 className="font-bold text-sm text-zinc-900">Processos em Andamento</h3>
            <span className="text-xs bg-zinc-100 text-zinc-600 px-2.5 py-0.5 rounded-full font-bold">
              {processes.length}
            </span>
          </div>

          <div className="space-y-2.5">
            {processes.map((proc) => {
              const isSelected = selectedProcess?.id === proc.id;
              const totalItems = proc.steps.reduce((acc, s) => acc + s.checklists.length, 0);
              const completedItems = proc.steps.reduce(
                (acc, s) => acc + s.checklists.filter((c) => c.completed).length,
                0
              );
              const progressPct =
                totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

              return (
                <div
                  key={proc.id}
                  onClick={() => setSelectedProcess(proc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#FFC107] bg-[#FFF8E7]/40 shadow-xs"
                      : "border-zinc-200/70 hover:border-zinc-300 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="font-bold text-xs text-zinc-900 line-clamp-1">
                      {proc.title}
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">
                      {proc.status.replace("_", " ")}
                    </span>
                  </div>

                  {proc.clientName && (
                    <div className="text-[11px] text-zinc-500 flex items-center gap-1 mb-2">
                      <User size={12} className="text-zinc-400" />
                      <span>{proc.clientName}</span>
                    </div>
                  )}

                  {/* Mini Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-zinc-400">
                      <span>Progresso</span>
                      <strong className="text-zinc-700">{progressPct}%</strong>
                    </div>
                    <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#FFC107] h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Process Workflow Timeline & Checklist */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs space-y-6">
          {selectedProcess ? (
            <>
              {/* Header of Selected Process */}
              <div className="pb-4 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
                    <span>Processo Ativo</span>
                    <ChevronRight size={12} />
                    <span className="font-bold text-zinc-800">{selectedProcess.nicheId}</span>
                  </div>
                  <h2 className="text-lg font-extrabold text-zinc-900">
                    {selectedProcess.title}
                  </h2>
                  {selectedProcess.clientName && (
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Vinculado a: <strong className="text-zinc-800">{selectedProcess.clientName}</strong>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-3 py-1 rounded-xl flex items-center gap-1.5">
                    <Sparkles size={13} />
                    Etapa {selectedProcess.currentStep} de {selectedProcess.totalSteps}
                  </span>
                </div>
              </div>

              {/* Steps Visual Stepper */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                {selectedProcess.steps.map((step, idx) => {
                  const isDone = step.status === "concluido";
                  const isCurrent = step.status === "em_andamento";

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isDone
                          ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                          : isCurrent
                          ? "bg-[#FFF8E7] border-[#FFC107] text-zinc-900 shadow-xs"
                          : "bg-zinc-50 border-zinc-200 text-zinc-400"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        {isDone ? (
                          <CheckCircle2 size={15} className="text-emerald-600" />
                        ) : (
                          <span
                            className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                              isCurrent
                                ? "bg-[#FFC107] text-black"
                                : "bg-zinc-200 text-zinc-600"
                            }`}
                          >
                            {step.stepNumber}
                          </span>
                        )}
                        <span className="text-[11px] font-bold">Etapa {step.stepNumber}</span>
                      </div>
                      <p className="text-[11px] font-semibold line-clamp-1">{step.name}</p>
                    </div>
                  );
                })}
              </div>

              {/* Detailed Checklists by Step */}
              <div className="space-y-4 pt-2">
                <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                  <CheckSquare size={16} className="text-[#FFC107]" />
                  Checklist e Critérios de Conclusão por Etapa
                </h3>

                <div className="space-y-4">
                  {selectedProcess.steps.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-[#111111] text-[#FFC107] font-bold text-xs flex items-center justify-center">
                            {step.stepNumber}
                          </span>
                          <span className="font-bold text-xs text-zinc-900">{step.name}</span>
                        </div>
                        {step.responsible && (
                          <span className="text-[11px] text-zinc-400">
                            Responsável: <strong className="text-zinc-600">{step.responsible}</strong>
                          </span>
                        )}
                      </div>

                      {/* Checklist items */}
                      <div className="space-y-2 pt-1">
                        {step.checklists.map((check) => (
                          <div
                            key={check.id}
                            onClick={() => handleToggleChecklist(selectedProcess.id, check.id)}
                            className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                              check.completed
                                ? "bg-white border-emerald-200 text-zinc-400"
                                : "bg-white border-zinc-200/80 hover:border-[#FFC107] text-zinc-800"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                                check.completed
                                  ? "bg-emerald-500 border-emerald-500 text-white"
                                  : "border-zinc-300 bg-white"
                              }`}
                            >
                              {check.completed && <CheckCircle2 size={12} />}
                            </div>
                            <span
                              className={`text-xs font-medium ${
                                check.completed ? "line-through" : ""
                              }`}
                            >
                              {check.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-zinc-400 text-xs">
              Selecione um processo na coluna ao lado para visualizar os detalhes e checklists.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Iniciar Novo Processo */}
      {isNewProcessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md border border-zinc-200 shadow-2xl p-6 space-y-4">
            <h3 className="font-extrabold text-sm text-zinc-900">
              Iniciar Novo Processo ({currentNiche.name})
            </h3>
            <p className="text-xs text-zinc-500">
              Cria um fluxo de trabalho com etapas padronizadas e checklists de qualidade.
            </p>

            <form onSubmit={handleCreateProcess} className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">Título do Processo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Abertura de Filial / Protocolo de Pós-Procedimento"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#FFC107] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700">
                  Nome do {currentNiche.clientLabel}
                </label>
                <input
                  type="text"
                  placeholder="Ex: João da Silva"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#FFC107] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewProcessModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#FFC107] hover:bg-[#E5AC06] text-black font-bold text-xs rounded-xl shadow-xs"
                >
                  {submitting ? "Criando..." : "Criar Processo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
