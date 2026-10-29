import { NextResponse } from "next/server";
import { isServerless } from "@/lib/env";
import { DEMO_CLIENTS } from "@/data/demoData";

export async function GET() {
  try {
    if (isServerless()) {
      return NextResponse.json({ success: true, data: DEMO_CLIENTS, demo: true });
    }
    const { getDb } = await import("@/lib/db");
    const db = getDb();
    const rows = db.prepare(`SELECT * FROM clients ORDER BY name ASC`).all();
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json({ success: true, data: DEMO_CLIENTS, demo: true });
  }
}

export async function POST(request: Request) {
  try {
    if (isServerless()) {
      const body = await request.json();
      return NextResponse.json({ success: true, data: { id: `cli-demo-${Date.now()}`, ...body } }, { status: 201 });
    }
    const body = await request.json();
    const { getDb } = await import("@/lib/db");
    const db = getDb();
    const id = `cli-${Date.now()}`;
    db.prepare(`INSERT INTO clients (id, name, email, phone, document, niche_id, notes, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(id, body.name, body.email || null, body.phone || null, body.document || null, body.nicheId || "beleza_estetica", body.notes || null, body.status || "ativo", new Date().toISOString());
    return NextResponse.json({ success: true, data: { id, ...body } }, { status: 201 });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json({ success: false, error: "Erro ao criar cliente" }, { status: 500 });
  }
}
