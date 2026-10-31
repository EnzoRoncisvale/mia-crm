"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Building,
  Phone,
  MessageCircle,
  Clock,
  Palette,
  Shield,
  Save,
  CheckCircle2,
  Bell,
  Sparkles,
} from "lucide-react";
import { NicheConfig } from "@/types/crm";

interface CompanySettings {
  companyName: string;
  tradingName: string;
  cnpjCpf: string;
  officialPhone: string;
  officialEmail: string;
  whatsappFloatingNumber: string;
  whatsappDefaultMessage: string;
  businessHoursStart: string;
  businessHoursEnd: string;
  workDays: string[];
  themeColor: string;
  enableAiAssistant: boolean;
  enableConflictBlock: boolean;
  enableNotifications: boolean;
}

const DEFAULT_SETTINGS: CompanySettings = {
  companyName: "Studio & Clínica Elegance",
  tradingName: "MIA Atendimento",
  cnpjCpf: "12.345.678/0001-90",
  officialPhone: "(11) 98765-4321",
  officialEmail: "contato@miacrm.com.br",
  whatsappFloatingNumber: "5511999999999",
  whatsappDefaultMessage: "Olá! Gostaria de saber mais sobre os serviços 👋",
  businessHoursStart: "08:00",
  businessHoursEnd: "19:00",
  workDays: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  themeColor: "#FFC107",
  enableAiAssistant: true,
  enableConflictBlock: true,
  enableNotifications: true,
};

const ALL_DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

interface SettingsModuleProps {
  currentNiche: NicheConfig;
  onSettingsSaved?: (newSettings: CompanySettings) => void;
}

