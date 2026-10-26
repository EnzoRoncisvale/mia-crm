import { getDb } from "./db";
import {
  Transaction,
  FinancialSummary,
  MonthlyBillingItem,
  DailyCashFlowItem,
  CategoryBreakdownItem,
  PaymentMethodBreakdownItem,
  PaymentMethod,
} from "@/types/financial";

export interface TransactionFilters {
  type?: "entrada" | "saida" | "all";
  category?: string;
  status?: "pago" | "pendente" | "cancelado" | "all";
  startDate?: string;
  endDate?: string;
  search?: string;
  nicheId?: string;
}

interface DbTransactionRow {
  id: string;
  type: "entrada" | "saida";
  description: string;
  amount: number;
  category: string;
  payment_method: string;
  date: string;
  status: "pago" | "pendente" | "cancelado";
  client_name: string | null;
  client_id: string | null;
  niche_id: string | null;
  created_at: string;
}

function mapRowToTransaction(row: DbTransactionRow): Transaction {
  return {
    id: row.id,
    type: row.type,
    description: row.description,
    amount: Number(row.amount),
    category: row.category,
    paymentMethod: row.payment_method as PaymentMethod,
    date: row.date,
    status: row.status,
    clientName: row.client_name || undefined,
    clientId: row.client_id || undefined,
    nicheId: row.niche_id || undefined,
    createdAt: row.created_at,
  };
}

