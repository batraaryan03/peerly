import { drizzle } from 'drizzle-orm/libsql';

let dbInstance: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (typeof window !== 'undefined') {
    throw new Error('DB client can only be used on the server side');
  }

  if (dbInstance) return dbInstance;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) throw new Error('TURSO_DATABASE_URL env var not set');
  if (!authToken) throw new Error('TURSO_AUTH_TOKEN env var not set');

  dbInstance = drizzle({
    connection: { url, authToken },
  });

  return dbInstance;
}
