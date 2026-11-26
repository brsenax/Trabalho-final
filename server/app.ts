import express from "express";
import cors from "cors";

import { UsuarioRepositoryMysql } from "./repositories/usuarioRepositoryMysql.js";
import { ChamadoRepositoryMysql } from "./repositories/chamadoRepositoryMysql.js";
import { AuthService } from "./services/authService.js";
import { ChamadoService } from "./services/chamadoService.js";
import { UsuarioController } from "./controllers/usuarioController.js";
import { ChamadoController } from "./controllers/chamadoController.js";
import { criarUsuarioRoutes } from "./routes/usuarioRoutes.js";
import { criarChamadoRoutes } from "./routes/chamadoRoutes.js";
import { exigirAdmin, exigirLogin } from "./middlewares/authMiddleware.js";
import { tratarErros } from "./middlewares/tratarErros.js";

export function criarApp() {
  const usuarioRepository = new UsuarioRepositoryMysql();
  const chamadoRepository = new ChamadoRepositoryMysql();

  const authService = new AuthService(usuarioRepository);
  const chamadoService = new ChamadoService(chamadoRepository, usuarioRepository);

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use(
    "/api/usuarios",
    criarUsuarioRoutes(new UsuarioController(authService), exigirLogin(authService), exigirAdmin)
  );
  app.use(
    "/api/chamados",
    criarChamadoRoutes(new ChamadoController(chamadoService), exigirLogin(authService), exigirAdmin)
  );

  app.use(tratarErros);
  return app;
}