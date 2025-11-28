import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  let globalWithPrisma = global as typeof globalThis & {
    __prisma?: PrismaClient;
  };
  if (!globalWithPrisma.__prisma) {
    globalWithPrisma.__prisma = new PrismaClient();
  }
  prisma = globalWithPrisma.__prisma;
}

export default prisma;
