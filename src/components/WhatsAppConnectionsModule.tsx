"use client";

import React, { useState, useEffect } from "react";
import {
  QrCode,
  Smartphone,
  CheckCircle2,
  RefreshCw,
  Wifi,
  WifiOff,
  BatteryCharging,
  ShieldCheck,
  Sparkles,
  Phone,
  Power,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { NicheConfig } from "@/types/crm";

interface WhatsAppConnectionsModuleProps {
  currentNiche: NicheConfig;
}

export default function WhatsAppConnectionsModule({ currentNiche }: WhatsAppConnectionsModuleProps) {
  const [status, setStatus] = useState<"conectado" | "desconectado" | "gerando_qr">("conectado");
  const [phoneNumber, setPhoneNumber] = useState("(11) 98765-4321");
  const [profileName, setProfileName] = useState("Atendimento MIA CRM");
  const [batteryLevel, setBatteryLevel] = useState(88);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrCountdown, setQrCountdown] = useState(45);

  // Contador regressivo do QR code
  useEffect(() => {
    let timer: any;
    if (showQrModal && qrCountdown > 0) {
      timer = setInterval(() => setQrCountdown((prev) => prev - 1), 1000);
    } else if (qrCountdown === 0) {
      setQrCountdown(45);
    }
    return () => clearInterval(timer);
  }, [showQrModal, qrCountdown]);

  const handleRefreshStatus = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1200);
  };

  const handleDisconnect = () => {
    setStatus("desconectado");
  };

  const handleStartConnect = () => {
    setStatus("gerando_qr");
    setShowQrModal(true);
    setQrCountdown(45);
  };

  const handleFinishConnect = () => {
    setShowQrModal(false);
    setStatus("conectado");
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-2">
            <Smartphone size={13} className="text-emerald-600" />
            <span>Infraestrutura de Mensagens · {currentNiche.name}</span>
          </div>
          <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">
            Conexão WhatsApp & Pareamento via QR Code
          </h2>
          <p className="text-xs text-zinc-500">
            Conecte o número do WhatsApp da empresa para sincronizar conversas, disparar notificações e habilitar a IA.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefreshStatus}
            disabled={isRefreshing}
            className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw size={13} className={isRefreshing ? "animate-spin text-[#FFC107]" : ""} />
            <span>{isRefreshing ? "Verificando..." : "Atualizar Status"}</span>
          </button>
        </div>
      </div>

      {/* Grid Principal: Cartão da Sessão Ativa + Instruções de Pareamento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Cartão de Estado da Conexão (7 colunas) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold ${
                  status === "conectado"
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-600"
                    : "bg-zinc-100 border border-zinc-200 text-zinc-400"
                }`}
              >
                {status === "conectado" ? <Wifi size={24} /> : <WifiOff size={24} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-zinc-900">Sessão WhatsApp Primária</h3>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      status === "conectado"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                        : "bg-rose-50 text-rose-700 border-rose-300"
                    }`}
                  >
                    {status === "conectado" ? "ONLINE & CONECTADO" : "DESCONECTADO"}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">Motor API: WAHA / Evolution Protocol v2</p>
              </div>
            </div>
          </div>

          {/* Dados do Aparelho Conectado */}
          {status === "conectado" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <span className="text-[10px] text-zinc-400 font-bold block mb-1">NÚMERO VINCULADO</span>
                  <span className="font-extrabold text-zinc-900">{phoneNumber}</span>
                </div>

                <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <span className="text-[10px] text-zinc-400 font-bold block mb-1">NOME DO PERFIL</span>
                  <span className="font-extrabold text-zinc-900 truncate block">{profileName}</span>
                </div>

                <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-100 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-zinc-400 font-bold block mb-1">BATERIA DO CELULAR</span>
                  <span className="font-extrabold text-emerald-600 flex items-center gap-1">
                    <BatteryCharging size={14} /> {batteryLevel}% carregando
                  </span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-900">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">Sincronização Ativa em Tempo Real:</span>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    As mensagens recebidas no WhatsApp entram automaticamente no <strong>Inbox de Comunicações</strong> e
                    os lembretes da <strong>Agenda</strong> podem ser disparados com 1 clique.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="px-4 py-2 border border-rose-200 hover:bg-rose-50 text-rose-600 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Power size={13} />
                  <span>Desconectar Aparelho</span>
                </button>

                <button
                  type="button"
                  onClick={handleStartConnect}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <QrCode size={13} />
                  <span>Reconectar / Trocar Aparelho</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto text-2xl font-bold">
                📱
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-zinc-900">Nenhum WhatsApp Conectado no Momento</h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Escaneie o código QR com a câmera do seu WhatsApp para conectar a linha comercial ao MIA CRM.
                </p>
              </div>

              <button
                type="button"
                onClick={handleStartConnect}
                className="px-6 py-2.5 bg-[#FFC107] hover:bg-[#E5AC06] text-black font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <QrCode size={16} />
                <span>Escanear QR Code de Conexão</span>
              </button>
            </div>
          )}
        </div>

        {/* Guia Passo a Passo (5 colunas) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
          <div className="border-b border-zinc-100 pb-3">
            <h3 className="font-extrabold text-sm text-zinc-900">Como Conectar seu Aparelho</h3>
            <p className="text-[11px] text-zinc-400">Processo idêntico ao WhatsApp Web tradicional.</p>
          </div>

          <div className="space-y-3.5 text-xs text-zinc-700">
            <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
              <span className="w-6 h-6 rounded-full bg-[#111111] text-[#FFC107] font-extrabold text-xs flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <strong className="block text-zinc-900">Abra o WhatsApp no Celular</strong>
                <span className="text-[11px] text-zinc-500">Acesse o app no smartphone da sua empresa.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
              <span className="w-6 h-6 rounded-full bg-[#111111] text-[#FFC107] font-extrabold text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <strong className="block text-zinc-900">Aparelhos Conectados</strong>
                <span className="text-[11px] text-zinc-500">
                  No Android toque nos 3 pontinhos; no iPhone toque em <em>Configurações &gt; Aparelhos Conectados</em>.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
              <span className="w-6 h-6 rounded-full bg-[#111111] text-[#FFC107] font-extrabold text-xs flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <strong className="block text-zinc-900">Escanear o QR Code</strong>
                <span className="text-[11px] text-zinc-500">
                  Aponte a câmera para o QR Code gerado na tela para validar a conexão instantaneamente.
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-2.5 text-[11px] text-blue-900">
            <ShieldCheck size={16} className="text-blue-600 shrink-0 mt-0.5" />
            <span>
              <strong>Criptografia Ponta a Ponta:</strong> Suas conversas continuam protegidas pelo protocolo oficial do WhatsApp.
            </span>
          </div>
        </div>
      </div>

      {/* Modal Interativo de Escaneamento de QR Code */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full border border-zinc-200 shadow-2xl p-6 space-y-4 text-center animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-zinc-900">Conectar WhatsApp Comercial</h3>
              <p className="text-xs text-zinc-500">Aponte a câmera do seu celular para o código abaixo</p>
            </div>

            {/* Simulação Visual de QR Code de Alta Densidade */}
            <div className="p-4 bg-zinc-50 rounded-3xl border-2 border-zinc-200 inline-block mx-auto relative group">
              <div className="w-56 h-56 bg-white p-3 rounded-2xl border border-zinc-200 shadow-inner flex flex-col items-center justify-center relative overflow-hidden">
                {/* Visual SVG de QR Code */}
                <svg className="w-full h-full text-zinc-900" viewBox="0 0 100 100" fill="currentColor">
                  {/* Padrões de canto do QR Code */}
                  <rect x="5" y="5" width="28" height="28" fill="#111111" rx="4" />
                  <rect x="9" y="9" width="20" height="20" fill="white" rx="2" />
                  <rect x="13" y="13" width="12" height="12" fill="#111111" rx="1" />

                  <rect x="67" y="5" width="28" height="28" fill="#111111" rx="4" />
                  <rect x="71" y="9" width="20" height="20" fill="white" rx="2" />
                  <rect x="75" y="13" width="12" height="12" fill="#111111" rx="1" />

                  <rect x="5" y="67" width="28" height="28" fill="#111111" rx="4" />
                  <rect x="9" y="71" width="20" height="20" fill="white" rx="2" />
                  <rect x="13" y="75" width="12" height="12" fill="#111111" rx="1" />

                  {/* Matriz simulada central */}
                  <rect x="38" y="10" width="8" height="8" fill="#111111" />
                  <rect x="50" y="10" width="8" height="8" fill="#111111" />
                  <rect x="38" y="24" width="8" height="8" fill="#111111" />
                  <rect x="50" y="24" width="8" height="8" fill="#111111" />
                  <rect x="10" y="38" width="8" height="8" fill="#111111" />
                  <rect x="24" y="38" width="8" height="8" fill="#111111" />
                  <rect x="38" y="38" width="24" height="24" fill="#FFC107" rx="4" />
                  <rect x="44" y="44" width="12" height="12" fill="#111111" rx="2" />
                  <rect x="68" y="38" width="8" height="8" fill="#111111" />
                  <rect x="82" y="38" width="8" height="8" fill="#111111" />
                  <rect x="38" y="68" width="8" height="8" fill="#111111" />
                  <rect x="50" y="68" width="8" height="8" fill="#111111" />
                  <rect x="68" y="68" width="8" height="8" fill="#111111" />
                  <rect x="82" y="82" width="8" height="8" fill="#111111" />
                </svg>

                <div className="absolute inset-0 bg-[#FFC107]/10 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] text-zinc-400 block font-semibold">
                O código expira em: <strong className="text-zinc-900">{qrCountdown}s</strong>
              </span>

              <button
                type="button"
                onClick={handleFinishConnect}
                className="w-full py-2.5 bg-[#FFC107] hover:bg-[#E5AC06] text-black font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 size={15} />
                <span>Simular Conexão Concluída</span>
              </button>

              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="w-full py-2 text-zinc-500 hover:text-zinc-800 text-xs font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
