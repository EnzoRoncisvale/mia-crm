"use client";

import React, { useState } from "react";
import { X, MessageCircle, Copy, CheckCheck, ChevronDown } from "lucide-react";
import { Appointment, NicheConfig } from "@/types/crm";

interface WhatsAppTemplatesProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  currentNiche: NicheConfig;
}

type TemplateKey = "confirmacao" | "lembrete" | "cobranca" | "agradecimento" | "reagendamento";

interface Template {
  key: TemplateKey;
  label: string;
  emoji: string;
  getMessage: (app: Appointment, niche: NicheConfig) => string;
}

const TEMPLATES: Template[] = [
  {
    key: "confirmacao",
    label: "Confirmação de Agendamento",
    emoji: "✅",
    getMessage: (app, niche) =>
      `Olá, ${app.clientName.split(" ")[0]}! 😊\n\nPassando para *confirmar* o seu ${niche.serviceLabel.toLowerCase()} conosco:\n\n📅 *Data:* ${app.date ? new Date(app.date + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" }) : "hoje"}\n⏰ *Horário:* ${app.time}\n💼 *Serviço:* ${app.service}\n💰 *Valor:* R$ ${app.price.toFixed(2).replace(".", ",")}\n\nPor favor, confirme sua presença respondendo *SIM* 🙏\n\nQualquer dúvida, estamos à disposição! ✨`,
  },
  {
    key: "lembrete",
    label: "Lembrete (1 dia antes)",
    emoji: "🔔",
    getMessage: (app, niche) =>
      `Oi, ${app.clientName.split(" ")[0]}! 👋\n\n*Lembrando* que amanhã é o seu dia! 🌟\n\n⏰ *Horário:* ${app.time}\n💼 *Serviço:* ${app.service}\n\nNos vemos amanhã! Qualquer imprevisto, avise com antecedência para que possamos reorganizar a agenda. 🙏\n\n_Equipe MIA CRM_ 💛`,
  },
  {
    key: "cobranca",
    label: "Cobrança / Pagamento Pendente",
    emoji: "💳",
    getMessage: (app, _niche) =>
      `Olá, ${app.clientName.split(" ")[0]}! 😊\n\nEspero que esteja bem! Notei que o pagamento referente ao serviço *${app.service}* ainda está em aberto.\n\n💰 *Valor:* R$ ${app.price.toFixed(2).replace(".", ",")}\n\nPode realizar o pagamento via PIX, cartão ou dinheiro. 🙏\n\nQualquer dúvida, é só chamar! Obrigada 💛`,
  },
  {
    key: "agradecimento",
    label: "Agradecimento pós-atendimento",
    emoji: "🌟",
    getMessage: (app, niche) =>
      `Olá, ${app.clientName.split(" ")[0]}! ✨\n\nFoi um prazer te atender hoje! Espero que tenha gostado do *${app.service}*. 😍\n\nSua satisfação é tudo para nós! Se quiser, deixe sua avaliação e indique para amigas — será muito especial! 💛\n\nNos vemos em breve! 🙏\n\n_Equipe MIA CRM_ 🌸`,
  },
  {
    key: "reagendamento",
    label: "Reagendamento",
    emoji: "🔄",
    getMessage: (app, niche) =>
      `Olá, ${app.clientName.split(" ")[0]}! 😊\n\nPrecisamos *reagendar* o seu ${niche.serviceLabel.toLowerCase()} marcado para as ${app.time}.\n\nPedimos desculpas pelo transtorno! Por favor, nos informe sua disponibilidade para remarcarmos o mais rápido possível. 🙏\n\nAguardamos seu retorno! 💛`,
  },
];

export default function WhatsAppTemplates({
  isOpen,
  onClose,
  appointment,
  currentNiche,
}: WhatsAppTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>("confirmacao");
  const [copied, setCopied] = useState(false);
  const [customMsg, setCustomMsg] = useState("");
  const [editMode, setEditMode] = useState(false);

  if (!isOpen || !appointment) return null;

  const template = TEMPLATES.find((t) => t.key === selectedTemplate)!;
  const generatedMessage = template.getMessage(appointment, currentNiche);
  const finalMessage = editMode ? customMsg : generatedMessage;

  // Abre WhatsApp Web com a mensagem
  const handleSendWhatsApp = () => {
    const msg = encodeURIComponent(finalMessage);
    // Tenta pegar o telefone do cliente — por enquanto abre sem número
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  // Copia para área de transferência
  const handleCopy = async () => {
    await navigator.clipboard.writeText(finalMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Ao trocar template, reseta edição
  const handleSelectTemplate = (key: TemplateKey) => {
    setSelectedTemplate(key);
    setEditMode(false);
    setCustomMsg("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-zinc-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#111111] text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-emerald-500">
              <MessageCircle size={16} />
            </div>
            <div>
              <h3 className="font-bold text-sm">WhatsApp Templates</h3>
              <p className="text-[11px] text-zinc-400">{appointment.clientName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* Info do agendamento */}
          <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center gap-3 text-xs">
            <div className="w-9 h-9 rounded-full bg-[#111111] text-[#FFC107] font-bold flex items-center justify-center text-sm shrink-0">
              {appointment.clientInitials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-zinc-900">{appointment.clientName}</div>
              <div className="text-zinc-500 truncate">{appointment.service} · {appointment.time}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-bold text-zinc-900">R$ {appointment.price.toFixed(2).replace(".", ",")}</div>
            </div>
          </div>

          {/* Selector de template */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-2">
              Tipo de Mensagem
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {TEMPLATES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => handleSelectTemplate(t.key)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left text-xs transition-all ${
                    selectedTemplate === t.key
                      ? "bg-[#FFF8E7] border-[#FFC107] font-semibold text-zinc-900"
                      : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  <span className="text-base">{t.emoji}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preview da mensagem */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-700">Preview da Mensagem</label>
              <button
                onClick={() => {
                  if (!editMode) setCustomMsg(generatedMessage);
                  setEditMode(!editMode);
                }}
                className="text-[11px] font-semibold text-[#FFC107] hover:text-amber-600"
              >
                {editMode ? "← Usar template" : "✏️ Editar"}
              </button>
            </div>

            {editMode ? (
              <textarea
                rows={10}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="w-full px-3 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-[#FFC107] resize-none font-mono"
              />
            ) : (
              <div className="bg-[#E7FFDB] border border-emerald-200 rounded-2xl p-4 text-xs text-zinc-800 whitespace-pre-wrap leading-relaxed font-sans">
                {generatedMessage}
              </div>
            )}
          </div>
        </div>

        {/* Footer com botões */}
        <div className="p-4 border-t border-zinc-100 flex gap-2.5 shrink-0">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold text-xs rounded-2xl transition-colors"
          >
            {copied ? <CheckCheck size={15} className="text-emerald-600" /> : <Copy size={15} />}
            {copied ? "Copiado!" : "Copiar texto"}
          </button>
          <button
            onClick={handleSendWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl transition-colors"
          >
            <MessageCircle size={15} />
            Abrir no WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
