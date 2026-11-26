import { ChamadoRepository } from "../repositories/chamadoRepository.js";

export function mostrarPainel(app: HTMLElement, nomeUsuario: string): void {
  const repo = new ChamadoRepository();
  const todosOsChamados = repo.listar();

  const totalChamados = todosOsChamados.length;
  const emAndamento = todosOsChamados.filter(c => c.prioridade === "Alta" || c.prioridade === "Média").length; 
  const concluidos = 0; 

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
              <p class="card-numero">${totalChamados}</p>
              <p class="card-detalhe">Solicitações registradas</p>
            </article>
            <article class="card">
              <p class="card-titulo">Em andamento</p>
              <p class="card-numero">${emAndamento}</p>
              <p class="card-detalhe">Precisam de atenção</p>
            </article>
            <article class="card">
              <p class="card-titulo">Concluídos</p>
              <p class="card-numero">${concluidos}</p>
              <p class="card-detalhe">Serviços finalizados</p>
            </article>
          </section>

          <h2 class="secao-titulo">Chamados recentes</h2>
          <table class="tabela">
            <thead>
              <tr><th>Nº</th><th>Descrição</th><th>Prioridade</th><th>Data</th></tr>
            </thead>
            <tbody>
              ${
                todosOsChamados.length === 0 
                ? `<tr><td colspan="4" style="text-align: center; color: #64748b; padding: 20px;">Nenhum chamado cadastrado ainda.</td></tr>`
                : todosOsChamados.map(c => `
                    <tr>
                      <td>#${String(c.id).padStart(4, '0')}</td>
                      <td>${c.descricao}</td>
                      <td>${c.prioridade}</td>
                      <td>${c.obterDataFormatada ? c.obterDataFormatada() : c.data_abertura}</td>
                    </tr>
                  `).join("")
              }
            </tbody>
          </table>
        </main>
      </section>
    </div>
  `;
}