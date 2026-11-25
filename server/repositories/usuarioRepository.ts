import type { User } from "../entities/user.js";

export interface UsuarioRepository {
  buscarPorEmail(email: string): User | undefined;
  buscarPorId(id: number): User | undefined;
  atualizar(usuario: User): void;
}
