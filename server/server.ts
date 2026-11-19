import express from "express";
import cors from "cors";
import usuarioRoutes from "../routes/usuarioRoutes.js";
import chamadoRoutes from "../routes/chamadoRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Registrando as rotas da API
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/chamados", chamadoRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});