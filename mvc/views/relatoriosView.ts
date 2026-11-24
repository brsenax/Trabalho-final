import { ChamadoRepository } from "../repositories/chamadoRepository.js";

export function mostrarRelatorios(app: HTMLElement, nomeUsuario: string): void {
  const repo = new ChamadoRepository();
  const todosOsChamados = repo.listar();

  const totalGeral = todosOsChamados.length;
  const altaPrioridade = todosOsChamados.filter(c => c.prioridade === "Alta").length;
  const mediaPrioridade = todosOsChamados.filter(c => c.prioridade === "Média").length;
  const baixaPrioridade = todosOsChamados.filter(c => c.prioridade === "Baixa").length;

  app.innerHTML = `
    <div class="layout">
      <aside class="sidebar">
        <div class="marca"><span class="marca-icone">M</span> Manutenção</div>
        <p class="menu-titulo">Menu principal</p>
        <nav class="menu">
          <a href="#">Visão geral</a>
          <a href="#">Meus chamados</a>
          <a href="#">Abrir chamado</a>
          <a class="ativo" href="#">Relatórios</a>
        </nav>
      </aside>

      <section class="conteudo">
        <header class="topo">
          <strong>Painel de controle</strong>
          <div>
            <span class="usuario">Olá, ${nomeUsuario}</span>
            <button class="sair" id="botao-sair">Sair</button>
          </div>
        </header>

        <main class="pagina">
          <h1>Relatórios Gerais</h1>
          <p class="descricao">Visualizar estatísticas e consolidados das solicitações de manutenção.</p>

          <section class="cards">
            <article class="card">
              <p class="card-titulo">Total Registrado</p>
              <p class="card-numero">${totalGeral}</p>
              <p class="card-detalhe">Chamados no sistema</p>
            </article>
            <article class="card">
              <p class="card-titulo">Alta Prioridade</p>
              <p class="card-numero">${altaPrioridade}</p>
              <p class="card-detalhe">Requerem atenção urgente</p>
            </article>
          </section>

          <h2 class="secao-titulo">Resumo por Prioridade</h2>
          <table class="tabela">
            <thead>
              <tr><th>Prioridade</th><th>Quantidade</th></tr>
            </thead>
            <tbody>
              <tr><td>Alta</td><td>${altaPrioridade}</td></tr>
              <tr><td>Média</td><td>${mediaPrioridade}</td></tr>
              <tr><td>Baixa</td><td>${baixaPrioridade}</td></tr>
            </tbody>
          </table>
        </main>
      </section>
    </div>
  `;
}