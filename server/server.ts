import "dotenv/config"; // precisa ser o primeiro import: carrega o .env antes do resto
import { criarApp } from "./app.js";
import { pool } from "./database/connection.js";
import { PORTA } from "./config.js";

// Falha logo na subida se o banco estiver inacessível, em vez de falhar na primeira requisição.
try {
  await pool.query("SELECT 1");
  console.log("Conectado ao MySQL.");
} catch (erro) {
  console.error("Não foi possível conectar ao MySQL. Confira o arquivo .env.", erro);
  process.exit(1);
}

criarApp().listen(PORTA, () => {
  console.log(`Servidor backend rodando na porta ${PORTA}`);
});