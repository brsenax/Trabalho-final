import { criarChamado } from "../clients/chamadoApi";
import { listarCategorias, listarSetores } from "../clients/catalogoApi";
import { esc, mostrarErro } from "./helpers";
import { ROTULO_PRIORIDADE } from "../rotulos";
import type { OpcaoLista, Prioridade } from "../types";

const opcoes = (lista: OpcaoLista[]) =>
  lista.map((o) => `<option value="${o.id}">${esc(o.nome)}</option>`).join("");

export async function renderAbrirChamado(pagina: HTMLElement): Promise<void> {
  pagina.innerHTML = `<p>Carregando...</p>`;

  // Setores e categorias vêm do banco, para o formulário nunca ter uma opção que não existe.
  let setores: OpcaoLista[], categorias: OpcaoLista[];
  try {
    [setores, categorias] = await Promise.all([listarSetores(), listarCategorias()]);
  } catch (erro) {
    return mostrarErro(pagina, erro);
  }

  pagina.innerHTML = `
    <h1>Abrir Chamado</h1>
    <p class="descricao">Preencha os dados abaixo para registrar uma nova solicitação de manutenção.</p>

    <div class="login-card" style="max-width:600px;margin:0;">
      <form id="form-chamado">
        <div class="form-group">
          <label for="titulo">Título</label>
          <input type="text" id="titulo" maxlength="120" placeholder="Ex: Computador não liga" required />
        </div>
        <div class="form-group">
          <label for="descricao">Descrição do problema</label>
          <textarea id="descricao" rows="4" placeholder="Descreva o que está acontecendo" required></textarea>
        </div>
        <div class="form-group">
          <label for="setor">Setor</label>
          <select id="setor" required><option value="">Selecione...</option>${opcoes(setores)}</select>
        </div>
        <div class="form-group">
          <label for="categoria">Categoria</label>
          <select id="categoria" required><option value="">Selecione...</option>${opcoes(categorias)}</select>
        </div>
        <div class="form-group">
          <label for="prioridade">Prioridade</label>
          <select id="prioridade">
            ${(Object.keys(ROTULO_PRIORIDADE) as Prioridade[])
              .map((p) => `<option value="${p}" ${p === "MEDIA" ? "selected" : ""}>${ROTULO_PRIORIDADE[p]}</option>`).join("")}
          </select>
        </div>
        <button type="submit" class="btn-primary">Cadastrar Chamado</button>
      </form>
      <p id="mensagem-feedback" style="display:none;margin-top:15px;"></p>
    </div>`;

  const form = pagina.querySelector<HTMLFormElement>("#form-chamado")!;
  const feedback = pagina.querySelector<HTMLElement>("#mensagem-feedback")!;
  const campo = (id: string) => pagina.querySelector<HTMLInputElement>(`#${id}`)!;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      // O frontend só envia os dados; quem valida, calcula o prazo e grava é o servidor.
      const { mensagem } = await criarChamado({
        titulo: campo("titulo").value,
        descricao: campo("descricao").value,
        setorId: Number(campo("setor").value),
        categoriaId: Number(campo("categoria").value),
        prioridade: campo("prioridade").value as Prioridade,
      });
      feedback.style.color = "#16a34a";
      feedback.textContent = mensagem;
      form.reset();
    } catch (erro) {
      feedback.style.color = "#dc2626";
      feedback.textContent = erro instanceof Error ? erro.message : "Erro ao cadastrar chamado.";
    }

    feedback.style.display = "block";
    setTimeout(() => (feedback.style.display = "none"), 3000);
  });
}