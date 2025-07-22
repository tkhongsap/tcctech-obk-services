import { Prisma, PrismaClient } from 'ob-notification/db/client';
import { logging } from 'ob-common-lib/dist';
import { CustomError } from '../middlewares/error_middleware';

export class CampaignRepository {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient = new PrismaClient()) {
    this.prisma = prisma;
  }

  public async create(
    inputs: Prisma.campaignCreateInput,
  ): Promise<typeof campaign> {
    let campaign = {};
    try {
      logging.info('create campaign');
      campaign = await this.prisma.campaign.create({
        data: inputs,
      });
    } catch (error) {
      logging.error(`${error}`);
      throw new CustomError(400, `Cannot create campaign`);
    }
    return campaign;
  }

  public async findBy(
    where: Prisma.campaignWhereInput,
  ): Promise<typeof campaign> {
    logging.info('find campaign by id');
    const campaign = await this.prisma.campaign.findFirst({
      where,
      include: { message_template: true },
    });

    return campaign;
  }
}
