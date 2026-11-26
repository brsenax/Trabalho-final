import { obterMeuResumo } from "../clients/chamadoApi";
import { mostrarErro } from "./helpers";

export async function renderRelatorios(pagina: HTMLElement): Promise<void> {
  pagina.innerHTML = `<p>Carregando...</p>`;

  try {
    const r = await obterMeuResumo();
    pagina.innerHTML = `
      <h1>Relatórios Gerais</h1>
      <p class="descricao">Estatísticas e consolidados das suas solicitações de manutenção.</p>

      <section class="cards">
        <article class="card"><p class="card-titulo">Total Registrado</p><p class="card-numero">${r.total}</p><p class="card-detalhe">Chamados no sistema</p></article>
        <article class="card"><p class="card-titulo">Alta e Urgente</p><p class="card-numero">${r.porPrioridade.ALTA + r.porPrioridade.URGENTE}</p><p class="card-detalhe">Requerem atenção urgente</p></article>
      </section>

      <h2 class="secao-titulo">Resumo por Prioridade</h2>
      <table class="tabela">
        <thead><tr><th>Prioridade</th><th>Quantidade</th></tr></thead>
        <tbody>
          <tr><td>Urgente</td><td>${r.porPrioridade.URGENTE}</td></tr>
          <tr><td>Alta</td><td>${r.porPrioridade.ALTA}</td></tr>
          <tr><td>Média</td><td>${r.porPrioridade.MEDIA}</td></tr>
          <tr><td>Baixa</td><td>${r.porPrioridade.BAIXA}</td></tr>
        </tbody>
      </table>`;
  } catch (erro) {
    mostrarErro(pagina, erro);
  }
}
