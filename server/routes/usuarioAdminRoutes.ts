import { Router, type RequestHandler } from "express";
import type { UsuarioAdminController } from "../controllers/usuarioAdminController.js";

export function criarUsuarioAdminRoutes(
  controller: UsuarioAdminController,
  exigirLogin: RequestHandler,
  exigirAdmin: RequestHandler
): Router {
  const router = Router();

  router.use(exigirLogin, exigirAdmin); // tudo aqui é só para administrador

  router.get("/", controller.listar);
  router.post("/", controller.criar);
  router.put("/:id", controller.atualizar);
  router.delete("/:id", controller.excluir);

  return router;
}