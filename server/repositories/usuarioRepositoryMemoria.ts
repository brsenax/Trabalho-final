import { User } from "../entities/user.js";
import type { UsuarioRepository } from "./usuarioRepository.js";

export class UsuarioRepositoryMemoria implements UsuarioRepository {
  private usuarios: User[] = [
    new User(1, "Administrador", 82999999999, "admin@ifal.edu.br", "123", "admin"),
    new User(2, "Aluno Teste", 82988888888, "aluno@ifal.edu.br", "123", "usuario"),
  ];

  buscarPorEmail(email: string): User | undefined {
    return this.usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  buscarPorId(id: number): User | undefined {
    return this.usuarios.find((u) => u.id_user === id);
  }

  atualizar(usuario: User): void {
    const i = this.usuarios.findIndex((u) => u.id_user === usuario.id_user);
    if (i >= 0) this.usuarios[i] = usuario;
  }
}
