import { PrismaClient } from '@prisma/client';

declare global {
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;

try {
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
  } else {
    if (!global.cachedPrisma) {
      global.cachedPrisma = new PrismaClient({
        log: ['query', 'error', 'warn'],
      });
    }
    prisma = global.cachedPrisma;
  }
} catch (error) {
  console.error('Failed to initialize Prisma client:', error);
  throw error;
}

export const db = prisma; 