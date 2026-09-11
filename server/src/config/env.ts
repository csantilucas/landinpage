import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL,
  MONGODB_URI: process.env.MONGODB_URI,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || '',
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || '',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',

  COMMODITIES_CACHE_TTL_MINUTES: process.env.COMMODITIES_CACHE_TTL_MINUTES ? parseInt(process.env.COMMODITIES_CACHE_TTL_MINUTES, 10) : 60,
};

if (ENV.NODE_ENV === 'production') {
  if (!process.env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET.includes('super-secret-key')) {
    console.warn('[SECURITY WARNING] ATENÇÃO: Defina uma chave BETTER_AUTH_SECRET segura e única no arquivo .env em produção!');
  }
}
