import type { Chamado, ChamadoDetalhado } from "../entities/chamado.js";

/**
 * Contrato de persistência dos chamados. Toda operação é assíncrona (Promise)
 * porque o banco responde depois; o Service usa `await`.
 */
export interface ChamadoRepository {
  /** Grava o chamado e devolve a entidade com o `id` gerado pelo banco. */
  salvar(chamado: Chamado): Promise<Chamado>;
  listar(): Promise<ChamadoDetalhado[]>;
  listarPorUsuario(usuarioId: number): Promise<ChamadoDetalhado[]>;
  buscarPorId(id: number): Promise<ChamadoDetalhado | undefined>;
}