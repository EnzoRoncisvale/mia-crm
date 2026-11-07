import { Appointment, Lead, NicheConfig, TaskItem } from "@/types/crm";

// Os 3 Nichos Oficiais do Projeto: Beleza & Estética, Saúde & Bem-estar e Contabilidade
export const NICHES: NicheConfig[] = [
  {
    id: "beleza_estetica",
    name: "Beleza e Estética",
    clientLabel: "Cliente",
    serviceLabel: "Procedimento",
    iconName: "Sparkles",
    description: "Salões de beleza, clínicas de estética facial/corporal, lash designers e manicures",
  },
  {
    id: "saude_bem_estar",
    name: "Saúde e Bem-estar",
    clientLabel: "Paciente",
    serviceLabel: "Consulta / Sessão",
    iconName: "HeartPulse",
    description: "Nutricionistas, fisioterapeutas, biomédicos, psicólogos e terapeutas integrativos",
  },
  {
    id: "contabilidade",
    name: "Contabilidade",
    clientLabel: "Cliente PJ/PF",
    serviceLabel: "Competência / Serviço",
    iconName: "Calculator",
    description: "Escritórios contábeis, BPO financeiro, abertura de empresas e consultoria fiscal",
  },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [];
export const INITIAL_LEADS: Lead[] = [];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: "task-1",
    title: "Confirmar agendamentos de amanhã via WhatsApp",
    dueDate: "Hoje às 17h",
    completed: false,
    priority: "alta",
  },
  {
    id: "task-2",
    title: "Checar estoque de insumos e procedimentos",
    dueDate: "Amanhã",
    completed: false,
    priority: "media",
  },
  {
    id: "task-3",
    title: "Enviar relatório mensal de faturamento para contabilidade",
    dueDate: "Sexta",
    completed: false,
    priority: "baixa",
  },
];
