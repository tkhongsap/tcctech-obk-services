import { Get, OperationId, Route, Queries, Post, Body } from 'tsoa';
import { MemberService } from '../../services';
import { Prisma } from '../../../db/client';
import { BaseController } from '../base_controller';
import { Pagination, WrappedArrayResponse } from '../queries_controller.interfaces';
import {
  FindMemberResult,
  MemberIndexQuery,
  MemberIndexResponse,
  MemberListBody,
} from '../members_controller.interfaces';
import { get } from 'lodash';
import { BaseIndexQuery } from '../base_controller.interfaces';
import { membersSerializer } from './members_controller.serializer';

@Route('v2/members')
export class V2MembersController extends BaseController {
  @Get('')
  @OperationId('members_v2.index')
  public async index(@Queries() query: MemberIndexQuery): Promise<WrappedArrayResponse<MemberIndexResponse>> {
    const _query = this.buildQuery<Prisma.MemberFindManyArgs>({ ...query });

    const memberService = new MemberService();
    const members = await memberService.list(_query);

    const membersResult = get(members, 'members');

    const pagination = this.paginationBuilder(
      members.total,
      query.page_size || this.DEFAULT_PAGE_SIZE,
      query.page_number || this.DEFAULT_PAGE_NUMBER,
    ) as Pagination;

    this.setStatus(200);
    return { data: membersResult, pagination };
  }

  @Post('')
  @OperationId('members_v2.listMembers')
  public async listMembers(
    @Queries() query: BaseIndexQuery,
    @Body() body: MemberListBody,
  ): Promise<WrappedArrayResponse<FindMemberResult>> {
    const _query = this.buildQuery<Prisma.MemberFindManyArgs>({ ...query });

    const memberService = new MemberService();
    const members = await memberService.findMembersAndCount(body, _query);

    const pagination = this.paginationBuilder(
      members.count,
      query.page_size || this.DEFAULT_PAGE_SIZE,
      query.page_number || this.DEFAULT_PAGE_NUMBER,
    ) as Pagination;

    this.setStatus(200);
    return { data: membersSerializer(members.members), pagination };
  }
}
