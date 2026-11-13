import { validarUsuario } from "../model/usuarioModel.js";
import { mostrarLogin } from "../views/loginView.js";
import { mostrarPainel } from "../views/dashboardView.js";

// Controller: decide qual tela mostrar e reage ao envio do formulário.
export function iniciarAplicacao(app: HTMLElement): void {
  mostrarLogin(app);

  const formulario = document.querySelector("#form-login") as HTMLFormElement | null;

  if (!formulario) return;

  formulario.addEventListener("submit", (evento: SubmitEvent) => {
    evento.preventDefault();

    const inputUsuario = document.querySelector("#usuario") as HTMLInputElement | null;
    const inputSenha = document.querySelector("#senha") as HTMLInputElement | null;
    const mensagemErro = document.querySelector("#mensagem-erro") as HTMLElement | null;

    const usuario = inputUsuario ? inputUsuario.value.trim() : "";
    const senha = inputSenha ? inputSenha.value : "";
    
    const acessoPermitido = validarUsuario(usuario, senha);

    if (acessoPermitido) {
      mostrarPainel(app, usuario);
      configurarBotaoSair(app);
    } else if (mensagemErro) {
      mensagemErro.textContent = "Usuário ou senha incorretos.";
    }
  });
}

function configurarBotaoSair(app: HTMLElement): void {
  const botaoSair = document.querySelector("#botao-sair") as HTMLElement | null;

  if (botaoSair) {
    botaoSair.addEventListener("click", () => {
      mostrarLogin(app);
      iniciarAplicacao(app);
    });
  }
}