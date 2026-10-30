export type NicheId =
  | "beleza_estetica"
  | "contabilidade"
  | "saude_bem_estar"
  | "imoveis_construcao"
  | "servicos_juridicos"
  | "marketing_digital"
  | "mercado_pet"
  | "educacao_cursos"
  | "automoveis"
  | "eventos"
  | "alimentacao"
  | "servicos_residenciais"
  | "turismo_hospitalidade"
  | "comercio_vendas"
  | "consultoria";

export interface NicheConfig {
  id: NicheId;
  name: string;
  clientLabel: string;
  serviceLabel: string;
  iconName: string;
  description: string;
}

export interface Appointment {
  id: string;
  time: string;
  endTime: string;
  date?: string; // ISO date "YYYY-MM-DD"
  clientName: string;
  clientInitials: string;
  service: string;
  status: "confirmado" | "em_andamento" | "agendado" | "concluido" | "cancelado";
  price: number;
}

export interface Lead {
  id: string;
  name: string;
  message: string;
  channel: "whatsapp" | "instagram";
  status: "novo" | "contato_feito" | "em_negociacao" | "proposta" | "convertido" | "perdido";
  timeAgo: string;
  value?: number;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  priority: "alta" | "media" | "baixa";
}

export interface PlanTier {
  id: "essencial" | "profissional" | "business";
  name: string;
  price: number;
  period: string;
  tagline: string;
  usersLimit: number;
  contactsLimit: number;
  aiCreditsLimit: number;
  features: string[];
  isPopular?: boolean;
}

// 2.2 Níveis de Acesso (RBAC) descritos no escopo
export type UserRole =
  | "admin_plataforma"
  | "admin_empresa"
  | "gerente"
  | "atendente"
  | "comercial"
  | "financeiro";

export interface UserRoleInfo {
  role: UserRole;
  label: string;
  description: string;
  allowedModules: string[];
}

export const USER_ROLES: Record<UserRole, UserRoleInfo> = {
  admin_plataforma: {
    role: "admin_plataforma",
    label: "Admin Plataforma",
    description: "Gerencia tenants, planos e configurações globais do MIA CRM",
    allowedModules: [
      "dashboard",
      "clientes",
      "leads",
      "agenda",
      "atendimentos",
      "servicos",
      "tarefas",
      "processos",
      "financeiro",
      "documentos",
      "comunicacoes",
      "relatorios",
      "equipe",
      "configuracoes",
    ],
  },
  admin_empresa: {
    role: "admin_empresa",
    label: "Admin Empresa",
    description: "Configura a conta, equipe, serviços, permissões e relatórios",
    allowedModules: [
      "dashboard",
      "clientes",
      "leads",
      "agenda",
      "atendimentos",
      "servicos",
      "tarefas",
      "processos",
      "financeiro",
      "documentos",
      "comunicacoes",
      "relatorios",
      "equipe",
      "configuracoes",
    ],
  },
  gerente: {
    role: "gerente",
    label: "Gerente / Supervisor",
    description: "Acompanha operação, equipe, agenda, leads e indicadores",
    allowedModules: [
      "dashboard",
      "clientes",
      "leads",
      "agenda",
      "atendimentos",
      "servicos",
      "tarefas",
      "processos",
      "comunicacoes",
      "relatorios",
      "equipe",
    ],
  },
  atendente: {
    role: "atendente",
    label: "Atendente / Secretária",
    description: "Administra contatos, conversas, agendamentos e tarefas",
    allowedModules: [
      "dashboard",
      "clientes",
      "leads",
      "agenda",
      "atendimentos",
      "tarefas",
      "processos",
      "comunicacoes",
    ],
  },
  comercial: {
    role: "comercial",
    label: "Comercial / Vendedor",
    description: "Acessa seus leads, oportunidades e propostas (sem financeiro global)",
    allowedModules: ["dashboard", "clientes", "leads", "agenda", "tarefas", "comunicacoes"],
  },
  financeiro: {
    role: "financeiro",
    label: "Financeiro",
    description: "Acessa lançamentos, fluxo de caixa, cobranças e relatórios financeiros",
    allowedModules: ["dashboard", "financeiro", "relatorios", "clientes"],
  },
};

// 3.2 Catálogo de Produtos e Serviços
export interface ProductService {
  id: string;
  name: string;
  description: string;
  nicheId: NicheId;
  category: string;
  price: number;
  durationMinutes: number;
  commissionPercent?: number;
  cost?: number;
  status: "ativo" | "inativo";
  createdAt: string;
}

// 3.4 Processos e Checklists Reutilizáveis
export interface ProcessChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface ProcessStep {
  stepNumber: number;
  name: string;
  description?: string;
  status: "concluido" | "em_andamento" | "pendente";
  responsible?: string;
  deadlineDays?: number;
  checklists: ProcessChecklistItem[];
}

export interface ProcessItem {
  id: string;
  title: string;
  nicheId: NicheId;
  clientName?: string;
  status: "em_andamento" | "concluido" | "pendente" | "cancelado";
  currentStep: number;
  totalSteps: number;
  steps: ProcessStep[];
  createdAt: string;
}
