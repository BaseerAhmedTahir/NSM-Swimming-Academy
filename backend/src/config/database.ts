import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Only log warnings and errors — 'query' logging is disabled for performance
    log: ['warn', 'error'],
    // Increase interactive transaction timeout to handle cold Neon DB connections
    transactionOptions: {
      maxWait: 10000,   // Max time to acquire a connection (10s)
      timeout: 15000,   // Max transaction duration (15s, up from default 5s)
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
