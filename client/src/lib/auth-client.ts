import { createAuthClient } from 'better-auth/react';

if(!process.env.NEXT_PUBLIC_API_URL){
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
}
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  fetchOptions: {
    credentials: 'include',
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;
