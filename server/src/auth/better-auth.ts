import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { Db } from 'mongodb';
import { ENV, getAllowedOrigins } from '../config/env.js';

let authInstance: any = null;

export function initAuth(db: Db) {
  authInstance = betterAuth({
    database: mongodbAdapter(db),
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
      const origins: string[] = getAllowedOrigins();
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
    throw new Error('Better Auth ainda não foi inicializado. Execute initAuth(db) primeiro.');
  }
  return authInstance;
}
