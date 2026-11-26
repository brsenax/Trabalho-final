import { ChamadoRepository } from "../repositories/chamadoRepository.js";

export function mostrarMeusChamados(app: HTMLElement, nomeUsuario: string): void {
  const repo = new ChamadoRepository();
  const todosOsChamados = repo.listar();

  app.innerHTML = `
    <div class="layout">
      <aside class="sidebar">
        <div class="marca"><span class="marca-icone">M</span> Manutenção</div>
        <p class="menu-titulo">Menu principal</p>
        <nav class="menu">
          <a href="#">Visão geral</a>
          <a class="ativo" href="#">Meus chamados</a>
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
          <h1>Meus Chamados</h1>
          <p class="descricao">Lista de todas as solicitações registradas no sistema.</p>

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
                      <td>#${c.id}</td>
                      <td>${c.descricao}</td>
                      <td>${c.prioridade}</td>
                      <td>${c.obterDataFormatada()}</td>
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