import type { Chamado } from "../entities/chamado.js";

export interface ChamadoRepository {
  proximoId(): Promise<number>;
  salvar(chamado: Chamado): Promise<Chamado>;
  listar(): Promise<Chamado[]>;
  listarPorUsuario(usuarioId: number): Promise<Chamado[]>;
  buscarPorId(id: number): Promise<Chamado | undefined>;
  atualizar(id: number, dados: Partial<Chamado>): Promise<void>;
  excluir(id: number): Promise<void>;
}