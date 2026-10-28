"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Clock, User } from "lucide-react";
import { Appointment, NicheConfig } from "@/types/crm";

interface WeeklyCalendarProps {
  currentNiche: NicheConfig;
  onNewAppointment: () => void;
}

// Horários exibidos no calendário (08:00 até 19:00)
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8..19

const STATUS_COLORS: Record<string, string> = {
  confirmado: "bg-emerald-500 border-emerald-600 text-white",
  em_andamento: "bg-blue-500 border-blue-600 text-white",
  agendado: "bg-[#FFC107] border-[#E5AC06] text-black",
  cancelado: "bg-zinc-300 border-zinc-400 text-zinc-600 line-through",
  concluido: "bg-zinc-700 border-zinc-800 text-white",
};

const STATUS_LABEL: Record<string, string> = {
  confirmado: "Confirmado",
  em_andamento: "Em andamento",
  agendado: "Agendado",
  cancelado: "Cancelado",
  concluido: "Concluído",
};

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const WEEKDAYS_FULL = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = domingo
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toDateObj(dateStr: string | undefined, timeStr: string) {
  const base = dateStr || new Date().toISOString().slice(0, 10);
  return new Date(`${base}T${timeStr}:00`);
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
}

export default function WeeklyCalendar({ currentNiche, onNewAppointment }: WeeklyCalendarProps) {
  const [weekStart, setWeekStart] = useState<Date>(getWeekStart(new Date()));
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Appointment | null>(null);
  const [viewMode, setViewMode] = useState<"semana" | "dia">("semana");
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  // Dias da semana atual
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  // Carregar agendamentos da API
  useEffect(() => {
    setLoading(true);
    fetch("/api/appointments")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) setAppointments(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const prevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };

  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };

  const goToday = () => {
    setWeekStart(getWeekStart(new Date()));
    setSelectedDay(new Date());
  };

  // Filtra agendamentos de um dia específico
  function appsForDay(day: Date): Appointment[] {
    return appointments
      .filter((a) => {
        const appDate = a.date
          ? new Date(a.date + "T00:00:00")
          : new Date(); // fallback hoje
        return isSameDay(appDate, day);
      })
      .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
  }

  // Para posicionamento no grid: posição top e altura em %
  function getSlotStyle(time: string, endTime?: string) {
    const startMin = timeToMinutes(time);
    const endMin = endTime ? timeToMinutes(endTime) : startMin + 45;
    const gridStart = 8 * 60; // 08:00
    const gridEnd = 20 * 60; // 20:00
    const totalMinutes = gridEnd - gridStart;

    const top = ((startMin - gridStart) / totalMinutes) * 100;
    const height = Math.max(((endMin - startMin) / totalMinutes) * 100, 2.5);
    return { top: `${top}%`, height: `${height}%` };
  }

  const today = new Date();
  const monthLabel = weekStart.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  // ------ VISÃO SEMANA ------
  const WeekView = () => (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        {/* Header dias */}
        <div className="grid grid-cols-8 border-b border-zinc-100 pb-2 mb-1">
          <div className="col-span-1" /> {/* espaço para horas */}
          {weekDays.map((day, i) => {
            const isToday = isSameDay(day, today);
            const count = appsForDay(day).length;
            return (
              <div
                key={i}
                className="col-span-1 text-center cursor-pointer group"
                onClick={() => { setSelectedDay(day); setViewMode("dia"); }}
              >
                <div className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wide">
                  {WEEKDAYS[day.getDay()]}
                </div>
                <div className={`mx-auto mt-1 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all group-hover:ring-2 group-hover:ring-[#FFC107] ${
                  isToday
                    ? "bg-[#FFC107] text-black"
                    : "text-zinc-700 hover:bg-zinc-100"
                }`}>
                  {day.getDate()}
                </div>
                {count > 0 && (
                  <div className="mt-0.5 text-[10px] font-semibold text-[#FFC107]">
                    {count} {count === 1 ? "apmt" : "apmts"}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Grid horas */}
        <div className="grid grid-cols-8 relative" style={{ height: "600px" }}>
          {/* Coluna de horas */}
          <div className="col-span-1 relative">
            {HOURS.map((h) => (
              <div
                key={h}
                className="absolute w-full text-right pr-3"
                style={{ top: `${((h - 8) / 12) * 100}%` }}
              >
                <span className="text-[11px] text-zinc-400 font-medium">
                  {String(h).padStart(2, "0")}:00
                </span>
              </div>
            ))}
          </div>

          {/* Colunas de dias */}
          {weekDays.map((day, di) => {
            const isToday = isSameDay(day, today);
            const dayApps = appsForDay(day);
            return (
              <div
                key={di}
                className={`col-span-1 relative border-l border-zinc-100 ${isToday ? "bg-[#FFF8E7]/40" : ""}`}
              >
                {/* Linhas de hora */}
                {HOURS.map((h) => (
                  <div
                    key={h}
                    className="absolute w-full border-t border-zinc-100"
                    style={{ top: `${((h - 8) / 12) * 100}%` }}
                  />
                ))}

                {/* Agendamentos */}
                {dayApps.map((app) => {
                  const style = getSlotStyle(app.time, app.endTime);
                  const colorClass = STATUS_COLORS[app.status] || STATUS_COLORS.agendado;
                  return (
                    <button
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      style={style}
                      className={`absolute left-0.5 right-0.5 rounded-lg border px-1.5 py-1 text-left overflow-hidden shadow-xs hover:z-10 hover:shadow-md transition-all ${colorClass}`}
                    >
                      <div className="text-[10px] font-bold truncate leading-tight">{app.clientName}</div>
                      <div className="text-[9px] truncate opacity-80">{app.service}</div>
                      <div className="text-[9px] opacity-70">{app.time}</div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ------ VISÃO DIA ------
  const DayView = () => {
    const dayApps = appsForDay(selectedDay);
    return (
      <div>
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => {
              const d = new Date(selectedDay);
              d.setDate(d.getDate() - 1);
              setSelectedDay(d);
              setWeekStart(getWeekStart(d));
            }}
            className="p-1.5 rounded-lg hover:bg-zinc-100"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-bold text-zinc-900">
            {WEEKDAYS_FULL[selectedDay.getDay()]}, {selectedDay.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}
          </span>
          <button
            onClick={() => {
              const d = new Date(selectedDay);
              d.setDate(d.getDate() + 1);
              setSelectedDay(d);
              setWeekStart(getWeekStart(d));
            }}
            className="p-1.5 rounded-lg hover:bg-zinc-100"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="relative" style={{ height: "600px" }}>
          {/* Grid de horas */}
          <div className="absolute inset-0 grid" style={{ gridTemplateRows: `repeat(12, 1fr)` }}>
            {HOURS.map((h) => (
              <div key={h} className="border-t border-zinc-100 flex items-start">
                <span className="text-[11px] text-zinc-400 font-medium w-12 pt-1 pl-1">
                  {String(h).padStart(2, "0")}:00
                </span>
              </div>
            ))}
          </div>

          {/* Agendamentos do dia */}
          <div className="absolute inset-0 ml-14">
            {dayApps.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                <Clock size={32} className="mb-2 opacity-30" />
                <p className="text-sm font-medium">Nenhum agendamento neste dia</p>
                <button
                  onClick={onNewAppointment}
                  className="mt-3 px-4 py-2 bg-[#FFC107] text-black text-xs font-bold rounded-xl"
                >
                  + Agendar Horário
                </button>
              </div>
            )}
            {dayApps.map((app) => {
              const style = getSlotStyle(app.time, app.endTime);
              const colorClass = STATUS_COLORS[app.status] || STATUS_COLORS.agendado;
              return (
                <button
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  style={style}
                  className={`absolute left-0 right-2 rounded-xl border px-3 py-2 text-left shadow-xs hover:shadow-md transition-all ${colorClass}`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {app.clientInitials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{app.clientName}</div>
                      <div className="text-[11px] opacity-80 truncate">{app.service}</div>
                    </div>
                    <div className="ml-auto text-right shrink-0">
                      <div className="text-xs font-bold">
                        R$ {app.price?.toFixed(2).replace(".", ",")}
                      </div>
                      <div className="text-[10px] opacity-70">{app.time} – {app.endTime}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-xs overflow-hidden">
      {/* Header do calendário */}
      <div className="p-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={prevWeek}
              className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <ChevronLeft size={16} className="text-zinc-600" />
            </button>
            <button
              onClick={nextWeek}
              className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <ChevronRight size={16} className="text-zinc-600" />
            </button>
          </div>
          <h2 className="text-sm font-bold text-zinc-900 capitalize">{monthLabel}</h2>
          <button
            onClick={goToday}
            className="px-2.5 py-1 text-[11px] font-semibold border border-zinc-200 rounded-lg hover:bg-zinc-50 text-zinc-600"
          >
            Hoje
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle visão */}
          <div className="flex bg-zinc-100 rounded-xl p-0.5">
            <button
              onClick={() => setViewMode("semana")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "semana" ? "bg-white shadow-xs text-zinc-900" : "text-zinc-500"
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => { setViewMode("dia"); setSelectedDay(new Date()); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "dia" ? "bg-white shadow-xs text-zinc-900" : "text-zinc-500"
              }`}
            >
              Dia
            </button>
          </div>

          <button
            onClick={onNewAppointment}
            className="px-3.5 py-2 bg-[#FFC107] text-black font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-[#E5AC06] transition-colors"
          >
            <Plus size={13} />
            Agendar
          </button>
        </div>
      </div>

      {/* Legenda de status */}
      <div className="px-5 py-2 border-b border-zinc-100 flex flex-wrap gap-3">
        {Object.entries(STATUS_LABEL).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full border ${STATUS_COLORS[key]}`} />
            <span className="text-[11px] text-zinc-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-zinc-400">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[#FFC107] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs">Carregando agenda...</p>
            </div>
          </div>
        ) : viewMode === "semana" ? (
          <WeekView />
        ) : (
          <DayView />
        )}
      </div>

      {/* Resumo da semana */}
      {viewMode === "semana" && !loading && (
        <div className="px-5 py-3 border-t border-zinc-100 bg-zinc-50/50 flex flex-wrap gap-4 text-xs text-zinc-500">
          <span>
            📅 <strong className="text-zinc-800">{appointments.length}</strong> agendamentos no total
          </span>
          <span>
            ✅ <strong className="text-emerald-700">
              {appointments.filter((a) => a.status === "confirmado").length}
            </strong> confirmados
          </span>
          <span>
            🕐 <strong className="text-amber-700">
              {appointments.filter((a) => a.status === "agendado").length}
            </strong> pendentes
          </span>
          <span>
            💰 <strong className="text-zinc-800">
              R$ {appointments
                .filter((a) => a.status !== "cancelado")
                .reduce((s, a) => s + (a.price || 0), 0)
                .toFixed(2)
                .replace(".", ",")}
            </strong> em aberto
          </span>
        </div>
      )}

      {/* Modal detalhe do agendamento */}
      {selectedApp && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelectedApp(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full border border-zinc-200 shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-zinc-900">Detalhes do Agendamento</h3>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-zinc-400 hover:text-zinc-700"
              >✕</button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#111111] text-[#FFC107] font-bold text-lg flex items-center justify-center">
                {selectedApp.clientInitials}
              </div>
              <div>
                <div className="font-bold text-zinc-900">{selectedApp.clientName}</div>
                <div className="text-xs text-zinc-500">{selectedApp.service}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-zinc-50 rounded-2xl">
                <div className="text-zinc-400 mb-0.5">Horário</div>
                <div className="font-bold text-zinc-900">{selectedApp.time} – {selectedApp.endTime}</div>
              </div>
              <div className="p-3 bg-zinc-50 rounded-2xl">
                <div className="text-zinc-400 mb-0.5">Valor</div>
                <div className="font-bold text-zinc-900">
                  R$ {selectedApp.price?.toFixed(2).replace(".", ",")}
                </div>
              </div>
              <div className="p-3 bg-zinc-50 rounded-2xl col-span-2">
                <div className="text-zinc-400 mb-0.5">Status</div>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[selectedApp.status]}`}>
                  {STATUS_LABEL[selectedApp.status] || selectedApp.status}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedApp(null)}
              className="w-full py-2.5 bg-[#FFC107] text-black font-bold rounded-2xl text-sm hover:bg-[#E5AC06] transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
