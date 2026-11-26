import { listarMeusChamados, obterMeuResumo } from "../clients/chamadoApi";
import { mostrarErro, tabelaChamados } from "./helpers";

export async function renderVisaoGeral(pagina: HTMLElement): Promise<void> {
  pagina.innerHTML = `<p>Carregando...</p>`;

  try {
    const [resumo, chamados] = await Promise.all([obterMeuResumo(), listarMeusChamados()]);
    const recentes = [...chamados].reverse().slice(0, 10);

    pagina.innerHTML = `
      <h1>Visão geral</h1>
      <p class="descricao">Acompanhe as suas solicitações de manutenção.</p>

      <section class="cards">
        <article class="card"><p class="card-titulo">Total de chamados</p><p class="card-numero">${resumo.total}</p><p class="card-detalhe">Solicitações registradas</p></article>
        <article class="card"><p class="card-titulo">Em aberto</p><p class="card-numero">${resumo.abertos + resumo.emAndamento}</p><p class="card-detalhe">Precisam de atenção</p></article>
        <article class="card"><p class="card-titulo">Concluídos</p><p class="card-numero">${resumo.concluidos}</p><p class="card-detalhe">Serviços finalizados</p></article>
      </section>

      <h2 class="secao-titulo">Chamados recentes</h2>
      ${tabelaChamados(recentes)}`;
  } catch (erro) {
    mostrarErro(pagina, erro);
  }
}
