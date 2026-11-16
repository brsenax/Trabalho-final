// View: monta a tela principal. Os chamados abaixo são exemplos visuais.
export function mostrarPainel(app: HTMLElement, nomeUsuario: string): void {
  app.innerHTML = `
    <div class="layout">
      <aside class="sidebar">
        <div class="marca"><span class="marca-icone">M</span> Manutenção</div>
        <p class="menu-titulo">Menu principal</p>
        <nav class="menu">
          <a class="ativo" href="#">Visão geral</a>
          <a href="#">Meus chamados</a>
          <a href="#">Abrir chamado</a>
          <a href="#">Relatórios</a>
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
          <h1>Visão geral</h1>
          <p class="descricao">Acompanhe as solicitações de manutenção.</p>

          <section class="cards">
            <article class="card">
              <p class="card-titulo">Total de chamados</p>
              <p class="card-numero">24</p>
              <p class="card-detalhe">Solicitações registradas</p>
            </article>
            <article class="card">
              <p class="card-titulo">Em andamento</p>
              <p class="card-numero">08</p>
              <p class="card-detalhe">Precisam de atenção</p>
            </article>
            <article class="card">
              <p class="card-titulo">Concluídos</p>
              <p class="card-numero">16</p>
              <p class="card-detalhe">Serviços finalizados</p>
            </article>
          </section>

          <h2 class="secao-titulo">Chamados recentes</h2>
          <table class="tabela">
            <thead>
              <tr><th>Nº</th><th>Solicitante</th><th>Problema</th><th>Setor</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr><td>#001</td><td>Maria Silva</td><td>Computador não liga</td><td>Administrativo</td><td><span class="status">Em andamento</span></td></tr>
              <tr><td>#002</td><td>João Santos</td><td>Problema na impressora</td><td>Financeiro</td><td><span class="status">Em andamento</span></td></tr>
              <tr><td>#003</td><td>Ana Costa</td><td>Instalação de programa</td><td>Recepção</td><td><span class="status">Em andamento</span></td></tr>
            </tbody>
          </table>
        </main>
      </section>
    </div>
  `;
}