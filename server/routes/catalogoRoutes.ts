
import { Router, type RequestHandler } from "express";
import type { CatalogoController } from "../controllers/catalogoController.js";

export function criarCatalogoRoutes(
  controller: CatalogoController,
  exigirLogin: RequestHandler
): Router {
  const router = Router();

  // exigirLogin é aplicado rota a rota (e não com router.use) para não bloquear /api/usuarios/login
  router.get("/setores", exigirLogin, controller.setores);
  router.get("/categorias", exigirLogin, controller.categorias);

  return router;
}