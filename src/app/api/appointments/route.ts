import { NextResponse } from "next/server";
import { Appointment } from "@/types/crm";
import { isServerless } from "@/lib/env";
import { DEMO_APPOINTMENTS } from "@/data/demoData";

export async function GET() {
  try {
    if (isServerless()) {
      return NextResponse.json({ success: true, data: DEMO_APPOINTMENTS, demo: true });
    }

    const { getDb } = await import("@/lib/db");
    const db = getDb();
    const rows = db.prepare(`SELECT * FROM appointments ORDER BY date DESC, time ASC`).all() as Array<{
      id: string;
      client_name: string;
      client_initials: string | null;
      service: string;
      time: string;
      end_time: string | null;
      date: string | null;
      status: Appointment["status"];
      price: number;
    }>;

    const appointments: Appointment[] = rows.map((r) => ({
      id: r.id,
      clientName: r.client_name,
      clientInitials: r.client_initials || r.client_name.substring(0, 2).toUpperCase(),
      service: r.service,
      time: r.time,
      endTime: r.end_time || "",
      date: r.date || undefined,
      status: r.status,
      price: Number(r.price),
    }));

    return NextResponse.json({ success: true, data: appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    // Fallback para demo em caso de erro
    return NextResponse.json({ success: true, data: DEMO_APPOINTMENTS, demo: true });
  }
}

export async function POST(request: Request) {
  try {
    if (isServerless()) {
      // Na Vercel, simula criação retornando o dado
      const body = await request.json();
      const initials = body.clientName?.split(" ").map((p: string) => p[0]).join("").substring(0, 2).toUpperCase() || "NC";
      const newApp: Appointment = {
        id: `app-demo-${Date.now()}`,
        clientName: body.clientName || "Cliente Demo",
        clientInitials: initials,
        service: body.service || "Serviço",
        time: body.time || "09:00",
        endTime: body.endTime || "09:45",
        date: body.date,
        status: "agendado",
        price: Number(body.price || 0),
      };
      return NextResponse.json({ success: true, data: newApp }, { status: 201 });
    }

    const body = await request.json();
    const { getDb } = await import("@/lib/db");
    const db = getDb();

    const targetDate = body.date || new Date().toISOString().slice(0, 10);
    const targetTime = body.time;

    // 3.3 Prevenção e Bloqueio de Conflito de Horário
    if (!body.allowConflict) {
      const existingConflict = db.prepare(`
        SELECT client_name, service, time FROM appointments
        WHERE date = ? AND time = ? AND status != 'cancelado'
      `).get(targetDate, targetTime) as { client_name: string; service: string; time: string } | undefined;

      if (existingConflict) {
        return NextResponse.json(
          {
            success: false,
            isConflict: true,
            error: `Conflito de agenda: já existe um atendimento marcado para às ${targetTime} (${existingConflict.client_name} - ${existingConflict.service}). Deseja autorizar um encaixe?`,
          },
          { status: 409 }
        );
      }
    }

    const id = `app-${Date.now()}`;
    const initials =
      body.clientInitials ||
      body.clientName.split(" ").map((p: string) => p[0]).join("").substring(0, 2).toUpperCase();

    db.prepare(`
      INSERT INTO appointments (id, client_name, client_initials, service, time, end_time, date, status, price, niche_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, body.clientName, initials, body.service, body.time, body.endTime || "", targetDate, body.status || "agendado", Number(body.price || 0), body.nicheId || "beleza_estetica", new Date().toISOString());

    if (body.price && Number(body.price) > 0 && body.createTransaction !== false) {
      db.prepare(`
        INSERT INTO transactions (id, type, description, amount, category, payment_method, date, status, client_name, niche_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(`tx-app-${id}`, "entrada", `${body.service} - ${body.clientName}`, Number(body.price), "Serviços & Procedimentos", "pix", targetDate, body.status === "confirmado" || body.status === "concluido" ? "pago" : "pendente", body.clientName, body.nicheId || "beleza_estetica", new Date().toISOString());
    }

    const createdAppointment: Appointment = {
      id, clientName: body.clientName, clientInitials: initials,
      service: body.service, time: body.time, endTime: body.endTime || "",
      date: targetDate, status: body.status || "agendado", price: Number(body.price || 0),
    };

    return NextResponse.json({ success: true, data: createdAppointment }, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json({ success: false, error: "Erro ao criar agendamento" }, { status: 500 });
  }
}
