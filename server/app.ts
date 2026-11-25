import express from "express";
import cors from "cors";

import { UsuarioRepositoryMemoria } from "./repositories/usuarioRepositoryMemoria.js";
import { ChamadoRepositoryMemoria } from "./repositories/chamadoRepositoryMemoria.js";
import { AuthService } from "./services/authService.js";
import { ChamadoService } from "./services/chamadoService.js";
import { UsuarioController } from "./controllers/usuarioController.js";
import { ChamadoController } from "./controllers/chamadoController.js";
import { criarUsuarioRoutes } from "./routes/usuarioRoutes.js";
import { criarChamadoRoutes } from "./routes/chamadoRoutes.js";
import { exigirAdmin, exigirLogin } from "./middlewares/authMiddleware.js";
import { tratarErros } from "./middlewares/tratarErros.js";

//se troca memoria por mysql aqui
export function criarApp() {
  const usuarioRepository = new UsuarioRepositoryMemoria();
  const chamadoRepository = new ChamadoRepositoryMemoria();

  const authService = new AuthService(usuarioRepository);
  const chamadoService = new ChamadoService(chamadoRepository, usuarioRepository);

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/api/usuarios", criarUsuarioRoutes(new UsuarioController(authService)));
  app.use(
    "/api/chamados",
    criarChamadoRoutes(new ChamadoController(chamadoService), exigirLogin(authService), exigirAdmin)
  );

  app.use(tratarErros);
  return app;
}
