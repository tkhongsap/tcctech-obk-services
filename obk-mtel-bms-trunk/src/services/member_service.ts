import { find, get, isEmpty, omit, set, unset } from 'lodash';
import {
  CreateMemberResult,
  PersonData,
  PersonDataResident,
} from '../controllers/integrations/fs/members_controller.interface';

import { MemberRepository, LocationRepository } from '../repositories';
import TenantRepository from '../repositories/tenant_repository';
import { PersonErrorSync, memberIndexInterface } from './interfaces/member_service.interface';
import TenantMemberRepository from '../repositories/tenant_member_repository';
import { AccessorType, Prisma, TenantMemberRole } from '../../db/client/';
import AuthorizedLocationRepository from '../repositories/authorized_location_repository';
import { EventProducer } from '../utils/kafka';
import FSClient from '../libs/fs_client';
import { CustomError } from '../middlewares/error';
import { OBError } from '../utils/error_spec';
import FSParkingClient from '../libs/fs_parking_client';
import logging from '../utils/logging';
import { MemberListBody } from '../controllers/members_controller.interfaces';

export default class MemberService {
  public async sync(data: PersonData[]): Promise<CreateMemberResult> {
    const errorList: PersonErrorSync[] = [];

    for (const item of data) {
      try {
        const metaData: PersonData = JSON.parse(JSON.stringify(item));
        const emails = metaData.emails;
        const convertedEmailsToLowerCase = emails.map((email) => email.toLowerCase());
        item.emails = convertedEmailsToLowerCase;
        const defaultLocation = find(metaData.locations, { isDefault: true });
        let defaultLocationData;
        if (defaultLocation) {
          defaultLocationData = await LocationRepository.findFirst({
            where: {
              uid: defaultLocation.locationID.toString(),
            },
            include: {
              floor: true,
            },
          });
        }

        const defaultFloor = defaultLocationData ? defaultLocationData.id : defaultLocationData;
        const memberUpsertResult = await MemberRepository.upsert({
          where: {
            uid: item.personID,
          },
          create: {
            uid: item.personID,
            metadata: JSON.parse(JSON.stringify(item)),
            default_floor: defaultFloor,
          },
          update: {
            metadata: JSON.parse(JSON.stringify(item)),
            default_floor: defaultFloor,
          },
        });

        if (!memberUpsertResult) {
          errorList.push({ type: 'create member error', uid_name: item.personID });
          continue;
        }

        EventProducer.send({
          name: 'ob-bms.member.created',
          payload: {
            member: { ...item },
          },
        });

        for (const tenant of item.tenantIDs) {
          const tenantResult = await TenantRepository.findFirst({ where: { uid: tenant.toString() } });

          if (!tenantResult) {
            errorList.push({ type: 'create tenant member error - cannot find tenant', uid_name: item.personID });
            continue;
          }

          const tenantMemberData = {
            tenant: {
              connect: {
                id: tenantResult.id,
              },
            },
            member: {
              connect: {
                id: memberUpsertResult.id,
              },
            },
            role: TenantMemberRole.staff,
            setting: {},
          };

          try {
            await TenantMemberRepository.upsert({
              create: tenantMemberData,
              update: omit(tenantMemberData, ['tenant', 'member']),
              where: {
                tenant_id_member_id: {
                  tenant_id: tenantResult.id,
                  member_id: memberUpsertResult.id,
                },
              },
            });
          } catch (error) {
            errorList.push({
              type: 'create tenant member error',
              uid_name: `${item.personID}:${tenantResult.uid}:${memberUpsertResult.uid}`,
            });
          }

          const locations = item.locations;

          for (const location of locations) {
            const locationResult = await LocationRepository.findFirst({
              where: { uid: location.locationID.toString() },
            });

            if (!locationResult) {
              errorList.push({
                type: 'cannot find location',
                uid_name: `${item.personID}:${tenantResult.uid}:${
                  memberUpsertResult.uid
                }:${location.locationID.toString()}`,
              });
              continue;
            }

            const authorizedLocationData = {
              member: {
                connect: { id: memberUpsertResult.id },
              },
              accessor_type: AccessorType.member,
              default: location.isDefault,
              location: {
                connect: { id: locationResult.id },
              },
            };

            try {
              await AuthorizedLocationRepository.upsert({
                create: authorizedLocationData,
                update: authorizedLocationData,
                where: {
                  accessor_type_member_id_location_id: {
                    accessor_type: AccessorType.member,
                    member_id: memberUpsertResult.id,
                    location_id: locationResult.id,
                  },
                },
              });
            } catch (error) {
              errorList.push({
                type: 'cannot upsert authorized location',
                uid_name: `${item.personID}:${tenantResult.uid}:${memberUpsertResult.uid}:${locationResult.uid}`,
              });
            }
          }
        }
      } catch (error) {
        console.log('error = ', error);
        errorList.push({ type: 'sync error', uid_name: item.personID });
      }
    }

    return {
      result: errorList.length === 0,
      error: errorList,
    };
  }

