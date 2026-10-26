import { NextResponse } from "next/server";
import { financialService, TransactionFilters } from "@/lib/financialService";

// GET /api/financial/transactions?type=entrada&status=pago&search=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const filters: TransactionFilters = {
      type: (searchParams.get("type") as TransactionFilters["type"]) || undefined,
      category: searchParams.get("category") || undefined,
      status: (searchParams.get("status") as TransactionFilters["status"]) || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      search: searchParams.get("search") || undefined,
      nicheId: searchParams.get("nicheId") || undefined,
    };

    const transactions = financialService.getTransactions(filters);
    return NextResponse.json({ success: true, data: transactions, count: transactions.length });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { success: false, error: "Falha ao buscar transações financeiras" },
      { status: 500 }
    );
  }
}

// POST /api/financial/transactions
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.description || !body.amount || !body.type || !body.category || !body.date) {
      return NextResponse.json(
        { success: false, error: "Campos obrigatórios ausentes (description, amount, type, category, date)" },
        { status: 400 }
      );
    }

    const created = financialService.createTransaction({
      type: body.type,
      description: body.description,
      amount: Number(body.amount),
      category: body.category,
      paymentMethod: body.paymentMethod || "pix",
      date: body.date,
      status: body.status || "pago",
      clientName: body.clientName,
      clientId: body.clientId,
      nicheId: body.nicheId || "beleza_estetica",
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { success: false, error: "Falha ao registrar transação financeira" },
      { status: 500 }
    );
  }
}

// PATCH /api/financial/transactions?id=tx-123
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "ID não fornecido" }, { status: 400 });
    }

    const body = await request.json();
    const updated = financialService.updateTransaction(id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: "Transação não encontrada" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { success: false, error: "Falha ao atualizar transação" },
      { status: 500 }
    );
  }
}

// DELETE /api/financial/transactions?id=tx-123
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID não fornecido" }, { status: 400 });
    }

    const deleted = financialService.deleteTransaction(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Transação não encontrada" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Transação excluída com sucesso" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { success: false, error: "Falha ao excluir transação" },
      { status: 500 }
    );
  }
}
