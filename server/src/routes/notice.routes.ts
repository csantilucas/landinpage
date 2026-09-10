import { Router } from 'express';
import { NoticeController } from '../controllers/notice.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';

export function createNoticeRouter(): { publicRouter: Router; adminRouter: Router } {
  const publicRouter = Router();
  const adminRouter = Router();
  const controller = new NoticeController();

  // Rotas Públicas
  publicRouter.get('/active', controller.getActive);
  publicRouter.get('/:id', controller.getById);

  // Rotas Administrativas (Protegidas)
  adminRouter.use(authMiddleware, adminMiddleware);
  adminRouter.get('/', controller.getAll);
  adminRouter.get('/:id', controller.getById);
  adminRouter.post('/', controller.create);
  adminRouter.put('/:id', controller.update);
  adminRouter.delete('/:id', controller.delete);
  adminRouter.patch('/:id/toggle', controller.toggle);

  return { publicRouter, adminRouter };
}
