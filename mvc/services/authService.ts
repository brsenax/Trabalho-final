import { User } from "../../src/entities/user.js";
import { UsuarioRepository } from "../repositories/usuarioRepository.js";

export class AuthService {
  constructor(private usuarioRepository: UsuarioRepository) { }

  public autenticar(email: string, senha: string): User | null {
    const emailLimpo = email.trim().toLowerCase();

    if (!emailLimpo || !senha) {
      return null;
    }

    return this.usuarioRepository.buscarPorEmailESenha(emailLimpo, senha) ?? null;
  }

  public redefinirSenha(email: string, novaSenha: string): boolean {
    const emailLimpo = email.trim().toLowerCase();

    if (!emailLimpo || !novaSenha) {
      return false;
    }

    return this.usuarioRepository.atualizarSenha(emailLimpo, novaSenha);
  }
}
