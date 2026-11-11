import { validarUsuario } from "../models/usuarioModel.js";
import { mostrarLogin } from "../views/loginView.js";
import { mostrarPainel } from "../views/dashboardView.js";

// Controller: decide qual tela mostrar e reage ao envio do formulário.
export function iniciarAplicacao(app) {
  mostrarLogin(app);

  const formulario = document.querySelector("#form-login");

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const usuario = document.querySelector("#usuario").value.trim();
    const senha = document.querySelector("#senha").value;
    const acessoPermitido = validarUsuario(usuario, senha);

    if (acessoPermitido) {
      mostrarPainel(app, usuario);
      configurarBotaoSair(app);
    } else {
      document.querySelector("#mensagem-erro").textContent =
        "Usuário ou senha incorretos.";
    }
  });
}

function configurarBotaoSair(app) {
  document.querySelector("#botao-sair").addEventListener("click", () => {
    mostrarLogin(app);
    iniciarAplicacao(app);
  });
}
