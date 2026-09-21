import { app } from './app.js';
import { ENV } from './config/env.js';
import { connectDB, closeDB } from './config/db.js';
import { initAuth } from './auth/better-auth.js';
import { commodityService } from './services/commodity.service.js';

let isInitialized = false;
let initPromise: Promise<typeof app> | null = null;

export async function getApp() {
  if (isInitialized) return app;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    if (!ENV.DATABASE_URL && !ENV.MONGODB_URI) {
      throw new Error('A variável de ambiente DATABASE_URL não foi definida.');
    }

    console.log('[Server] Inicializando conexão com o SQL Server (Prisma ORM)...');
    await connectDB();

    console.log('[Server] Inicializando Better Auth com adaptador SQL Server (Prisma)...');
    initAuth();

    isInitialized = true;
    return app;
  })();

  return initPromise;
}

export { app };

// Handler padrão para serverless (Vercel)
export default async function handler(req: any, res: any) {
  try {
    const initializedApp = await getApp();
    return initializedApp(req, res);
  } catch (error: any) {
    console.error('[Serverless Fatal Error]:', error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', req.headers?.origin || '*');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      return res.end(
        JSON.stringify({
          success: false,
          error: 'Falha na inicialização do backend',
          message: error?.message || String(error),
          hint: !ENV.DATABASE_URL
            ? 'Adicione DATABASE_URL nas variáveis de ambiente com a string do SQL Server.'
            : 'Verifique se o SQL Server está acessível e aceitando conexões na porta configurada.',
        })
      );
    }
  }
}

async function bootstrap() {
  try {
    await getApp();

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

// Só inicia o servidor com listen se NÃO estiver rodando como serverless ou teste
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  bootstrap();
}
