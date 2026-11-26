import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../database/connection.js";
import { User, type Perfil } from "../entities/user.js";
import { ErroDeValidacao } from "../errors.js";
import type { UsuarioRepository } from "./usuarioRepository.js";

interface LinhaUsuario extends RowDataPacket {
  id: number;
  id_setor: number | null;
  nome: string;
  telefone: string | null;
  email: string;
  senha: string;
  perfil: Perfil;
}

const COLUNAS = "id, id_setor, nome, telefone, email, senha, perfil";

export class UsuarioRepositoryMysql implements UsuarioRepository {
  async listar(): Promise<User[]> {
    const [linhas] = await pool.query<LinhaUsuario[]>(`SELECT ${COLUNAS} FROM Usuario ORDER BY nome`);
    return linhas.map((l) => this.paraEntidade(l));
  }

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

  async criar(usuario: User): Promise<User> {
    try {
      const [resultado] = await pool.execute<ResultSetHeader>(
        "INSERT INTO Usuario (id_setor, nome, telefone, email, senha, perfil) VALUES (?, ?, ?, ?, ?, ?)",
        [usuario.setorId, usuario.nome, usuario.telefone || null, usuario.email, usuario.senha ?? "", usuario.perfil]
      );
      usuario.id_user = resultado.insertId; // id gerado pelo AUTO_INCREMENT
      return usuario;
    } catch (erro) {
      throw this.traduzirErro(erro);
    }
  }

  async atualizar(usuario: User): Promise<void> {
    try {
      await pool.execute(
        "UPDATE Usuario SET id_setor = ?, nome = ?, telefone = ?, email = ?, senha = ?, perfil = ? WHERE id = ?",
        [usuario.setorId, usuario.nome, usuario.telefone || null, usuario.email, usuario.senha ?? "", usuario.perfil, usuario.id_user]
      );
    } catch (erro) {
      throw this.traduzirErro(erro);
    }
  }

  async excluir(id: number): Promise<void> {
    try {
      await pool.execute("DELETE FROM Usuario WHERE id = ?", [id]);
    } catch (erro) {
      throw this.traduzirErro(erro);
    }
  }

  // Converte uma linha da tabela em objeto do domínio.
  private paraEntidade(l: LinhaUsuario): User {
    return new User(l.id, l.nome, l.telefone ?? "", l.email, l.senha, l.perfil, l.id_setor);
  }

  // Erros de restrição do banco viram mensagens que o usuário entende (HTTP 400 em vez de 500).
  private traduzirErro(erro: unknown): unknown {
    const codigo = (erro as { code?: string }).code;
    if (codigo === "ER_DUP_ENTRY") return new ErroDeValidacao("Já existe um usuário com este e-mail.");
    if (codigo === "ER_ROW_IS_REFERENCED_2") {
      return new ErroDeValidacao("Este usuário possui chamados ou andamentos registrados e não pode ser excluído.");
    }
    return erro;
  }
}