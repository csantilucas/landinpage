import { Router } from 'express';
import { ContentController } from '../controllers/content.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';

export function createContentRouter(): { publicRouter: Router; adminRouter: Router } {
  const publicRouter = Router();
  const adminRouter = Router();
  const controller = new ContentController();

  // Rotas Públicas
  publicRouter.get('/', controller.getAll);
  publicRouter.get('/:key', controller.getByKey);

  // Rotas Administrativas (Protegidas)
  adminRouter.use(authMiddleware, adminMiddleware);
  adminRouter.put('/:key', controller.update);

  return { publicRouter, adminRouter };
}
