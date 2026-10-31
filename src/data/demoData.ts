// Coleção vazia para produção: o sistema inicia completamente limpo
// e só exibe clientes, agendamentos, leads e transações que forem cadastrados pelo usuário.

import { Appointment, Lead } from "@/types/crm";

export const DEMO_APPOINTMENTS: Appointment[] = [];
export const DEMO_LEADS: Lead[] = [];
export const DEMO_CLIENTS: any[] = [];
export const DEMO_TRANSACTIONS: any[] = [];
export const DEMO_SERVICES: any[] = [];
