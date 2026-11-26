import { Chamado } from "../../src/entities/chamado.js";
import { ChamadoRepository } from "../repositories/chamadoRepository.js";

export class ChamadoService {
  constructor(private repository: ChamadoRepository) {}

  listarChamados(): Chamado[] {
    return this.repository.listar();
  }

  criarChamado(descricao: string, prioridade: string = "Normal"): Chamado {
    if (!descricao.trim()) {
      throw new Error("A descrição do chamado é obrigatória.");
    }

    const chamados = this.repository.listar();
    const novoChamado = new Chamado(
      descricao.trim(),
      chamados.length + 1,
      prioridade,
      new Date()
    );

    this.repository.salvar(novoChamado);
    return novoChamado;
  }
}
