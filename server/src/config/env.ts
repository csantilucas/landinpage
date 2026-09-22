import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  DATABASE_URL: process.env.DATABASE_URL || '',
  MONGODB_URI: process.env.MONGODB_URI,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || '',
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || '',
  COMMODITIES_CACHE_TTL_MINUTES: process.env.COMMODITIES_CACHE_TTL_MINUTES ? parseInt(process.env.COMMODITIES_CACHE_TTL_MINUTES, 10) : 60,
};

export function getAllowedOrigins(): string[] {
  const envOrigins = [ENV.ALLOWED_ORIGINS, ENV.CLIENT_URL]
    .filter(Boolean)
    .join(',')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const productionDomains = [
    'https://trrkrupinski.com.br',
    'https://www.trrkrupinski.com.br',
  ];

  for (const domain of productionDomains) {
    if (!envOrigins.includes(domain)) {
      envOrigins.push(domain);
    }
  }

  // Em desenvolvimento, permite origens locais
  if (ENV.NODE_ENV !== 'production') {
    const defaults = ['http://localhost:3000', 'http://127.0.0.1:3000'];
    for (const def of defaults) {
      if (!envOrigins.includes(def)) {
        envOrigins.push(def);
      }
    }
  }

  return envOrigins;
}
if (ENV.NODE_ENV === 'production') {
  if (!process.env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET.includes('super-secret-key')) {
    console.warn('[SECURITY WARNING] ATENÇÃO: Defina uma chave BETTER_AUTH_SECRET segura e única no arquivo .env em produção!');
  }
}
