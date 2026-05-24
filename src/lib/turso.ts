import { createClient } from '@libsql/client';

let client: ReturnType<typeof createClient> | null = null;

export function getTurso() {
  if (typeof window !== 'undefined') {
    throw new Error('Turso client can only be used on the server side');
  }

  if (client) return client;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error(
      'TURSO_DATABASE_URL environment variable is not set',
    );
  }

  if (!authToken) {
    throw new Error(
      'TURSO_AUTH_TOKEN environment variable is not set',
    );
  }

  client = createClient({
    url,
    authToken,
  });

  return client;
}
