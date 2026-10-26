"use client";

import React from "react";
import { Calendar, ChevronRight, Clock, CheckCircle } from "lucide-react";
import { Appointment } from "@/types/crm";

interface TodayAgendaProps {
  appointments: Appointment[];
  onViewAll: () => void;
  onSelectAppointment: (app: Appointment) => void;
}

export default function TodayAgenda({
  appointments,
  onViewAll,
  onSelectAppointment,
}: TodayAgendaProps) {
  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmado":
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Confirmado
          </span>
        );
      case "em_andamento":
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FFF8E7] text-amber-800 border border-[#FFC107]/40 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC107] animate-pulse" />
            Em atendimento
          </span>
        );
      case "concluido":
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
            Concluído
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Agendado
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
            <Calendar size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-900">Agenda de hoje</h2>
            <p className="text-[11px] text-zinc-400">
              5 compromissos programados
            </p>
          </div>
        </div>

        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-zinc-600 hover:text-black flex items-center gap-1 transition-colors group"
        >
          <span>Ver agenda completa</span>
          <ChevronRight
            size={14}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      </div>

      {/* Appointment List */}
      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {appointments.map((app) => (
          <div
            key={app.id}
            onClick={() => onSelectAppointment(app)}
            className="group p-3 rounded-xl border border-zinc-100 bg-zinc-50/60 hover:bg-[#FFF8E7]/40 hover:border-[#FFC107]/40 transition-all cursor-pointer flex items-center justify-between gap-3"
          >
            {/* Left: Time pill */}
            <div className="text-center min-w-[58px] py-1 px-1.5 bg-white rounded-lg border border-zinc-200 text-zinc-700 shadow-2xs group-hover:border-[#FFC107]">
              <div className="text-xs font-bold text-zinc-900">{app.time}</div>
              <div className="text-[10px] text-zinc-400 font-medium">
                {app.endTime}
              </div>
            </div>

            {/* Middle: Client avatar + info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 rounded-full bg-zinc-200/80 text-zinc-700 font-bold text-xs flex items-center justify-center shrink-0 border border-zinc-300/50 group-hover:bg-[#FFC107] group-hover:text-black transition-colors">
                {app.clientInitials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-zinc-900 truncate">
                  {app.clientName}
                </div>
                <div className="text-[11px] text-zinc-500 truncate flex items-center gap-1">
                  <span>{app.service}</span>
                  <span className="text-zinc-300">•</span>
                  <span className="font-semibold text-zinc-700">
                    R$ {app.price.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Status badge */}
            <div className="shrink-0">{getStatusBadge(app.status)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
