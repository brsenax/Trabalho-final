import type { Request, Response } from "express";
import type { CatalogoService } from "../services/catalogoService.js";

export class CatalogoController {
  constructor(private catalogoService: CatalogoService) {}

  setores = async (_req: Request, res: Response) => {
    res.json(await this.catalogoService.listarSetores());
  };

  categorias = async (_req: Request, res: Response) => {
    res.json(await this.catalogoService.listarCategorias());
  };
}