import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ProcessItem, ProcessStep } from "@/types/crm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const nicheId = searchParams.get("nicheId");

    const db = getDb();
    let query = "SELECT * FROM processes";
    const params: string[] = [];

    if (nicheId && nicheId !== "all") {
      query += " WHERE niche_id = ?";
      params.push(nicheId);
    }

    query += " ORDER BY created_at DESC";

    const rows = db.prepare(query).all(...params) as Array<{
      id: string;
      title: string;
      niche_id: string;
      client_name: string | null;
      status: ProcessItem["status"];
      current_step: number;
      total_steps: number;
      steps_json: string;
      created_at: string;
    }>;

    const processes: ProcessItem[] = rows.map((r) => {
      let parsedSteps: ProcessStep[] = [];
      try {
        parsedSteps = JSON.parse(r.steps_json);
      } catch (e) {
        parsedSteps = [];
      }

      return {
        id: r.id,
        title: r.title,
        nicheId: r.niche_id as ProcessItem["nicheId"],
        clientName: r.client_name || undefined,
        status: r.status,
        currentStep: Number(r.current_step),
        totalSteps: Number(r.total_steps),
        steps: parsedSteps,
        createdAt: r.created_at,
      };
    });

    return NextResponse.json({ success: true, data: processes });
  } catch (error) {
    console.error("Error fetching processes:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar processos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDb();

    if (!body.title) {
      return NextResponse.json(
        { success: false, error: "Título do processo é obrigatório" },
        { status: 400 }
      );
    }

    const id = `proc-${Date.now()}`;
    const createdAt = new Date().toISOString();
    const steps: ProcessStep[] = body.steps || [];

    const insert = db.prepare(`
      INSERT INTO processes (
        id, title, niche_id, client_name, status, current_step, total_steps, steps_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      body.title.trim(),
      body.nicheId || "beleza_estetica",
      body.clientName ? body.clientName.trim() : null,
      body.status || "em_andamento",
      Number(body.currentStep || 1),
      Number(steps.length || 4),
      JSON.stringify(steps),
      createdAt
    );

    const created: ProcessItem = {
      id,
      title: body.title,
      nicheId: body.nicheId || "beleza_estetica",
      clientName: body.clientName,
      status: body.status || "em_andamento",
      currentStep: Number(body.currentStep || 1),
      totalSteps: Number(steps.length || 4),
      steps,
      createdAt,
    };

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("Error creating process:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao criar processo operacional" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID não fornecido" }, { status: 400 });
    }

    const body = await request.json();
    const db = getDb();

    const row = db.prepare("SELECT * FROM processes WHERE id = ?").get(id) as {
      id: string;
      title: string;
      niche_id: string;
      client_name: string | null;
      status: string;
      current_step: number;
      total_steps: number;
      steps_json: string;
      created_at: string;
    } | undefined;

    if (!row) {
      return NextResponse.json({ success: false, error: "Processo não encontrado" }, { status: 404 });
    }

    let steps: ProcessStep[] = [];
    try {
      steps = JSON.parse(row.steps_json);
    } catch (e) {
      steps = [];
    }

    let updatedCurrentStep = row.current_step;
    let updatedStatus = row.status;

    // Toggle checklist item or advance step
    if (body.toggleChecklistId) {
      for (const step of steps) {
        for (const item of step.checklists) {
          if (item.id === body.toggleChecklistId) {
            item.completed = !item.completed;
          }
        }
        // Auto-update step status if all checklists completed
        const allCompleted = step.checklists.length > 0 && step.checklists.every((c) => c.completed);
        if (allCompleted) {
          step.status = "concluido";
        }
      }
    }

    if (body.currentStep !== undefined) {
      updatedCurrentStep = Number(body.currentStep);
    }

    if (body.status !== undefined) {
      updatedStatus = body.status;
    }

    db.prepare(`
      UPDATE processes 
      SET steps_json = ?, current_step = ?, status = ?
      WHERE id = ?
    `).run(JSON.stringify(steps), updatedCurrentStep, updatedStatus, id);

    return NextResponse.json({ success: true, message: "Processo atualizado com sucesso" });
  } catch (error) {
    console.error("Error updating process:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao atualizar processo" },
      { status: 500 }
    );
  }
}
