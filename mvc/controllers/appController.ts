import { AuthService } from "../services/authService.js";
import { UsuarioRepository } from "../repositories/usuarioRepository.js";
import { mostrarLogin } from "../views/loginView.js";
import { mostrarPainel } from "../views/dashboardView.js";

const authService = new AuthService(new UsuarioRepository());

export function iniciarAplicacao(app: HTMLElement): void {
  mostrarLogin(app);

  const formulario = document.querySelector("#form-login") as HTMLFormElement | null;
  if (!formulario) return;

  formulario.addEventListener("submit", (evento: SubmitEvent) => {
    evento.preventDefault();

    const inputUsuario = document.querySelector("#usuario") as HTMLInputElement | null;
    const inputSenha = document.querySelector("#senha") as HTMLInputElement | null;
    const mensagemErro = document.querySelector("#mensagem-erro") as HTMLElement | null;

    const email = inputUsuario?.value ?? "";
    const senha = inputSenha?.value ?? "";
    const usuario = authService.autenticar(email, senha);

    if (usuario) {
      mostrarPainel(app, usuario.nome);
      configurarBotaoSair(app);
    } else if (mensagemErro) {
      mensagemErro.textContent = "Usuário ou senha incorretos.";
    }
  });
}

function configurarBotaoSair(app: HTMLElement): void {
  const botaoSair = document.querySelector("#botao-sair") as HTMLButtonElement | null;

  botaoSair?.addEventListener("click", () => iniciarAplicacao(app));
}
