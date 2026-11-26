import type { User } from "../entities/user.js";

export interface UsuarioRepository {
  buscarPorEmail(email: string): Promise<User | undefined>;
  buscarPorId(id: number): Promise<User | undefined>;
  listarTodos(): Promise<User[]>;
  criar(usuario: Omit<User, "id_user">): Promise<User>;
  atualizar(usuario: User): Promise<void>;
  excluir(id: number): Promise<void>;
}