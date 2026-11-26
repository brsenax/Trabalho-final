import { requisicao } from "./http";
import type { Chamado, ChamadoDetalhado, Prioridade, ResumoChamados } from "../types";

// Usuário comum: só os próprios dados
export const listarMeusChamados = () => requisicao<Chamado[]>("/chamados/meus");
export const obterMeuResumo = () => requisicao<ResumoChamados>("/chamados/meus/resumo");

// Administrador: todos os dados
export const listarTodosChamados = () => requisicao<ChamadoDetalhado[]>("/chamados");
export const obterResumoGeral = () => requisicao<ResumoChamados>("/chamados/resumo");

export function criarChamado(dados: { descricao: string; setor: string; prioridade: Prioridade }) {
  return requisicao<{ mensagem: string; chamado: Chamado }>("/chamados", {
    metodo: "POST",
    corpo: dados,
  });
}
