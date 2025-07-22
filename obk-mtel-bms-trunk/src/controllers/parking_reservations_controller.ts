import { MemberRepository, ParkingReservationRepository, ParkingSpaceRepository } from '../repositories';
import { BaseController } from './base_controller';
import { WrappedOneResponse } from './base_controller.interfaces';
import { Body, Header, OperationId, Post, Route, Get, Path, Query } from 'tsoa';
import ActivityLog from '../utils/activity_log';
import {
  ParkingReservationBody,
  ParkingReservationResponse,
  ParkingReservationStatus,
  ParkingReservationDetailResponse,
  ParkingReservationReservedListResponse,
} from './parking_reservations_controller.interfaces';
import { CustomError } from '../middlewares/error';
import { OBError } from '../utils/error_spec';
import { parkingReservationShowSerializer } from './parking_reservations_controller.serializer';
import { formatReference } from '../utils/references_code';
import {
  PKR_REFERENCES_FORMAT_DATE,
  PKR_REFERENCES_LENGTH,
  PKR_REFERENCES_START,
} from '../consts/parking_reservations';
import PaymentService from '../services/payment_service';
import {
  parkingReservationDetailSerializer,
  parkingReservationReservedListSerializer,
} from './parking_reservations_controller.serializer';

@Route('parking_reservations')
export class ParkingReservationsController extends BaseController {
  @Post('')
  @OperationId('parking_reservations.create')
  @ActivityLog('parking_reservations.create')
  public async create(
    @Body() body: ParkingReservationBody,
    @Header('x-account-id') xAccountId?: string,
  ): Promise<WrappedOneResponse<ParkingReservationResponse>> {
    const { parking_space_id, start_time, fee } = body;

    if (!xAccountId) {
      throw new CustomError(OBError.BMS_VAL_001);
    }

    const member = await MemberRepository.findFirst({
      where: { account_id: xAccountId },
    });

    if (!member) throw new CustomError(OBError.BMS_MEMB_003);

    const ParkingSpaceData = await ParkingSpaceRepository.findFirst({ where: { id: parking_space_id } });

    if (!ParkingSpaceData?.available) {
      throw new CustomError(OBError.BMS_PKR_001);
    }

    const latestReservation = await ParkingReservationRepository.findFirst({
      orderBy: {
        reservation_number: 'desc',
      },
    });

    const date = new Date().toString();
    let reservationNumber;

    if (!latestReservation) {
      reservationNumber = formatReference(
        date,
        PKR_REFERENCES_START,
        PKR_REFERENCES_LENGTH,
        undefined,
        PKR_REFERENCES_FORMAT_DATE,
      );
    } else {
      const lastFourDigits = latestReservation.reservation_number.slice(-4);
      const incrementedNumber = (parseInt(lastFourDigits) + 1).toString();
      reservationNumber = formatReference(
        date,
        incrementedNumber,
        PKR_REFERENCES_LENGTH,
        undefined,
        PKR_REFERENCES_FORMAT_DATE,
      );
    }

    const parkingReservationData = await ParkingReservationRepository.create({
      data: {
        parking_space_id,
        fee,
        start_time,
        member_id: member.id,
        status: ParkingReservationStatus.PENDING,
        reservation_number: reservationNumber,
      },
      include: {
        parking_space: {
          include: {
            blocker: true,
            parking_lot: { include: { parking_floors: true } },
          },
        },
      },
    });

    await new PaymentService().create({
      parkingReservationId: parkingReservationData.id,
      totalAmount: fee,
    });

    if (parkingReservationData) {
      await ParkingSpaceRepository.update({
        where: {
          id: parking_space_id,
        },
        data: {
          available: false,
        },
      });
    }

    return { data: parkingReservationShowSerializer(parkingReservationData) };
  }

  @Get('')
  @OperationId('parking_reservations_list.show')
  @ActivityLog('parking_reservations_list.show')
  public async index(
    @Header('x-account-id') xAccountId?: string,
  ): Promise<WrappedOneResponse<ParkingReservationReservedListResponse[]>> {
    if (!xAccountId) {
      throw new CustomError(OBError.BMS_VAL_001);
    }

    try {
      const member = await MemberRepository.findFirst({
        where: { account_id: xAccountId },
      });

      if (!member) throw new CustomError(OBError.BMS_MEMB_003);

      const memberReservedParkingList = await ParkingReservationRepository.findMany({
        where: {
          member_id: member.id,
          status: 'confirmed',
        },
        include: {
          parking_space: {
            include: {
              blocker: true,
              parking_lot: { include: { parking_floors: true } },
            },
          },
        },
      });

      if (!memberReservedParkingList) throw new CustomError(OBError.BMS_PKR_002);

      return { data: parkingReservationReservedListSerializer(memberReservedParkingList) };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(OBError.BMS_PKR_002);
    }
  }

  @Get('/{id}')
  @OperationId('parking_reservations_list.detail')
  @ActivityLog('parking_reservations_list.detail')
  public async show(@Path() id: string): Promise<WrappedOneResponse<ParkingReservationDetailResponse>> {
    try {
      const memberReservedParkingDetail = await ParkingReservationRepository.findFirst({
        where: {
          id: id,
        },
        include: ParkingReservationRepository.defaultInclude,
      });

      if (!memberReservedParkingDetail) throw new CustomError(OBError.BMS_PKR_002);

      return { data: parkingReservationDetailSerializer(memberReservedParkingDetail) };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(OBError.BMS_PKR_002);
    }
  }
}
