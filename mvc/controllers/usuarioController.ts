import { Request, Response } from 'express';
import { validarUsuario } from '../model/usuarioModel.js';

export async function fazerLogin(req: Request, res: Response) {
  const { email, senha } = req.body;

  // Chama o Model para validar os dados
  const usuario = validarUsuario(email, senha);

  if (!usuario) {
    return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
  }

  return res.json({ mensagem: 'Login bem-sucedido', usuario });
}