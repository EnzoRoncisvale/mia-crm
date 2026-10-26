import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { Lead } from "@/types/crm";

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare(`
      SELECT * FROM leads ORDER BY created_at DESC
    `).all() as Array<{
      id: string;
      name: string;
      message: string;
      channel: Lead["channel"];
      status: Lead["status"];
      time_ago: string;
    }>;

    const leads: Lead[] = rows.map((r) => ({
      id: r.id,
      name: r.name,
      message: r.message,
      channel: r.channel,
      status: r.status,
      timeAgo: r.time_ago || "Agora há pouco",
    }));

    return NextResponse.json({ success: true, data: leads });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar leads" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDb();

    const id = `lead-${Date.now()}`;
    const insert = db.prepare(`
      INSERT INTO leads (id, name, message, channel, status, time_ago, niche_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      body.name,
      body.message || "Interesse em agendamento",
      body.channel || "whatsapp",
      body.status || "novo",
      "Agora há pouco",
      body.nicheId || "beleza_estetica",
      new Date().toISOString()
    );

    const createdLead: Lead = {
      id,
      name: body.name,
      message: body.message || "Interesse em agendamento",
      channel: body.channel || "whatsapp",
      status: body.status || "novo",
      timeAgo: "Agora há pouco",
    };

    return NextResponse.json({ success: true, data: createdLead }, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao criar lead" },
      { status: 500 }
    );
  }
}
