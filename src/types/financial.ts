export type TransactionType = "entrada" | "saida";

export type PaymentMethod =
  | "pix"
  | "cartao_credito"
  | "cartao_debito"
  | "dinheiro"
  | "boleto"
  | "transferencia";

export type TransactionStatus = "pago" | "pendente" | "cancelado";

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  category: string;
  paymentMethod: PaymentMethod;
  date: string; // YYYY-MM-DD
  status: TransactionStatus;
  clientName?: string;
  clientId?: string;
  nicheId?: string;
  createdAt: string;
}

export interface MonthlyBillingItem {
  month: string;
  monthLabel: string;
  entradas: number;
  saidas: number;
  lucro: number;
}

export interface DailyCashFlowItem {
  date: string;
  entradas: number;
  saidas: number;
  saldoDia: number;
}

export interface CategoryBreakdownItem {
  category: string;
  amount: number;
  percentage: number;
  type: TransactionType;
}

export interface PaymentMethodBreakdownItem {
  method: PaymentMethod;
  label: string;
  amount: number;
  count: number;
}

export interface FinancialSummary {
  totalRevenue: number; // Entradas pagas
  totalExpenses: number; // Saídas pagas
  netBalance: number; // Saldo Líquido
  pendingReceivables: number; // A receber
  pendingPayables: number; // A pagar
  profitMargin: number; // Margem de lucro (%)
  totalTransactionsCount: number;
  monthlyBilling: MonthlyBillingItem[];
  dailyCashFlow: DailyCashFlowItem[];
  categoriesBreakdown: CategoryBreakdownItem[];
  paymentMethodsBreakdown: PaymentMethodBreakdownItem[];
}

export const FINANCIAL_CATEGORIES = {
  entradas: [
    "Serviços & Procedimentos",
    "Planos & Assinaturas",
    "Venda de Produtos",
    "Consultoria & Avaliação",
    "Outras Receitas",
  ],
  saidas: [
    "Insumos & Materiais",
    "Aluguel & Condomínio",
    "Softwares & Assinaturas",
    "Marketing & Anúncios",
    "Comissões & Salários",
    "Energia, Água & Internet",
    "Impostos & Taxas",
    "Manutenção & Equipamentos",
    "Outras Despesas",
  ],
};
