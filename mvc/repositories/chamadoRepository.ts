import { Chamado } from "../../src/entities/chamado.js";

export class ChamadoRepository {
  // O 'static' garante que a lista seja compartilhada em toda a aplicação
  private static chamados: Chamado[] = [];

  public salvar(chamado: Chamado): void {
    ChamadoRepository.chamados.push(chamado);
  }

  public listar(): Chamado[] {
    return [...ChamadoRepository.chamados];
  }

  public buscarPorId(id: number): Chamado | undefined {
    return ChamadoRepository.chamados.find((chamado) => chamado.id === id);
  }
}