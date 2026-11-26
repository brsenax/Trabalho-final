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

  listar = async (_req: Request, res: Response) => {
    const usuarios = await this.authService.listarUsuarios();
    res.json(usuarios);
  };

  criar = async (req: Request, res: Response) => {
    const { nome, email, senha, telefone, perfil } = req.body ?? {};
    const usuario = await this.authService.criarUsuario({ nome, email, senha, telefone, perfil });
    res.status(201).json(usuario);
  };

  atualizar = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { nome, email, telefone } = req.body ?? {};
    await this.authService.atualizarUsuario(id, { nome, email, telefone });
    res.json({ mensagem: "Usuário atualizado com sucesso!" });
  };

  excluir = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await this.authService.excluirUsuario(id);
    res.json({ mensagem: "Usuário excluído com sucesso!" });
  };
}