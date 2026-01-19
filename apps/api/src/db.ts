import { PrismaClient } from '../node_modules/.prisma/client';

let db: PrismaClient;

export function getDb(): PrismaClient {
  if (!db) {
    db = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  return db;
}
