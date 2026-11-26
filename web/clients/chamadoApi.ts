import { requisicao } from "./http";
import type { Chamado, Prioridade, ResumoChamados } from "../types";

// Usuário comum: só os próprios dados
export const listarMeusChamados = () => requisicao<Chamado[]>("/chamados/meus");
export const obterMeuResumo = () => requisicao<ResumoChamados>("/chamados/meus/resumo");

// Administrador: todos os dados
export const listarTodosChamados = () => requisicao<Chamado[]>("/chamados");
export const obterResumoGeral = () => requisicao<ResumoChamados>("/chamados/resumo");

export interface DadosNovoChamado {
  titulo: string;
  descricao: string;
  setorId: number;
  categoriaId: number;
  prioridade: Prioridade;
}

export function criarChamado(dados: DadosNovoChamado) {
  return requisicao<{ mensagem: string }>("/chamados", { metodo: "POST", corpo: dados });
}