import type { Usuario } from "./types";

// Guarda APENAS a sessão de login (token + dados do usuário). Chamados nunca ficam aqui.
const CHAVE = "sessao";

export interface Sessao {
  token: string;
  usuario: Usuario;
}

export function obterSessao(): Sessao | null {
  try {
    const bruto = localStorage.getItem(CHAVE);
    return bruto ? (JSON.parse(bruto) as Sessao) : null;
  } catch {
    return null;
  }
}

export function salvarSessao(sessao: Sessao): void {
  localStorage.setItem(CHAVE, JSON.stringify(sessao));
}

export function limparSessao(): void {
  localStorage.removeItem(CHAVE);
}
