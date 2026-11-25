import { listarMeusChamados } from "../clients/chamadoApi";
import { mostrarErro, tabelaChamados } from "./helpers";

export async function renderMeusChamados(pagina: HTMLElement): Promise<void> {
  pagina.innerHTML = `<p>Carregando...</p>`;

  try {
    const chamados = await listarMeusChamados();
    pagina.innerHTML = `
      <h1>Meus Chamados</h1>
      <p class="descricao">Solicitações abertas por você.</p>
      ${tabelaChamados(chamados)}`;
  } catch (erro) {
    mostrarErro(pagina, erro);
  }
}
