import { createAuthClient } from 'better-auth/react';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
});

export const { signIn, signUp, signOut, useSession } = authClient;
