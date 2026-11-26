import { limparSessao, obterSessao } from "../sessao";

export class ApiError extends Error {
  constructor(mensagem: string, public status: number) {
    super(mensagem);
  }
}

interface Opcoes {
  metodo?: "GET" | "POST" | "PUT" | "DELETE";
  corpo?: unknown;
}

/** Único ponto que fala com o backend. O prefixo /api é redirecionado pelo Vite (ver vite.config.ts). */
export async function requisicao<T>(caminho: string, { metodo = "GET", corpo }: Opcoes = {}): Promise<T> {
  const token = obterSessao()?.token;

  let resposta: Response;
  try {
    resposta = await fetch(`/api${caminho}`, {
      method: metodo,
      headers: {
        ...(corpo !== undefined && { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new ApiError("Erro de conexão com o servidor.", 0);
  }

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    // Token expirado/inválido: volta para o login.
    if (resposta.status === 401 && token) {
      limparSessao();
      window.location.reload();
    }
    throw new ApiError(dados?.erro ?? "Erro inesperado.", resposta.status);
  }

  return dados as T;
}