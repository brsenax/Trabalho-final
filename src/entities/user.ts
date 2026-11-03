export class User {
    nome: string;
    telefone: number;
    id: number;

    constructor(nome: string, telefone: number, id: number) {
        this.nome = nome;
        this.telefone = telefone;
        this.id = id
    }
}