export const financialService = {
  getTransactions(filters: TransactionFilters = {}): Transaction[] {
    const db = getDb();
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (filters.type && filters.type !== "all") {
      conditions.push("type = ?");
      params.push(filters.type);
    }

    if (filters.status && filters.status !== "all") {
      conditions.push("status = ?");
      params.push(filters.status);
    }

    if (filters.category && filters.category !== "all") {
      conditions.push("category = ?");
      params.push(filters.category);
    }

    if (filters.startDate) {
      conditions.push("date >= ?");
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      conditions.push("date <= ?");
      params.push(filters.endDate);
    }

    if (filters.search) {
      conditions.push("(description LIKE ? OR client_name LIKE ?)");
      const term = `%${filters.search}%`;
      params.push(term, term);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const query = `
      SELECT * FROM transactions
      ${whereClause}
      ORDER BY date DESC, created_at DESC
    `;

    const stmt = db.prepare(query);
    const rows = stmt.all(...params) as unknown as DbTransactionRow[];
    return rows.map(mapRowToTransaction);
  },

  createTransaction(data: {
    type: "entrada" | "saida";
    description: string;
    amount: number;
    category: string;
    paymentMethod: PaymentMethod;
    date: string;
    status: "pago" | "pendente" | "cancelado";
    clientName?: string;
    clientId?: string;
    nicheId?: string;
  }): Transaction {
    const db = getDb();
    const id = `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const createdAt = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO transactions (
        id, type, description, amount, category, payment_method, date, status, client_name, client_id, niche_id, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      data.type,
      data.description.trim(),
      Number(data.amount),
      data.category,
      data.paymentMethod,
      data.date,
      data.status,
      data.clientName ? data.clientName.trim() : null,
      data.clientId || null,
      data.nicheId || "beleza_estetica",
      createdAt
    );

    return {
      id,
      type: data.type,
      description: data.description,
      amount: Number(data.amount),
      category: data.category,
      paymentMethod: data.paymentMethod,
      date: data.date,
      status: data.status,
      clientName: data.clientName,
      clientId: data.clientId,
      nicheId: data.nicheId,
      createdAt,
    };
  },

  updateTransaction(
    id: string,
    updates: Partial<Pick<Transaction, "description" | "amount" | "category" | "paymentMethod" | "date" | "status" | "clientName">>
  ): Transaction | null {
    const db = getDb();
    const fields: string[] = [];
    const params: (string | number | null)[] = [];

    if (updates.description !== undefined) {
      fields.push("description = ?");
      params.push(updates.description.trim());
    }
    if (updates.amount !== undefined) {
      fields.push("amount = ?");
      params.push(Number(updates.amount));
    }
    if (updates.category !== undefined) {
      fields.push("category = ?");
      params.push(updates.category);
    }
    if (updates.paymentMethod !== undefined) {
      fields.push("payment_method = ?");
      params.push(updates.paymentMethod);
    }
    if (updates.date !== undefined) {
      fields.push("date = ?");
      params.push(updates.date);
    }
    if (updates.status !== undefined) {
      fields.push("status = ?");
      params.push(updates.status);
    }
    if (updates.clientName !== undefined) {
      fields.push("client_name = ?");
      params.push(updates.clientName ? updates.clientName.trim() : null);
    }

    if (fields.length === 0) return null;

    params.push(id);
    const query = `UPDATE transactions SET ${fields.join(", ")} WHERE id = ?`;
    db.prepare(query).run(...params);

    const row = db.prepare("SELECT * FROM transactions WHERE id = ?").get(id) as unknown as DbTransactionRow | undefined;
    return row ? mapRowToTransaction(row) : null;
  },

  deleteTransaction(id: string): boolean {
    const db = getDb();
    const result = db.prepare("DELETE FROM transactions WHERE id = ?").run(id);
    return Boolean(result.changes && result.changes > 0);
  },

  getFinancialSummary(yearMonthFilter?: string): FinancialSummary {
    const db = getDb();

    // Determine current month if not specified (format YYYY-MM)
    const targetMonth = yearMonthFilter || "2026-10";

    // 1. Current Month Totals
    const currentMonthRows = db.prepare(`
      SELECT type, status, SUM(amount) as total, COUNT(*) as count
      FROM transactions
      WHERE strftime('%Y-%m', date) = ?
      GROUP BY type, status
    `).all(targetMonth) as { type: string; status: string; total: number; count: number }[];

    let totalRevenue = 0;
    let totalExpenses = 0;
    let pendingReceivables = 0;
    let pendingPayables = 0;
    let totalTransactionsCount = 0;

    for (const r of currentMonthRows) {
      totalTransactionsCount += r.count;
      if (r.type === "entrada") {
        if (r.status === "pago") totalRevenue += r.total;
        else if (r.status === "pendente") pendingReceivables += r.total;
      } else if (r.type === "saida") {
        if (r.status === "pago") totalExpenses += r.total;
        else if (r.status === "pendente") pendingPayables += r.total;
      }
    }

    const netBalance = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? Number(((netBalance / totalRevenue) * 100).toFixed(1)) : 0;

    // 2. Monthly Billing History (Last 6 Months for revenue charts)
    const monthlyRows = db.prepare(`
      SELECT 
        strftime('%Y-%m', date) as month,
        SUM(CASE WHEN type = 'entrada' AND status = 'pago' THEN amount ELSE 0 END) as entradas,
        SUM(CASE WHEN type = 'saida' AND status = 'pago' THEN amount ELSE 0 END) as saidas
      FROM transactions
      GROUP BY strftime('%Y-%m', date)
      ORDER BY month ASC
    `).all() as { month: string; entradas: number; saidas: number }[];

    const monthLabelsMap: Record<string, string> = {
      "01": "Jan", "02": "Fev", "03": "Mar", "04": "Abr",
      "05": "Mai", "06": "Jun", "07": "Jul", "08": "Ago",
      "09": "Set", "10": "Out", "11": "Nov", "12": "Dez",
    };

    const monthlyBilling: MonthlyBillingItem[] = monthlyRows.map((r) => {
      const parts = r.month.split("-");
      const mm = parts[1] || "";
      const yy = parts[0]?.substring(2) || "";
      const label = `${monthLabelsMap[mm] || mm}/${yy}`;
      const entradas = Number(r.entradas || 0);
      const saidas = Number(r.saidas || 0);
      return {
        month: r.month,
        monthLabel: label,
        entradas,
        saidas,
        lucro: entradas - saidas,
      };
    });

    // 3. Daily Cash Flow for the targeted month
    const dailyRows = db.prepare(`
      SELECT 
        date,
        SUM(CASE WHEN type = 'entrada' AND status = 'pago' THEN amount ELSE 0 END) as entradas,
        SUM(CASE WHEN type = 'saida' AND status = 'pago' THEN amount ELSE 0 END) as saidas
      FROM transactions
      WHERE strftime('%Y-%m', date) = ?
      GROUP BY date
      ORDER BY date ASC
    `).all(targetMonth) as { date: string; entradas: number; saidas: number }[];

    const dailyCashFlow: DailyCashFlowItem[] = dailyRows.map((d) => ({
      date: d.date.substring(8, 10) + "/" + d.date.substring(5, 7),
      entradas: Number(d.entradas || 0),
      saidas: Number(d.saidas || 0),
      saldoDia: Number(d.entradas || 0) - Number(d.saidas || 0),
    }));

    // 4. Categories Breakdown
    const catRows = db.prepare(`
      SELECT category, type, SUM(amount) as total
      FROM transactions
      WHERE strftime('%Y-%m', date) = ? AND status = 'pago'
      GROUP BY category, type
      ORDER BY total DESC
    `).all(targetMonth) as { category: string; type: "entrada" | "saida"; total: number }[];

    const categoriesBreakdown: CategoryBreakdownItem[] = catRows.map((c) => {
      const baseTotal = c.type === "entrada" ? (totalRevenue || 1) : (totalExpenses || 1);
      return {
        category: c.category,
        type: c.type,
        amount: Number(c.total),
        percentage: Number(((c.total / baseTotal) * 100).toFixed(1)),
      };
    });

    // 5. Payment Methods Breakdown
    const paymentLabels: Record<PaymentMethod, string> = {
      pix: "Pix",
      cartao_credito: "Cartão de Crédito",
      cartao_debito: "Cartão de Débito",
      dinheiro: "Dinheiro",
      boleto: "Boleto",
      transferencia: "Transferência",
    };

    const methodRows = db.prepare(`
      SELECT payment_method, SUM(amount) as total, COUNT(*) as count
      FROM transactions
      WHERE strftime('%Y-%m', date) = ? AND status = 'pago'
      GROUP BY payment_method
      ORDER BY total DESC
    `).all(targetMonth) as { payment_method: PaymentMethod; total: number; count: number }[];

    const paymentMethodsBreakdown: PaymentMethodBreakdownItem[] = methodRows.map((m) => ({
      method: m.payment_method,
      label: paymentLabels[m.payment_method] || m.payment_method,
      amount: Number(m.total),
      count: m.count,
    }));

    return {
      totalRevenue,
      totalExpenses,
      netBalance,
      pendingReceivables,
      pendingPayables,
      profitMargin,
      totalTransactionsCount,
      monthlyBilling,
      dailyCashFlow,
      categoriesBreakdown,
      paymentMethodsBreakdown,
    };
  },
};
