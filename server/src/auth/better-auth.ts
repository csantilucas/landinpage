import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { Db } from 'mongodb';
import { ENV } from '../config/env.js';

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
    trustedOrigins: (request) => {
      const origin = request?.headers?.get('origin');
      return origin ? [origin] : [];
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