  public async syncResident(data: PersonDataResident[]): Promise<CreateMemberResult> {
    const errorList: PersonErrorSync[] = [];

    for (const item of data) {
      try {
        const metaData: PersonDataResident = JSON.parse(JSON.stringify(item));
        const emails = metaData.emails;
        const convertedEmailsToLowerCase = emails.map((email) => email.toLowerCase());
        item.emails = convertedEmailsToLowerCase;
        const memberUpsertResult = await MemberRepository.upsert({
          where: {
            uid: item.personID,
          },
          create: {
            uid: item.personID,
            metadata_resident: JSON.parse(JSON.stringify(item)),
          },
          update: {
            metadata_resident: JSON.parse(JSON.stringify(item)),
          },
        });

        if (!memberUpsertResult) {
          errorList.push({ type: 'create member error', uid_name: item.personID });
          continue;
        }

        EventProducer.send({
          name: 'ob-bms.member_resident.created',
          payload: {
            member: { ...item },
          },
        });
      } catch (error) {
        console.log('error = ', error);
        errorList.push({ type: 'sync error', uid_name: item.personID });
      }
    }

    return {
      result: errorList.length === 0,
      error: errorList,
    };
  }

  public async find(identifier?: string, accountId?: string, uid?: string): Promise<memberIndexInterface> {
    const query: Prisma.MemberWhereInput[] = [];

    if (identifier) {
      query.push({ metadata: { path: ['phones'], array_contains: identifier } });
      query.push({ metadata: { path: ['emails'], array_contains: identifier } });
      query.push({ metadata_resident: { path: ['phones'], array_contains: identifier } });
      query.push({ metadata_resident: { path: ['emails'], array_contains: identifier } });
    }

    if (accountId) {
      query.push({ account_id: accountId });
    }

    if (uid) {
      query.push({ uid: uid });
    }

    const member = await MemberRepository.findFirst({
      where: {
        OR: query,
      },
      include: {
        tenant_members: {
          include: {
            tenant: true,
          },
        },
      },
    });

    if (!member) throw new CustomError(OBError.BMS_MEMB_003);
    let redemptionAuthorized = false;

    if (get(member, 'metadata') !== null) {
      const memberFSEmail = get(member, ['metadata', 'emails'], []);

      logging.info('checkRedemptionStatusByEmail body request', memberFSEmail);

      try {
        const fsUserResponse = await FSParkingClient.checkRedemptionStatusByEmail(memberFSEmail);
        logging.info('checkRedemptionStatusByEmail data', fsUserResponse.data);

        if (fsUserResponse.data.data) {
          const { departmentId, tenantId, isUse } = fsUserResponse.data.data;
          if (departmentId && tenantId && isUse === 1) {
            redemptionAuthorized = true;
          }
        }
      } catch (error) {
        logging.info('cannot call to parking api');
      }
    }

    const tenant = get(member, ['tenant_members', '0', 'tenant']);
    const memberResult = omit(member, 'tenant_members');

    const result = {
      ...memberResult,
      redemption_authorized: redemptionAuthorized,
      tenant,
    };
    return result;
  }

  public async update(memberId: string, floorId: string): Promise<boolean | null> {
    const member = await MemberRepository.findFirst({ where: { id: memberId } });

    const location = await AuthorizedLocationRepository.findMany({
      where: { member_id: memberId },
      include: {
        location: {
          include: {
            floor: true,
            zone: true,
            tower: {
              include: {
                project: true,
              },
            },
          },
        },
      },
    });
    if (!member) {
      throw new CustomError(OBError.BMS_MEMB_003);
    }
    if (location.length === 0) {
      throw new CustomError(OBError.BMS_LCT_003);
    }

    const selectedAuthorizedLocation = find(location, { location: { floor: { id: floorId } } });

    if (!selectedAuthorizedLocation) {
      throw new CustomError(OBError.BMS_LCT_003);
    }

    const selectedLocation = selectedAuthorizedLocation.location;

    if (!location) {
      throw new CustomError(OBError.BMS_LCT_003);
    }

    const body = {
      personID: member.uid,
      towerID: parseInt(selectedLocation.tower.uid),
      floorID: parseInt(selectedLocation.floor.uid),
      zoneID: parseInt(selectedLocation.zone.uid),
      projectID: parseInt(selectedLocation.tower.project.uid),
    };
    logging.info(body);
    try {
      const res = await FSClient.updateDefaultFloor(body);
      if (!res) {
        throw new CustomError(OBError.BMS_FS_004);
      }

      await MemberRepository.update({
        where: {
          id: memberId,
        },
        data: {
          default_floor: selectedLocation.id,
        },
      });
      return true;
    } catch (error) {
      const errorResponse = get(error, ['response', 'data']);
      console.log(errorResponse);
      throw new CustomError(OBError.BMS_FS_004);
    }
  }

