import type { Prioridade, StatusChamado } from "./types";

// O banco guarda "EM_ATENDIMENTO"; na tela mostramos "Em atendimento".
export const ROTULO_PRIORIDADE: Record<Prioridade, string> = {
  BAIXA: "Baixa",
  MEDIA: "Média",
  ALTA: "Alta",
  URGENTE: "Urgente",
};

export const ROTULO_STATUS: Record<StatusChamado, string> = {
  ABERTO: "Aberto",
  EM_ATENDIMENTO: "Em atendimento",
  AGUARDANDO_PECA: "Aguardando peça",
  CONCLUIDO: "Concluído",
};