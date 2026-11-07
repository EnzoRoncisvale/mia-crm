import React from "react";
import { ShieldCheck, HeartPulse, Sparkles, Calculator, Building2 } from "lucide-react";

export default function FooterCorporate() {
  return (
    <footer className="mt-12 border-t border-zinc-200/80 bg-white/80 backdrop-blur-xs py-8 px-4 md:px-8 text-zinc-600">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Identificação da Plataforma */}
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFC107]" />
            <span className="font-extrabold text-sm text-zinc-900 tracking-tight">
              MIA CRM
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
              Versão 1.4.0
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 max-w-md">
            Ecossistema inteligente de gestão comercial, agendamentos e automação para Beleza & Estética, Saúde & Bem-estar e Contabilidade.
          </p>
        </div>

        {/* Quadro de Responsabilidade & CNPJs */}
        <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-3.5 text-xs space-y-2 w-full md:w-auto shadow-2xs">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-200/60 pb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Estrutura Societária & Dados Fiscais</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-0.5 text-[11px]">
            {/* Enzo Roncisvale */}
            <div className="space-y-0.5">
              <div className="font-bold text-zinc-900">Enzo Roncisvale</div>
              <div className="font-mono text-[10px] text-zinc-600">64.345.126/0001-80</div>
              <div className="text-[9px] text-zinc-400">Desenvolvimento & Engenharia</div>
            </div>

            {/* Lucas Ribeiro */}
            <div className="space-y-0.5">
              <div className="font-bold text-zinc-900">Lucas Ribeiro</div>
              <div className="font-mono text-[10px] text-zinc-600">64.297.509/0001-20</div>
              <div className="text-[9px] text-zinc-400">Back-end & Arquitetura</div>
            </div>

            {/* Tayná / Empresária */}
            <div className="space-y-0.5">
              <div className="font-bold text-zinc-900">Tayná (Empresária)</div>
              <div className="font-mono text-[10px] text-zinc-600">CNPJ Operacional Ativo</div>
              <div className="text-[9px] text-zinc-400">Operação & Gestão Comercial</div>
            </div>
          </div>
        </div>
      </div>

      {/* Direitos Reservados */}
      <div className="max-w-7xl mx-auto pt-6 mt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 gap-2">
        <div>
          © 2026 MIA CRM. Todos os direitos reservados.
        </div>
        <div className="flex items-center gap-4 text-[10px]">
          <span>Privacidade & LGPD</span>
          <span>•</span>
          <span>Termos de Uso</span>
          <span>•</span>
          <span className="text-emerald-600 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Servidores Online
          </span>
        </div>
      </div>
    </footer>
  );
}
