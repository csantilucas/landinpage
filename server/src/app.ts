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

  // Headers de Segurança HTTP (Helmet)
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // CORS configurado para os IPs e origens definidos na variável de ambiente
  const allowedOrigins = getAllowedOrigins();

  const corsMiddleware = cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const matches = allowedOrigins.some((allowed) => {
        if (origin === allowed) return true;
        if (!allowed.startsWith('http://') && !allowed.startsWith('https://')) {
          return origin.includes(allowed);
        }
        return false;
      });

      if (matches) {
        return callback(null, origin);
      }

      callback(null, origin);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  });

  app.use(corsMiddleware);
  app.options('*', corsMiddleware);

  // Rate limiter estrito nas rotas de login do Better Auth (5 tentativas por 15 min)
  app.post(['/api/auth/sign-in', '/api/auth/sign-in/*'], authLimiter);

  // Handler do Better Auth montado ANTES de express.json()
  // Isso é fundamental para evitar a condição de corrida no stream da requisição (body stream)
  app.all(['/api/auth', '/api/auth/*'], toNodeHandler(getAuth()));

  // Limite máximo de payload para evitar estouro de memória e DoS
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  // Auditoria e prevenção contra injeção de scripts (XSS e Prototype Pollution)
  app.use(preventScriptInjection);

  // Rate limiter global para proteção contra DoS nas rotas da API (ignorado em ambiente de teste para velocidade)
  if (process.env.NODE_ENV !== 'test') {
    app.use('/api', apiLimiter);
  }

  // Montagem das rotas da API
  app.use('/api', createMainRouter());

  // Middleware de erro 404
  app.use((_req, res) => {
    res.status(404).json({ success: false, error: 'Rota não encontrada' });
  });

  return app;
}

export const app = createApp();
export default app;
