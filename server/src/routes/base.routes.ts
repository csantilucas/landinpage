import { Router } from 'express';
import { BaseController } from '../controllers/base.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';

export function createBaseRouter(): { publicRouter: Router; adminRouter: Router } {
  const publicRouter = Router();
  const adminRouter = Router();
  const controller = new BaseController();

  // Rotas Públicas
  publicRouter.get('/', controller.getActive);
  publicRouter.get('/:id', controller.getById);

  // Rotas Administrativas (Protegidas)
  adminRouter.use(authMiddleware, adminMiddleware);
  adminRouter.get('/', controller.getAll);
  adminRouter.get('/:id', controller.getById);
  adminRouter.post('/', controller.create);
  adminRouter.put('/:id', controller.update);
  adminRouter.delete('/:id', controller.delete);

  return { publicRouter, adminRouter };
}
