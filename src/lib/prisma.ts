// ==============================================================================
// ALTOQ PE - CLIENTE SINGLETON DE PRISMA ORM
// Evita agotamiento de conexiones en entornos Serverless y desarrollo local
// REGLA ESTRICTA: Sin uso de emojis en código ni comentarios
// ==============================================================================

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
