import { OperationId, Route, Get } from 'tsoa';
import { WrappedResponse } from '../base_controller.interfaces';
import { map } from 'lodash';
import { BaseController } from '../base_controller';
import { TagsIndexResponseData } from './index.interface';
import TagRepository from '../../repositories/tag_repository';
import { tagSerializer } from './tags_controller.serializer';

@Route('tags')
export class TagsController extends BaseController {
  @Get('')
  @OperationId('tags.index')
  public async index(): Promise<WrappedResponse<TagsIndexResponseData>> {
    const tags = await TagRepository.findMany({});

    const serailizedTags = map(tags, (tag) => {
      return tagSerializer(tag);
    });

    this.setStatus(200);
    return { data: serailizedTags };
  }
}
