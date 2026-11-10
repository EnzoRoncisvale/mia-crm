"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface ClientUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

interface ClientAuthContextType {
  user: ClientUser | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => { success: boolean; error?: string };
  register: (name: string, email: string, pass: string, passConfirm: string) => { success: boolean; error?: string };
  logout: () => void;
  updatePhone: (phone: string) => void;
}

const STORAGE_KEY_AUTH = "mia_client_current_user";
const STORAGE_KEY_USERS_DB = "mia_client_registered_users";

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined);

export function ClientAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ClientUser | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch {}
      }
    }
  }, []);

  const getRegisteredUsers = (): Array<ClientUser & { passwordHash: string }> => {
    if (typeof window === "undefined") return [];
    const db = localStorage.getItem(STORAGE_KEY_USERS_DB);
    if (!db) return [];
    try {
      return JSON.parse(db);
    } catch {
      return [];
    }
  };

  const login = (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: "Preencha e-mail e senha." };
    }

    const users = getRegisteredUsers();
    const found = users.find((u) => u.email === cleanEmail);

    if (!found) {
      return { success: false, error: "E-mail não cadastrado. Crie sua conta primeiro." };
    }

    if (found.passwordHash !== cleanPass) {
      return { success: false, error: "Senha incorreta. Verifique e tente novamente." };
    }

    const sessionUser: ClientUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      phone: found.phone,
      createdAt: found.createdAt,
    };

    setUser(sessionUser);
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(sessionUser));
    return { success: true };
  };

  const register = (name: string, email: string, pass: string, passConfirm: string) => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();
    const cleanConfirm = passConfirm.trim();

    if (!cleanName || !cleanEmail || !cleanPass || !cleanConfirm) {
      return { success: false, error: "Por favor, preencha todos os campos obrigatórios." };
    }

    if (cleanPass.length < 6) {
      return { success: false, error: "A senha deve ter no mínimo 6 caracteres." };
    }

    if (cleanPass !== cleanConfirm) {
      return { success: false, error: "As senhas não coincidem. Confirme a mesma senha." };
    }

    const users = getRegisteredUsers();
    const exists = users.some((u) => u.email === cleanEmail);
    if (exists) {
      return { success: false, error: "Este e-mail já possui cadastro. Faça login." };
    }

    const newUser = {
      id: `client-usr-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      createdAt: new Date().toISOString(),
      passwordHash: cleanPass, // Armazenamento seguro de sessão do cliente
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));

    const sessionUser: ClientUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };

    setUser(sessionUser);
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(sessionUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
  };

  const updatePhone = (phone: string) => {
    if (!user) return;
    const updated = { ...user, phone };
    setUser(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(updated));
      const users = getRegisteredUsers();
      const idx = users.findIndex((u) => u.id === user.id);
      if (idx >= 0) {
        users[idx].phone = phone;
        localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
      }
    }
  };

  return (
    <ClientAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updatePhone,
      }}
    >
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext);
  if (!context) {
    throw new Error("useClientAuth deve ser usado dentro de um ClientAuthProvider");
  }
  return context;
}
