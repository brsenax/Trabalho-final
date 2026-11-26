import { pool } from "../database.js";
import type { UsuarioRepository } from "./usuarioRepository.js";
import { User, type Perfil } from "../entities/user.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export class UsuarioRepositoryMysql implements UsuarioRepository {
  async buscarPorEmail(email: string): Promise<User | undefined> {
    const [adms] = await pool.execute<RowDataPacket[]>(
      "SELECT id AS id_user, nome, telefone, email, senha FROM Adm WHERE email = ?",
      [email]
    );
    if (adms.length > 0) {
      const a = adms[0];
      return new User(a.id_user, a.nome, Number(a.telefone || 0), a.email, a.senha, "admin");
    }

    const [users] = await pool.execute<RowDataPacket[]>(
      "SELECT id AS id_user, nome, telefone, email, senha FROM Usuario WHERE email = ?",
      [email]
    );
    if (users.length > 0) {
      const u = users[0];
      return new User(u.id_user, u.nome, Number(u.telefone || 0), u.email, u.senha, "usuario");
    }

    return undefined;
  }

  async buscarPorId(id: number): Promise<User | undefined> {
    const [adms] = await pool.execute<RowDataPacket[]>(
      "SELECT id AS id_user, nome, telefone, email, senha FROM Adm WHERE id = ?",
      [id]
    );
    if (adms.length > 0) {
      const a = adms[0];
      return new User(a.id_user, a.nome, Number(a.telefone || 0), a.email, a.senha, "admin");
    }

    const [users] = await pool.execute<RowDataPacket[]>(
      "SELECT id AS id_user, nome, telefone, email, senha FROM Usuario WHERE id = ?",
      [id]
    );
    if (users.length > 0) {
      const u = users[0];
      return new User(u.id_user, u.nome, Number(u.telefone || 0), u.email, u.senha, "usuario");
    }

    return undefined;
  }

  async listarTodos(): Promise<User[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT id AS id_user, nome, telefone, email, senha FROM Usuario"
    );
    return rows.map(
      (u: RowDataPacket) => new User(u.id_user, u.nome, Number(u.telefone || 0), u.email, u.senha, "usuario")
    );
  }

  async criar(usuario: Omit<User, "id_user">): Promise<User> {
    const tabela = usuario.perfil === "admin" ? "Adm" : "Usuario";
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO ${tabela} (nome, email, senha, telefone) VALUES (?, ?, ?, ?)`,
      [usuario.nome, usuario.email, usuario.senha ?? "", usuario.telefone || null]
    );
    return new User(
      result.insertId,
      usuario.nome,
      usuario.telefone,
      usuario.email,
      usuario.senha,
      usuario.perfil as Perfil
    );
  }

  async atualizar(usuario: User): Promise<void> {
    await pool.execute(
      "UPDATE Usuario SET nome = ?, email = ?, telefone = ? WHERE id = ?",
      [usuario.nome, usuario.email, usuario.telefone || null, usuario.id_user]
    );
  }

  async excluir(id: number): Promise<void> {
    await pool.execute("DELETE FROM Andamento WHERE id_usuario = ?", [id]);
    await pool.execute("DELETE FROM Andamento WHERE id_chamado IN (SELECT id FROM Chamado WHERE id_usuario = ?)", [id]);
    await pool.execute("DELETE FROM Chamado WHERE id_usuario = ?", [id]);
    await pool.execute("DELETE FROM Usuario WHERE id = ?", [id]);
  }
}