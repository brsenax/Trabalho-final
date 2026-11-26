export const PRIORIDADES = ["Baixa", "Média", "Alta"] as const;
export type Prioridade = (typeof PRIORIDADES)[number];

export const STATUS = ["Aberto", "Em andamento", "Concluído"] as const;
export type StatusChamado = (typeof STATUS)[number];

export class Chamado {
  descricao: string;
  id: number;
  prioridade: Prioridade;
  data_abertura: Date;
  setor: string;
  usuarioId: number;
  status: StatusChamado;

  constructor(
    descricao: string,
    id: number,
    prioridade: Prioridade,
    data_abertura: Date,
    setor: string,
    usuarioId: number,
    status: StatusChamado = "Aberto"
  ) {
    this.descricao = descricao;
    this.id = id;
    this.prioridade = prioridade;
    this.data_abertura = data_abertura;
    this.setor = setor;
    this.usuarioId = usuarioId;
    this.status = status;
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
