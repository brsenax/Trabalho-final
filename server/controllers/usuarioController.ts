import type { Request, Response } from "express";
import type { AuthService } from "../services/authService.js";
import { ErroDeValidacao } from "../errors.js";

export class UsuarioController {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response) => {
    const { email, senha } = req.body ?? {};
    if (typeof email !== "string" || typeof senha !== "string") {
      throw new ErroDeValidacao("E-mail e senha são obrigatórios.");
    }

    const { token, usuario } = await this.authService.autenticar(email, senha);
    res.json({ mensagem: "Login bem-sucedido.", token, usuario });
  };

  recuperarSenha = async (req: Request, res: Response) => {
    const { email, novaSenha } = req.body ?? {};
    if (typeof email !== "string" || typeof novaSenha !== "string") {
      throw new ErroDeValidacao("E-mail e nova senha são obrigatórios.");
    }

    await this.authService.redefinirSenha(email, novaSenha);
    res.json({ mensagem: "Senha redefinida com sucesso!" });
  };
}
