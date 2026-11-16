import type { Request, Response } from "express";
import { UsuarioRepository } from "../repositories/usuarioRepository.js";
import { AuthService } from "../services/authService.js";

const authService = new AuthService(new UsuarioRepository());

export function fazerLogin(req: Request, res: Response) {
  const { email, senha } = req.body ?? {};

  if (typeof email !== "string" || typeof senha !== "string") {
    return res.status(400).json({ erro: "E-mail e senha são obrigatórios." });
  }

  const usuario = authService.autenticar(email, senha);

  if (!usuario) {
    return res.status(401).json({ erro: "Usuário ou senha inválidos." });
  }

  const { senha: _senha, ...usuarioSeguro } = usuario;
  return res.json({ mensagem: "Login bem-sucedido.", usuario: usuarioSeguro });
}
