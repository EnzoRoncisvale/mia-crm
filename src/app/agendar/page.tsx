"use client";

import React from "react";
import ClientPortal from "@/components/ClientPortal";
import FooterCorporate from "@/components/FooterCorporate";

export default function AgendarPage() {
  const handleBook = (appointment: any) => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("mia_appointments");
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(appointment);
        localStorage.setItem("mia_appointments", JSON.stringify(list));
      } catch (e) {
        console.error("Erro ao salvar agendamento:", e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <ClientPortal
        onBackToAdmin={() => {
          if (typeof window !== "undefined") {
            window.location.href = "/";
          }
        }}
      />
      <FooterCorporate />
    </div>
  );
}
