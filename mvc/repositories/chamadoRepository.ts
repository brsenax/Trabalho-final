import { Chamado } from "../../src/entities/chamado.js";

export class ChamadoRepository {
  private chamados: Chamado[] = [];

  public salvar(chamado: Chamado): void {
    this.chamados.push(chamado);
  }

  public listar(): Chamado[] {
    return [...this.chamados];
  }

  public buscarPorId(id: number): Chamado | undefined {
    return this.chamados.find(chamado => chamado.id === id);
  }
}
