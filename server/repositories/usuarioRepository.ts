import type { User } from "../entities/user.js";

export interface UsuarioRepository {
  buscarPorEmail(email: string): Promise<User | undefined>;
  buscarPorId(id: number): Promise<User | undefined>;
  atualizar(usuario: User): Promise<void>;
}