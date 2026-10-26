import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ProductService } from "@/types/crm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const nicheId = searchParams.get("nicheId");

    const db = getDb();
    let query = "SELECT * FROM services";
    const params: string[] = [];

    if (nicheId && nicheId !== "all") {
      query += " WHERE niche_id = ?";
      params.push(nicheId);
    }

    query += " ORDER BY name ASC";

    const rows = db.prepare(query).all(...params) as Array<{
      id: string;
      name: string;
      description: string | null;
      niche_id: string;
      category: string | null;
      price: number;
      duration_minutes: number;
      commission_percent: number;
      cost: number;
      status: "ativo" | "inativo";
      created_at: string;
    }>;

    const services: ProductService[] = rows.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description || "",
      nicheId: r.niche_id as ProductService["nicheId"],
      category: r.category || "Geral",
      price: Number(r.price),
      durationMinutes: Number(r.duration_minutes),
      commissionPercent: Number(r.commission_percent || 0),
      cost: Number(r.cost || 0),
      status: r.status,
      createdAt: r.created_at,
    }));

    return NextResponse.json({ success: true, data: services, count: services.length });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar catálogo de serviços" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDb();

    if (!body.name || body.price === undefined) {
      return NextResponse.json(
        { success: false, error: "Nome e preço são obrigatórios" },
        { status: 400 }
      );
    }

    const id = `svc-${Date.now()}`;
    const createdAt = new Date().toISOString();

    const insert = db.prepare(`
      INSERT INTO services (
        id, name, description, niche_id, category, price, duration_minutes, commission_percent, cost, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      body.name.trim(),
      body.description ? body.description.trim() : "",
      body.nicheId || "beleza_estetica",
      body.category || "Procedimentos",
      Number(body.price),
      Number(body.durationMinutes || 45),
      Number(body.commissionPercent || 0),
      Number(body.cost || 0),
      body.status || "ativo",
      createdAt
    );

    const created: ProductService = {
      id,
      name: body.name,
      description: body.description || "",
      nicheId: body.nicheId || "beleza_estetica",
      category: body.category || "Procedimentos",
      price: Number(body.price),
      durationMinutes: Number(body.durationMinutes || 45),
      commissionPercent: Number(body.commissionPercent || 0),
      cost: Number(body.cost || 0),
      status: body.status || "ativo",
      createdAt,
    };

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao cadastrar serviço" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID não fornecido" }, { status: 400 });
    }

    const db = getDb();
    const result = db.prepare("DELETE FROM services WHERE id = ?").run(id);

    if (!result.changes) {
      return NextResponse.json({ success: false, error: "Serviço não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Serviço excluído do catálogo" });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao excluir serviço" },
      { status: 500 }
    );
  }
}
