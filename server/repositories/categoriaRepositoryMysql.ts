import type { RowDataPacket } from "mysql2";
import { pool } from "../database/connection.js";
import { Categoria } from "../entities/categoria.js";
import type { CategoriaRepository } from "./categoriaRepository.js";

interface LinhaCategoria extends RowDataPacket { id: number; nome: string }

export class CategoriaRepositoryMysql implements CategoriaRepository {
  async listar(): Promise<Categoria[]> {
    const [linhas] = await pool.query<LinhaCategoria[]>("SELECT id, nome FROM Categoria ORDER BY nome");
    return linhas.map((l) => new Categoria(l.nome, l.id));
  }

  async buscarPorId(id: number): Promise<Categoria | undefined> {
    const [linhas] = await pool.execute<LinhaCategoria[]>("SELECT id, nome FROM Categoria WHERE id = ?", [id]);
    return linhas[0] && new Categoria(linhas[0].nome, linhas[0].id);
  }
}