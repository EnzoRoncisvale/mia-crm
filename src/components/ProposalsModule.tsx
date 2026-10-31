"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Send,
  Download,
  Copy,
  CheckCircle2,
  Clock,
  Trash2,
  DollarSign,
  Sparkles,
  Search,
  MessageCircle,
} from "lucide-react";
import { NicheConfig, ProductService } from "@/types/crm";

export interface ProposalItem {
  serviceId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Proposal {
  id: string;
  proposalNumber: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  items: ProposalItem[];
  subtotal: number;
  discountPercent: number;
  total: number;
  paymentTerms: string;
  validDays: number;
  status: "rascunho" | "enviada" | "aprovada" | "recusada";
  createdAt: string;
  notes?: string;
}

interface ProposalsModuleProps {
  currentNiche: NicheConfig;
}

export default function ProposalsModule({ currentNiche }: ProposalsModuleProps) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableServices, setAvailableServices] = useState<ProductService[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("PIX à vista ou 3x sem juros no cartão");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [validDays, setValidDays] = useState<number>(7);
  const [selectedItems, setSelectedItems] = useState<ProposalItem[]>([]);
  const [notes, setNotes] = useState("");

  // Carrega serviços e propostas
  useEffect(() => {
    // Carrega propostas do localStorage
    const saved = localStorage.getItem("mia_proposals");
    if (saved) {
      try {
        setProposals(JSON.parse(saved));
      } catch {}
    }

    // Carrega catálogo de serviços para compor a proposta
    fetch(`/api/services?nicheId=${currentNiche.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          setAvailableServices(data.data);
        }
      })
      .catch(() => {});
  }, [currentNiche.id]);

  const saveProposalsList = (updated: Proposal[]) => {
    setProposals(updated);
    localStorage.setItem("mia_proposals", JSON.stringify(updated));
  };

  const handleAddItemToProposal = (service: ProductService) => {
    const existingIndex = selectedItems.findIndex((it) => it.serviceId === service.id);
    if (existingIndex >= 0) {
      const copy = [...selectedItems];
      copy[existingIndex].quantity += 1;
      setSelectedItems(copy);
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          serviceId: service.id,
          name: service.name,
          price: service.price,
          quantity: 1,
        },
      ]);
    }
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const subtotal = selectedItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const total = subtotal * (1 - discountPercent / 100);

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || selectedItems.length === 0) return;

    const newProposal: Proposal = {
      id: `prop-${Date.now()}`,
      proposalNumber: `ORC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim(),
      items: selectedItems,
      subtotal,
      discountPercent,
      total,
      paymentTerms,
      validDays,
      status: "enviada",
      createdAt: new Date().toLocaleDateString("pt-BR"),
      notes: notes.trim(),
    };

    saveProposalsList([newProposal, ...proposals]);
    setIsModalOpen(false);

    // Reset Form
    setClientName("");
    setClientPhone("");
    setClientEmail("");
    setSelectedItems([]);
    setDiscountPercent(0);
    setNotes("");
  };

  const handleStatusChange = (id: string, newStatus: Proposal["status"]) => {
    const updated = proposals.map((p) => (p.id === id ? { ...p, status: newStatus } : p));
    saveProposalsList(updated);
  };

  const handleDelete = (id: string) => {
    const updated = proposals.filter((p) => p.id !== id);
    saveProposalsList(updated);
  };

  const handleCopyWhatsAppText = (p: Proposal) => {
    const itemsText = p.items
      .map((it) => `• ${it.name} (${it.quantity}x) — R$ ${(it.price * it.quantity).toFixed(2).replace(".", ",")}`)
      .join("\n");

    const text = `*Orçamento Oficial — ${p.proposalNumber}*\n\nOlá, *${p.clientName}*! Segue a proposta personalizada para você:\n\n*Serviços Inclusos:*\n${itemsText}\n\n*Subtotal:* R$ ${p.subtotal.toFixed(2).replace(".", ",")}${
      p.discountPercent > 0 ? `\n*Desconto:* ${p.discountPercent}%` : ""
    }\n*Valor Total:* R$ ${p.total.toFixed(2).replace(".", ",")}\n\n*Condições de Pagamento:* ${p.paymentTerms}\n*Validade:* ${p.validDays} dias\n\nFicamos à disposição para agendar e iniciar! 💛`;

    navigator.clipboard.writeText(text);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 2500);

    const cleanPhone = p.clientPhone.replace(/\D/g, "");
    if (cleanPhone) {
      window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  const filteredProposals = proposals.filter(
    (p) =>
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.proposalNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8E7] text-[#111111] border border-[#FFC107]/40 text-xs font-bold mb-2">
            <Sparkles size={13} className="text-[#FFC107]" />
            <span>Propostas & Orçamentos · {currentNiche.name}</span>
          </div>
          <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">
            Emissor de Propostas Comerciais & Orçamentos
          </h2>
          <p className="text-xs text-zinc-500">
            Crie orçamentos com itens do seu catálogo, aplique descontos e envie propostas prontas para o WhatsApp.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#FFC107] hover:bg-[#E5AC06] text-black font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-auto"
        >
          <Plus size={15} />
          <span>Criar Nova Proposta</span>
        </button>
      </div>

      {/* Lista de Propostas */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
          <div className="relative max-w-sm flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar por cliente ou número da proposta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
            />
          </div>

          <span className="text-xs text-zinc-500 font-semibold">
            {filteredProposals.length} propostas emitidas
          </span>
        </div>

        {filteredProposals.length === 0 ? (
          <div className="py-16 text-center text-zinc-400 text-xs space-y-2">
            <FileText size={36} className="mx-auto text-zinc-300" />
            <p className="font-semibold text-zinc-600">Nenhuma proposta comercial criada ainda.</p>
            <p className="text-zinc-400">Clique no botão acima para montar o primeiro orçamento com itens do catálogo.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {filteredProposals.map((p) => (
              <div
                key={p.id}
                className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-zinc-50/60 p-3 rounded-2xl transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#111111] text-[#FFC107] font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ORÇ
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-zinc-900">{p.clientName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                        {p.proposalNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.status === "aprovada"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : p.status === "recusada"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {p.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-500">
                      {p.items.length} {p.items.length === 1 ? "item" : "itens"} · Validade: {p.validDays} dias · {p.createdAt}
                    </p>

                    <p className="text-[11px] text-zinc-400 italic">Condição: {p.paymentTerms}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 self-end lg:self-center">
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-emerald-600">
                      R$ {p.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </div>
                    {p.discountPercent > 0 && (
                      <span className="text-[10px] text-zinc-400 line-through">
                        R$ {p.subtotal.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <select
                    value={p.status}
                    onChange={(e) => handleStatusChange(p.id, e.target.value as any)}
                    className="px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold focus:outline-none"
                  >
                    <option value="enviada">Enviada</option>
                    <option value="aprovada">Aprovada</option>
                    <option value="recusada">Recusada</option>
                  </select>

                  <button
                    onClick={() => handleCopyWhatsAppText(p)}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <MessageCircle size={13} />
                    <span>{copiedId === p.id ? "Copiado!" : "Enviar WhatsApp"}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Criar Proposta */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full border border-zinc-200 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-zinc-900">Nova Proposta / Orçamento Comercial</h3>
                <span className="text-[11px] text-zinc-400">Nicho: {currentNiche.name}</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-black p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProposal} className="space-y-4 text-xs">
              {/* Dados do Cliente */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Nome do Cliente *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Amanda Silva"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    placeholder="(11) 99999-8888"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">E-mail (opcional)</label>
                  <input
                    type="email"
                    placeholder="cliente@email.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                  />
                </div>
              </div>

              {/* Itens Disponíveis para adicionar */}
              <div className="space-y-2 p-3 bg-zinc-50 rounded-2xl border border-zinc-200">
                <span className="font-bold text-zinc-700 block">Adicionar Serviços do Catálogo:</span>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
                  {availableServices.length === 0 ? (
                    <span className="text-zinc-400 italic">Nenhum serviço cadastrado no catálogo.</span>
                  ) : (
                    availableServices.map((svc) => (
                      <button
                        key={svc.id}
                        type="button"
                        onClick={() => handleAddItemToProposal(svc)}
                        className="px-2.5 py-1.5 bg-white border border-zinc-200 hover:border-[#FFC107] text-zinc-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <Plus size={12} className="text-[#FFC107]" />
                        <span>{svc.name}</span>
                        <span className="text-emerald-600 font-bold">R$ {svc.price.toFixed(2)}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Tabela de Itens Selecionados */}
              <div className="space-y-2">
                <span className="font-bold text-zinc-700 block">Itens da Proposta:</span>
                {selectedItems.length === 0 ? (
                  <p className="text-zinc-400 italic">Nenhum item adicionado ainda.</p>
                ) : (
                  <div className="border border-zinc-200 rounded-2xl overflow-hidden divide-y divide-zinc-100">
                    {selectedItems.map((item, i) => (
                      <div key={i} className="p-2.5 flex items-center justify-between bg-white text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-900">{item.name}</span>
                          <span className="text-zinc-400 text-[11px]">({item.quantity}x)</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-zinc-900">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(i)}
                            className="text-zinc-400 hover:text-rose-600"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Condições & Desconto */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Desconto (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Validade (dias)</label>
                  <input
                    type="number"
                    min="1"
                    value={validDays}
                    onChange={(e) => setValidDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 mb-1">Condição de Pagamento</label>
                  <input
                    type="text"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                  />
                </div>
              </div>

              {/* Totalizador */}
              <div className="p-3.5 bg-[#FFF8E7] rounded-2xl border border-[#FFC107]/40 flex items-center justify-between text-xs font-bold">
                <span className="text-zinc-800">Total com Desconto:</span>
                <span className="text-base text-zinc-950 font-extrabold">
                  R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex gap-2 pt-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 text-xs font-bold text-zinc-600 border border-zinc-200 rounded-xl hover:bg-zinc-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={selectedItems.length === 0}
                  className="flex-1 py-2 bg-[#FFC107] hover:bg-[#E5AC06] text-black text-xs font-bold rounded-xl shadow-xs disabled:opacity-50 transition-colors"
                >
                  Salvar e Gerar Proposta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
