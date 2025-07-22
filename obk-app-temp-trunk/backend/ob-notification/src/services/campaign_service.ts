import { JsonConvert, logging } from 'ob-common-lib/dist';
import { CampaignRepository } from '../repositories/campaign_repository';
import { CampaignData } from './interfaces/campaign_interface';
import { get, isEmpty } from 'lodash';
import { CustomError } from '../middlewares/error_middleware';
import { RecipientRepository } from '../repositories/recipient_repository';
import { Prisma } from 'ob-notification/db/client';
import { MessageRepository } from '../repositories/message_repository';
import { MessageService } from './message_service';

export class CampaignService {
  private readonly campaignRepository: CampaignRepository;
  private readonly messageRepository: MessageRepository;
  private readonly recipientRepository: RecipientRepository;
  private readonly messageService: MessageService;

  constructor(
    campaignRepository?: CampaignRepository,
    messageRepository?: MessageRepository,
    recipientRepository?: RecipientRepository,
    messageService?: MessageService,
  ) {
    this.campaignRepository = campaignRepository || new CampaignRepository();
    this.messageRepository = messageRepository || new MessageRepository();
    this.recipientRepository = recipientRepository || new RecipientRepository();
    this.messageService = messageService || new MessageService();
  }

  public async create(payload: CampaignData): Promise<boolean> {
    logging.info(`start create campaign : ${payload.name}`);

    const result = await this.campaignRepository.create({
      name: payload.name,
      message_template: {
        connect: { id: payload.message_template_id },
      },
    });

    return result !== null;
  }

  public async createAndSendingMessage(campaignId: string): Promise<boolean> {
    logging.info(`start create message `);

    const campaign = await this.campaignRepository.findBy({ id: campaignId });

    const messageTemplateId = get(campaign, 'message_template_id', '');
    if (isEmpty(messageTemplateId)) {
      throw new CustomError(400, 'Campaign id is not exist');
    }

    const recipients = await this.recipientRepository.findAll();

    const message: Prisma.messageCreateManyInput[] = [];

    recipients.forEach((recipient) => {
      const jsonData = JsonConvert.objectToJson(
        campaign?.message_template.data,
      );
      message.push({
        message_template_id: messageTemplateId,
        recipient_id: recipient.id,
        sender_id: campaignId,
        sender_type: '',
        data: jsonData,
      });
    });

    const result = await this.messageRepository.bulkCreate(message);

    if (campaign) {
      this.messageService.sendingMessage(campaign.id);
    }

    return result !== null;
  }
}
