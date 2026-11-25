import jwt from "jsonwebtoken";
import type { User, Perfil } from "../entities/user.js";
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

  autenticar(email: string, senha: string): SessaoAutenticada {
    const usuario = this.usuarioRepository.buscarPorEmail(email.trim());

    if (!usuario || !usuario.validarSenha(senha)) {
      throw new ErroNaoAutorizado("Usuário ou senha inválidos.");
    }

    const token = jwt.sign({ sub: String(usuario.id_user) }, JWT_SECRET, {
      expiresIn: JWT_EXPIRA_EM,
    });

    return { token, usuario: this.paraPublico(usuario) };
  }

  /** Retorna quem é o dono do token (o perfil vem do repositório, não do token), ou lança ErroNaoAutorizado. */
  validarToken(token: string): { id: number; perfil: Perfil } {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      const id = Number(typeof payload === "string" ? NaN : payload.sub);
      const usuario = Number.isInteger(id) ? this.usuarioRepository.buscarPorId(id) : undefined;
      if (!usuario) {
        throw new Error("usuário do token não existe");
      }
      return { id: usuario.id_user, perfil: usuario.perfil };
    } catch {
      throw new ErroNaoAutorizado("Sessão inválida ou expirada.");
    }
  }

  redefinirSenha(email: string, novaSenha: string): void {
    if (!novaSenha) {
      throw new ErroDeValidacao("A nova senha é obrigatória.");
    }

    const usuario = this.usuarioRepository.buscarPorEmail(email.trim());
    if (!usuario) {
      throw new ErroNaoEncontrado("Usuário não encontrado com este e-mail.");
    }

    usuario.senha = novaSenha;
    this.usuarioRepository.atualizar(usuario);
  }

  private paraPublico(u: User): UsuarioPublico {
    return { id_user: u.id_user, nome: u.nome, telefone: u.telefone, email: u.email, perfil: u.perfil };
  }
}
