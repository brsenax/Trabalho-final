import type { NextFunction, Request, Response } from "express";
import { ErroDeValidacao, ErroNaoAutorizado, ErroNaoEncontrado, ErroProibido } from "../errors.js";

export function tratarErros(erro: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (erro instanceof ErroDeValidacao) return res.status(400).json({ erro: erro.message });
  if (erro instanceof ErroNaoAutorizado) return res.status(401).json({ erro: erro.message });
  if (erro instanceof ErroProibido) return res.status(403).json({ erro: erro.message });
  if (erro instanceof ErroNaoEncontrado) return res.status(404).json({ erro: erro.message });

  console.error(erro);
  return res.status(500).json({ erro: "Erro interno do servidor." });
}
