import type { User } from "../entities/user.js";

export interface UsuarioRepository {
  listar(): Promise<User[]>;
  buscarPorEmail(email: string): Promise<User | undefined>;
  buscarPorId(id: number): Promise<User | undefined>;
  /** Grava o usuário novo e devolve a entidade com o `id_user` gerado pelo banco. */
  criar(usuario: User): Promise<User>;
  atualizar(usuario: User): Promise<void>;
  excluir(id: number): Promise<void>;
}