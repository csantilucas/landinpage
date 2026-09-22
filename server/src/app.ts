import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { getAllowedOrigins } from './config/env.js';
import { getAuth } from './auth/better-auth.js';
import { toNodeHandler } from 'better-auth/node';
import { authLimiter, apiLimiter } from './middlewares/rate-limit.middleware.js';
import { preventScriptInjection } from './middlewares/security.middleware.js';
import { createMainRouter } from './routes/index.js';

export function createApp(): express.Express {
  const app = express();

  // Habilita a leitura segura dos headers X-Forwarded-* enviados pelo Nginx
  app.set('trust proxy', 1);

  // Headers de Segurança HTTP (Helmet)
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // CORS configurado com validação estrita de origens permitidas
  const allowedOrigins = getAllowedOrigins();

  const corsMiddleware = cors({
    origin: (origin, callback) => {
      // Permite requisições sem origin (como curl, mobile apps ou ferramentas internas)
      if (!origin) return callback(null, true);

      const matches = allowedOrigins.some((allowed) => {
        if (origin === allowed) return true;
        if (!allowed.startsWith('http://') && !allowed.startsWith('https://')) {
          return origin.includes(allowed);
        }
        return false;
      });

      if (matches) {
        return callback(null, true);
      }

      // Bloqueia com erro caso a origem seja desconhecida
      callback(new Error(`Origem não permitida pelo CORS: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  });

  // Aplica o middleware de CORS
  app.use(corsMiddleware);

  // Rate limiter estrito nas rotas de login do Better Auth
  app.use('/api/auth/sign-in', authLimiter);

  // Handler do Better Auth montado ANTES de express.json()
  app.all(/^\/api\/auth(\/.*)?$/, toNodeHandler(getAuth()));

  // Limite máximo de payload para evitar DoS
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  // Prevenção contra injeção de scripts (XSS e Prototype Pollution)
  app.use(preventScriptInjection);

  // Rate limiter global para proteção contra DoS nas rotas da API
  if (process.env.NODE_ENV !== 'test') {
    app.use('/api', apiLimiter);
  }

  // Montagem das rotas da API
  app.use('/api', createMainRouter());

  // Middleware de fallback 404
  app.use((_req, res) => {
    res.status(404).json({ success: false, error: 'Rota não encontrada' });
  });

  return app;
}

export const app = createApp();
export default app;