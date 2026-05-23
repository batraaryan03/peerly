import { createClient } from '@libsql/client';

let tursoClient: ReturnType<typeof createClient> | null = null;

export function getTurso() {
  if (!tursoClient) {
    // Try both env var names (Vercel format and standard)
    const url =
      process.env.TURSO_DATABASE_URL || process.env.NEXT_PUBLIC_TURSO_DATABASE_URL;
    const authToken =
      process.env.TURSO_AUTH_TOKEN || process.env.NEXT_PUBLIC_TURSO_AUTH_TOKEN;

    if (!url || !authToken) {
      console.error('Turso env vars:', {
        TURSO_DATABASE_URL: !!process.env.TURSO_DATABASE_URL,
        TURSO_AUTH_TOKEN: !!process.env.TURSO_AUTH_TOKEN,
      });
      throw new Error(
        'Turso database credentials not found. Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables.',
      );
    }

    tursoClient = createClient({
      url,
      authToken,
    });
  }
  return tursoClient;
}

// Export the initialized Turso client directly for proper method access
export const turso = getTurso();