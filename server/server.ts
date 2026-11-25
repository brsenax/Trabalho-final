import { criarApp } from "./app.js";
import { PORTA } from "./config.js";

criarApp().listen(PORTA, () => {
  console.log(`Servidor backend rodando na porta ${PORTA}`);
});
