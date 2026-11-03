export class Chamado {
    descricao: string;
    id: number;
    prioridade: string;
    data_abertura: Date;

    constructor(
        descricao: string, 
        id: number, 
        prioridade: string, 
        data_abertura: Date) {
            this.descricao = descricao;
            this.id = id;
            this.prioridade = prioridade;
            this.data_abertura = data_abertura
        }
}