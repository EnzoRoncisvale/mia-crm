"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Plus,
  Clock,
  Percent,
  Trash2,
  DollarSign,
  Tag,
  Search,
  CheckCircle,
  X,
} from "lucide-react";
import { ProductService, NicheConfig } from "@/types/crm";

interface ServicesModuleProps {
  currentNiche: NicheConfig;
}

export default function ServicesModule({ currentNiche }: ServicesModuleProps) {
  const [services, setServices] = useState<ProductService[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // New service form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Procedimentos");
  const [price, setPrice] = useState("150");
  const [durationMinutes, setDurationMinutes] = useState("45");
  const [commissionPercent, setCommissionPercent] = useState("20");
  const [cost, setCost] = useState("25");
  const [submitting, setSubmitting] = useState(false);

  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/services`);
      const data = await res.json();
      if (data.success && data.data) {
        setServices(data.data);
      }
    } catch (err) {
      console.error("Erro ao buscar catálogo:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, [currentNiche]);

  const handleDeleteService = async (id: string) => {
    if (!window.confirm("Deseja remover este serviço do catálogo?")) return;
    try {
      const res = await fetch(`/api/services?id=${id}`, { method: "DELETE" });
      if (res.ok) await loadServices();
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          nicheId: currentNiche.id,
          category,
          price: parseFloat(price.replace(",", ".")),
          durationMinutes: parseInt(durationMinutes) || 45,
          commissionPercent: parseFloat(commissionPercent) || 0,
          cost: parseFloat(cost.replace(",", ".")) || 0,
          status: "ativo",
        }),
      });

      if (res.ok) {
        setName("");
        setDescription("");
        setIsNewServiceModalOpen(false);
        await loadServices();
      }
    } catch (err) {
      console.error("Erro ao salvar serviço:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredServices = services.filter((s) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-5 md:p-6 border border-zinc-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8E7] text-[#111111] border border-[#FFC107]/40 text-xs font-bold mb-2">
            <Sparkles size={13} className="text-[#FFC107]" />
            <span>Seção 3.2 do Escopo MIA CRM</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-zinc-900">
            Catálogo de Produtos & Serviços
          </h1>
          <p className="text-xs md:text-sm text-zinc-500 mt-1">
            Precificação, duração estimada, custo operacional e regras de comissão.
          </p>
        </div>

        <button
          onClick={() => setIsNewServiceModalOpen(true)}
          className="px-4 py-2.5 bg-[#FFC107] hover:bg-[#E5AC06] text-black rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
        >
          <Plus size={16} />
          <span>+ Cadastrar {currentNiche.serviceLabel}</span>
        </button>
      </div>

      {/* Services Table Card */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
          <div>
            <h3 className="font-bold text-sm text-zinc-900">
              Serviços Configurados ({filteredServices.length})
            </h3>
            <p className="text-xs text-zinc-400">
              Disponíveis para agendamento rápido e lançamento no financeiro
            </p>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar serviço..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-[#FFC107] w-48 sm:w-60"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((svc) => (
            <div
              key={svc.id}
              className="p-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 hover:bg-white hover:border-[#FFC107]/60 hover:shadow-xs transition-all flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFF8E7] text-amber-800 border border-[#FFC107]/40">
                    {svc.category}
                  </span>
                  <button
                    onClick={() => handleDeleteService(svc.id)}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-600 transition-opacity"
                    title="Remover serviço"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <h4 className="font-bold text-sm text-zinc-900">{svc.name}</h4>
                <p className="text-xs text-zinc-500 line-clamp-2 mt-1">{svc.description}</p>
              </div>

              <div className="pt-3 border-t border-zinc-200/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-[11px] flex items-center gap-1">
                    <Clock size={12} /> Duração:
                  </span>
                  <strong className="text-zinc-700 font-bold">{svc.durationMinutes} min</strong>
                </div>

                {svc.commissionPercent ? (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-[11px] flex items-center gap-1">
                      <Percent size={12} /> Comissão:
                    </span>
                    <strong className="text-emerald-700 font-bold">{svc.commissionPercent}%</strong>
                  </div>
                ) : null}

                <div className="flex items-baseline justify-between pt-1 border-t border-zinc-200/40">
                  <span className="text-zinc-500 font-semibold text-[11px]">Preço Final</span>
                  <span className="text-base font-extrabold text-zinc-900">
                    {formatCurrency(svc.price)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Novo Serviço */}
      {isNewServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md border border-zinc-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="font-extrabold text-sm text-zinc-900">
                Novo {currentNiche.serviceLabel} no Catálogo
              </h3>
              <button
                onClick={() => setIsNewServiceModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-3 pt-1 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-zinc-700">Nome do Serviço / Produto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Limpeza Facial com Fototerapia"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FFC107] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-700">Descrição Breve</label>
                <textarea
                  rows={2}
                  placeholder="Detalhes ou regras de atendimento..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FFC107] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Preço (R$) *</label>
                  <input
                    type="text"
                    required
                    placeholder="180,00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FFC107] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Duração (min)</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FFC107] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Comissão (%)</label>
                  <input
                    type="number"
                    value={commissionPercent}
                    onChange={(e) => setCommissionPercent(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FFC107] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-700">Custo Insumos (R$)</label>
                  <input
                    type="text"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-[#FFC107] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewServiceModalOpen(false)}
                  className="px-4 py-2 font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#FFC107] hover:bg-[#E5AC06] text-black font-bold rounded-xl shadow-xs"
                >
                  {submitting ? "Cadastrando..." : "Cadastrar no Catálogo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
