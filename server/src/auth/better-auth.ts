import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '../config/prisma.js';
import { ENV, getAllowedOrigins } from '../config/env.js';

let authInstance: any = null;

export function initAuth(client = prisma) {
  if (authInstance) return authInstance;

  const isDev = process.env.NODE_ENV === 'development';

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
    // Desativa o rate limit interno redundante do Better Auth em desenvolvimento local
    rateLimit: {
      enabled: !isDev,
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
      ipAddress: {
        ipAddressHeaders: ['x-forwarded-for', 'x-real-ip'],
        trustedProxies: ['127.0.0.1', '::1'],
      },
      defaultCookieAttributes: {
        sameSite: 'none',
        secure: true,
        partitioned: true,
      },
      useSecureCookies: true,
    },
    trustedOrigins: () => getAllowedOrigins(),
  });

  return authInstance;
}

export function getAuth() {
  if (!authInstance) {
    return initAuth();
  }
  return authInstance;
}