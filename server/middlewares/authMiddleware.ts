import type { NextFunction, Request, Response } from "express";
import type { AuthService } from "../services/authService.js";
import { ErroNaoAutorizado, ErroProibido } from "../errors.js";

export function exigirLogin(authService: AuthService) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const cabecalho = req.header("Authorization") ?? "";
      const [tipo, token] = cabecalho.split(" ");
      if (tipo !== "Bearer" || !token) {
        throw new ErroNaoAutorizado("Faça login para continuar.");
      }
      const { id, perfil } = authService.validarToken(token);
      res.locals.usuarioId = id;
      res.locals.perfil = perfil;
      next();
    } catch (erro) {
      next(erro);
    }
  };
}

/** Usar depois de exigirLogin: só deixa passar administradores. */
export function exigirAdmin(_req: Request, res: Response, next: NextFunction) {
  if (res.locals.perfil !== "admin") {
    return next(new ErroProibido("Acesso restrito a administradores."));
  }
  next();
}
