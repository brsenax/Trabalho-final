import { PERFIS, User, type Perfil } from "../entities/user.js";
import type { UsuarioRepository } from "../repositories/usuarioRepository.js";
import type { SetorRepository } from "../repositories/setorRepository.js";
import { ErroDeValidacao, ErroNaoEncontrado } from "../errors.js";

/** Usuário como a API devolve: sem a senha. */
export interface UsuarioGerenciado {
  id_user: number;
  nome: string;
  email: string;
  telefone: string;
  perfil: Perfil;
  setorId: number | null;
}

export interface DadosUsuario {
  nome: string;
  email: string;
  telefone?: string;
  perfil: string;
  setorId?: number | null;
  senha?: string;
}

const SENHA_MINIMA = 6;
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** CRUD de usuários, usado pelo administrador. */
export class UsuarioService {
  constructor(
    private usuarioRepository: UsuarioRepository,
    private setorRepository: SetorRepository
  ) {}

  async listar(): Promise<UsuarioGerenciado[]> {
    return (await this.usuarioRepository.listar()).map((u) => this.paraPublico(u));
  }

  async criar(dados: DadosUsuario): Promise<UsuarioGerenciado> {
    const limpos = await this.validar(dados);
    if (!dados.senha) throw new ErroDeValidacao("A senha é obrigatória para um novo usuário.");
    this.validarSenha(dados.senha);

    const usuario = new User(0, limpos.nome, limpos.telefone, limpos.email, dados.senha, limpos.perfil, limpos.setorId);
    return this.paraPublico(await this.usuarioRepository.criar(usuario));
  }

  /** Senha em branco = mantém a senha atual. */
  async atualizar(id: number, dados: DadosUsuario, usuarioLogadoId: number): Promise<UsuarioGerenciado> {
    const usuario = await this.usuarioRepository.buscarPorId(id);
    if (!usuario) throw new ErroNaoEncontrado("Usuário não encontrado.");

    const limpos = await this.validar(dados);
    if (id === usuarioLogadoId && limpos.perfil !== "admin") {
      throw new ErroDeValidacao("Você não pode remover o seu próprio acesso de administrador.");
    }

    usuario.nome = limpos.nome;
    usuario.email = limpos.email;
    usuario.telefone = limpos.telefone;
    usuario.perfil = limpos.perfil;
    usuario.setorId = limpos.setorId;
    if (dados.senha) {
      this.validarSenha(dados.senha);
      usuario.senha = dados.senha;
    }

    await this.usuarioRepository.atualizar(usuario);
    return this.paraPublico(usuario);
  }

  async excluir(id: number, usuarioLogadoId: number): Promise<void> {
    if (id === usuarioLogadoId) {
      throw new ErroDeValidacao("Você não pode excluir o seu próprio usuário.");
    }
    if (!(await this.usuarioRepository.buscarPorId(id))) {
      throw new ErroNaoEncontrado("Usuário não encontrado.");
    }
    await this.usuarioRepository.excluir(id);
  }

  private async validar(dados: DadosUsuario) {
    const nome = dados.nome.trim();
    const email = dados.email.trim();
    const telefone = (dados.telefone ?? "").trim();
    const setorId = dados.setorId ?? null;

    if (!nome) throw new ErroDeValidacao("O nome é obrigatório.");
    if (nome.length > 100) throw new ErroDeValidacao("O nome deve ter no máximo 100 caracteres.");
    if (!EMAIL_VALIDO.test(email) || email.length > 120) throw new ErroDeValidacao("E-mail inválido.");
    if (telefone.length > 20) throw new ErroDeValidacao("O telefone deve ter no máximo 20 caracteres.");
    if (!(PERFIS as readonly string[]).includes(dados.perfil)) {
      throw new ErroDeValidacao(`Perfil inválido. Use: ${PERFIS.join(", ")}.`);
    }
    if (setorId !== null && !(await this.setorRepository.buscarPorId(setorId))) {
      throw new ErroDeValidacao("Setor inválido.");
    }

    return { nome, email, telefone, setorId, perfil: dados.perfil as Perfil };
  }

  private validarSenha(senha: string): void {
    if (senha.length < SENHA_MINIMA) {
      throw new ErroDeValidacao(`A senha deve ter pelo menos ${SENHA_MINIMA} caracteres.`);
    }
  }

  private paraPublico(u: User): UsuarioGerenciado {
    return { id_user: u.id_user, nome: u.nome, email: u.email, telefone: u.telefone, perfil: u.perfil, setorId: u.setorId };
  }
}