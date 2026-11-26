import type { Request, Response } from "express";
import type { ChamadoService } from "../services/chamadoService.js";
import { ErroDeValidacao } from "../errors.js";

export class ChamadoController {
  constructor(private chamadoService: ChamadoService) {}

  listarTodos = async (_req: Request, res: Response) => {
    const chamados = await this.chamadoService.listarTodos();
    res.json(chamados);
  };

  listarMeus = async (_req: Request, res: Response) => {
    const chamados = await this.chamadoService.listarDoUsuario(res.locals.usuarioId);
    res.json(chamados);
  };

  resumoGeral = async (_req: Request, res: Response) => {
    const resumo = await this.chamadoService.resumo();
    res.json(resumo);
  };

  resumoMeus = async (_req: Request, res: Response) => {
    const resumo = await this.chamadoService.resumo(res.locals.usuarioId);
    res.json(resumo);
  };

  criar = async (req: Request, res: Response) => {
    const { descricao, setor, prioridade } = req.body ?? {};

    if (typeof descricao !== "string" || typeof setor !== "string") {
      throw new ErroDeValidacao("Descrição e setor são obrigatórios.");
    }
    if (prioridade !== undefined && typeof prioridade !== "string") {
      throw new ErroDeValidacao("A prioridade deve ser um texto.");
    }

    const chamado = await this.chamadoService.criar(
      { descricao, setor, prioridade },
      res.locals.usuarioId
    );
    res.status(201).json({ mensagem: "Chamado criado com sucesso!", chamado });
  };
}