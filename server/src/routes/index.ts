import { Router } from 'express';
import { toNodeHandler } from 'better-auth/node';
import { getAuth } from '../auth/better-auth.js';
import { createNoticeRouter } from './notice.routes.js';
import { createFleetRouter } from './fleet.routes.js';
import { createContentRouter } from './content.routes.js';
import { createCommodityRouter } from './commodity.routes.js';
import { loginRateLimiter } from '../middlewares/rate-limit.middleware.js';

export function createMainRouter(): Router {
  const router = Router();
  const auth = getAuth();

  // Rate limiter para proteção contra força bruta em tentativas de login
  router.post('/auth/sign-in/*', loginRateLimiter);
  router.post('/auth/sign-in', loginRateLimiter);

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
  const { publicRouter: commodityPublic, adminRouter: commodityAdmin } = createCommodityRouter();

  // Rotas Públicas
  router.use('/notices', noticePublic);
  router.use('/fleet', fleetPublic);
  router.use('/content', contentPublic);
  router.use('/commodities', commodityPublic);

  // Rotas Administrativas (Protegidas por authMiddleware + adminMiddleware)
  router.use('/admin/notices', noticeAdmin);
  router.use('/admin/fleet', fleetAdmin);
  router.use('/admin/content', contentAdmin);
  router.use('/admin/commodities', commodityAdmin);

  return router;
}
