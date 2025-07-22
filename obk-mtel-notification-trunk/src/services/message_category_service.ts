import logging from '../libs/logging';
import MessageCategoryRepository from '../repositories/message_category_repository';
import { Prisma } from '../../db/client';
import { MessageService } from './message_service';
import { CustomError } from '../middlewares/error_middleware';
import {
  MessageCategoryBody,
  MessageCategoryCountResult,
  MessageCategoryUpdateBody,
} from '../controllers/message_category_controller.interfaces';
export class MessageCategoryService {
  private readonly messageCategoryRepository: MessageCategoryRepository;
  private readonly messageService: MessageService;

  constructor(messageCategoryRepository?: MessageCategoryRepository, messageService?: MessageService) {
    this.messageCategoryRepository = messageCategoryRepository || new MessageCategoryRepository();
    this.messageService = messageService || new MessageService();
  }

  public async findAll(orderBy?: Prisma.message_categoryOrderByWithRelationInput): Promise<typeof result> {
    logging.info('start find all message category');
    const result = await MessageCategoryRepository.findMany({ where: { visible: true }, orderBy });
    return result;
  }
  public async find(where: Prisma.message_categoryWhereInput): Promise<typeof result> {
    logging.info('start find all message category');
    const result = await MessageCategoryRepository.findFirst({ where });
    return result;
  }
  public async countMessage(
    accountId: string,
    category?: string,
    read?: boolean,
  ): Promise<MessageCategoryCountResult[]> {
    const result = [];
    if (!category) {
      // return all if does not specify category
      const categories = await MessageCategoryRepository.findMany();
      let allCount = 0;
      for (const _category of categories) {
        const total = await this.messageService.count(
          { account_id: accountId },
          {
            deleted_at: null,
            message_template: {
              message_category: {
                id: _category.id,
              },
            },
            read: read,
          },
        );

        allCount += total;
        result.push({
          id: _category.id,
          name: _category.name,
          total,
        });
      }
      result.push({
        id: '',
        name: 'All',
        total: allCount,
      });
    } else {
      let _category;
      if (category !== 'All') {
        _category = await MessageCategoryRepository.findFirst({
          where: {
            name: category,
          },
        });

        if (!_category) {
          throw new CustomError(500, 'Category does not exist');
        }
      }

      const total = await this.messageService.count(
        { account_id: accountId },
        {
          deleted_at: null,
          message_template:
            category === 'All'
              ? undefined
              : {
                  message_category: {
                    name: category,
                  },
                },
          read: read,
        },
      );
      result.push({
        id: _category?.id ?? '',
        name: _category?.name ?? 'All',
        total,
      });
    }

    return result;
  }

  public async create(MessageCategoryPayload: MessageCategoryBody): Promise<typeof result> {
    const result = await MessageCategoryRepository.create({
      data: {
        ...MessageCategoryPayload,
        icon_id: MessageCategoryPayload.icon_id !== null ? MessageCategoryPayload.icon_id : undefined,
      },
    });

    return result;
  }
  public async update(MessageCategoryPayload: MessageCategoryUpdateBody, id: string): Promise<typeof result> {
    const result = await MessageCategoryRepository.update({ where: { id }, data: MessageCategoryPayload });

    return result;
  }
  public async delete(id: string): Promise<boolean> {
    const result = await MessageCategoryRepository.delete({ where: { id } });

    return result !== null;
  }
}
