"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppContactButton() {
  const [hovered, setHovered] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("5511999999999");
  const [whatsappMessage, setWhatsappMessage] = useState("Olá! Gostaria de saber mais sobre os serviços 👋");

  useEffect(() => {
    // Sincroniza dinamicamente com as configurações salvas na Central de Configurações
    const updateFromSettings = () => {
      const saved = localStorage.getItem("mia_company_settings");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.whatsappFloatingNumber) setWhatsappNumber(parsed.whatsappFloatingNumber);
          if (parsed.whatsappDefaultMessage) setWhatsappMessage(parsed.whatsappDefaultMessage);
        } catch {}
      }
    };

    updateFromSettings();
    window.addEventListener("storage", updateFromSettings);
    return () => window.removeEventListener("storage", updateFromSettings);
  }, []);

  const handleClick = () => {
    const msg = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, "_blank");
  };

  return (
    <div className="fixed bottom-22 right-6 z-40 flex items-center gap-3">
      {/* Tooltip */}
      {hovered && (
        <div className="bg-white border border-zinc-200 shadow-lg rounded-2xl px-4 py-2.5 text-xs font-semibold text-zinc-800 animate-in fade-in slide-in-from-right-2 whitespace-nowrap">
          💬 Fale conosco no WhatsApp
        </div>
      )}

      {/* Botão Flutuante */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
        aria-label="Contato via WhatsApp"
      >
        <MessageCircle size={26} fill="white" />
      </button>
    </div>
  );
}
