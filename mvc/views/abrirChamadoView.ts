import { Chamado } from "../../src/entities/chamado.js";
import { ChamadoRepository } from "../repositories/chamadoRepository.js";

export function mostrarAbrirChamado(app: HTMLElement, nomeUsuario: string): void {
  app.innerHTML = `
    <div class="layout">
      <aside class="sidebar">
        <div class="marca"><span class="marca-icone">M</span> Manutenção</div>
        <p class="menu-titulo">Menu principal</p>
        <nav class="menu">
          <a href="#">Visão geral</a>
          <a href="#">Meus chamados</a>
          <a class="ativo" href="#">Abrir chamado</a>
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
          <h1>Abrir Chamado</h1>
          <p class="descricao">Preencha os dados abaixo para registrar uma nova solicitação de manutenção.</p>

          <div class="login-card" style="max-width: 600px; margin: 0;">
            <form id="form-chamado">
              <div class="form-group">
                <label for="problema">Descrição do Problema</label>
                <input type="text" id="problema" placeholder="Ex: Computador não liga / Impressora sem papel" required />
              </div>

              <div class="form-group">
                <label for="setor">Setor</label>
                <input type="text" id="setor" placeholder="Ex: Administrativo, Financeiro, Recepção" required />
              </div>

              <button type="submit" class="btn-primary">Cadastrar Chamado</button>
            </form>
            <p id="mensagem-feedback" style="color: #16a34a; display: none; margin-top: 15px;">Chamado cadastrado com sucesso!</p>
          </div>
        </main>
      </section>
    </div>
  `;

  // === Lógica de POO e Persistência ao enviar o formulário ===
  const form = document.getElementById("form-chamado") as HTMLFormElement;
  const inputProblema = document.getElementById("problema") as HTMLInputElement;
  const inputSetor = document.getElementById("setor") as HTMLInputElement;
  const mensagemFeedback = document.getElementById("mensagem-feedback") as HTMLElement;
  const repo = new ChamadoRepository();
  const totalAtual = repo.listar().length;
  const proximoId = totalAtual + 1;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const repo = new ChamadoRepository();

    const novoChamado = new Chamado(
      `${inputProblema.value} (Setor: ${inputSetor.value})`,
      proximoId,                                           
      "Média",                                              
      new Date()                                            
    );

  
    repo.salvar(novoChamado); //salva no repositorio em memoria

    mensagemFeedback.style.display = "block";
    form.reset();

    setTimeout(() => {
      mensagemFeedback.style.display = "none";
    }, 3000);
  });
}