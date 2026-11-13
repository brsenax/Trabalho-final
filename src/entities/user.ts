export class User {
    id_user: number;
    nome: string;
    telefone: number;
    email: string;
    senha?: string; // Opcional para segurança na listagem

    constructor(id_user: number, nome: string, telefone: number, email: string, senha?: string) {
        this.id_user = id_user;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.senha = senha;
    }
}