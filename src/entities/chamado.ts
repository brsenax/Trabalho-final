export class Chamado {
  descricao: string;
  id: number;
  prioridade: string;
  data_abertura: Date;

  constructor(
    descricao: string,
    id: number,
    prioridade: string,
    data_abertura: Date
  ) {
    this.descricao = descricao;
    this.id = id;
    this.prioridade = prioridade;
    this.data_abertura = data_abertura;
  }

  alterarPrioridade(novaPrioridade: string) : void {
    this.prioridade = novaPrioridade;
  }

  obterDataFormatada(): string {
    const data = new Date(this.data_abertura);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }
}
