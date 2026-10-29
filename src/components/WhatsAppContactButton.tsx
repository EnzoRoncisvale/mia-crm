"use client";

import React, { useState } from "react";
import { MessageCircle, X, Phone } from "lucide-react";

// ⚠️ Substitua pelo número real (55 + DDD + número, sem espaços)
const WHATSAPP_NUMBER = "5511999999999";
const WHATSAPP_MESSAGE = "Olá! Gostaria de saber mais sobre o MIA CRM 👋";

export default function WhatsAppContactButton() {
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    const msg = encodeURIComponent(WHATSAPP_MESSAGE);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Tooltip */}
      {hovered && (
        <div className="bg-white border border-zinc-200 shadow-lg rounded-2xl px-4 py-2.5 text-xs font-semibold text-zinc-800 animate-in fade-in slide-in-from-right-2 whitespace-nowrap">
          💬 Fale conosco no WhatsApp
        </div>
      )}

      {/* Botão */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        aria-label="Contato via WhatsApp"
      >
        <MessageCircle size={26} fill="white" />
      </button>
    </div>
  );
}
