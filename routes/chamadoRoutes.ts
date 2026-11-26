import { Router } from 'express';
import { listarChamados, criarChamado } from '../mvc/controllers/chamadoControllers.js';

const router = Router();

router.get('/chamados', listarChamados);
router.post('/chamados', criarChamado);

export default router;