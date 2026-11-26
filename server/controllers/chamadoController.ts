import type { Request, Response } from "express";
import type { ChamadoService } from "../services/chamadoService.js";
import { ErroDeValidacao } from "../errors.js";

export class ChamadoController {
  constructor(private chamadoService: ChamadoService) {}

  listarTodos = async (_req: Request, res: Response) => {
    res.json(await this.chamadoService.listarTodos());
  };

  listarMeus = async (_req: Request, res: Response) => {
    res.json(await this.chamadoService.listarDoUsuario(res.locals.usuarioId));
  };

  resumoGeral = async (_req: Request, res: Response) => {
    res.json(await this.chamadoService.resumo());
  };

  resumoMeus = async (_req: Request, res: Response) => {
    res.json(await this.chamadoService.resumo(res.locals.usuarioId));
  };

  criar = async (req: Request, res: Response) => {
    const { titulo, descricao, setorId, categoriaId, prioridade } = req.body ?? {};

    if (typeof titulo !== "string" || typeof descricao !== "string") {
      throw new ErroDeValidacao("Título e descrição são obrigatórios.");
    }
    if (!Number.isInteger(setorId) || !Number.isInteger(categoriaId)) {
      throw new ErroDeValidacao("Setor e categoria são obrigatórios.");
    }
    if (prioridade !== undefined && typeof prioridade !== "string") {
      throw new ErroDeValidacao("A prioridade deve ser um texto.");
    }

    const chamado = await this.chamadoService.criar(
      { titulo, descricao, setorId, categoriaId, prioridade },
      res.locals.usuarioId
    );
    res.status(201).json({ mensagem: "Chamado criado com sucesso!", chamado });
  };
}