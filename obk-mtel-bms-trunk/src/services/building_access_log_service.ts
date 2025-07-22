import { MemberRepository } from '../repositories';
import { Prisma } from '../../db/client';
import VisitorRepository from '../repositories/visitors_repository';
import {
  AccessorType,
  BuildingAccessLogMemberBody,
  BuildingAccessLogPaginationResult,
  BuildingAccessLogVisitorBody,
  queryMember,
} from '../controllers/building_access_log_controller.interface';
import BuildingAccessLogRepository from '../repositories/building_access_log_repository';
import { CustomError } from '../middlewares/error';
import { OBError } from '../utils/error_spec';
import { get, isArray } from 'lodash';

export default class BuildingAccessLogsService {
  public async index(query: Prisma.BuildingAccessgLogFindManyArgs): Promise<BuildingAccessLogPaginationResult> {
    const { orderBy, take, skip } = query;
    const querys = get(query, 'where.filter');
    const queryTower = get(query, 'where.building');
    const queryType = get(query, 'where.accessorType');
    const queryId = get(query, 'where.id');
    const queryStatus = get(query, 'where.status');
    const startDate = get(query, 'where.startDate') === 'Invalid Date' ? undefined : get(query, 'where.startDate');
    const endDate = get(query, 'where.endDate');
    const direction = get(orderBy, 'created_at', 'desc');

    if (queryType !== AccessorType.member && queryType !== AccessorType.pass) {
      throw new CustomError(OBError.BMS_BAL_002);
    }

    const OR: Prisma.BuildingAccessgLogWhereInput[] = [];

    if (queryType === AccessorType.member) {
      OR.push({ name: { contains: querys, mode: 'insensitive' } });
    }

    let buildQuery: Prisma.BuildingAccessgLogFindManyArgs | queryMember = {
      where: {
        type: queryType,
        fs_account_id: queryId,
        status: queryStatus,
        display_tower: queryTower,
        transaction_date: { lte: endDate, gte: startDate },
        AND: { OR },
      },
    };

    let buildingLogs = await BuildingAccessLogRepository.findMany({
      where: { ...buildQuery.where },
      orderBy: { transaction_date: direction },
      take,
      skip,
    });

    if (buildingLogs.length === 0 && queryType === AccessorType.member) {
      buildingLogs = await BuildingAccessLogRepository.findMany({
        where: {
          type: queryType,
          fs_account_id: queryId,
          status: queryStatus,
          display_tower: queryTower,
          transaction_date: { lte: endDate, gte: startDate },
        },
        orderBy: { transaction_date: direction },
        take,
        skip,
      });

      buildQuery = {
        where: {
          email: querys,
        },
      };
    }

    const buildingLogsData =
      queryType === AccessorType.member
        ? await this.findMember(buildingLogs, buildQuery)
        : await this.findVisitor(buildingLogs, query);

    return { buildingLogs: buildingLogsData, totalData: buildingLogsData.length } as BuildingAccessLogPaginationResult;
  }

  public async show(
    identity: string,
    type: AccessorType,
  ): Promise<BuildingAccessLogMemberBody[] | BuildingAccessLogVisitorBody[]> {
    let buildingLogData;

    buildingLogData = await BuildingAccessLogRepository.findFirst({
      where: {
        fs_account_id: identity,
      },
      orderBy: { transaction_date: 'desc' },
    });

    if (!buildingLogData) {
      buildingLogData = await BuildingAccessLogRepository.findMany({
        where: {
          type,
        },
        orderBy: { transaction_date: 'desc' },
      });
    }

    if (type == AccessorType.member) {
      buildingLogData = await this.findMember(buildingLogData);
    } else if (type == AccessorType.pass) {
      const query = {
        where: {
          name: identity,
        },
      };
      buildingLogData = await this.findVisitor(buildingLogData, query as Prisma.BuildingAccessgLogFindManyArgs);
    } else {
      throw new CustomError(OBError.BMS_BAL_002);
    }
    return buildingLogData as BuildingAccessLogMemberBody[] | BuildingAccessLogVisitorBody[];
  }

  private async findMember(
    buildingLog: Prisma.BuildingAccessgLogGetPayload<null>[] | Prisma.BuildingAccessgLogGetPayload<null>,
    query?: Prisma.BuildingAccessgLogFindManyArgs | queryMember,
  ): Promise<typeof buildingLogsData> {
    const queryId = get(query, 'where.id');
    const querys = get(query, 'where.email') as string | undefined;

    const buildingLogArray = isArray(buildingLog) ? buildingLog : [buildingLog];

    const buildingLogsData = await Promise.all(
      buildingLogArray.map(async (log) => {
        const member = await MemberRepository.findFirst({
          where: {
            OR: queryId
              ? [
                  { id: queryId },
                  { account_id: queryId },
                  { uid: queryId },
                  { metadata: { path: ['personID'], equals: queryId } },
                ]
              : [
                  { id: log.fs_account_id },
                  { account_id: log.fs_account_id },
                  { uid: log.fs_account_id },
                  { metadata: { path: ['personID'], equals: log.fs_account_id } },
                ],
          },
          include: MemberRepository.defaultInclude,
        });

        if (member) {
          return {
            ...log,
            member,
          };
        }
      }),
    );

    const filterData = buildingLogsData.filter((item) => item !== undefined);

    if (querys) {
      const membersWithEmails = filterData.filter((log) => this.findEmail(log?.member?.metadata, querys));

      return membersWithEmails;
    }

    return filterData;
  }

  private findEmail(metadata: Prisma.JsonValue | undefined, query: string): boolean {
    if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
      return false;
    }

    const emails = metadata['emails'] as string[];
    return emails && emails.some((email) => email.toLowerCase().startsWith(query.toLowerCase()));
  }

  private async findVisitor(
    buildingLog: Prisma.BuildingAccessgLogGetPayload<null>[] | Prisma.BuildingAccessgLogGetPayload<null>,
    query?: Prisma.BuildingAccessgLogFindManyArgs,
  ): Promise<typeof buildingLogsData> {
    const filters = get(query, 'where.filter');
    const queryName: string = get(query, 'where.name') as string;
    const buildingLogArray = isArray(buildingLog) ? buildingLog : [buildingLog];

    const OR: Prisma.VisitorWhereInput[] | undefined = filters ? this.getVisitorORConditions(filters) : undefined;

    const buildingLogsData = await Promise.all(
      buildingLogArray.map(async (log) => {
        const visitor = await VisitorRepository.findFirst({
          where: {
            AND: {
              id: log.fs_account_id,
              name: queryName,
              OR,
            },
          },
          include: VisitorRepository.defaultInclude,
        });

        if (visitor !== null) {
          return { ...log, visitor };
        }
      }),
    );

    const filterData = buildingLogsData.filter((item) => item !== undefined);

    return filterData;
  }

  private getVisitorORConditions(filters: string): Prisma.VisitorWhereInput[] {
    return [
      { company_name: { contains: filters, mode: 'insensitive' } },
      { email: { contains: filters, mode: 'insensitive' } },
      { name: { contains: filters, mode: 'insensitive' } },
    ];
  }
}
