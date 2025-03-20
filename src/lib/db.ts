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
      const prisma = new PrismaClient({
        log: ['error', 'warn', 'info'],
        errorFormat: 'pretty',
      });

      // Test the connection
      await prisma.$connect();
      console.log('Database connection established');

      // Test query to ensure database is accessible
      await prisma.user.findFirst();
      console.log('Database query test successful');

      return prisma;
    } catch (error) {
      lastError = error as Error;
      retries++;
      console.error(`Database connection attempt ${retries} failed:`, {
        error: lastError.message,
        stack: lastError.stack,
      });
      
      if (retries === MAX_RETRIES) {
        console.error('Max retries reached. Could not connect to database.');
        throw new Error(`Database initialization failed after ${MAX_RETRIES} attempts: ${lastError.message}`);
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retries)); // Exponential backoff
    }
  }

  throw new Error('Failed to initialize database after max retries');
}

let db: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  db = new PrismaClient({
    log: ['error', 'warn'],
    errorFormat: 'pretty',
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['error', 'warn', 'info', 'query'],
      errorFormat: 'pretty',
    });
  }
  db = global.prisma;
}

// Initialize connection
try {
  initializePrisma()
    .then(client => {
      if (process.env.NODE_ENV === 'production') {
        db = client;
      } else {
        global.prisma = client;
        db = global.prisma;
      }
      console.log('Database initialized successfully');
    })
    .catch(error => {
      console.error('Failed to initialize database:', error);
      process.exit(1); // Exit if we can't connect to the database
    });
} catch (error) {
  console.error('Critical database initialization error:', error);
  process.exit(1);
}

export { db }; 