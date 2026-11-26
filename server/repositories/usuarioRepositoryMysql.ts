import type { RowDataPacket } from "mysql2";
import { pool } from "../database/connection.js";
import { User, type Perfil } from "../entities/user.js";
import type { UsuarioRepository } from "./usuarioRepository.js";

interface LinhaUsuario extends RowDataPacket {
  id: number;
  nome: string;
  telefone: string | null;
  email: string;
  senha: string;
  perfil: Perfil;
}

const COLUNAS = "id, nome, telefone, email, senha, perfil";

export class UsuarioRepositoryMysql implements UsuarioRepository {
  async buscarPorEmail(email: string): Promise<User | undefined> {
    const [linhas] = await pool.execute<LinhaUsuario[]>(
      `SELECT ${COLUNAS} FROM Usuario WHERE email = ? LIMIT 1`,
      [email]
    );
    return linhas[0] && this.paraEntidade(linhas[0]);
  }

  async buscarPorId(id: number): Promise<User | undefined> {
    const [linhas] = await pool.execute<LinhaUsuario[]>(
      `SELECT ${COLUNAS} FROM Usuario WHERE id = ? LIMIT 1`,
      [id]
    );
    return linhas[0] && this.paraEntidade(linhas[0]);
  }

  async atualizar(usuario: User): Promise<void> {
    await pool.execute(
      "UPDATE Usuario SET nome = ?, telefone = ?, senha = ?, perfil = ? WHERE id = ?",
      [usuario.nome, usuario.telefone, usuario.senha ?? "", usuario.perfil, usuario.id_user]
    );
  }

  // Converte uma linha da tabela em objeto do domínio.
  private paraEntidade(l: LinhaUsuario): User {
    return new User(l.id, l.nome, l.telefone ?? "", l.email, l.senha, l.perfil);
  }
}