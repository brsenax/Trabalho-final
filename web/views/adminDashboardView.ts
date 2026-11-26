import { listarTodosChamados, obterResumoGeral } from "../clients/chamadoApi";
import { mostrarErro, tabelaChamados } from "./helpers";

const GRADE = 'style="grid-template-columns:repeat(auto-fit,minmax(170px,1fr));"';

export async function renderAdminDashboard(pagina: HTMLElement): Promise<void> {
  pagina.innerHTML = `<p>Carregando...</p>`;

  try {
    const [r, chamados] = await Promise.all([obterResumoGeral(), listarTodosChamados()]);
    const maisRecentesPrimeiro = [...chamados].reverse();

    pagina.innerHTML = `
      <h1>Dashboard</h1>
      <p class="descricao">Todos os chamados abertos no sistema e a situação de cada um.</p>

      <section class="cards" ${GRADE}>
        <article class="card"><p class="card-titulo">Total de chamados</p><p class="card-numero">${r.total}</p><p class="card-detalhe">Solicitações registradas</p></article>
        <article class="card"><p class="card-titulo">Abertos</p><p class="card-numero">${r.abertos}</p><p class="card-detalhe">Aguardando atendimento</p></article>
        <article class="card"><p class="card-titulo">Em atendimento</p><p class="card-numero">${r.emAtendimento}</p><p class="card-detalhe">Sendo atendidos</p></article>
        <article class="card"><p class="card-titulo">Aguardando peça</p><p class="card-numero">${r.aguardandoPeca}</p><p class="card-detalhe">Parados por material</p></article>
        <article class="card"><p class="card-titulo">Concluídos</p><p class="card-numero">${r.concluidos}</p><p class="card-detalhe">Serviços finalizados</p></article>
      </section>

      <section class="cards" ${GRADE}>
        <article class="card"><p class="card-titulo">Urgente</p><p class="card-numero">${r.porPrioridade.URGENTE}</p><p class="card-detalhe">Atender de imediato</p></article>
        <article class="card"><p class="card-titulo">Alta prioridade</p><p class="card-numero">${r.porPrioridade.ALTA}</p><p class="card-detalhe">Requerem atenção</p></article>
        <article class="card"><p class="card-titulo">Média prioridade</p><p class="card-numero">${r.porPrioridade.MEDIA}</p><p class="card-detalhe">Atendimento normal</p></article>
        <article class="card"><p class="card-titulo">Baixa prioridade</p><p class="card-numero">${r.porPrioridade.BAIXA}</p><p class="card-detalhe">Sem urgência</p></article>
      </section>

      <h2 class="secao-titulo">Todos os chamados</h2>
      ${tabelaChamados(maisRecentesPrimeiro, true)}`;
  } catch (erro) {
    mostrarErro(pagina, erro);
  }
}