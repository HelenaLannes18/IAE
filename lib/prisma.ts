import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Função para criar a conexão do jeito novo que o Prisma 7 exige
const getPrismaClient = () => {
  // 1. Transforma na linguagem que o Prisma entende (o Adapter)
  const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL || 'file:./dev.db',
  });
  
  // 2. Constrói o cliente passando o Adapter obrigatoriamente
  return new PrismaClient({ adapter });
};

// Mantém a conexão ativa durante o desenvolvimento (Next.js HMR)
export const prisma = globalForPrisma.prisma || getPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;