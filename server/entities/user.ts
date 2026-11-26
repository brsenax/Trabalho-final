export const PERFIS = ["admin", "usuario"] as const;
export type Perfil = (typeof PERFIS)[number];

export class User {
    id_user: number;
    nome: string;
    telefone: string;
    email: string;
    senha?: string; 
    perfil: Perfil;
    setorId: number | null;

    constructor(id_user: number, nome: string, telefone: string, email: string, senha?: string, perfil: Perfil = "usuario", setorId: number | null = null) {
        this.id_user = id_user;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.senha = senha;
        this.perfil = perfil;
        this.setorId = setorId;
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
