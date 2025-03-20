import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function initializePrisma(): Promise<PrismaClient> {
  let retries = 0;
  let lastError: Error | null = null;
  
  while (retries < MAX_RETRIES) {
    try {
      console.log('Attempting to initialize Prisma client...');
      
      const prisma = new PrismaClient({
        log: ['error', 'warn', 'info', 'query'],
        errorFormat: 'pretty',
      });

      // Test the connection
      console.log('Testing database connection...');
      await prisma.$connect();
      console.log('Database connection established successfully');

      // Test query to ensure database is accessible
      console.log('Testing database query...');
      await prisma.user.findFirst();
      console.log('Database query test successful');

      return prisma;
    } catch (error) {
      lastError = error as Error;
      retries++;
      console.error(`Database connection attempt ${retries} failed:`, error);
      
      if (retries < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY}ms...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }

  console.error('Failed to initialize database after maximum retries');
  throw lastError || new Error('Failed to initialize database');
}

let db: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  db = new PrismaClient();
} else {
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient();
  }
  db = globalThis.prisma;
}

// Initialize the database connection
initializePrisma()
  .then(client => {
    if (process.env.NODE_ENV === 'production') {
      db = client;
    } else {
      globalThis.prisma = client;
      db = globalThis.prisma;
    }
    console.log('Database initialized successfully');
  })
  .catch(error => {
    console.error('Failed to initialize database:', error);
    // In production, we might want to exit the process
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  });

export { db }; 