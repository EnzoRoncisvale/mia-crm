"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  UploadCloud,
  Download,
  Trash2,
  Search,
  Filter,
  Eye,
  ShieldCheck,
  Folder,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { NicheConfig } from "@/types/crm";

export interface ClientDocument {
  id: string;
  title: string;
  clientName: string;
  category: "contrato" | "termo_lgpd" | "laudo" | "foto" | "outros";
  fileSize: string;
  fileUrl?: string;
  createdAt: string;
}

const CATEGORY_LABELS: Record<ClientDocument["category"], { label: string; color: string }> = {
  contrato: { label: "Contrato", color: "bg-blue-50 text-blue-700 border-blue-200" },
  termo_lgpd: { label: "Termo LGPD", color: "bg-purple-50 text-purple-700 border-purple-200" },
  laudo: { label: "Laudo / Avaliação", color: "bg-amber-50 text-amber-800 border-amber-200" },
  foto: { label: "Foto / Anexo", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  outros: { label: "Outros", color: "bg-zinc-100 text-zinc-700 border-zinc-200" },
};

interface DocumentsModuleProps {
  currentNiche: NicheConfig;
}

export default function DocumentsModule({ currentNiche }: DocumentsModuleProps) {
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [docTitle, setDocTitle] = useState("");
  const [docClient, setDocClient] = useState("");
  const [docCategory, setDocCategory] = useState<ClientDocument["category"]>("contrato");
  const [selectedFileName, setSelectedFileName] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("mia_client_documents");
    if (saved) {
      try {
        setDocuments(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const saveDocsList = (updated: ClientDocument[]) => {
    setDocuments(updated);
    localStorage.setItem("mia_client_documents", JSON.stringify(updated));
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim() || !docClient.trim()) return;

    const newDoc: ClientDocument = {
      id: `doc-${Date.now()}`,
      title: docTitle.trim(),
      clientName: docClient.trim(),
      category: docCategory,
      fileSize: selectedFileName ? "1.4 MB" : "540 KB",
      createdAt: new Date().toLocaleDateString("pt-BR"),
    };

    saveDocsList([newDoc, ...documents]);
    setIsModalOpen(false);

    setDocTitle("");
    setDocClient("");
    setSelectedFileName("");
  };

  const handleDelete = (id: string) => {
    const updated = documents.filter((d) => d.id !== id);
    saveDocsList(updated);
  };

  const filteredDocs = documents.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "todos" || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8E7] text-[#111111] border border-[#FFC107]/40 text-xs font-bold mb-2">
            <ShieldCheck size={13} className="text-[#FFC107]" />
            <span>Gestão Documental · {currentNiche.name}</span>
          </div>
          <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">
            Documentos, Termos & Contratos
          </h2>
          <p className="text-xs text-zinc-500">
            Armazene com segurança termos de consentimento LGPD, contratos de prestação e laudos técnicos dos clientes.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#FFC107] hover:bg-[#E5AC06] text-black font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-auto"
        >
          <Plus size={15} />
          <span>Upload de Documento</span>
        </button>
      </div>

      {/* Lista de Documentos */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs space-y-4">
        {/* Barra de Filtros */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
          <div className="relative max-w-sm flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar documento ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-xs font-semibold">Categoria:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold focus:outline-none"
            >
              <option value="todos">Todas categorias</option>
              <option value="contrato">Contratos</option>
              <option value="termo_lgpd">Termos LGPD</option>
              <option value="laudo">Laudos / Avaliações</option>
              <option value="foto">Fotos / Anexos</option>
              <option value="outros">Outros</option>
            </select>
          </div>
        </div>

        {/* Tabela ou Vazio */}
        {filteredDocs.length === 0 ? (
          <div className="py-16 text-center text-zinc-400 text-xs space-y-2">
            <Folder size={36} className="mx-auto text-zinc-300" />
            <p className="font-semibold text-zinc-600">Nenhum documento anexado ainda.</p>
            <p className="text-zinc-400">
              Faça o upload do primeiro termo de consentimento, contrato ou arquivo para vincular ao cliente.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {filteredDocs.map((doc) => {
              const catInfo = CATEGORY_LABELS[doc.category];
              return (
                <div
                  key={doc.id}
                  className="py-3.5 flex items-center justify-between hover:bg-zinc-50/60 p-3 rounded-2xl transition-colors gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-2xl bg-zinc-100 text-zinc-700 flex items-center justify-center shrink-0">
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-zinc-900 truncate">{doc.title}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catInfo.color} shrink-0`}
                        >
                          {catInfo.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate">
                        Cliente: <strong className="text-zinc-700">{doc.clientName}</strong> · Tamanho: {doc.fileSize} · Cadastrado em: {doc.createdAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => alert(`Simulação de visualização do documento: ${doc.title}`)}
                      className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="Visualizar"
                    >
                      <Eye size={13} />
                      <span className="hidden sm:inline">Visualizar</span>
                    </button>

                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Excluir arquivo"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Upload */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full border border-zinc-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="font-bold text-sm text-zinc-900">Anexar Documento ao Cliente</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-black p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Título do Arquivo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Contrato de Prestação de Serviços"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Nome do Cliente Vinculado *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Gabriela Duarte"
                  value={docClient}
                  onChange={(e) => setDocClient(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Categoria do Arquivo</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                >
                  <option value="contrato">Contrato de Prestação</option>
                  <option value="termo_lgpd">Termo de Consentimento LGPD</option>
                  <option value="laudo">Laudo Técnico / Avaliação</option>
                  <option value="foto">Foto de Antes / Depois</option>
                  <option value="outros">Outros Documentos</option>
                </select>
              </div>

              {/* Upload Box */}
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Arquivo (PDF, JPG, PNG)</label>
                <label className="border-2 border-dashed border-zinc-200 hover:border-[#FFC107] rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-zinc-50/50 transition-colors">
                  <UploadCloud size={24} className="text-zinc-400" />
                  <span className="text-[11px] font-bold text-zinc-700">
                    {selectedFileName || "Clique para escolher o arquivo"}
                  </span>
                  <span className="text-[10px] text-zinc-400">Suporta até 25MB</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFileName(e.target.files[0].name);
                      }
                    }}
                  />
                </label>
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
                  className="flex-1 py-2 bg-[#FFC107] hover:bg-[#E5AC06] text-black text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Confirmar Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
