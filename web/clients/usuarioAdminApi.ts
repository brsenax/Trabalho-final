import { requisicao } from "./http";
import type { Perfil, UsuarioGerenciado } from "../types";

export interface DadosUsuario {
  nome: string;
  email: string;
  telefone: string;
  perfil: Perfil;
  setorId: number | null;
  senha?: string; // na edição, vazio = mantém a senha atual
}

export const listarUsuarios = () => requisicao<UsuarioGerenciado[]>("/admin/usuarios");

export const criarUsuario = (dados: DadosUsuario) =>
  requisicao<{ mensagem: string }>("/admin/usuarios", { metodo: "POST", corpo: dados });

export const atualizarUsuario = (id: number, dados: DadosUsuario) =>
  requisicao<{ mensagem: string }>(`/admin/usuarios/${id}`, { metodo: "PUT", corpo: dados });

export const excluirUsuario = (id: number) =>
  requisicao<{ mensagem: string }>(`/admin/usuarios/${id}`, { metodo: "DELETE" });