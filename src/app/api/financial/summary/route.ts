import { NextResponse } from "next/server";
import { financialService } from "@/lib/financialService";

// GET /api/financial/summary?month=2026-10
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month") || undefined;

    const summary = financialService.getFinancialSummary(month);
    return NextResponse.json({ success: true, data: summary });
  } catch (error) {
    console.error("Error generating financial summary:", error);
    return NextResponse.json(
      { success: false, error: "Falha ao calcular indicadores financeiros" },
      { status: 500 }
    );
  }
}
