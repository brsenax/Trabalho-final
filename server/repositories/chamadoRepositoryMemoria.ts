import type { Chamado } from "../entities/chamado.js";
import type { ChamadoRepository } from "./chamadoRepository.js";

export class ChamadoRepositoryMemoria implements ChamadoRepository {
  private chamados: Chamado[] = [];
  private ultimoId = 0;

  proximoId(): number {
    return ++this.ultimoId;
  }

  salvar(chamado: Chamado): Chamado {
    this.chamados.push(chamado);
    return chamado;
  }

  listar(): Chamado[] {
    return [...this.chamados];
  }

  listarPorUsuario(usuarioId: number): Chamado[] {
    return this.chamados.filter((c) => c.usuarioId === usuarioId);
  }

  buscarPorId(id: number): Chamado | undefined {
    return this.chamados.find((c) => c.id === id);
  }
}
