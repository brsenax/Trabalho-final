import type { Categoria } from "../entities/categoria.js";

export interface CategoriaRepository {
  listar(): Promise<Categoria[]>;
  buscarPorId(id: number): Promise<Categoria | undefined>;
}