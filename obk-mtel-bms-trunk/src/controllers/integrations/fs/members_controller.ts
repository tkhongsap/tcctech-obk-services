import { get } from 'lodash';
import { Route, Post, Body, Controller, Delete, Middlewares, OperationId } from 'tsoa';

import MemberRepository from '../../../repositories/member_repository';
import {
  CreateFSMembersBody,
  CreateMembersResponse,
  CreateResidenceFSMembersBody,
  DestroyFSMembers,
  DestroyMembersResponse,
} from './members_controller.interface';
import { Authorizer } from '../../../middlewares/authorizer';
import MemberService from '../../../services/member_service';
import { randomUUID } from 'crypto';
import { EventProducer } from '../../../utils/kafka';
import { syncRoleLogRepository } from '../../../repositories/sync_role_log';
import { Prisma } from '../../../../db/client';
import logging from '../../../utils/logging';
import { CustomError } from '../../../middlewares/error';
import { OBError } from '../../../utils/error_spec';
import TCCClient, { UpdateTransactionCarParkBody } from '../../../libs/tcc_client';

@Route('integrations/fs/members')
@Middlewares(
  Authorizer({
    resource: 'fs',
    action: '*',
  }),
)
export class FSMembersController extends Controller {
  @Post()
  @OperationId('integrations.fs.members.create')
  public async create(@Body() body: CreateFSMembersBody): Promise<CreateMembersResponse> {
    const data = get(body, 'data');

    const memberService = new MemberService();
    await memberService.sync(data);

    this.setStatus(200);
    return {
      result: true,
      data: {
        job_id: randomUUID(),
      },
      error: null,
    };
  }

  @Post('resident')
  @OperationId('integrations.fs.members.resident.create')
  public async createResident(@Body() body: CreateResidenceFSMembersBody): Promise<CreateMembersResponse> {
    const data = get(body, 'data');

    const memberService = new MemberService();
    await memberService.syncResident(data);

    this.setStatus(200);
    return {
      result: true,
      data: {
        job_id: randomUUID(),
      },
      error: null,
    };
  }

  @Delete()
  @OperationId('integrations.fs.members.delete')
  public async destroy(@Body() body: DestroyFSMembers): Promise<DestroyMembersResponse> {
    const loggingContext = logging.getLogContext();
    const traceId = loggingContext.traceId!;
    const members = await MemberRepository.findMany({
      where: { uid: { in: body.member_ids }, AND: { account_id: { not: null } } },
    });

    let accountIds;
    if (members.length > 0) {
      accountIds = members.map((member) => {
        return member.account_id;
      });
    }

    await MemberRepository.deleteMany({
      where: {
        uid: {
          in: body.member_ids,
        },
      },
    });

    if (accountIds) {
      console.log('ob-iam.member.deleted');
      EventProducer.send({
        name: 'ob-iam.member.deleted',
        payload: {
          account_ids: accountIds,
        },
      });

      if (process.env.ENABLE_IMPORT_PHYSICAL_PARKING_TICKET === 'true') {
        logging.info('start update tenant to shopper');
        const offBoardMembers: UpdateTransactionCarParkBody[] = [];
        for (const member of members) {
          if (member.account_id) {
            offBoardMembers.push({
              logId: '',
              uid: member.id,
              accountId: member.account_id,
              algType: 'TenantToShopper',
            });
          }
        }
        const createSyncRoleLogPayload: Prisma.SyncRoleLogCreateManyInput[] = offBoardMembers.map((offboard) => ({
          trace_id: traceId,
          action: offboard.algType,
          status: 'pending',
          account_id: offboard.accountId,
          payload: JSON.stringify(offboard),
        }));

        await syncRoleLogRepository.createMany({ data: [...createSyncRoleLogPayload] });
        logging.info('updateTransactionCarpark body request:', offBoardMembers);

        if (offBoardMembers.length > 0) {
          const errorMessage = new CustomError(OBError.BMS_FSP_001);
          const results = await Promise.allSettled(
            offBoardMembers.map(async (member) => {
              try {
                const response = await TCCClient.updateTransactionCarpark(member);
                logging.info(`updateTransactionCarpark for account id ${member.accountId} data`, response);
                if (response.data.status === 1) {
                  return { traceId, accountId: member.accountId };
                }
                return Promise.reject({ traceId, accountId: member.accountId, error: errorMessage });
              } catch (error) {
                logging.error(`Failed to update transaction carpark for account id ${member.accountId}`, error);
                return Promise.reject({ traceId, accountId: member.accountId, error });
              }
            }),
          );

          await Promise.all(
            results.map((result) => {
              const isSuccess = result.status === 'fulfilled';
              return syncRoleLogRepository.updateMany({
                where: {
                  AND: [
                    { account_id: isSuccess ? result.value.accountId : result.reason.accountId },
                    { trace_id: isSuccess ? result.value.traceId : result.reason.traceId },
                  ],
                },
                data: { status: isSuccess ? 'success' : 'failed' },
              });
            }),
          );
        }
      }
    } else {
      console.log('accountId don t exist');
    }

    this.setStatus(200);
    return {
      result: true,
      data: {
        job_id: randomUUID(),
      },
      error: null,
    };
  }
}
