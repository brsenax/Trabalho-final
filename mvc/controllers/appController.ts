import { initLoginView } from "../views/loginView.js";
import { mostrarPainel } from "../views/dashboardView.js";

export function iniciarAplicacao(app: HTMLElement): void {
  // Verifica se já existe um usuário logado
  const usuarioLogadoStr = localStorage.getItem("usuarioLogado");

  if (usuarioLogadoStr) {
    const usuario = JSON.parse(usuarioLogadoStr);
    mostrarPainel(app, usuario.nome);
    configurarBotaoSair(app);
  } else {
    // Apenas inicializa os eventos da tela de login que já está no index.html
    initLoginView();
  }
}

function configurarBotaoSair(app: HTMLElement): void {
  const botaoSair = document.querySelector("#botao-sair") as HTMLButtonElement | null;

  botaoSair?.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    window.location.reload();
  });
}