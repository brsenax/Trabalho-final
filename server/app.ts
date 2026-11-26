import express from "express";
import cors from "cors";

import { UsuarioRepositoryMysql } from "./repositories/usuarioRepositoryMysql.js";
import { ChamadoRepositoryMysql } from "./repositories/chamadoRepositoryMysql.js";
import { SetorRepositoryMysql } from "./repositories/setorRepositoryMysql.js";
import { CategoriaRepositoryMysql } from "./repositories/categoriaRepositoryMysql.js";
import { AuthService } from "./services/authService.js";
import { ChamadoService } from "./services/chamadoService.js";
import { CatalogoService } from "./services/catalogoService.js";
import { UsuarioController } from "./controllers/usuarioController.js";
import { ChamadoController } from "./controllers/chamadoController.js";
import { CatalogoController } from "./controllers/catalogoController.js";
import { criarUsuarioRoutes } from "./routes/usuarioRoutes.js";
import { criarChamadoRoutes } from "./routes/chamadoRoutes.js";
import { criarCatalogoRoutes } from "./routes/catalogoRoutes.js";
import { exigirAdmin, exigirLogin } from "./middlewares/authMiddleware.js";
import { tratarErros } from "./middlewares/tratarErros.js";

/**
 * Raiz de composição: é o único lugar que decide qual Repository concreto
 * cada Service recebe. Aqui todos são a versão MySQL.
 */
export function criarApp() {
  const usuarioRepository = new UsuarioRepositoryMysql();
  const chamadoRepository = new ChamadoRepositoryMysql();
  const setorRepository = new SetorRepositoryMysql();
  const categoriaRepository = new CategoriaRepositoryMysql();

  const authService = new AuthService(usuarioRepository);
  const chamadoService = new ChamadoService(chamadoRepository, setorRepository, categoriaRepository);
  const catalogoService = new CatalogoService(setorRepository, categoriaRepository);

  const app = express();
  app.use(cors());
  app.use(express.json());

  const login = exigirLogin(authService);

  app.use("/api/usuarios", criarUsuarioRoutes(new UsuarioController(authService)));
  app.use("/api/chamados", criarChamadoRoutes(new ChamadoController(chamadoService), login, exigirAdmin));
  app.use("/api", criarCatalogoRoutes(new CatalogoController(catalogoService), login));

  app.use(tratarErros);
  return app;
}