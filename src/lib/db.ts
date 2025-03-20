import { PrismaClient } from '@prisma/client';

declare global {
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;

try {
  if (process.env.NODE_ENV === 'production') {
    console.log('Initializing Prisma client in production mode');
    prisma = new PrismaClient();
  } else {
    console.log('Initializing Prisma client in development mode');
    if (!global.cachedPrisma) {
      console.log('Creating new cached Prisma client instance');
      global.cachedPrisma = new PrismaClient({
        log: ['error', 'warn', 'info', 'query'],
      });
    } else {
      console.log('Using existing cached Prisma client instance');
    }
    prisma = global.cachedPrisma;
  }

  // Test database connection immediately
  prisma.$connect()
    .then(() => {
      console.log('Successfully connected to database');
      // Test query to ensure database is working
      return prisma.user.findFirst().then(() => {
        console.log('Successfully executed test query');
      });
    })
    .catch((error) => {
      console.error('Database connection error:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      // Throw error to prevent app from starting with bad database connection
      throw error;
    });

} catch (error) {
  console.error('Failed to initialize Prisma client:', error);
  if (error instanceof Error) {
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
  }
  throw error;
}

export const db = prisma; 