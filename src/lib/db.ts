import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import { Transaction, FinancialSummary } from "@/types/financial";
import { INITIAL_APPOINTMENTS, INITIAL_LEADS, INITIAL_TASKS } from "@/data/mockData";

let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (dbInstance) {
    return dbInstance;
  }

  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, "mia_crm.sqlite");
  dbInstance = new DatabaseSync(dbPath);

  // Enable foreign keys and WAL mode for better concurrency and reliability
  dbInstance.exec("PRAGMA journal_mode = WAL;");
  dbInstance.exec("PRAGMA foreign_keys = ON;");

  initSchema(dbInstance);
  seedInitialData(dbInstance);

  return dbInstance;
}

function initSchema(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL CHECK(type IN ('entrada', 'saida')),
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('pago', 'pendente', 'cancelado')),
      client_name TEXT,
      client_id TEXT,
      niche_id TEXT,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
    CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
    CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      document TEXT,
      niche_id TEXT,
      notes TEXT,
      status TEXT DEFAULT 'ativo',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      client_name TEXT NOT NULL,
      client_initials TEXT,
      service TEXT NOT NULL,
      time TEXT NOT NULL,
      end_time TEXT,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      price REAL NOT NULL,
      niche_id TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      message TEXT,
      channel TEXT NOT NULL,
      status TEXT NOT NULL,
      time_ago TEXT,
      niche_id TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      due_date TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      priority TEXT NOT NULL,
      niche_id TEXT,
      created_at TEXT NOT NULL
    );
  `);
}

function seedInitialData(db: DatabaseSync) {
  // Check if transactions are already seeded
  const countRow = db.prepare("SELECT COUNT(*) as count FROM transactions").get() as { count: number };
  if (countRow && countRow.count > 0) {
    return;
  }

  // Seed Initial Transactions (covering last 6 months to showcase revenue charts and cash flows)
  const insertTx = db.prepare(`
    INSERT INTO transactions (
      id, type, description, amount, category, payment_method, date, status, client_name, niche_id, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialTransactions = [
    // Mês Atual (Outubro 2026) - Entradas
    { id: "tx-01", type: "entrada", description: "Alongamento de Unhas - Ana Maria", amount: 180, category: "Serviços & Procedimentos", paymentMethod: "pix", date: "2026-10-25", status: "pago", clientName: "Ana Maria Silva" },
    { id: "tx-02", type: "entrada", description: "Design de Sobrancelhas - Juliana", amount: 90, category: "Serviços & Procedimentos", paymentMethod: "cartao_credito", date: "2026-10-25", status: "pago", clientName: "Juliana Santos" },
    { id: "tx-03", type: "entrada", description: "Lash Lifting Completo - Camila", amount: 150, category: "Serviços & Procedimentos", paymentMethod: "pix", date: "2026-10-24", status: "pago", clientName: "Camila Barbosa" },
    { id: "tx-04", type: "entrada", description: "Pacote VIP Mensal Beleza - Larissa", amount: 480, category: "Planos & Assinaturas", paymentMethod: "cartao_credito", date: "2026-10-22", status: "pago", clientName: "Larissa Rocha" },
    { id: "tx-05", type: "entrada", description: "Manicure & SPA dos Pés - Paula", amount: 120, category: "Serviços & Procedimentos", paymentMethod: "dinheiro", date: "2026-10-21", status: "pago", clientName: "Paula Fernandes" },
    { id: "tx-06", type: "entrada", description: "Kit Cuidados Home Care - Venda", amount: 210, category: "Venda de Produtos", paymentMethod: "pix", date: "2026-10-20", status: "pago", clientName: "Beatriz Oliveira" },
    { id: "tx-07", type: "entrada", description: "Micropigmentação Labial - Mariana", amount: 650, category: "Serviços & Procedimentos", paymentMethod: "cartao_credito", date: "2026-10-18", status: "pago", clientName: "Mariana Lima" },
    { id: "tx-08", type: "entrada", description: "Alongamento Fibra de Vidro - Fernanda", amount: 220, category: "Serviços & Procedimentos", paymentMethod: "pix", date: "2026-10-16", status: "pago", clientName: "Fernanda Costa" },
    { id: "tx-09", type: "entrada", description: "Procedimento Estético Agendado - Carla", amount: 350, category: "Serviços & Procedimentos", paymentMethod: "pix", date: "2026-10-28", status: "pendente", clientName: "Carla Souza" },
    { id: "tx-10", type: "entrada", description: "Pacote Noiva & Madrinhas - Encomenda", amount: 1200, category: "Planos & Assinaturas", paymentMethod: "cartao_credito", date: "2026-10-30", status: "pendente", clientName: "Helena Ramos" },

    // Mês Atual (Outubro 2026) - Saídas
    { id: "tx-11", type: "saida", description: "Aluguel do Espaço / Clínica", amount: 1800, category: "Aluguel & Condomínio", paymentMethod: "boleto", date: "2026-10-10", status: "pago", clientName: "" },
    { id: "tx-12", type: "saida", description: "Assinatura Software MIA CRM & Gestão", amount: 129.90, category: "Softwares & Assinaturas", paymentMethod: "cartao_credito", date: "2026-10-05", status: "pago", clientName: "" },
    { id: "tx-13", type: "saida", description: "Reposição de Géis, Fibras e Esmaltes", amount: 680, category: "Insumos & Materiais", paymentMethod: "pix", date: "2026-10-14", status: "pago", clientName: "" },
    { id: "tx-14", type: "saida", description: "Campanha Meta Ads (Instagram/WhatsApp)", amount: 350, category: "Marketing & Anúncios", paymentMethod: "cartao_credito", date: "2026-10-15", status: "pago", clientName: "" },
    { id: "tx-15", type: "saida", description: "Energia Elétrica & Água", amount: 320, category: "Energia, Água & Internet", paymentMethod: "pix", date: "2026-10-12", status: "pago", clientName: "" },
    { id: "tx-16", type: "saida", description: "Manutenção Autoclave & Estufa", amount: 180, category: "Manutenção & Equipamentos", paymentMethod: "pix", date: "2026-10-19", status: "pago", clientName: "" },
    { id: "tx-17", type: "saida", description: "Internet Fibra Óptica", amount: 119.90, category: "Energia, Água & Internet", paymentMethod: "boleto", date: "2026-10-20", status: "pago", clientName: "" },
    { id: "tx-18", type: "saida", description: "DAS Simples Nacional / MEI", amount: 82, category: "Impostos & Taxas", paymentMethod: "pix", date: "2026-10-20", status: "pago", clientName: "" },
    { id: "tx-19", type: "saida", description: "Comissão Assistente e Recepção", amount: 800, category: "Comissões & Salários", paymentMethod: "pix", date: "2026-10-30", status: "pendente", clientName: "" },

    // Meses Anteriores (Histórico de Faturamento para gráficos de faturamento)
    // Setembro 2026
    { id: "tx-20", type: "entrada", description: "Total Faturamento Procedimentos - Setembro", amount: 7850, category: "Serviços & Procedimentos", paymentMethod: "pix", date: "2026-09-28", status: "pago", clientName: "Lote Mês Setembro" },
    { id: "tx-21", type: "saida", description: "Custos Totais Operacionais - Setembro", amount: 3420, category: "Aluguel & Condomínio", paymentMethod: "pix", date: "2026-09-28", status: "pago", clientName: "Operação Setembro" },
    
    // Agosto 2026
    { id: "tx-22", type: "entrada", description: "Total Faturamento Procedimentos - Agosto", amount: 6920, category: "Serviços & Procedimentos", paymentMethod: "pix", date: "2026-08-28", status: "pago", clientName: "Lote Mês Agosto" },
    { id: "tx-23", type: "saida", description: "Custos Totais Operacionais - Agosto", amount: 3150, category: "Aluguel & Condomínio", paymentMethod: "pix", date: "2026-08-28", status: "pago", clientName: "Operação Agosto" },

    // Julho 2026
    { id: "tx-24", type: "entrada", description: "Total Faturamento Procedimentos - Julho", amount: 6400, category: "Serviços & Procedimentos", paymentMethod: "pix", date: "2026-07-28", status: "pago", clientName: "Lote Mês Julho" },
    { id: "tx-25", type: "saida", description: "Custos Totais Operacionais - Julho", amount: 2980, category: "Aluguel & Condomínio", paymentMethod: "pix", date: "2026-07-28", status: "pago", clientName: "Operação Julho" },

    // Junho 2026
    { id: "tx-26", type: "entrada", description: "Total Faturamento Procedimentos - Junho", amount: 5800, category: "Serviços & Procedimentos", paymentMethod: "pix", date: "2026-06-28", status: "pago", clientName: "Lote Mês Junho" },
    { id: "tx-27", type: "saida", description: "Custos Totais Operacionais - Junho", amount: 2750, category: "Aluguel & Condomínio", paymentMethod: "pix", date: "2026-06-28", status: "pago", clientName: "Operação Junho" },

    // Maio 2026
    { id: "tx-28", type: "entrada", description: "Total Faturamento Procedimentos - Maio", amount: 5100, category: "Serviços & Procedimentos", paymentMethod: "pix", date: "2026-05-28", status: "pago", clientName: "Lote Mês Maio" },
    { id: "tx-29", type: "saida", description: "Custos Totais Operacionais - Maio", amount: 2600, category: "Aluguel & Condomínio", paymentMethod: "pix", date: "2026-05-28", status: "pago", clientName: "Operação Maio" },
  ];

  for (const tx of initialTransactions) {
    insertTx.run(
      tx.id,
      tx.type,
      tx.description,
      tx.amount,
      tx.category,
      tx.paymentMethod,
      tx.date,
      tx.status,
      tx.clientName || null,
      "beleza_estetica",
      new Date().toISOString()
    );
  }

  // Seed Initial Appointments
  const insertApp = db.prepare(`
    INSERT INTO appointments (id, client_name, client_initials, service, time, end_time, date, status, price, niche_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const app of INITIAL_APPOINTMENTS) {
    insertApp.run(
      app.id,
      app.clientName,
      app.clientInitials,
      app.service,
      app.time,
      app.endTime,
      "2026-10-26",
      app.status,
      app.price,
      "beleza_estetica",
      new Date().toISOString()
    );
  }

  // Seed Initial Leads
  const insertLead = db.prepare(`
    INSERT INTO leads (id, name, message, channel, status, time_ago, niche_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const lead of INITIAL_LEADS) {
    insertLead.run(
      lead.id,
      lead.name,
      lead.message,
      lead.channel,
      lead.status,
      lead.timeAgo,
      "beleza_estetica",
      new Date().toISOString()
    );
  }

  // Seed Initial Tasks
  const insertTask = db.prepare(`
    INSERT INTO tasks (id, title, due_date, completed, priority, niche_id, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const task of INITIAL_TASKS) {
    insertTask.run(
      task.id,
      task.title,
      task.dueDate,
      task.completed ? 1 : 0,
      task.priority,
      "beleza_estetica",
      new Date().toISOString()
    );
  }

  // Seed Initial Clients
  const insertClient = db.prepare(`
    INSERT INTO clients (id, name, email, phone, document, niche_id, notes, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialClients = [
    { id: "cli-1", name: "Ana Maria Silva", email: "ana.maria@gmail.com", phone: "(11) 98765-4321", document: "123.456.789-00", notes: "Prefere atendimento matutino" },
    { id: "cli-2", name: "Juliana Santos", email: "juliana.santos@outlook.com", phone: "(11) 99876-5432", document: "234.567.890-11", notes: "Alérgica a produtos com amônia" },
    { id: "cli-3", name: "Camila Barbosa", email: "camila.b@yahoo.com", phone: "(11) 97654-3210", document: "345.678.901-22", notes: "Lash Lifting periódico" },
    { id: "cli-4", name: "Larissa Rocha", email: "larissa.rocha@gmail.com", phone: "(11) 96543-2109", document: "456.789.012-33", notes: "Assinante do Pacote VIP Mensal" },
    { id: "cli-5", name: "Paula Fernandes", email: "paula.f@gmail.com", phone: "(11) 95432-1098", document: "567.890.123-44", notes: "Cliente fidelidade" },
  ];

  for (const cli of initialClients) {
    insertClient.run(
      cli.id,
      cli.name,
      cli.email,
      cli.phone,
      cli.document,
      "beleza_estetica",
      cli.notes,
      "ativo",
      new Date().toISOString()
    );
  }
}
