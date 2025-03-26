import { PrismaClient } from '@prisma/client';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}

// Test the connection
async function testConnection() {
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      console.log(`[Database] Testing connection (attempt ${retries + 1}/${MAX_RETRIES})...`);
      await db.$connect();
      
      // Try a simple query to verify connection
      await db.user.findFirst();
      
      console.log('[Database] Connection test successful');
      return true;
    } catch (error) {
      console.error(`[Database] Connection test failed (attempt ${retries + 1}):`, error);
      retries++;
      
      if (retries < MAX_RETRIES) {
        console.log(`[Database] Waiting ${RETRY_DELAY}ms before retrying...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }
  
  console.error('[Database] Failed to establish connection after maximum retries');
  return false;
}

// Initialize connection
testConnection()
  .then((success) => {
    if (!success && process.env.NODE_ENV === 'production') {
      console.error('[Database] Exiting due to connection failure in production');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('[Database] Unexpected error during initialization:', error);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }); 