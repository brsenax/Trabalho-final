export const PERFIS = ["admin", "usuario"] as const;
export type Perfil = (typeof PERFIS)[number];

export class User {
    id_user: number;
    nome: string;
    telefone: number;
    email: string;
    senha?: string; 
    perfil: Perfil;

    constructor(id_user: number, nome: string, telefone: number, email: string, senha?: string, perfil: Perfil = "usuario") {
        this.id_user = id_user;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.senha = senha;
        this.perfil = perfil;
    }

    validarSenha(senhaInformada: string) : boolean {
        return this.senha === senhaInformada;
    }

    ehAdmin(): boolean {
        return this.perfil === "admin";
    }

    obterResumo(): string {
        return `${this.nome} (${this.email})`;
    }
}
