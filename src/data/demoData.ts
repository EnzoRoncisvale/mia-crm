// Dados de demonstração usados na Vercel (sem SQLite)
// Localmente, os dados vêm do SQLite em data/mia_crm.sqlite

import { Appointment, Lead } from "@/types/crm";

const TODAY = new Date().toISOString().slice(0, 10);
const YESTERDAY = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
const TOMORROW = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

export const DEMO_APPOINTMENTS: Appointment[] = [
  {
    id: "app-1",
    clientName: "Ana Maria Silva",
    clientInitials: "AM",
    service: "Alongamento de Unhas",
    time: "09:00",
    endTime: "09:45",
    date: TODAY,
    status: "confirmado",
    price: 180,
  },
  {
    id: "app-2",
    clientName: "Juliana Santos",
    clientInitials: "JS",
    service: "Design de Sobrancelhas",
    time: "10:00",
    endTime: "10:45",
    date: TODAY,
    status: "em_andamento",
    price: 90,
  },
  {
    id: "app-3",
    clientName: "Camila Barbosa",
    clientInitials: "CB",
    service: "Lash Lifting Completo",
    time: "11:00",
    endTime: "11:45",
    date: TODAY,
    status: "agendado",
    price: 150,
  },
  {
    id: "app-4",
    clientName: "Fernanda Costa",
    clientInitials: "FC",
    service: "Manicure + Pedicure",
    time: "14:00",
    endTime: "15:00",
    date: TODAY,
    status: "agendado",
    price: 120,
  },
  {
    id: "app-5",
    clientName: "Beatriz Lima",
    clientInitials: "BL",
    service: "Coloração Capilar",
    time: "15:30",
    endTime: "17:00",
    date: TODAY,
    status: "agendado",
    price: 250,
  },
  {
    id: "app-6",
    clientName: "Patricia Mendes",
    clientInitials: "PM",
    service: "Hidratação Capilar",
    time: "09:00",
    endTime: "09:45",
    date: TOMORROW,
    status: "agendado",
    price: 130,
  },
  {
    id: "app-7",
    clientName: "Ana Maria Silva",
    clientInitials: "AM",
    service: "Manutenção de Unhas",
    time: "10:00",
    endTime: "10:45",
    date: YESTERDAY,
    status: "concluido",
    price: 80,
  },
];

export const DEMO_LEADS: Lead[] = [
  {
    id: "lead-1",
    name: "Beatriz Oliveira",
    message: "Gostaria de agendar um horário para esta quinta-feira",
    channel: "whatsapp",
    status: "em_negociacao",
    timeAgo: "há 12 min",
  },
  {
    id: "lead-2",
    name: "Mariana Lima",
    message: "Qual o valor do lash lifting e quanto tempo dura?",
    channel: "instagram",
    status: "novo",
    timeAgo: "há 34 min",
  },
  {
    id: "lead-3",
    name: "Fernanda Costa",
    message: "Vocês têm horário sábado de manhã disponível?",
    channel: "whatsapp",
    status: "contato_feito",
    timeAgo: "há 1h",
  },
  {
    id: "lead-4",
    name: "Larissa Souza",
    message: "Quero fazer alongamento de cílios, qual o preço?",
    channel: "instagram",
    status: "novo",
    timeAgo: "há 2h",
  },
];

export const DEMO_CLIENTS = [
  {
    id: "cli-1",
    name: "Ana Maria Silva",
    email: "ana.maria@gmail.com",
    phone: "(11) 98765-4321",
    document: "123.456.789-00",
    niche_id: "beleza_estetica",
    notes: "Prefere atendimento matutino",
    status: "ativo",
    created_at: "2026-01-15T10:00:00.000Z",
  },
  {
    id: "cli-2",
    name: "Juliana Santos",
    email: "juliana.santos@outlook.com",
    phone: "(11) 99876-5432",
    document: "234.567.890-11",
    niche_id: "beleza_estetica",
    notes: "Alérgica a produtos com amônia",
    status: "ativo",
    created_at: "2026-02-10T10:00:00.000Z",
  },
  {
    id: "cli-3",
    name: "Camila Barbosa",
    email: "camila.b@yahoo.com",
    phone: "(11) 97654-3210",
    document: "345.678.901-22",
    niche_id: "beleza_estetica",
    notes: "Lash Lifting periódico — a cada 45 dias",
    status: "ativo",
    created_at: "2026-03-05T10:00:00.000Z",
  },
  {
    id: "cli-4",
    name: "Fernanda Costa",
    email: "fernanda.costa@gmail.com",
    phone: "(11) 96543-2100",
    document: "456.789.012-33",
    niche_id: "beleza_estetica",
    notes: "Cliente VIP — desconto especial",
    status: "ativo",
    created_at: "2026-01-20T10:00:00.000Z",
  },
];

export const DEMO_TRANSACTIONS = [
  { id: "tx-01", type: "entrada", description: "Alongamento de Unhas - Ana Maria", amount: 180, category: "Serviços & Procedimentos", payment_method: "pix", date: TODAY, status: "pago", client_name: "Ana Maria Silva" },
  { id: "tx-02", type: "entrada", description: "Design de Sobrancelhas - Juliana", amount: 90, category: "Serviços & Procedimentos", payment_method: "cartao_credito", date: TODAY, status: "pago", client_name: "Juliana Santos" },
  { id: "tx-03", type: "entrada", description: "Lash Lifting Completo - Camila", amount: 150, category: "Serviços & Procedimentos", payment_method: "pix", date: YESTERDAY, status: "pago", client_name: "Camila Barbosa" },
  { id: "tx-04", type: "saida", description: "Compra de insumos — esmaltes e bases", amount: 320, category: "Insumos & Materiais", payment_method: "pix", date: YESTERDAY, status: "pago", client_name: null },
  { id: "tx-05", type: "entrada", description: "Manicure + Pedicure - Fernanda", amount: 120, category: "Serviços & Procedimentos", payment_method: "dinheiro", date: YESTERDAY, status: "pago", client_name: "Fernanda Costa" },
  { id: "tx-06", type: "saida", description: "Aluguel do espaço — outubro", amount: 1200, category: "Aluguel & Infraestrutura", payment_method: "transferencia", date: YESTERDAY, status: "pago", client_name: null },
  { id: "tx-07", type: "entrada", description: "Coloração Capilar - Beatriz", amount: 250, category: "Serviços & Procedimentos", payment_method: "cartao_debito", date: YESTERDAY, status: "pago", client_name: "Beatriz Lima" },
];

export const DEMO_SERVICES = [
  { id: "svc-1", name: "Alongamento de Unhas", price: 180, duration_minutes: 60, niche_id: "beleza_estetica", status: "ativo" },
  { id: "svc-2", name: "Manicure + Pedicure", price: 120, duration_minutes: 60, niche_id: "beleza_estetica", status: "ativo" },
  { id: "svc-3", name: "Design de Sobrancelhas", price: 90, duration_minutes: 45, niche_id: "beleza_estetica", status: "ativo" },
  { id: "svc-4", name: "Lash Lifting Completo", price: 150, duration_minutes: 60, niche_id: "beleza_estetica", status: "ativo" },
  { id: "svc-5", name: "Coloração Capilar", price: 250, duration_minutes: 90, niche_id: "beleza_estetica", status: "ativo" },
  { id: "svc-6", name: "Hidratação Capilar", price: 130, duration_minutes: 60, niche_id: "beleza_estetica", status: "ativo" },
  { id: "svc-7", name: "Manutenção de Unhas", price: 80, duration_minutes: 45, niche_id: "beleza_estetica", status: "ativo" },
];
