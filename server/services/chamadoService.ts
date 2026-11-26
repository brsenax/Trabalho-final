import { Chamado, PRIORIDADES, type Prioridade } from "../entities/chamado.js";
import type { ChamadoDetalhado } from "../entities/chamado.js";
import type { ChamadoRepository } from "../repositories/chamadoRepository.js";
import type { SetorRepository } from "../repositories/setorRepository.js";
import type { CategoriaRepository } from "../repositories/categoriaRepository.js";
import { ErroDeValidacao } from "../errors.js";

export interface NovoChamado {
  titulo: string;
  descricao: string;
  setorId: number;
  categoriaId: number;
  prioridade?: string;
}

export interface ResumoChamados {
  total: number;
  abertos: number;
  emAtendimento: number;
  aguardandoPeca: number;
  concluidos: number;
  porPrioridade: Record<Prioridade, number>;
}

// Prazo de atendimento em horas, por prioridade (regra de negócio: a equipe pode ajustar).
const PRAZO_EM_HORAS: Record<Prioridade, number> = { URGENTE: 4, ALTA: 24, MEDIA: 72, BAIXA: 168 };

export class ChamadoService {
  constructor(
    private repository: ChamadoRepository,
    private setorRepository: SetorRepository,
    private categoriaRepository: CategoriaRepository
  ) {}

  listarTodos(): Promise<ChamadoDetalhado[]> {
    return this.repository.listar();
  }

  listarDoUsuario(usuarioId: number): Promise<ChamadoDetalhado[]> {
    return this.repository.listarPorUsuario(usuarioId);
  }

  async criar(dados: NovoChamado, usuarioId: number): Promise<Chamado> {
    const titulo = dados.titulo.trim();
    const descricao = dados.descricao.trim();
    const prioridade = dados.prioridade ?? "MEDIA";

    if (!titulo) throw new ErroDeValidacao("O título do chamado é obrigatório.");
    if (!descricao) throw new ErroDeValidacao("A descrição do chamado é obrigatória.");
    if (!this.prioridadeValida(prioridade)) {
      throw new ErroDeValidacao(`Prioridade inválida. Use: ${PRIORIDADES.join(", ")}.`);
    }
    if (!(await this.setorRepository.buscarPorId(dados.setorId))) {
      throw new ErroDeValidacao("Setor inválido.");
    }
    if (!(await this.categoriaRepository.buscarPorId(dados.categoriaId))) {
      throw new ErroDeValidacao("Categoria inválida.");
    }

    const agora = new Date();
    const prazo = new Date(agora.getTime() + PRAZO_EM_HORAS[prioridade] * 60 * 60 * 1000);

    const chamado = new Chamado(
      0, // o id real é gerado pelo banco no salvar()
      titulo, descricao, prioridade, "ABERTO", agora, prazo,
      dados.setorId, dados.categoriaId, usuarioId
    );

    return this.repository.salvar(chamado);
  }

  /** Sem usuarioId = todos os chamados (administrador); com usuarioId = só os dele. */
  async resumo(usuarioId?: number): Promise<ResumoChamados> {
    const chamados = usuarioId === undefined
      ? await this.repository.listar()
      : await this.repository.listarPorUsuario(usuarioId);
    const contar = (fn: (c: ChamadoDetalhado) => boolean) => chamados.filter(fn).length;

    return {
      total: chamados.length,
      abertos: contar((c) => c.status === "ABERTO"),
      emAtendimento: contar((c) => c.status === "EM_ATENDIMENTO"),
      aguardandoPeca: contar((c) => c.status === "AGUARDANDO_PECA"),
      concluidos: contar((c) => c.status === "CONCLUIDO"),
      porPrioridade: {
        URGENTE: contar((c) => c.prioridade === "URGENTE"),
        ALTA: contar((c) => c.prioridade === "ALTA"),
        MEDIA: contar((c) => c.prioridade === "MEDIA"),
        BAIXA: contar((c) => c.prioridade === "BAIXA"),
      },
    };
  }

  private prioridadeValida(valor: string): valor is Prioridade {
    return (PRIORIDADES as readonly string[]).includes(valor);
  }
}