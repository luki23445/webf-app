/**
 * Helper to get DB client from apps/api
 * This is a workaround for modules that need Prisma client
 * but can't import it directly due to monorepo structure
 */
let dbClient: any = null;

export async function getDbClient() {
  if (!dbClient) {
    // Dynamic import to avoid circular dependencies
    const dbModule = await import('../../apps/api/src/db');
    dbClient = dbModule.getDb();
  }
  return dbClient;
}
