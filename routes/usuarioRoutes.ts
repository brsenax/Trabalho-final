import { Router } from "express";
import { fazerLogin, recuperarSenha } from "../mvc/controllers/usuarioController.js";

const usuarioRoutes = Router();

usuarioRoutes.post("/login", fazerLogin);
usuarioRoutes.post("/recuperar-senha", recuperarSenha);

export default usuarioRoutes;