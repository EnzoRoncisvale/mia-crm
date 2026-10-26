"use client";

import React from "react";
import {
  Target,
  ChevronRight,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";

function InstagramIcon({ size = 12, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
import { Lead } from "@/types/crm";

interface RecentLeadsProps {
  leads: Lead[];
  onViewAll: () => void;
  onOpenLead: (lead: Lead) => void;
}

export default function RecentLeads({
  leads,
  onViewAll,
  onOpenLead,
}: RecentLeadsProps) {
  const getStatusBadge = (status: Lead["status"]) => {
    switch (status) {
      case "novo":
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Novo
          </span>
        );
      case "em_negociacao":
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FFF8E7] text-amber-800 border border-[#FFC107]/50">
            Em negociação
          </span>
        );
      case "convertido":
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Convertido
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
            Contato feito
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#FFF8E7] text-[#111111]">
            <Target size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-900">Leads recentes</h2>
            <p className="text-[11px] text-zinc-400">
              Oportunidades em aberto e mensagens
            </p>
          </div>
        </div>

        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-zinc-600 hover:text-black flex items-center gap-1 transition-colors group"
        >
          <span>Ver todos</span>
          <ChevronRight
            size={14}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      </div>

      {/* Leads List */}
      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {leads.map((lead) => (
          <div
            key={lead.id}
            onClick={() => onOpenLead(lead)}
            className="group p-3 rounded-xl border border-zinc-100 bg-zinc-50/60 hover:bg-[#FFF8E7]/40 hover:border-[#FFC107]/40 transition-all cursor-pointer flex items-center justify-between gap-3"
          >
            {/* Left Avatar with Channel Icon */}
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full bg-zinc-200 text-zinc-800 font-bold text-xs flex items-center justify-center border border-zinc-300">
                {lead.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] shadow-xs ${
                  lead.channel === "whatsapp" ? "bg-emerald-500" : "bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600"
                }`}
                title={lead.channel === "whatsapp" ? "WhatsApp" : "Instagram Direct"}
              >
                {lead.channel === "whatsapp" ? (
                  <MessageSquare size={9} />
                ) : (
                  <InstagramIcon size={9} />
                )}
              </div>
            </div>

            {/* Middle: Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-900 truncate">
                  {lead.name}
                </span>
                <span className="text-[10px] text-zinc-400 shrink-0">
                  {lead.timeAgo}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                "{lead.message}"
              </p>
            </div>

            {/* Right: Status badge & Action */}
            <div className="flex items-center gap-2 shrink-0">
              {getStatusBadge(lead.status)}
              <div className="p-1 rounded-lg bg-zinc-100 text-zinc-400 group-hover:text-black group-hover:bg-[#FFC107] transition-colors">
                <ArrowUpRight size={13} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
