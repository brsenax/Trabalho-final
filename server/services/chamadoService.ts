import { Chamado, PRIORIDADES, type Prioridade } from "../entities/chamado.js";
import type { ChamadoRepository } from "../repositories/chamadoRepository.js";
import type { UsuarioRepository } from "../repositories/usuarioRepository.js";
import { ErroDeValidacao } from "../errors.js";

export interface NovoChamado {
  descricao: string;
  setor: string;
  prioridade?: string;
}

export interface ResumoChamados {
  total: number;
  abertos: number;
  emAndamento: number;
  concluidos: number;
  porPrioridade: Record<Prioridade, number>;
}

/** Chamado + nome de quem abriu (usado no dashboard do administrador). */
export type ChamadoDetalhado = Omit<Chamado, "alterarPrioridade" | "obterDataFormatada"> & { solicitante: string };

export class ChamadoService {
  constructor(
    private repository: ChamadoRepository,
    private usuarioRepository: UsuarioRepository
  ) {}

  async listarTodos(): Promise<ChamadoDetalhado[]> {
    const chamados = await this.repository.listar();
    return Promise.all(
      chamados.map(async (c) => {
        const usuario = await this.usuarioRepository.buscarPorId(c.usuarioId);
        return {
          ...c,
          solicitante: usuario?.nome ?? "Desconhecido",
        };
      })
    );
  }

  async listarDoUsuario(usuarioId: number): Promise<Chamado[]> {
    return this.repository.listarPorUsuario(usuarioId);
  }

  async criar(dados: NovoChamado, usuarioId: number): Promise<Chamado> {
    const descricao = dados.descricao.trim();
    const setor = dados.setor.trim();
    const prioridade = dados.prioridade ?? "Média";

    if (!descricao) throw new ErroDeValidacao("A descrição do chamado é obrigatória.");
    if (!setor) throw new ErroDeValidacao("O setor é obrigatório.");
    if (!this.prioridadeValida(prioridade)) {
      throw new ErroDeValidacao(`Prioridade inválida. Use: ${PRIORIDADES.join(", ")}.`);
    }

    const proximoId = await this.repository.proximoId();
    const chamado = new Chamado(
      descricao,
      proximoId,
      prioridade,
      new Date(),
      setor,
      usuarioId
    );

    return this.repository.salvar(chamado);
  }

  /** Sem usuarioId = todos os chamados (administrador); com usuarioId = só os dele. */
  async resumo(usuarioId?: number): Promise<ResumoChamados> {
    const chamados = usuarioId === undefined
      ? await this.repository.listar()
      : await this.repository.listarPorUsuario(usuarioId);
    const contar = (fn: (c: Chamado) => boolean) => chamados.filter(fn).length;

    return {
      total: chamados.length,
      abertos: contar((c) => c.status === "Aberto"),
      emAndamento: contar((c) => c.status === "Em andamento"),
      concluidos: contar((c) => c.status === "Concluído"),
      porPrioridade: {
        Alta: contar((c) => c.prioridade === "Alta"),
        Média: contar((c) => c.prioridade === "Média"),
        Baixa: contar((c) => c.prioridade === "Baixa"),
      },
    };
  }

  private prioridadeValida(valor: string): valor is Prioridade {
    return (PRIORIDADES as readonly string[]).includes(valor);
  }
}