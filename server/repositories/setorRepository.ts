import type { Setor } from "../entities/setor.js";

export interface SetorRepository {
  listar(): Promise<Setor[]>;
  buscarPorId(id: number): Promise<Setor | undefined>;
}