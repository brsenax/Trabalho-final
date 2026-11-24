import { initLoginView } from "../views/loginView.js";
import { mostrarPainel } from "../views/dashboardView.js";
import { mostrarMeusChamados } from "../views/meusChamadosView.js";
import { mostrarAbrirChamado } from "../views/abrirChamadoView.js";
import { mostrarRelatorios } from "../views/relatoriosView.js"; // <-- Importe a nova view de relatórios

export function iniciarAplicacao(app: HTMLElement): void {
  const usuarioLogadoStr = localStorage.getItem("usuarioLogado");

  if (usuarioLogadoStr) {
    const usuario = JSON.parse(usuarioLogadoStr);
    mostrarPainel(app, usuario.nome);
    configurarEventosPainel(app, usuario.nome);
  } else {
    initLoginView();
  }
}

function configurarEventosPainel(app: HTMLElement, nomeUsuario: string): void {
  const botaoSair = document.querySelector("#botao-sair") as HTMLButtonElement | null;
  botaoSair?.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    window.location.reload();
  });

  const linksMenu = document.querySelectorAll(".menu a");

  linksMenu.forEach((link) => {
    link.addEventListener("click", (evento) => {
      evento.preventDefault();
      const textoMenu = link.textContent?.trim();

      if (textoMenu === "Visão geral") {
        mostrarPainel(app, nomeUsuario);
        configurarEventosPainel(app, nomeUsuario);
      } else if (textoMenu === "Meus chamados") {
        mostrarMeusChamados(app, nomeUsuario);
        configurarEventosPainel(app, nomeUsuario);
      } else if (textoMenu === "Abrir chamado") {
        mostrarAbrirChamado(app, nomeUsuario);
        configurarEventosPainel(app, nomeUsuario);

        const formChamado = document.querySelector("#form-chamado") as HTMLFormElement | null;
        const msgFeedback = document.querySelector("#mensagem-feedback") as HTMLElement | null;

        formChamado?.addEventListener("submit", (e) => {
          e.preventDefault();
          if (msgFeedback) {
            msgFeedback.style.display = "block";
            setTimeout(() => {
              formChamado.reset();
              msgFeedback.style.display = "none";
            }, 2500);
          }
        });
      } else if (textoMenu === "Relatórios") {
        mostrarRelatorios(app, nomeUsuario);
        configurarEventosPainel(app, nomeUsuario);
      }
    });
  });
}