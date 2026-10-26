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
  clientName: string;
  clientInitials: string;
  service: string;
  status: "confirmado" | "em_andamento" | "agendado" | "concluido";
  price: number;
}

export interface Lead {
  id: string;
  name: string;
  message: string;
  channel: "whatsapp" | "instagram";
  status: "novo" | "em_negociacao" | "contato_feito" | "convertido";
  timeAgo: string;
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
