import { prisma, ExtendedPrismaClient } from './prisma.js';

let isConnected = false;
let connectPromise: Promise<ExtendedPrismaClient> | null = null;

export async function connectDB(): Promise<ExtendedPrismaClient> {
  if (isConnected) return prisma;
  if (connectPromise) return connectPromise;

  connectPromise = (async () => {
    try {
      await prisma.$connect();
      isConnected = true;
      console.log('[Database] Conectado ao SQL Server com sucesso via Prisma ORM');
      return prisma;
    } catch (error) {
      connectPromise = null;
      isConnected = false;
      console.error('[Database] Erro ao conectar ao SQL Server:', error);
      throw error;
    }
  })();

  return connectPromise;
}

export function getDB(): ExtendedPrismaClient {
  return prisma;
}

export function getPrisma(): ExtendedPrismaClient {
  return prisma;
}

export async function closeDB(): Promise<void> {
  try {
    await prisma.$disconnect();
    isConnected = false;
    connectPromise = null;
    console.log('[Database] Conexão com SQL Server encerrada.');
  } catch (error) {
    console.error('[Database] Erro ao encerrar conexão com SQL Server:', error);
  }
}

export { prisma };
