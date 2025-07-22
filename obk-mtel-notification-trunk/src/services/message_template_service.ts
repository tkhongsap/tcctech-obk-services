import { MessageTemplateData } from '../controllers/v2/message_templates_controller.interface';
import MessageTemplateRepository from '../repositories/message_template_repository';
import { Prisma } from '../../db/client';
import { ImageService } from './image_service';
import { ContentTypeImage } from '../controllers/v2/message_templates_controller.interface';

export class MessageTemplateService {
  private imageService: ImageService = new ImageService();
  public async create(body: MessageTemplateData): Promise<typeof result> {
    const title: Prisma.InputJsonObject = {
      en: body.title.en,
      th: body.title.th,
      zh: body.title.zh,
    };

    let messageTemplateData;
    let messageTemplateThumbnail;

    if (body?.data) {
      messageTemplateData = await Promise.all(
        body?.data?.map(async (data) => {
          if ((data as any).type === 'image') {
            return {
              ...data,
              data: await Promise.all(
                (data as ContentTypeImage)?.data?.map(async (image: string) => {
                  if (image.startsWith('https')) {
                    // check if the image is already uploaded
                    return image;
                  }
                  return (await this.imageService.uploadImage(image))?.imageUrl;
                }),
              ),
            };
          }
          return data;
        }),
      );
    }

    if (body.thumbnail) {
      if (body.thumbnail.startsWith('https')) {
        messageTemplateThumbnail = body.thumbnail;
      } else {
        messageTemplateThumbnail = (await this.imageService.uploadImage(body.thumbnail))?.imageUrl;
      }
    }

    const result = await MessageTemplateRepository.create({
      data: {
        ...body,
        message_category: undefined,
        campaign_target_groups: undefined,
        data: messageTemplateData as object[],
        thumbnail: messageTemplateThumbnail,
        title,
        sub_title: body.sub_title
          ? {
              en: body.sub_title.en,
              th: body.sub_title.th,
              zh: body.sub_title.zh,
            }
          : undefined,
        deeplink_display_name: body.deeplink_display_name as object,
        created_at: new Date().toISOString(),
      },
      include: { message_category: true, campaign_target_groups: true },
    });
    return result;
  }

  public async update(body: MessageTemplateData, id: string): Promise<typeof result> {
    const title: Prisma.InputJsonObject = {
      en: body.title.en,
      th: body.title.th,
      zh: body.title.zh,
    };

    let messageTemplateData;
    let messageTemplateThumbnail;

    if (body?.data) {
      messageTemplateData = await Promise.all(
        body?.data?.map(async (data) => {
          if ((data as any).type === 'image') {
            return {
              ...data,
              data: await Promise.all(
                (data as ContentTypeImage)?.data?.map(async (image: string) => {
                  if (image.startsWith('https')) {
                    // check if the image is already uploaded
                    return image;
                  }
                  return (await this.imageService.uploadImage(image))?.imageUrl;
                }),
              ),
            };
          }
          return data;
        }),
      );
    }

    if (body.thumbnail) {
      if (body.thumbnail.startsWith('https')) {
        messageTemplateThumbnail = body.thumbnail;
      } else {
        try {
          messageTemplateThumbnail = (await this.imageService.uploadImage(body.thumbnail))?.imageUrl;
        } catch (error: any) {
          return error;
        }
      }
    }

    const result = await MessageTemplateRepository.update({
      where: { id },
      data: {
        ...body,
        message_category: undefined,
        campaign_target_groups: undefined,
        thumbnail: messageTemplateThumbnail,
        data: messageTemplateData as object[],
        title,
        sub_title: body.sub_title
          ? {
              en: body.sub_title.en,
              th: body.sub_title.th,
              zh: body.sub_title.zh,
            }
          : undefined,
        updated_at: new Date().toISOString(),
        deeplink_display_name: body.deeplink_display_name as object,
      },
      include: { message_category: true, campaign_target_groups: true },
    });
    return result;
  }

  public async delete(id: string): Promise<boolean> {
    const result = await MessageTemplateRepository.delete({ where: { id } });
    return result !== null;
  }
}
