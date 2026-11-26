import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../database/connection.js";
import type { Chamado, ChamadoDetalhado } from "../entities/chamado.js";
import type { ChamadoRepository } from "./chamadoRepository.js";

type LinhaChamado = RowDataPacket & ChamadoDetalhado;

// Os "AS" fazem as colunas do banco virarem os nomes usados pela API.
const SELECT_DETALHADO = `
  SELECT c.id, c.titulo, c.descricao, c.prioridade, c.situacao AS status,
         c.data_abertura, c.prazo, c.id_usuario AS usuarioId,
         s.nome AS setor, cat.nome AS categoria, u.nome AS solicitante
  FROM Chamado c
  JOIN Setor s      ON s.id   = c.id_setor
  JOIN Categoria cat ON cat.id = c.id_categoria
  JOIN Usuario u    ON u.id   = c.id_usuario`;

export class ChamadoRepositoryMysql implements ChamadoRepository {
  async salvar(chamado: Chamado): Promise<Chamado> {
    const [resultado] = await pool.execute<ResultSetHeader>(
      `INSERT INTO Chamado
         (id_usuario, id_setor, id_categoria, titulo, descricao, prioridade, situacao, data_abertura, prazo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        chamado.usuarioId, chamado.setorId, chamado.categoriaId,
        chamado.titulo, chamado.descricao, chamado.prioridade, chamado.status,
        chamado.data_abertura, chamado.prazo,
      ]
    );
    chamado.id = resultado.insertId; // id gerado pelo AUTO_INCREMENT
    return chamado;
  }

  async listar(): Promise<ChamadoDetalhado[]> {
    const [linhas] = await pool.query<LinhaChamado[]>(`${SELECT_DETALHADO} ORDER BY c.id`);
    return linhas;
  }

  async listarPorUsuario(usuarioId: number): Promise<ChamadoDetalhado[]> {
    const [linhas] = await pool.query<LinhaChamado[]>(
      `${SELECT_DETALHADO} WHERE c.id_usuario = ? ORDER BY c.id`,
      [usuarioId]
    );
    return linhas;
  }

  async buscarPorId(id: number): Promise<ChamadoDetalhado | undefined> {
    const [linhas] = await pool.query<LinhaChamado[]>(`${SELECT_DETALHADO} WHERE c.id = ?`, [id]);
    return linhas[0];
  }
}