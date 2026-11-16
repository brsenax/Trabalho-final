import { iniciarAplicacao } from "./controllers/appController.js";

// Ponto de entrada: encontra a área principal e inicia o sistema.
const app = document.querySelector("#app") as HTMLElement | null;

if (app) {
  iniciarAplicacao(app);
} else {
  console.error("Elemento principal #app não foi encontrado no DOM.");
}