import { OperationId, Route, Get, Post, Body } from 'tsoa';
import { WrappedResponse } from '../base_controller.interfaces';
import { map } from 'lodash';
import { BaseController } from '../base_controller';
import { TargetGroupData, TargetGroupsIndexResponseData } from './index.interface';
import { targetGroupSerializer } from './target_groups_controller.serializer';
import TargetGroupRepository from '../../repositories/target_group_repository';
import { TargetGroupService } from '../../services/target_group_service';
import { TargetGroupBody } from '../../services/interfaces/target_group_interface';

@Route('target_groups')
export class TargetGroupsController extends BaseController {
  @Get('')
  @OperationId('target_groups.index')
  public async index(): Promise<WrappedResponse<TargetGroupsIndexResponseData>> {
    const targetGroups = await TargetGroupRepository.findMany({});

    const serailizedTargetGroups = map(targetGroups, (targetGroup) => {
      return targetGroupSerializer(targetGroup);
    });

    this.setStatus(200);
    return { data: serailizedTargetGroups };
  }

  @Post('')
  @OperationId('target_groups.create')
  public async create(@Body() body: TargetGroupBody): Promise<WrappedResponse<TargetGroupData>> {
    const targetGroupService = new TargetGroupService();
    const targetGroup = await targetGroupService.createTargetGroup(body);
    this.setStatus(200);
    return { data: targetGroupSerializer(targetGroup) };
  }
}
