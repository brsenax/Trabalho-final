// Formato dos dados que a API devolve (o frontend não importa nada do servidor).
// Os valores de Prioridade e StatusChamado são os mesmos ENUMs do banco.
export type Prioridade = "BAIXA" | "MEDIA" | "ALTA" | "URGENTE";
export type StatusChamado = "ABERTO" | "EM_ATENDIMENTO" | "AGUARDANDO_PECA" | "CONCLUIDO";
export type Perfil = "admin" | "usuario";

export interface Usuario {
  id_user: number;
  perfil: Perfil;
  nome: string;
  email: string;
  telefone: string;
}

/** Usuário como o administrador o vê na tela de gerenciamento (a senha nunca vem da API). */
export interface UsuarioGerenciado {
  id_user: number;
  nome: string;
  email: string;
  telefone: string;
  perfil: Perfil;
  setorId: number | null;
}

export interface Chamado {
  id: number;
  titulo: string;
  descricao: string;
  prioridade: Prioridade;
  status: StatusChamado;
  data_abertura: string; // ISO 8601
  prazo: string;         // ISO 8601
  usuarioId: number;
  setor: string;         // nome do setor
  categoria: string;     // nome da categoria
  solicitante: string;   // nome de quem abriu
}

export interface OpcaoLista {
  id: number;
  nome: string;
}

export interface ResumoChamados {
  total: number;
  abertos: number;
  emAtendimento: number;
  aguardandoPeca: number;
  concluidos: number;
  porPrioridade: Record<Prioridade, number>;
}