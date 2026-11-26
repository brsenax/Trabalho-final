import type { Request, Response } from "express";
import { ChamadoRepository } from "../repositories/chamadoRepository.js";
import { ChamadoService } from "../services/chamadoService.js";

const chamadoService = new ChamadoService(new ChamadoRepository());

export function listarChamados(_req: Request, res: Response) {
  return res.json(chamadoService.listarChamados());
}

export function criarChamado(req: Request, res: Response) {
  const { descricao, prioridade } = req.body ?? {};

  if (typeof descricao !== "string") {
    return res.status(400).json({ erro: "A descrição do chamado é obrigatória." });
  }

  if (prioridade !== undefined && typeof prioridade !== "string") {
    return res.status(400).json({ erro: "A prioridade deve ser um texto." });
  }

  try {
    const chamado = chamadoService.criarChamado(descricao, prioridade ?? "Normal");
    return res.status(201).json({
      mensagem: "Chamado criado com sucesso!",
      chamado
    });
  } catch (erro) {
    const mensagem = erro instanceof Error
      ? erro.message
      : "Não foi possível criar o chamado.";

    return res.status(400).json({ erro: mensagem });
  }
}
