import { atualizarUsuario, criarUsuario, excluirUsuario, listarUsuarios } from "../clients/usuarioAdminApi";
import { listarSetores } from "../clients/catalogoApi";
import { obterSessao } from "../sessao";
import { esc, mostrarErro } from "./helpers";
import type { OpcaoLista, Perfil, UsuarioGerenciado } from "../types";

const ROTULO_PERFIL: Record<Perfil, string> = { admin: "Administrador", usuario: "Usuário" };

export async function renderAdminUsuarios(pagina: HTMLElement): Promise<void> {
  pagina.innerHTML = `<p>Carregando...</p>`;

  let setores: OpcaoLista[];
  let usuarios: UsuarioGerenciado[];
  try {
    [setores, usuarios] = await Promise.all([listarSetores(), listarUsuarios()]);
  } catch (erro) {
    return mostrarErro(pagina, erro);
  }

  const meuId = obterSessao()?.usuario.id_user;
  const nomeDoSetor = (id: number | null) => setores.find((s) => s.id === id)?.nome ?? "-";

  // Estado da tela: a lista de usuários vem do servidor; o resto só controla o que é exibido.
  let formAberto = false;
  let editando: UsuarioGerenciado | null = null; // null = criando um novo
  let aviso: { texto: string; ok: boolean } | null = null;

  async function recarregar(): Promise<void> {
    usuarios = await listarUsuarios();
    desenhar();
  }

  function formulario(): string {
    const u = editando;
    const euMesmo = u !== null && u.id_user === meuId;
    return `
      <div class="login-card" style="max-width:700px;margin:0 0 24px;">
        <h2 class="secao-titulo" style="margin-top:0;">${u ? "Editar usuário" : "Novo usuário"}</h2>
        <form id="form-usuario">
          <div class="form-linha">
            <div class="form-group">
              <label for="u-nome">Nome</label>
              <input type="text" id="u-nome" maxlength="100" value="${esc(u?.nome ?? "")}" required />
            </div>
            <div class="form-group">
              <label for="u-email">E-mail</label>
              <input type="email" id="u-email" maxlength="120" value="${esc(u?.email ?? "")}" required />
            </div>
          </div>
          <div class="form-linha">
            <div class="form-group">
              <label for="u-telefone">Telefone</label>
              <input type="text" id="u-telefone" maxlength="20" value="${esc(u?.telefone ?? "")}" />
            </div>
            <div class="form-group">
              <label for="u-setor">Setor</label>
              <select id="u-setor">
                <option value="">Sem setor</option>
                ${setores.map((s) => `<option value="${s.id}" ${u?.setorId === s.id ? "selected" : ""}>${esc(s.nome)}</option>`).join("")}
              </select>
            </div>
          </div>
          <div class="form-linha">
            <div class="form-group">
              <label for="u-perfil">Perfil</label>
              <select id="u-perfil" ${euMesmo ? 'disabled title="Você não pode alterar o seu próprio perfil"' : ""}>
                <option value="usuario" ${u?.perfil === "usuario" || !u ? "selected" : ""}>Usuário</option>
                <option value="admin" ${u?.perfil === "admin" ? "selected" : ""}>Administrador</option>
              </select>
            </div>
            <div class="form-group">
              <label for="u-senha">Senha</label>
              <input type="password" id="u-senha" minlength="6" autocomplete="new-password"
                     placeholder="${u ? "Deixe em branco para manter a atual" : "Mínimo 6 caracteres"}" ${u ? "" : "required"} />
            </div>
          </div>
          <div class="form-botoes">
            <button type="submit" class="btn-primary">${u ? "Salvar alterações" : "Criar usuário"}</button>
            <button type="button" class="btn-secundario" id="btn-cancelar">Cancelar</button>
          </div>
        </form>
        <p id="mensagem-feedback" style="color:#dc2626;"></p>
      </div>`;
  }

  function tabela(): string {
    const linhas = usuarios.map((u) => {
      const euMesmo = u.id_user === meuId;
      return `
        <tr>
          <td>${esc(u.nome)}${euMesmo ? " <em>(você)</em>" : ""}</td>
          <td>${esc(u.email)}</td>
          <td>${esc(u.telefone || "-")}</td>
          <td>${esc(nomeDoSetor(u.setorId))}</td>
          <td>${ROTULO_PERFIL[u.perfil]}</td>
          <td>
            <div class="acoes-linha">
              <button class="btn-tabela" data-acao="editar" data-id="${u.id_user}">Editar</button>
              <button class="btn-tabela perigo" data-acao="excluir" data-id="${u.id_user}"
                      ${euMesmo ? 'disabled title="Você não pode excluir o seu próprio usuário"' : ""}>Excluir</button>
            </div>
          </td>
        </tr>`;
    }).join("");

    return `
      <table class="tabela">
        <thead><tr><th>Nome</th><th>E-mail</th><th>Telefone</th><th>Setor</th><th>Perfil</th><th>Ações</th></tr></thead>
        <tbody>${linhas}</tbody>
      </table>`;
  }

  function desenhar(): void {
    pagina.innerHTML = `
      <div class="barra-acoes">
        <div>
          <h1>Gerenciamento de usuários</h1>
          <p class="descricao" style="margin:0;">Cadastro, edição e exclusão de usuários.</p>
        </div>
        ${formAberto ? "" : `<button class="btn-primary btn-novo" id="btn-novo">+ Novo usuário</button>`}
      </div>
      ${aviso ? `<div class="aviso ${aviso.ok ? "ok" : "erro"}">${esc(aviso.texto)}</div>` : ""}
      ${formAberto ? formulario() : ""}
      ${tabela()}`;
    aviso = null; // o aviso aparece uma vez só

    pagina.querySelector("#btn-novo")?.addEventListener("click", () => {
      editando = null;
      formAberto = true;
      desenhar();
    });

    pagina.querySelector("#btn-cancelar")?.addEventListener("click", () => {
      formAberto = false;
      editando = null;
      desenhar();
    });

    pagina.querySelector("#form-usuario")?.addEventListener("submit", salvar);

    // Um único ouvinte para todos os botões Editar/Excluir da tabela.
    pagina.querySelector(".tabela tbody")!.addEventListener("click", (e) => {
      const botao = (e.target as HTMLElement).closest<HTMLButtonElement>("button[data-acao]");
      if (!botao) return;
      const usuario = usuarios.find((u) => u.id_user === Number(botao.dataset.id));
      if (!usuario) return;

      if (botao.dataset.acao === "editar") {
        editando = usuario;
        formAberto = true;
        desenhar();
        pagina.querySelector("#form-usuario")?.scrollIntoView({ behavior: "smooth" });
      } else {
        void excluir(usuario);
      }
    });
  }

  async function salvar(e: Event): Promise<void> {
    e.preventDefault();
    const valor = (id: string) => pagina.querySelector<HTMLInputElement | HTMLSelectElement>(`#${id}`)!.value;
    const feedback = pagina.querySelector<HTMLElement>("#mensagem-feedback")!;

    const dados = {
      nome: valor("u-nome"),
      email: valor("u-email"),
      telefone: valor("u-telefone"),
      setorId: valor("u-setor") ? Number(valor("u-setor")) : null,
      perfil: valor("u-perfil") as Perfil,
      senha: valor("u-senha") || undefined,
    };

    try {
      const { mensagem } = editando
        ? await atualizarUsuario(editando.id_user, dados)
        : await criarUsuario(dados);
      formAberto = false;
      editando = null;
      aviso = { texto: mensagem, ok: true };
      await recarregar();
    } catch (erro) {
      // Mantém o formulário aberto com o que foi digitado e mostra o motivo.
      feedback.textContent = erro instanceof Error ? erro.message : "Erro ao salvar usuário.";
    }
  }

  async function excluir(usuario: UsuarioGerenciado): Promise<void> {
    if (!window.confirm(`Excluir o usuário "${usuario.nome}"? Esta ação não pode ser desfeita.`)) return;

    try {
      const { mensagem } = await excluirUsuario(usuario.id_user);
      aviso = { texto: mensagem, ok: true };
    } catch (erro) {
      aviso = { texto: erro instanceof Error ? erro.message : "Erro ao excluir usuário.", ok: false };
    }
    await recarregar();
  }

  desenhar();
}