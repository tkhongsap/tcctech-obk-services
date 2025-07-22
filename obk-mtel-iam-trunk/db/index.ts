import { Prisma, PrismaClient } from './client/index';

const dbClient = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL },
  },
});

const roDBClient = new PrismaClient({
  datasources: {
    db: { url: process.env.REPLICA_DATABASE_URL },
  },
});

export { Prisma, PrismaClient, dbClient, roDBClient };
export default new PrismaClient();