"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Users, Search, Download, Upload, Plus, FileText, CheckCircle2,
  AlertCircle, Phone, Mail, Calendar, Trash2, ArrowUpDown, Filter, X
} from "lucide-react";
import { NicheConfig } from "@/types/crm";

export interface ClientItem {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  document?: string;
  notes?: string;
  status: "ativo" | "inativo" | "vip" | "novo";
  created_at?: string;
  totalSpent?: number;
  lastVisit?: string;
}

interface ClientsModuleProps {
  currentNiche: NicheConfig;
  onOpenNewClient: () => void;
  onSelectClient?: (clientName: string) => void;
}

const STORAGE_KEY = "mia_crm_custom_clients";

export default function ClientsModule({
  currentNiche,
  onOpenNewClient,
  onSelectClient,
}: ClientsModuleProps) {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importFeedback, setImportFeedback] = useState<{ success: number; errors: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carrega clientes do backend e do localStorage
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      let serverClients: ClientItem[] = data.data || [];

      // Recupera também do localStorage para persistir na Vercel
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const localList: ClientItem[] = JSON.parse(saved);
            // Mescla sem duplicar por ID ou nome
            const existingIds = new Set(serverClients.map((c) => c.id));
            const merged = [...serverClients];
            for (const item of localList) {
              if (!existingIds.has(item.id)) {
                merged.push(item);
                existingIds.add(item.id);
              }
            }
            serverClients = merged;
          } catch (e) {
            console.error(e);
          }
        }
      }

      setClients(serverClients);
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
    }
  };

  const saveClientsList = (updated: ClientItem[]) => {
    setClients(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  // Filtragem
  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm)) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === "todos" || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Exportação CSV
  const handleExportCSV = () => {
    if (clients.length === 0) {
      alert("Nenhum cliente para exportar no momento.");
      return;
    }

    // Monta cabeçalho e linhas
    const headers = ["Nome", "Telefone", "E-mail", "CPF/Documento", "Status", "Notas", "Data Cadastro"];
    const rows = clients.map((c) => [
      `"${c.name.replace(/"/g, '""')}"`,
      `"${(c.phone || "").replace(/"/g, '""')}"`,
      `"${(c.email || "").replace(/"/g, '""')}"`,
      `"${(c.document || "").replace(/"/g, '""')}"`,
      `"${c.status || "ativo"}"`,
      `"${(c.notes || "").replace(/"/g, '""')}"`,
      `"${c.created_at ? new Date(c.created_at).toLocaleDateString("pt-BR") : ""}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `clientes_${currentNiche.id}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download do Modelo de Exemplo CSV
  const handleDownloadSample = () => {
    const sampleHeaders = ["Nome", "Telefone", "E-mail", "CPF/Documento", "Status", "Notas"];
    const sampleRows = [
      ["Maria Silva Oliveira", "(11) 98765-4321", "maria@exemplo.com", "123.456.789-00", "ativo", "Prefere atendimento matutino"],
      ["Carlos Eduardo Santos", "(21) 99887-1122", "carlos@exemplo.com", "234.567.890-11", "vip", "Cliente fidelizado"],
      ["Fernanda Costa", "(31) 97654-3210", "fernanda@exemplo.com", "", "novo", "Indicação de amiga"],
    ];
    const csvContent = "\uFEFF" + [sampleHeaders.join(";"), ...sampleRows.map((r) => r.join(";"))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `modelo_importacao_clientes.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Processa texto CSV (seja por upload de arquivo ou colado)
  const processCSVText = (csvText: string) => {
    const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length <= 1) {
      alert("O arquivo não possui linhas de dados suficientes.");
      return;
    }

    // Identifica separador (, ou ;)
    const headerLine = lines[0];
    const sep = headerLine.includes(";") ? ";" : ",";
    const headerCols = headerLine.split(sep).map((c) => c.replace(/["']/g, "").trim().toLowerCase());

    const nameIdx = headerCols.findIndex((c) => c.includes("nome") || c.includes("cliente") || c === "name");
    const phoneIdx = headerCols.findIndex((c) => c.includes("tel") || c.includes("cel") || c.includes("whats") || c === "phone");
    const emailIdx = headerCols.findIndex((c) => c.includes("mail") || c.includes("email"));
    const docIdx = headerCols.findIndex((c) => c.includes("cpf") || c.includes("doc") || c.includes("cnpj"));
    const statusIdx = headerCols.findIndex((c) => c.includes("status"));
    const notesIdx = headerCols.findIndex((c) => c.includes("obs") || c.includes("nota") || c.includes("notes"));

    let importedCount = 0;
    const newClients: ClientItem[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;

      // Split respeitando aspas básicas
      const cols = line.split(sep).map((c) => c.replace(/^["']|["']$/g, "").trim());
      const rawName = nameIdx !== -1 ? cols[nameIdx] : cols[0];

      if (!rawName) continue;

      const rawPhone = phoneIdx !== -1 ? cols[phoneIdx] : "";
      const rawEmail = emailIdx !== -1 ? cols[emailIdx] : "";
      const rawDoc = docIdx !== -1 ? cols[docIdx] : "";
      const rawStatus = (statusIdx !== -1 && cols[statusIdx]?.toLowerCase()) || "ativo";
      const validStatus: ClientItem["status"] = ["ativo", "inativo", "vip", "novo"].includes(rawStatus)
        ? (rawStatus as ClientItem["status"])
        : "ativo";
      const rawNotes = notesIdx !== -1 ? cols[notesIdx] : "";

      const newClient: ClientItem = {
        id: `cli-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
        name: rawName,
        phone: rawPhone,
        email: rawEmail,
        document: rawDoc,
        status: validStatus,
        notes: rawNotes,
        created_at: new Date().toISOString(),
      };

      newClients.push(newClient);
      importedCount++;
    }

    if (newClients.length > 0) {
      const updated = [...newClients, ...clients];
      saveClientsList(updated);
      setImportFeedback({ success: importedCount, errors: 0 });
      setImportText("");
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportFeedback(null);
      }, 1800);
    } else {
      alert("Não foi possível identificar nomes válidos no arquivo importado.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        processCSVText(content);
      }
    };
    reader.readAsText(file, "UTF-8");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith(".csv") || file.name.endsWith(".txt"))) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          processCSVText(content);
        }
      };
      reader.readAsText(file, "UTF-8");
    }
  };

  const handleDeleteClient = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Tem certeza que deseja remover este cliente?")) {
      const updated = clients.filter((c) => c.id !== id);
      saveClientsList(updated);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-6">
      {/* Header do Módulo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-zinc-900">
              Base de {currentNiche.clientLabel}s
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFC107]/20 text-zinc-800 border border-[#FFC107]/40">
              {clients.length} {clients.length === 1 ? "registro" : "registros"}
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Gerencie contatos, histórico e importe/exporte listas de {currentNiche.name.toLowerCase()} em segundos.
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Exportar */}
          <button
            onClick={handleExportCSV}
            title="Exportar para Excel / CSV"
            className="px-3 py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-semibold rounded-xl border border-zinc-200/80 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500" />
            <span>Exportar CSV</span>
          </button>

          {/* Importar */}
          <button
            onClick={() => setIsImportModalOpen(true)}
            title="Importar lista de clientes"
            className="px-3 py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-semibold rounded-xl border border-zinc-200/80 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span>Importar Planilha</span>
          </button>

          {/* Novo Cliente */}
          <button
            onClick={onOpenNewClient}
            className="px-3.5 py-2 bg-[#FFC107] hover:bg-[#ffb300] text-black font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ Cadastrar {currentNiche.clientLabel}</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Buscar por nome, telefone ou e-mail...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-zinc-50 border border-zinc-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107] transition-all"
          />
        </div>

        {/* Filtro por Status */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-semibold text-zinc-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Status:
          </span>
          {[
            { id: "todos", label: "Todos" },
            { id: "ativo", label: "Ativos" },
            { id: "vip", label: "VIP ⭐" },
            { id: "novo", label: "Novos" },
            { id: "inativo", label: "Inativos" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterStatus(item.id)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                filterStatus === item.id
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-600"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista / Tabela de Clientes */}
      {filteredClients.length === 0 ? (
        <div className="text-center py-16 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
          <Users className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
          <h3 className="text-xs font-bold text-zinc-700">Nenhum {currentNiche.clientLabel.toLowerCase()} encontrado</h3>
          <p className="text-[11px] text-zinc-400 max-w-sm mx-auto mt-1 mb-4">
            {searchTerm
              ? "Tente ajustar os termos da sua busca ou filtros."
              : "Sua base está limpa. Comece cadastrando um novo contato ou importando sua planilha de contatos."}
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-3 py-1.5 bg-white border border-zinc-200 text-zinc-700 text-xs font-semibold rounded-xl hover:bg-zinc-50 cursor-pointer"
            >
              Importar Planilha CSV
            </button>
            <button
              onClick={onOpenNewClient}
              className="px-3 py-1.5 bg-[#FFC107] text-black text-xs font-bold rounded-xl hover:bg-[#ffb300] cursor-pointer"
            >
              + Novo Cadastro
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto border border-zinc-100 rounded-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 text-[11px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-200/80">
                <th className="py-3 px-4">Nome & Contato</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Documento</th>
                <th className="py-3 px-4">Notas / Observação</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {filteredClients.map((client) => {
                const initials = client.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <tr
                    key={client.id}
                    onClick={() => onSelectClient && onSelectClient(client.name)}
                    className="hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Nome + Avatar + Contatos */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#111111] text-[#FFC107] font-bold text-[11px] flex items-center justify-center shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                            {client.name}
                            {client.status === "vip" && (
                              <span className="text-amber-500 text-[10px]">⭐</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5 text-[11px] text-zinc-400">
                            {client.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-zinc-400" />
                                {client.phone}
                              </span>
                            )}
                            {client.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-zinc-400" />
                                {client.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          client.status === "vip"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : client.status === "novo"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : client.status === "inativo"
                            ? "bg-zinc-100 text-zinc-600 border border-zinc-200"
                            : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {client.status === "vip"
                          ? "VIP"
                          : client.status === "novo"
                          ? "Novo"
                          : client.status === "inativo"
                          ? "Inativo"
                          : "Ativo"}
                      </span>
                    </td>

                    {/* Documento */}
                    <td className="py-3 px-4 text-zinc-600 text-[11px]">
                      {client.document || <span className="text-zinc-300">—</span>}
                    </td>

                    {/* Notas */}
                    <td className="py-3 px-4 text-zinc-500 text-[11px] max-w-xs truncate">
                      {client.notes || <span className="text-zinc-300">—</span>}
                    </td>

                    {/* Ações */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {client.phone && (
                          <a
                            href={`https://wa.me/55${client.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title="Conversar no WhatsApp"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={(e) => handleDeleteClient(client.id, e)}
                          title="Remover cliente"
                          className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL DE IMPORTAÇÃO DE PLANILHA CSV */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-zinc-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">
                    Importar Base de {currentNiche.clientLabel}s
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Importe contatos via planilha Excel (.csv) ou cole diretamente
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportFeedback(null);
                }}
                className="text-zinc-400 hover:text-zinc-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sucesso de importação */}
            {importFeedback ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold">Importação concluída com sucesso!</div>
                  <div className="text-[11px] text-emerald-700">
                    {importFeedback.success} contatos adicionados à sua base de {currentNiche.clientLabel}s.
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Zona de Drop de Arquivo */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-zinc-200 hover:border-zinc-300 bg-zinc-50/50"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".csv,text/csv,text/plain"
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                  <div className="text-xs font-bold text-zinc-700">
                    Arraste sua planilha CSV ou clique para selecionar
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Formatos suportados: .CSV separado por vírgula ou ponto-e-vírgula
                  </p>
                </div>

                {/* Opção alternativa: Colar texto */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-600 mb-1">
                    <span>Ou cole o conteúdo da planilha abaixo:</span>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Nome;Telefone;Email;CPF;Status&#10;Maria Silva;(11) 98765-4321;maria@email.com;123.456.789-00;ativo"
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    className="w-full text-xs font-mono p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                  />
                </div>

                {/* Ajuda & Modelo */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-xs">
                  <button
                    onClick={handleDownloadSample}
                    className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Download className="w-3 h-3" /> Baixar planilha modelo (.CSV)
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsImportModalOpen(false)}
                      className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-700"
                    >
                      Cancelar
                    </button>
                    <button
                      disabled={!importText.trim()}
                      onClick={() => processCSVText(importText)}
                      className="px-4 py-1.5 bg-[#FFC107] hover:bg-[#ffb300] disabled:opacity-40 disabled:hover:bg-[#FFC107] text-black font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Processar Dados
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
