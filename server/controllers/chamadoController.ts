import type { Request, Response } from "express";
import type { ChamadoService } from "../services/chamadoService.js";
import { ErroDeValidacao } from "../errors.js";

export class ChamadoController {
  constructor(private chamadoService: ChamadoService) {}

  listarTodos = (_req: Request, res: Response) => {
    res.json(this.chamadoService.listarTodos());
  };

  listarMeus = (_req: Request, res: Response) => {
    res.json(this.chamadoService.listarDoUsuario(res.locals.usuarioId));
  };

  resumoGeral = (_req: Request, res: Response) => {
    res.json(this.chamadoService.resumo());
  };

  resumoMeus = (_req: Request, res: Response) => {
    res.json(this.chamadoService.resumo(res.locals.usuarioId));
  };

  criar = (req: Request, res: Response) => {
    const { descricao, setor, prioridade } = req.body ?? {};

    if (typeof descricao !== "string" || typeof setor !== "string") {
      throw new ErroDeValidacao("Descrição e setor são obrigatórios.");
    }
    if (prioridade !== undefined && typeof prioridade !== "string") {
      throw new ErroDeValidacao("A prioridade deve ser um texto.");
    }

    const chamado = this.chamadoService.criar(
      { descricao, setor, prioridade },
      res.locals.usuarioId
    );
    res.status(201).json({ mensagem: "Chamado criado com sucesso!", chamado });
  };
}
