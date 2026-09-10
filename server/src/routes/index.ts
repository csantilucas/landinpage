import { Router } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { getAuth } from '../auth/better-auth.js';
import { createNoticeRouter } from './notice.routes.js';
import { createFleetRouter } from './fleet.routes.js';
import { createContentRouter } from './content.routes.js';

export function createMainRouter(): Router {
  const router = Router();
  const auth = getAuth();

  // Rota de Autenticação do Better Auth (login, logout, session, etc.)
  router.all('/auth/*', toNodeHandler(auth));

  // Rota de Healthcheck
  router.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'TRR Krupinski API',
      timestamp: new Date().toISOString(),
    });
  });

  // Instancia roteadores por módulo
  const { publicRouter: noticePublic, adminRouter: noticeAdmin } = createNoticeRouter();
  const { publicRouter: fleetPublic, adminRouter: fleetAdmin } = createFleetRouter();
  const { publicRouter: contentPublic, adminRouter: contentAdmin } = createContentRouter();

  // Rotas Públicas
  router.use('/notices', noticePublic);
  router.use('/fleet', fleetPublic);
  router.use('/content', contentPublic);

  // Rotas Administrativas (Protegidas por authMiddleware + adminMiddleware)
  router.use('/admin/notices', noticeAdmin);
  router.use('/admin/fleet', fleetAdmin);
  router.use('/admin/content', contentAdmin);

  return router;
}
