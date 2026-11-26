import type { RowDataPacket } from "mysql2";
import { pool } from "../database/connection.js";
import { Setor } from "../entities/setor.js";
import type { SetorRepository } from "./setorRepository.js";

interface LinhaSetor extends RowDataPacket { id: number; nome: string }

export class SetorRepositoryMysql implements SetorRepository {
  async listar(): Promise<Setor[]> {
    const [linhas] = await pool.query<LinhaSetor[]>("SELECT id, nome FROM Setor ORDER BY nome");
    return linhas.map((l) => new Setor(l.nome, l.id));
  }

  async buscarPorId(id: number): Promise<Setor | undefined> {
    const [linhas] = await pool.execute<LinhaSetor[]>("SELECT id, nome FROM Setor WHERE id = ?", [id]);
    return linhas[0] && new Setor(linhas[0].nome, linhas[0].id);
  }
}