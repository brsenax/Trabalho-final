import { pool } from "../database.js";
import type { ChamadoRepository } from "./chamadoRepository.js";
import { Chamado, type Prioridade, type StatusChamado } from "../entities/chamado.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

function mapearStatusParaApp(situacao: string): StatusChamado {
  const s = (situacao || "").toUpperCase();
  if (s === "EM_ATENDIMENTO" || s === "AGUARDANDO_PECA") return "Em andamento";
  if (s === "CONCLUIDO") return "Concluído";
  return "Aberto";
}

function mapearStatusParaBanco(status?: StatusChamado): string {
  if (status === "Em andamento") return "EM_ATENDIMENTO";
  if (status === "Concluído") return "CONCLUIDO";
  return "ABERTO";
}

function mapearPrioridadeParaApp(prioridade: string): Prioridade {
  const p = (prioridade || "").toUpperCase();
  if (p === "ALTA" || p === "URGENTE") return "Alta";
  if (p === "BAIXA") return "Baixa";
  return "Média";
}

function mapearPrioridadeParaBanco(prioridade?: Prioridade): string {
  if (prioridade === "Alta") return "ALTA";
  if (prioridade === "Baixa") return "BAIXA";
  return "MEDIA";
}

export class ChamadoRepositoryMysql implements ChamadoRepository {
  async proximoId(): Promise<number> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT COALESCE(MAX(id), 0) + 1 AS proximo FROM Chamado"
    );
    return Number(rows[0]?.proximo ?? 1);
  }

  async salvar(chamado: Chamado): Promise<Chamado> {
    const [setores] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM Setor WHERE nome = ? LIMIT 1",
      [chamado.setor]
    );
    const idSetor = setores.length > 0 ? setores[0].id : 1;

    const [categorias] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM Categoria LIMIT 1"
    );
    const idCategoria = categorias.length > 0 ? categorias[0].id : 1;

    const titulo = chamado.descricao.slice(0, 60) || "Chamado de Suporte";

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO Chamado (id_usuario, id_setor, id_categoria, titulo, descricao, prioridade, situacao, data_abertura, prazo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))`,
      [
        chamado.usuarioId,
        idSetor,
        idCategoria,
        titulo,
        chamado.descricao,
        mapearPrioridadeParaBanco(chamado.prioridade),
        mapearStatusParaBanco(chamado.status),
        chamado.data_abertura,
      ]
    );

    return new Chamado(
      chamado.descricao,
      result.insertId,
      chamado.prioridade,
      chamado.data_abertura,
      chamado.setor,
      chamado.usuarioId,
      chamado.status
    );
  }

  async listar(): Promise<Chamado[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT c.id, c.descricao, c.prioridade, c.data_abertura,
              COALESCE(s.nome, '') AS setor, c.id_usuario AS usuarioId, c.situacao
       FROM Chamado c
       LEFT JOIN Setor s ON c.id_setor = s.id
       ORDER BY c.data_abertura DESC`
    );
    return rows.map(
      (r: RowDataPacket) =>
        new Chamado(
          r.descricao,
          r.id,
          mapearPrioridadeParaApp(r.prioridade),
          new Date(r.data_abertura),
          r.setor,
          r.usuarioId,
          mapearStatusParaApp(r.situacao)
        )
    );
  }

  async listarPorUsuario(usuarioId: number): Promise<Chamado[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT c.id, c.descricao, c.prioridade, c.data_abertura,
              COALESCE(s.nome, '') AS setor, c.id_usuario AS usuarioId, c.situacao
       FROM Chamado c
       LEFT JOIN Setor s ON c.id_setor = s.id
       WHERE c.id_usuario = ?
       ORDER BY c.data_abertura DESC`,
      [usuarioId]
    );
    return rows.map(
      (r: RowDataPacket) =>
        new Chamado(
          r.descricao,
          r.id,
          mapearPrioridadeParaApp(r.prioridade),
          new Date(r.data_abertura),
          r.setor,
          r.usuarioId,
          mapearStatusParaApp(r.situacao)
        )
    );
  }

  async buscarPorId(id: number): Promise<Chamado | undefined> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT c.id, c.descricao, c.prioridade, c.data_abertura,
              COALESCE(s.nome, '') AS setor, c.id_usuario AS usuarioId, c.situacao
       FROM Chamado c
       LEFT JOIN Setor s ON c.id_setor = s.id
       WHERE c.id = ?`,
      [id]
    );
    if (rows.length === 0) return undefined;
    const r = rows[0];
    return new Chamado(
      r.descricao,
      r.id,
      mapearPrioridadeParaApp(r.prioridade),
      new Date(r.data_abertura),
      r.setor,
      r.usuarioId,
      mapearStatusParaApp(r.situacao)
    );
  }

  async atualizar(id: number, dados: Partial<Chamado>): Promise<void> {
    const novaSituacao = dados.status ? mapearStatusParaBanco(dados.status) : null;
    const novaPrioridade = dados.prioridade ? mapearPrioridadeParaBanco(dados.prioridade) : null;

    await pool.execute(
      `UPDATE Chamado
       SET situacao = COALESCE(?, situacao),
           prioridade = COALESCE(?, prioridade),
           data_conclusao = IF(? = 'CONCLUIDO', NOW(), data_conclusao)
       WHERE id = ?`,
      [novaSituacao, novaPrioridade, novaSituacao, id]
    );
  }

  async excluir(id: number): Promise<void> {
    await pool.execute("DELETE FROM Andamento WHERE id_chamado = ?", [id]);
    await pool.execute("DELETE FROM Chamado WHERE id = ?", [id]);
  }
}