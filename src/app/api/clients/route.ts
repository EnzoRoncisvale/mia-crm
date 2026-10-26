import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const rows = db.prepare(`
      SELECT * FROM clients ORDER BY name ASC
    `).all();

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar clientes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDb();

    const id = `cli-${Date.now()}`;
    const insert = db.prepare(`
      INSERT INTO clients (id, name, email, phone, document, niche_id, notes, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      body.name,
      body.email || null,
      body.phone || null,
      body.document || null,
      body.nicheId || "beleza_estetica",
      body.notes || null,
      body.status || "ativo",
      new Date().toISOString()
    );

    return NextResponse.json({ success: true, data: { id, ...body } }, { status: 201 });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao criar cliente" },
      { status: 500 }
    );
  }
}
