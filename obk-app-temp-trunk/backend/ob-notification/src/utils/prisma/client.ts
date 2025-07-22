import { Prisma, PrismaClient } from 'ob-notification/db/client';
import { prisma } from '../../../db';

export type transactionFunction = () => Promise<unknown>;

/**
 * @public prisma - a prisma client which repository can access and inherit.
 *
 * @example
 * ```
 * class Repository extends DBClient {

    constructor() {
    }

    public async Get(){
       return this.prisma.user.get();
       ...
    }
 * ```
 * 
 */
export class DBClient {
  public prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  /**
   * Receive an asynchronous function containing logic involving several repository actions that performs a transactional execution.
   * - handle rollback all transaction if there's an error.
   * @example
   * ```
   * this.repositoryA.transaction( async () => {
   *  const result = await this.repositoryA.update({where: id, data});
   *  await this.repositoryB.create({account_id: result.id, ...});
   * }, [this.repositoryA, this.repositoryB]);
   * ```
   * If an error occurs within the async function, the entire transaction will fail and roll back to the previous state.
   * Repository in the transaction should Implenment extends DBClient class and use prima client from DBClient
   */
  public async transaction(
    transaction: transactionFunction,
    repositories: DBClient[],
  ): Promise<typeof response> {
    const response = await this.prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        repositories.forEach((repo) => {
          repo.prisma = tx as PrismaClient;
        });

        const result = await transaction();
        repositories.forEach((repo) => {
          repo.prisma = prisma;
        });
        return result;
      },
    );
    return response;
  }
}