  public async list(query: Prisma.MemberFindManyArgs): Promise<{
    members: Prisma.MemberGetPayload<null>[];
    total: number;
  }> {
    const floorId = get(query, 'where.floor_id');
    const tenantId = get(query, 'where.tenant_id');
    const uid = get(query, 'where.uid');

    let members;
    set(query, 'where.account_id', { not: null });
    if (floorId) {
      set(query, 'where.authorized_locations.some.location.floor_id', floorId);
      unset(query, 'where.floor_id');
      members = await this.findMembersByFloorId(query);
    } else if (tenantId) {
      set(query, 'where.tenant_members.some.tenant.id', tenantId);
      unset(query, 'where.tenant_id');
      members = await this.findMembersByTenantId(query);
    } else if (uid) {
      members = await this.findMembersByTenantId(query);
    }

    if (!members || isEmpty(members)) {
      throw new CustomError(OBError.BMS_MEMB_003);
    }

    return members;
  }

  private async findMembersByFloorId(query: Prisma.MemberFindManyArgs): Promise<{
    members: Prisma.MemberGetPayload<null>[];
    total: number;
  }> {
    const members = await MemberRepository.findMany({
      ...query,
    });
    const total = await this.count(query);

    return { members, total };
  }

  private async findMembersByTenantId(query: Prisma.MemberFindManyArgs): Promise<{
    members: Prisma.MemberGetPayload<{
      include: {
        tenant_members: { include: { tenant: true } };
      };
    }>[];
    total: number;
  }> {
    const members = await MemberRepository.findMany({
      ...query,
      include: MemberRepository.defaultInclude,
    });
    const total = await this.count(query);
    return { members, total };
  }

  private async count(query: Prisma.MemberFindManyArgs): Promise<number> {
    const _query = get(query, 'where');

    return MemberRepository.count({
      where: {
        ..._query,
      },
    });
  }

  public async findMembersAndCount(
    body: MemberListBody,
    query: Prisma.MemberFindManyArgs,
  ): Promise<{ members: Prisma.MemberGetPayload<null>[]; count: number }> {
    const floorIds = get(body, 'floor_ids');
    const tenantIds = get(body, 'tenant_ids');

    const hasFloorIds = floorIds && floorIds.length > 0;
    const hasTenantIds = tenantIds && tenantIds.length > 0;
    unset(query, 'where');
    if (hasFloorIds && hasTenantIds) {
      return await this.fetchByFloorAndTenantIds(floorIds, tenantIds, query);
    } else if (hasFloorIds) {
      return await this.fetchByFloorIds(floorIds, query);
    } else if (hasTenantIds) {
      return await this.fetchByTenantIds(tenantIds, query);
    } else {
      return { members: [], count: 0 };
    }
  }

  private async fetchByFloorIds(
    floorIds: string[],
    query: Prisma.MemberFindManyArgs,
  ): Promise<{ members: Prisma.MemberGetPayload<null>[]; count: number }> {
    const whereClause = {
      authorized_locations: {
        some: {
          location: {
            floor_id: { in: floorIds },
          },
        },
      },
      account_id: { not: null },
    };

    const members = await MemberRepository.findMany({
      where: whereClause,
      ...query,
    });

    const count = await MemberRepository.count({ where: whereClause });

    return { members, count };
  }

  private async fetchByTenantIds(
    tenantIds: string[],
    query: Prisma.MemberFindManyArgs,
  ): Promise<{ members: Prisma.MemberGetPayload<null>[]; count: number }> {
    const whereClause = {
      tenant_members: {
        some: {
          tenant: {
            id: { in: tenantIds },
          },
        },
      },
      account_id: { not: null },
    };

    const members = await MemberRepository.findMany({
      where: whereClause,
      ...query,
    });

    const count = await MemberRepository.count({
      where: { ...whereClause, account_id: { not: null } },
    });

    return { members, count };
  }

  private async fetchByFloorAndTenantIds(
    floorIds: string[],
    tenantIds: string[],
    query: Prisma.MemberFindManyArgs,
  ): Promise<{ members: Prisma.MemberGetPayload<null>[]; count: number }> {
    const whereClause = {
      OR: [
        {
          authorized_locations: {
            some: {
              location: {
                floor_id: { in: floorIds },
              },
            },
          },
        },
        {
          tenant_members: {
            some: {
              tenant: {
                id: { in: tenantIds },
              },
            },
          },
        },
      ],
      account_id: { not: null },
    };

    const members = await MemberRepository.findMany({
      where: whereClause,
      ...query,
    });

    const count = await MemberRepository.count({
      where: { ...whereClause, account_id: { not: null } },
    });

    return { members, count };
  }
}
