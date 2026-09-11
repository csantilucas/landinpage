import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import { connectDB, closeDB } from './config/db.js';
import { initAuth } from './auth/better-auth.js';
import { createMainRouter } from './routes/index.js';
import { commodityService } from './services/commodity.service.js';

let appInstance: express.Express | null = null;
let initPromise: Promise<express.Express> | null = null;

export async function getApp(): Promise<express.Express> {
  if (appInstance) return appInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    console.log('[Server] Inicializando conexão com o MongoDB...');
    const db = await connectDB();

    console.log('[Server] Inicializando Better Auth com adaptador MongoDB...');
    initAuth(db);

    const app = express();

    // CORS configurado para ENV.CLIENT_URL e ambiente local
    const isAllowedOrigin = (origin?: string) => {
      if (!origin) return true;
      if (
        (ENV.CLIENT_URL && origin === ENV.CLIENT_URL) ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        return true;
      }
      return false;
    };

    app.use(
      cors({
        origin: (origin, callback) => {
          if (isAllowedOrigin(origin)) {
            callback(null, origin || true);
          } else {
            callback(null, false);
          }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
      })
    );

    // Parse JSON
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Montagem da API
    app.use('/api', createMainRouter());

    // Middleware de erro 404
    app.use((_req, res) => {
      res.status(404).json({ success: false, error: 'Rota não encontrada' });
    });

    appInstance = app;
    return app;
  })();

  return initPromise;
}

// Handler padrão para serverless (Vercel)
export default async function handler(req: any, res: any) {
  const app = await getApp();
  return app(req, res);
}

async function bootstrap() {
  try {
    const app = await getApp();

    // Inicia agendador horário de commodities apenas em servidor contínuo
    commodityService.startScheduledSync();

    const server = app.listen(ENV.PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 Servidor TRR Krupinski rodando na porta ${ENV.PORT}`);
      console.log(`📡 URL da API: http://localhost:${ENV.PORT}/api`);
      console.log(`🔒 Better Auth: http://localhost:${ENV.PORT}/api/auth`);
      console.log(`🌐 Cliente permitido: ${ENV.CLIENT_URL}`);
      console.log(`====================================================`);
    });

    const handleShutdown = async () => {
      console.log('\n[Server] Encerrando servidor de forma segura...');
      commodityService.stopScheduledSync();
      server.close(async () => {
        await closeDB();
        process.exit(0);
      });
    };

    process.on('SIGINT', handleShutdown);
    process.on('SIGTERM', handleShutdown);
  } catch (error) {
    console.error('[Server] Falha fatal ao iniciar o servidor:', error);
    process.exit(1);
  }
}

// Só inicia o servidor com listen se NÃO estiver rodando como serverless na Vercel
if (!process.env.VERCEL) {
  bootstrap();
}
