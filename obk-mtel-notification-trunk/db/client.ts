import { Prisma, PrismaClient } from './client/index';

export { Prisma, PrismaClient };
export default new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
