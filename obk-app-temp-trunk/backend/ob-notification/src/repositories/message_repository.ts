import { Prisma, message } from 'ob-notification/db/client';
import { logging } from 'ob-common-lib/dist';
import { CustomError } from '../middlewares/error_middleware';
import { DBClient } from '../utils/prisma/client';

export class MessageRepository extends DBClient {
  constructor() {
    super();
  }
  public async bulkCreate(
    inputs: Prisma.messageCreateManyInput[],
  ): Promise<void> {
    try {
      logging.info('bulk create message');
      await this.prisma.message.createMany({
        data: inputs,
      });
    } catch (error) {
      logging.error(`${error}`);
      throw new CustomError(400, `Cannot bulk create message`);
    }
  }

  public async create(data: Prisma.messageCreateInput): Promise<typeof result> {
    let result: message;
    try {
      logging.info('create message');
      result = await this.prisma.message.create({
        data,
      });
    } catch (error) {
      logging.error(`${error}`);
      throw new CustomError(400, `Cannot bulk create message`);
    }
    return result;
  }

  public async findAll(
    where: Prisma.messageWhereInput,
    include?: Prisma.messageInclude,
    orderBy?: Prisma.messageOrderByWithRelationInput,
    take?: number,
    skip?: number,
  ): Promise<typeof messages> {
    const messages = await this.prisma.message.findMany({
      where,
      include,
      orderBy,
      take,
      skip,
    });
    return messages;
  }

  public async count(where: Prisma.messageWhereInput): Promise<number> {
    return await this.prisma.message.count({
      where,
    });
  }

  public async update(
    update: Prisma.messageUpdateInput,
    where: Prisma.messageWhereUniqueInput,
  ): Promise<typeof result> {
    let result = {};
    try {
      logging.info('start update message - repository');
      result = await this.prisma.message.update({
        data: update,
        where: where,
      });
    } catch (error) {
      throw new CustomError(500, 'Cannot update message');
    }
    return result;
  }

  public async updateAll(
    update: Prisma.messageUpdateInput,
    where: Prisma.messageWhereInput,
  ): Promise<typeof result> {
    let result = {};
    try {
      logging.info('start update all message - repositpry');
      result = await this.prisma.message.updateMany({
        data: update,
        where: where,
      });
    } catch (error) {
      throw new CustomError(500, 'Cannot update all message');
    }
    return result;
  }

  public async find(
    where: Prisma.messageWhereInput,
    include?: Prisma.messageInclude,
  ): Promise<typeof result> {
    const result = this.prisma.message.findFirst({ where, include });
    return result;
  }
}