export default function SettingsModule({ currentNiche, onSettingsSaved }: SettingsModuleProps) {
  const [activeTab, setActiveTab] = useState<"empresa" | "whatsapp" | "horarios" | "automacao">("empresa");
  const [settings, setSettings] = useState<CompanySettings>(DEFAULT_SETTINGS);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Carrega configurações do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("mia_company_settings");
    if (saved) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
      } catch (err) {
        console.error("Erro ao carregar configurações:", err);
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("mia_company_settings", JSON.stringify(settings));
    if (onSettingsSaved) {
      onSettingsSaved(settings);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const toggleDay = (day: string) => {
    setSettings((prev) => {
      const exists = prev.workDays.includes(day);
      return {
        ...prev,
        workDays: exists ? prev.workDays.filter((d) => d !== day) : [...prev.workDays, day],
      };
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8E7] text-[#111111] border border-[#FFC107]/40 text-xs font-bold mb-2">
            <Settings size={13} className="text-[#FFC107]" />
            <span>Configurações do Sistema · {currentNiche.name}</span>
          </div>
          <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">
            Central de Configurações & Whitelabel
          </h2>
          <p className="text-xs text-zinc-500">
            Personalize a identidade da empresa, número de WhatsApp flutuante, horários de expediente e automações.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold animate-in fade-in">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>Configurações salvas com sucesso!</span>
          </div>
        )}
      </div>

      {/* Conteúdo Principal com Abas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Menu Lateral de Abas (3 colunas) */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-zinc-200/80 p-3 shadow-xs space-y-1 self-start">
          <button
            type="button"
            onClick={() => setActiveTab("empresa")}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-left transition-colors ${
              activeTab === "empresa"
                ? "bg-[#111111] text-[#FFC107]"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-black"
            }`}
          >
            <Building size={16} />
            <span>Dados da Empresa</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("whatsapp")}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-left transition-colors ${
              activeTab === "whatsapp"
                ? "bg-[#111111] text-[#FFC107]"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-black"
            }`}
          >
            <MessageCircle size={16} />
            <span>WhatsApp & Atendimento</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("horarios")}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-left transition-colors ${
              activeTab === "horarios"
                ? "bg-[#111111] text-[#FFC107]"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-black"
            }`}
          >
            <Clock size={16} />
            <span>Horários de Expediente</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("automacao")}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-left transition-colors ${
              activeTab === "automacao"
                ? "bg-[#111111] text-[#FFC107]"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-black"
            }`}
          >
            <Sparkles size={16} />
            <span>IA & Políticas</span>
          </button>
        </div>

        {/* Formulário da Aba Ativa (9 colunas) */}
        <div className="lg:col-span-9 bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs">
          <form onSubmit={handleSave} className="space-y-5 text-xs">
            {/* ABA 1: Dados da Empresa */}
            {activeTab === "empresa" && (
              <div className="space-y-4">
                <div className="border-b border-zinc-100 pb-3">
                  <h3 className="font-extrabold text-sm text-zinc-900">Perfil & Identidade Visual</h3>
                  <p className="text-[11px] text-zinc-400">
                    Informações exibidas no cabeçalho e nos comprovantes do sistema.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">Razão Social / Nome Oficial</label>
                    <input
                      type="text"
                      value={settings.companyName}
                      onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                      className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">Nome Fantasia / Marca</label>
                    <input
                      type="text"
                      value={settings.tradingName}
                      onChange={(e) => setSettings({ ...settings, tradingName: e.target.value })}
                      className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">CNPJ ou CPF</label>
                    <input
                      type="text"
                      value={settings.cnpjCpf}
                      onChange={(e) => setSettings({ ...settings, cnpjCpf: e.target.value })}
                      className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">E-mail de Contato Principal</label>
                    <input
                      type="email"
                      value={settings.officialEmail}
                      onChange={(e) => setSettings({ ...settings, officialEmail: e.target.value })}
                      className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ABA 2: WhatsApp & Atendimento */}
            {activeTab === "whatsapp" && (
              <div className="space-y-4">
                <div className="border-b border-zinc-100 pb-3">
                  <h3 className="font-extrabold text-sm text-zinc-900">Integração WhatsApp & Botão do Site</h3>
                  <p className="text-[11px] text-zinc-400">
                    Defina para onde o botão flutuante e os links de conversa direcionam os clientes.
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">
                      Número Oficial de WhatsApp (com DDI e DDD, apenas dígitos) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 5511999998888"
                      value={settings.whatsappFloatingNumber}
                      onChange={(e) => setSettings({ ...settings, whatsappFloatingNumber: e.target.value.replace(/\D/g, "") })}
                      className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                    />
                    <span className="text-[10px] text-zinc-400 mt-1 block">
                      Exemplo: <strong>55</strong> (Brasil) + <strong>11</strong> (DDD) + <strong>999998888</strong>.
                    </span>
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">
                      Mensagem Padrão de Boas-Vindas ao Abrir o WhatsApp
                    </label>
                    <textarea
                      rows={3}
                      value={settings.whatsappDefaultMessage}
                      onChange={(e) => setSettings({ ...settings, whatsappDefaultMessage: e.target.value })}
                      className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ABA 3: Horários de Expediente */}
            {activeTab === "horarios" && (
              <div className="space-y-4">
                <div className="border-b border-zinc-100 pb-3">
                  <h3 className="font-extrabold text-sm text-zinc-900">Grade de Expediente & Agenda</h3>
                  <p className="text-[11px] text-zinc-400">
                    Define o horário de atendimento que aparece na agenda e mensagens automáticas.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">Início do Atendimento</label>
                    <input
                      type="time"
                      value={settings.businessHoursStart}
                      onChange={(e) => setSettings({ ...settings, businessHoursStart: e.target.value })}
                      className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 mb-1">Término do Atendimento</label>
                    <input
                      type="time"
                      value={settings.businessHoursEnd}
                      onChange={(e) => setSettings({ ...settings, businessHoursEnd: e.target.value })}
                      className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 mb-2">Dias de Funcionamento</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_DAYS.map((day) => {
                      const isSelected = settings.workDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                            isSelected
                              ? "bg-[#111111] text-[#FFC107] border-black"
                              : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ABA 4: IA & Políticas */}
            {activeTab === "automacao" && (
              <div className="space-y-4">
                <div className="border-b border-zinc-100 pb-3">
                  <h3 className="font-extrabold text-sm text-zinc-900">Políticas de Operação & Inteligência</h3>
                  <p className="text-[11px] text-zinc-400">
                    Ajuste o comportamento do assistente virtual MIA e regras de conflito.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50 cursor-pointer hover:bg-zinc-100/60">
                    <div>
                      <span className="font-bold text-zinc-900 block">Assistente Virtual MIA Conectada</span>
                      <span className="text-[11px] text-zinc-500">Permitir que a IA consulte relatórios e agenda via chat flutuante.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableAiAssistant}
                      onChange={(e) => setSettings({ ...settings, enableAiAssistant: e.target.checked })}
                      className="w-4 h-4 accent-[#FFC107] rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50 cursor-pointer hover:bg-zinc-100/60">
                    <div>
                      <span className="font-bold text-zinc-900 block">Bloqueio Automático de Conflito de Horário</span>
                      <span className="text-[11px] text-zinc-500">Avisar e bloquear quando dois atendimentos caírem no mesmo slot da agenda.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableConflictBlock}
                      onChange={(e) => setSettings({ ...settings, enableConflictBlock: e.target.checked })}
                      className="w-4 h-4 accent-[#FFC107] rounded"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Botão de Salvar */}
            <div className="pt-4 border-t border-zinc-100 flex items-center justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#FFC107] hover:bg-[#E5AC06] text-black font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Save size={15} />
                <span>Salvar Configurações</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
