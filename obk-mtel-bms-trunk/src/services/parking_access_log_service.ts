import { MemberRepository } from '../repositories';
import { Prisma } from '../../db/client';
import { AccessorType } from '../controllers/building_access_log_controller.interface';
import { get } from 'lodash';
import ParkingLogRepository from '../repositories/parking_log_repository';
import dayjs from 'dayjs';
import { CustomError } from '../middlewares/error';
import { OBError } from '../utils/error_spec';
import duration from 'dayjs/plugin/duration';
import { ParkingLogPaginationResult, ParkingLogResult } from '../controllers/parking_access_log_controller.interfaces';
import logging from '../utils/logging';
import { PositionStatus } from '../../db/client/';
dayjs.extend(duration);
export default class ParkingAccessLogsService {
  public async index(query: Prisma.ParkingLogFindManyArgs): Promise<ParkingLogPaginationResult> {
    const { orderBy, take, skip } = query;

    const querys = get(query, 'where.filter');
    const queryGate = get(query, 'where.gate');
    const startDate = get(query, 'where.startDate') === 'Invalid Date' ? undefined : get(query, 'where.startDate');
    const endDate = get(query, 'where.endDate');
    const direction = get(orderBy, 'created_at', 'desc');
    const queryType = get(query, 'where.accessorType');

    const buildQuery: Prisma.ParkingLogFindManyArgs = {
      where: {
        transaction_date: { lte: endDate, gte: startDate },
        terminal_id: queryGate,
        type: queryType,
        AND: {
          OR: [
            { plate_number: { contains: querys, mode: 'insensitive' } },
            { name: { contains: querys, mode: 'insensitive' } },
          ],
        },
      },
      orderBy: { transaction_date: direction },
      take,
      skip,
    };
    const parkingLogsData = await ParkingLogRepository.findMany({
      ...buildQuery,
    });

    const parkingLogs = await Promise.all(
      parkingLogsData.map(async (item) => {
        if (item.type === AccessorType.member) {
          return await this.findMember(item);
        } else if (item.type === AccessorType.pass) {
          return item;
        }
      }),
    );

    const totalData = await ParkingLogRepository.count({
      where: { ...buildQuery.where },
    });

    return { parkingLogs, totalData } as ParkingLogPaginationResult;
  }

  public async show(plate_number: string): Promise<ParkingLogResult> {
    let parkingLogsData;
    parkingLogsData = await ParkingLogRepository.findFirst({
      where: {
        plate_number,
      },
      orderBy: { transaction_date: 'desc' },
    });

    if (parkingLogsData && parkingLogsData.type == AccessorType.member) {
      parkingLogsData = await this.findMember(parkingLogsData);
    } else {
      throw new CustomError(OBError.BMS_BAL_002);
    }
    return parkingLogsData;
  }

  private async findMember(parkingLog: Prisma.ParkingLogGetPayload<null>): Promise<ParkingLogResult> {
    let result;
    const member = await this.findMemberByAccountId(parkingLog.identifier);

    result = {
      ...parkingLog,
      member,
    };

    if (parkingLog.status === PositionStatus.leave) {
      const durationTime = await this.calculateParkingDuration(parkingLog.uid);
      result = {
        ...result,
        ...durationTime,
      };
    }

    return result as ParkingLogResult;
  }

  private async findMemberByAccountId(
    accountId: string,
  ): Promise<Prisma.MemberGetPayload<{ include: { tenant_members: { include: { tenant: true } } } }> | null> {
    try {
      const memberData = await MemberRepository.findFirst({
        where: {
          OR: [{ account_id: accountId }, { uid: accountId }],
        },
        include: MemberRepository.defaultInclude,
      });

      if (!memberData) {
        logging.error('No member found for accountId:', accountId);
        return null;
      }

      return memberData;
    } catch (error) {
      logging.error('Error finding member by accountId:', error);
      throw new CustomError(OBError.BMS_MEMB_003);
    }
  }

  private async calculateParkingDuration(transacId: string): Promise<object | null> {
    const parkingLog = await ParkingLogRepository.findMany({
      where: {
        uid: transacId,
      },
      orderBy: { transaction_date: 'desc' },
    });

    if (parkingLog.length !== 2) return null;

    return {
      durationTime: this.calculateDurationTime(parkingLog[1].transaction_date, parkingLog[0].transaction_date),
      accessGate: parkingLog[1].terminal_id,
    };
  }

  private calculateDurationTime(startDate: string, endDate: string): string {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const duration = dayjs.duration(end.diff(start));

    return duration.format('H:mm:ss');
  }
}
