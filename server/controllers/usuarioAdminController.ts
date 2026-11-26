import type { Request, Response } from "express";
import type { UsuarioService } from "../services/usuarioService.js";
import { ErroDeValidacao } from "../errors.js";

export class UsuarioAdminController {
  constructor(private usuarioService: UsuarioService) {}

  listar = async (_req: Request, res: Response) => {
    res.json(await this.usuarioService.listar());
  };

  criar = async (req: Request, res: Response) => {
    const usuario = await this.usuarioService.criar(this.lerCorpo(req));
    res.status(201).json({ mensagem: "Usuário criado com sucesso!", usuario });
  };

  atualizar = async (req: Request, res: Response) => {
    const usuario = await this.usuarioService.atualizar(this.lerId(req), this.lerCorpo(req), res.locals.usuarioId);
    res.json({ mensagem: "Usuário atualizado com sucesso!", usuario });
  };

  excluir = async (req: Request, res: Response) => {
    await this.usuarioService.excluir(this.lerId(req), res.locals.usuarioId);
    res.json({ mensagem: "Usuário excluído com sucesso!" });
  };

  private lerId(req: Request): number {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw new ErroDeValidacao("Id inválido.");
    return id;
  }

  // Confere só o TIPO dos campos; as regras de negócio ficam no service.
  private lerCorpo(req: Request) {
    const { nome, email, telefone, perfil, setorId, senha } = req.body ?? {};

    if (typeof nome !== "string" || typeof email !== "string" || typeof perfil !== "string") {
      throw new ErroDeValidacao("Nome, e-mail e perfil são obrigatórios.");
    }
    if (telefone !== undefined && telefone !== null && typeof telefone !== "string") {
      throw new ErroDeValidacao("O telefone deve ser um texto.");
    }
    if (senha !== undefined && senha !== null && typeof senha !== "string") {
      throw new ErroDeValidacao("A senha deve ser um texto.");
    }
    if (setorId !== undefined && setorId !== null && !Number.isInteger(setorId)) {
      throw new ErroDeValidacao("Setor inválido.");
    }

    return { nome, email, telefone: telefone ?? undefined, perfil, setorId: setorId ?? null, senha: senha ?? undefined };
  }
}