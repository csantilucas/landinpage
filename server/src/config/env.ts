import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/trr_krupinski',
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || 'trr-krupinski-super-secret-key-30anos-2026',
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || 'http://localhost:5000',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@trrkrupinski.com.br',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123456',
};

if (ENV.NODE_ENV === 'production') {
  if (!process.env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET.includes('super-secret-key')) {
    console.warn('[SECURITY WARNING] ATENÇÃO: Defina uma chave BETTER_AUTH_SECRET segura e única no arquivo .env em produção!');
  }
}
