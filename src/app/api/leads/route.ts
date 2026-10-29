import { NextResponse } from "next/server";
import { Lead } from "@/types/crm";
import { isServerless } from "@/lib/env";

export async function GET() {
  try {
    if (isServerless()) {
      // Na Vercel: retorna lista vazia (dados vêm do localStorage no cliente)
      return NextResponse.json({ success: true, data: [], demo: true });
    }
    const { getDb } = await import("@/lib/db");
    const db = getDb();
    const rows = db.prepare(`SELECT * FROM leads ORDER BY created_at DESC`).all() as Array<{
      id: string; name: string; message: string;
      channel: Lead["channel"]; status: Lead["status"]; time_ago: string;
    }>;
    const leads: Lead[] = rows.map((r) => ({
      id: r.id, name: r.name, message: r.message,
      channel: r.channel, status: r.status, timeAgo: r.time_ago || "Agora há pouco",
    }));
    return NextResponse.json({ success: true, data: leads });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json({ success: true, data: [], demo: true });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (isServerless()) {
      const newLead: Lead = {
        id: `lead-demo-${Date.now()}`, name: body.name || "Lead",
        message: body.message || "", channel: body.channel || "whatsapp",
        status: "novo", timeAgo: "Agora há pouco",
      };
      return NextResponse.json({ success: true, data: newLead }, { status: 201 });
    }
    const { getDb } = await import("@/lib/db");
    const db = getDb();
    const id = `lead-${Date.now()}`;
    db.prepare(`INSERT INTO leads (id, name, message, channel, status, time_ago, niche_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(id, body.name, body.message || "", body.channel || "whatsapp", body.status || "novo", "Agora há pouco", body.nicheId || "beleza_estetica", new Date().toISOString());
    const createdLead: Lead = {
      id, name: body.name, message: body.message || "",
      channel: body.channel || "whatsapp", status: body.status || "novo", timeAgo: "Agora há pouco",
    };
    return NextResponse.json({ success: true, data: createdLead }, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json({ success: false, error: "Erro ao criar lead" }, { status: 500 });
  }
}
