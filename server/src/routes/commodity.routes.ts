import { Router } from 'express';
import { CommodityController } from '../controllers/commodity.controller.js';

export function createCommodityRouter(): { publicRouter: Router; adminRouter: Router } {
  const publicRouter = Router();
  const adminRouter = Router();
  const controller = new CommodityController();

  // Rota pública para a landing page (leitura com cache de 1h)
  publicRouter.get('/', controller.getRates);
  publicRouter.post('/refresh', controller.refreshRates);

  // Rota administrativa para forçar sincronização
  adminRouter.post('/refresh', controller.refreshRates);

  return { publicRouter, adminRouter };
}
