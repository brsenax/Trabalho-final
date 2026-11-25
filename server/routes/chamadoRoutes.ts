import { Router, type RequestHandler } from "express";
import type { ChamadoController } from "../controllers/chamadoController.js";

export function criarChamadoRoutes(
  controller: ChamadoController,
  exigirLogin: RequestHandler,
  exigirAdmin: RequestHandler
): Router {
  const router = Router();

  router.use(exigirLogin); 

  router.get("/meus", controller.listarMeus);
  router.get("/meus/resumo", controller.resumoMeus);
  router.post("/", controller.criar);

  router.get("/", exigirAdmin, controller.listarTodos);
  router.get("/resumo", exigirAdmin, controller.resumoGeral);

  return router;
}
