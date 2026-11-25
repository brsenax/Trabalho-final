import { Router } from "express";
import type { UsuarioController } from "../controllers/usuarioController.js";

export function criarUsuarioRoutes(controller: UsuarioController): Router {
  const router = Router();

  router.post("/login", controller.login);
  router.post("/recuperar-senha", controller.recuperarSenha);

  return router;
}
