import { Controller, Get, OperationId, Path, Route, Put, Body, Query, Header } from 'tsoa';
import MemberService from '../services/member_service';
import { MembersShowResponse, UpdateMemberRequestBody, UpdateMemberResponse } from './members_controller.interfaces';
import { WrappedResponse } from './base_controller.interfaces';
import { MemberRepository, TowerRepository } from '../repositories';
import { membersShowSerializer } from './members_controller.serializer';
import { CustomError } from '../middlewares/error';
import { OBError } from '../utils/error_spec';
import { flatMap, get, isEmpty, map } from 'lodash';
import FSClient from '../libs/fs_client';
import { memberIndexInterface } from '../services/interfaces/member_service.interface';
import logging from '../utils/logging';
import ActivityLog from '../utils/activity_log';
import cache from '../libs/cache';
import TowerService from '../services/tower_service';

@Route('members')
export class MembersController extends Controller {
  @Get('')
  @OperationId('members.index')
  public async index(
    @Query() identifier?: string,
    @Query() account_id?: string,
    @Query() uid?: string,
    @Header('x-account-id') xAccountId?: string,
  ): Promise<WrappedResponse<memberIndexInterface[] | null>> {
    const memberService = new MemberService();
    const accountId = account_id || xAccountId;
    const result = await memberService.find(identifier, accountId, uid);

    const canPreRegister = get(result, 'metadata.canPreRegister', false);

    this.setStatus(200);
    return {
      data: [{ ...result, can_preregister: canPreRegister } as memberIndexInterface],
    };
  }

  @Get('{id}')
  @OperationId('members.show')
  public async show(
    @Path() id: string,
    @Query() location_id?: string,
  ): Promise<WrappedResponse<MembersShowResponse | null>> {
    const memberData = await cache.getSet(
      `member_data_${id}_${location_id}`,
      async () => {
        const memberResponse = await MemberRepository.findFirst({
          where: {
            id,
          },
          include: {
            passes: {
              include: {
                visitor: true,
                visitor_schedule: true,
              },
              where: {
                // fix for test on 8 jan 2024
                status: 'confirmed',
              },
            },
            tenant_members: {
              include: {
                tenant: {
                  include: {
                    authorized_location: {
                      where: { default: true },
                      include: { location: true },
                    },
                  },
                },
              },
            },
            authorized_locations: {
              include: { location: true },
            },
          },
        });
        if (memberResponse) {
          return JSON.stringify(memberResponse);
        } else {
          return '';
        }
      },
      60 * 1,
    );

    if (!memberData || isEmpty(memberData)) {
      throw new CustomError(OBError.BMS_MEMB_003);
    }
    const member = JSON.parse(memberData);
    const authorizedLocation: string[] = [];

    if (member?.tenant_members) {
      authorizedLocation.push(
        ...flatMap(
          member.tenant_members,
          (tenantMember) => map(tenantMember.tenant?.authorized_location, 'location_id') || [],
        ),
      );
    }

    const authorizedFloor: string[] = map(member?.authorized_locations, (location) => location?.location.floor_id);
    const towerResponse = await cache.getSet(
      `member_tower_${id}_${location_id}_${authorizedLocation}_${authorizedFloor}`,
      async () => {
        const towerData = await TowerRepository.findMany({
          where: {
            locations: {
              some: {
                id: {
                  in: authorizedLocation,
                },
              },
            },
            floors: {
              some: {
                id: {
                  in: authorizedFloor,
                },
              },
            },
          },
          include: {
            locations: {
              where: {
                id: {
                  in: authorizedLocation,
                },
              },
            },
            floors: {
              where: {
                id: {
                  in: authorizedFloor,
                },
              },
            },
          },
        });
        if (towerData) {
          return JSON.stringify(towerData);
        } else {
          return '';
        }
      },
      60 * 60 * 1,
    );

    const tower = JSON.parse(towerResponse);

    let passed_turnstile = false;
    if (location_id) {
      try {
        const result = await FSClient.getMemberExitsTower({
          personID: member.uid,
          locationID: parseInt(location_id),
        });
        logging.info(result.data);
        const isExist = result.data.data?.[0]?.isExist;

        if (isExist !== undefined && isExist !== null) {
          passed_turnstile = isExist;
        }
      } catch (error) {
        console.log('location error');
        console.log(error);
      }
    }
    const towerService = new TowerService();
    const outdoor = await towerService.index();
    const data = membersShowSerializer(member, tower, outdoor, passed_turnstile);
    this.setStatus(200);
    return {
      data: data,
    };
  }

  @Put('{id}')
  @OperationId('members.update')
  @ActivityLog('members.update.floor')
  public async defaultFloor(
    @Path() id: string,
    @Body() updateMemberRequestBody: UpdateMemberRequestBody,
  ): Promise<WrappedResponse<UpdateMemberResponse>> {
    const memberService = new MemberService();

    const result = await memberService.update(id, updateMemberRequestBody.default_floor);

    return { data: { result } };
  }
}
