import type { Setor } from "../entities/setor.js";
import type { Categoria } from "../entities/categoria.js";
import type { SetorRepository } from "../repositories/setorRepository.js";
import type { CategoriaRepository } from "../repositories/categoriaRepository.js";

/** Dados de apoio do formulário de chamado (listas de setores e categorias). */
export class CatalogoService {
  constructor(
    private setorRepository: SetorRepository,
    private categoriaRepository: CategoriaRepository
  ) {}

  listarSetores(): Promise<Setor[]> {
    return this.setorRepository.listar();
  }

  listarCategorias(): Promise<Categoria[]> {
    return this.categoriaRepository.listar();
  }
}