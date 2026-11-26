import { Router, type RequestHandler } from "express";
import type { UsuarioController } from "../controllers/usuarioController.js";

export function criarUsuarioRoutes(
  controller: UsuarioController,
  exigirLogin: RequestHandler,
  exigirAdmin: RequestHandler
): Router {
  const router = Router();

  router.post("/login", controller.login);
  router.post("/recuperar-senha", controller.recuperarSenha);

  router.get("/", exigirLogin, exigirAdmin, controller.listar);
  router.post("/", exigirLogin, exigirAdmin, controller.criar);
  router.put("/:id", exigirLogin, exigirAdmin, controller.atualizar);
  router.delete("/:id", exigirLogin, exigirAdmin, controller.excluir);

  return router;
}