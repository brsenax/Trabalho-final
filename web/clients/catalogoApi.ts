import { requisicao } from "./http";
import type { OpcaoLista } from "../types";

export const listarSetores = () => requisicao<OpcaoLista[]>("/setores");
export const listarCategorias = () => requisicao<OpcaoLista[]>("/categorias");