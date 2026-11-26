export const PRIORIDADES = ["BAIXA", "MEDIA", "ALTA", "URGENTE"] as const;
export type Prioridade = (typeof PRIORIDADES)[number];

export const STATUS = ["ABERTO", "EM_ATENDIMENTO", "AGUARDANDO_PECA", "CONCLUIDO"] as const;
export type StatusChamado = (typeof STATUS)[number];

export class Chamado {
  id: number;
  titulo: string;
  descricao: string;
  prioridade: Prioridade;
  status: StatusChamado;
  data_abertura: Date;
  prazo: Date;
  setorId: number;
  categoriaId: number;
  usuarioId: number;

  constructor(
    id: number,
    titulo: string,
    descricao: string,
    prioridade: Prioridade,
    status: StatusChamado,
    data_abertura: Date,
    prazo: Date,
    setorId: number,
    categoriaId: number,
    usuarioId: number
  ) {
    this.id = id;
    this.titulo = titulo;
    this.descricao = descricao;
    this.prioridade = prioridade;
    this.status = status;
    this.data_abertura = data_abertura;
    this.prazo = prazo;
    this.setorId = setorId;
    this.categoriaId = categoriaId;
    this.usuarioId = usuarioId;
  }

  alterarPrioridade(novaPrioridade: Prioridade): void {
    this.prioridade = novaPrioridade;
  }

  obterDataFormatada(): string {
    const data = new Date(this.data_abertura);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }
}

/** Chamado já com os nomes vindos dos JOINs (setor, categoria e quem abriu). É o que as telas consomem. */
export interface ChamadoDetalhado {
  id: number;
  titulo: string;
  descricao: string;
  prioridade: Prioridade;
  status: StatusChamado;
  data_abertura: Date;
  prazo: Date;
  usuarioId: number;
  setor: string;
  categoria: string;
  solicitante: string;
}