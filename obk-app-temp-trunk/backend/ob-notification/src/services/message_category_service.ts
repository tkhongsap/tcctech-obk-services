import { logging } from 'ob-common-lib/dist';
import { MessageCategoryRepository } from '../repositories/message_category_repository';
import { Prisma } from '../../db/client';
import { MessageService } from './message_service';
import { CustomError } from '../middlewares/error_middleware';

export class MessageCategoryService {
  private readonly messageCategoryRepository: MessageCategoryRepository;
  private readonly messageService: MessageService;

  constructor(
    messageCategoryRepository?: MessageCategoryRepository,
    messageService?: MessageService,
  ) {
    this.messageCategoryRepository =
      messageCategoryRepository || new MessageCategoryRepository();
    this.messageService = messageService || new MessageService();
  }

  public async findAll(
    orderBy?: Prisma.message_categoryOrderByWithRelationInput,
  ): Promise<typeof result> {
    logging.info('start find all message category');
    const result = await this.messageCategoryRepository.findAll(orderBy);
    return result;
  }
  public async find(
    where: Prisma.message_categoryWhereInput,
  ): Promise<typeof result> {
    logging.info('start find all message category');
    const result = await this.messageCategoryRepository.find(where);
    return result;
  }
  public async countMessage(
    category: string,
    accountId: string,
    read?: boolean,
  ) {
    const result = [];
    if (!category) {
      // return all if does not specify category
      const categories = await this.messageCategoryRepository.findAll();
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
        _category = await this.messageCategoryRepository.find({
          name: category,
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
}
