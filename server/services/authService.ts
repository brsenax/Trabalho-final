import jwt from "jsonwebtoken";
import { User, type Perfil } from "../entities/user.js";
import type { UsuarioRepository } from "../repositories/usuarioRepository.js";
import { ErroDeValidacao, ErroNaoAutorizado, ErroNaoEncontrado } from "../errors.js";
import { JWT_EXPIRA_EM, JWT_SECRET } from "../config.js";

/** Usuário sem a senha: é o único formato que sai da API. */
export type UsuarioPublico = Pick<User, "id_user" | "nome" | "telefone" | "email" | "perfil">;

export interface SessaoAutenticada {
  token: string;
  usuario: UsuarioPublico;
}

export class AuthService {
  constructor(private usuarioRepository: UsuarioRepository) {}

  async autenticar(email: string, senha: string): Promise<SessaoAutenticada> {
    const usuario = await this.usuarioRepository.buscarPorEmail(email.trim());

    if (!usuario || !usuario.validarSenha(senha)) {
      throw new ErroNaoAutorizado("Usuário ou senha inválidos.");
    }

    const token = jwt.sign({ sub: String(usuario.id_user) }, JWT_SECRET, {
      expiresIn: JWT_EXPIRA_EM,
    });

    return { token, usuario: this.paraPublico(usuario) };
  }

  /** Retorna quem é o dono do token (o perfil vem do repositório, não do token), ou lança ErroNaoAutorizado. */
  async validarToken(token: string): Promise<{ id: number; perfil: Perfil }> {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      const id = Number(typeof payload === "string" ? NaN : payload.sub);
      const usuario = Number.isInteger(id) ? await this.usuarioRepository.buscarPorId(id) : undefined;
      if (!usuario) {
        throw new Error("usuário do token não existe");
      }
      return { id: usuario.id_user, perfil: usuario.perfil };
    } catch {
      throw new ErroNaoAutorizado("Sessão inválida ou expirada.");
    }
  }

  async redefinirSenha(email: string, novaSenha: string): Promise<void> {
    if (!novaSenha) {
      throw new ErroDeValidacao("A nova senha é obrigatória.");
    }

    const usuario = await this.usuarioRepository.buscarPorEmail(email.trim());
    if (!usuario) {
      throw new ErroNaoEncontrado("Usuário não encontrado com este e-mail.");
    }

    usuario.senha = novaSenha;
    await this.usuarioRepository.atualizar(usuario);
  }

  async listarUsuarios(): Promise<UsuarioPublico[]> {
    const usuarios = await this.usuarioRepository.listarTodos();
    return usuarios.map((u) => this.paraPublico(u));
  }

  async criarUsuario(dados: { nome: string; email: string; senha: string; telefone?: number; perfil?: Perfil }): Promise<UsuarioPublico> {
    if (!dados.nome?.trim() || !dados.email?.trim() || !dados.senha) {
      throw new ErroDeValidacao("Nome, e-mail e senha são obrigatórios.");
    }

    const existente = await this.usuarioRepository.buscarPorEmail(dados.email.trim());
    if (existente) {
      throw new ErroDeValidacao("Já existe um usuário cadastrado com este e-mail.");
    }

    const novo = new User(
      0,
      dados.nome.trim(),
      Number(dados.telefone || 0),
      dados.email.trim(),
      dados.senha,
      dados.perfil ?? "usuario"
    );

    const criado = await this.usuarioRepository.criar(novo);
    return this.paraPublico(criado);
  }

  async atualizarUsuario(id: number, dados: { nome?: string; email?: string; telefone?: number }): Promise<void> {
    const usuario = await this.usuarioRepository.buscarPorId(id);
    if (!usuario) {
      throw new ErroNaoEncontrado("Usuário não encontrado.");
    }

    if (dados.nome !== undefined) usuario.nome = dados.nome.trim();
    if (dados.email !== undefined) usuario.email = dados.email.trim();
    if (dados.telefone !== undefined) usuario.telefone = Number(dados.telefone);

    await this.usuarioRepository.atualizar(usuario);
  }

  async excluirUsuario(id: number): Promise<void> {
    await this.usuarioRepository.excluir(id);
  }

  private paraPublico(u: User): UsuarioPublico {
    return { id_user: u.id_user, nome: u.nome, telefone: u.telefone, email: u.email, perfil: u.perfil };
  }
}