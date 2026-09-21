import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '../config/prisma.js';
import { ENV, getAllowedOrigins } from '../config/env.js';

let authInstance: any = null;

export function initAuth(client = prisma) {
  if (authInstance) return authInstance;

  authInstance = betterAuth({
    database: prismaAdapter(client, {
      provider: 'sqlserver',
    }),
    secret: ENV.BETTER_AUTH_SECRET,
    baseURL: ENV.BETTER_AUTH_URL,
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
    },
    user: {
      additionalFields: {
        role: {
          type: 'string',
          required: false,
          defaultValue: 'user',
        },
      },
    },
    advanced: {
      defaultCookieAttributes: {
        sameSite: 'none',
        secure: true,
        partitioned: true,
      },
      useSecureCookies: true,
    },
    trustedOrigins: (request) => {
      const origin = request?.headers?.get('origin');
      const referer = request?.headers?.get('referer');
      const origins: string[] = [...getAllowedOrigins()];
      if (origin && !origins.includes(origin)) origins.push(origin);
      if (referer) {
        try {
          const refOrigin = new URL(referer).origin;
          if (!origins.includes(refOrigin)) origins.push(refOrigin);
        } catch {}
      }
      return origins;
    },
  });

  return authInstance;
}

export function getAuth() {
  if (!authInstance) {
    // Inicializa automaticamente se ainda não foi inicializado
    return initAuth();
  }
  return authInstance;
}
