import { MongoClient, Db } from 'mongodb';
import { ENV } from './env.js';

let client: MongoClient | null = null;
let db: Db | null = null;
let connectPromise: Promise<Db> | null = null;

export async function connectDB(): Promise<Db> {
  if (db) return db;
  if (connectPromise) return connectPromise;

  connectPromise = (async () => {
    try {
      client = new MongoClient(ENV.MONGODB_URI!, {
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10,
      });
      await client.connect();
      db = client.db();
      console.log(`[Database] Conectado ao MongoDB com sucesso: ${db.databaseName}`);
      return db;
    } catch (error) {
      connectPromise = null;
      console.error('[Database] Erro ao conectar ao MongoDB:', error);
      throw error;
    }
  })();

  return connectPromise;
}

export function getDB(): Db {
  if (!db) {
    throw new Error('Banco de dados ainda não foi conectado. Execute connectDB() primeiro.');
  }
  return db;
}

export function getMongoClient(): MongoClient {
  if (!client) {
    throw new Error('MongoClient ainda não foi inicializado.');
  }
  return client;
}

export async function closeDB(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('[Database] Conexão com MongoDB encerrada.');
  }
}
