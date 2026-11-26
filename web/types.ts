// Formato dos dados que a API devolve (o frontend não importa nada do servidor).
export type Prioridade = "Baixa" | "Média" | "Alta";
export type StatusChamado = "Aberto" | "Em andamento" | "Concluído";

export type Perfil = "admin" | "usuario";

export interface Usuario {
  id_user: number;
  perfil: Perfil;
  nome: string;
  email: string;
  telefone: number;
}

export interface Chamado {
  id: number;
  descricao: string;
  setor: string;
  prioridade: Prioridade;
  status: StatusChamado;
  data_abertura: string; // ISO 8601
  usuarioId: number;
}

/** Chamado com o nome de quem abriu (só o administrador recebe). */
export interface ChamadoDetalhado extends Chamado {
  solicitante: string;
}

export interface ResumoChamados {
  total: number;
  abertos: number;
  emAndamento: number;
  concluidos: number;
  porPrioridade: Record<Prioridade, number>;
}
