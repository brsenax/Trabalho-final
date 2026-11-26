import { initLoginView } from "./views/loginView.js";
import { iniciarAplicacao } from "./controllers/appController.js";

// Ponto de entrada da aplicação
document.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector("#app") as HTMLElement | null;

  if (app) {
    iniciarAplicacao(app);
  } else {
    // Fallback de segurança: inicializa a view de login diretamente caso o #app não exista no HTML
    initLoginView();
  }
});