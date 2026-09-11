import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import { connectDB, closeDB } from './config/db.js';
import { initAuth } from './auth/better-auth.js';
import { createMainRouter } from './routes/index.js';
import { commodityService } from './services/commodity.service.js';

async function bootstrap() {
  try {
    console.log('[Server] Inicializando conexão com o MongoDB...');
    const db = await connectDB();

    console.log('[Server] Inicializando Better Auth com adaptador MongoDB...');
    initAuth(db);

    // Inicia agendador horário de commodities
    commodityService.startScheduledSync();

    const app = express();

    // CORS configurado para o cliente Next.js com credenciais/cookies
    app.use(
      cors({
        origin: [ENV.CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
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

bootstrap();
