import type { Chamado } from "../entities/chamado.js";

/**
 * Contrato de persistência dos chamados.
 * O Service depende só desta interface; hoje há uma implementação em memória
 * e, no futuro, pode haver uma em MySQL sem mexer no Service.
 */
export interface ChamadoRepository {
  proximoId(): number;
  salvar(chamado: Chamado): Chamado;
  listar(): Chamado[];
  listarPorUsuario(usuarioId: number): Chamado[];
  buscarPorId(id: number): Chamado | undefined;
}
