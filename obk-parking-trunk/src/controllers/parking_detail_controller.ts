import {
  Body,
  Get,
  Header,
  OperationId,
  Path,
  Post,
  Queries,
  Route,
} from 'tsoa';
import {
  AddParkingTicketQuery,
  AddParkingTicketResponse,
  GetParkingDetailIndexQuery,
  GetParkingDetailResponse,
  GetParkingDetailsIndexResponse,
  GetParkingDetaiQuery,
  ParkingDetailRedeemBody,
  RedeemParkingDetailResponse,
} from './parking_detail_controller.interfaces';
import ParkingDetailService from '../services/parking_detail_service';
import { CustomError } from '../middlewares/error';
import { OBError } from '../utils/error_spec';
import { BaseController, Pagination } from './base_controller';
import { Prisma } from '../../db/client';
import ParkingDetailsRepository from '../repositories/parking_details_repository';
import { ResponseData } from './base_controller.interfaces';
import logging from '../utils/logging';
@Route('parking-details')
export class ParkingController extends BaseController {
  @Get('')
  @OperationId('parking-details.index')
  public async getParkingDetails(
    @Queries() query: GetParkingDetailIndexQuery
  ): Promise<ResponseData<GetParkingDetailsIndexResponse[]>> {
    const { startDate, endDate, filter_by, ...queryData } = query;
    const { orderBy, ..._query } =
      this.buildQuery<Prisma.ParkingDetailFindManyArgs>({ ...queryData });
    let where: Prisma.ParkingDetailWhereInput = { ..._query.where };

    if (where) {
      if (filter_by && where) {
        where.OR = [
          {
            username: {
              contains: filter_by,
            },
          },
          {
            account_id: {
              contains: filter_by,
            },
          },
          {
            uid: {
              contains: filter_by,
            },
          },
          {
            id: {
              contains: filter_by,
            },
          },
          {
            record_id: {
              contains: filter_by,
            },
          },
          {
            plate_no: {
              contains: filter_by,
            },
          },
        ];
      }

      if (startDate && endDate) {
        where.created_at = {
          gte: startDate,
          lte: endDate,
        };
      }
    }

    const parkingDetails = await ParkingDetailsRepository.findMany({
      ..._query,
      where: where,
      ...(orderBy ? {orderBy: orderBy} : {
        orderBy:{
          created_at:'desc'
        }
      })
    });
    logging.info(`getParkingDetails ${parkingDetails}`);
    const formattedParkingDetails: GetParkingDetailsIndexResponse[] =
      parkingDetails.map((parkingDetail) => {
        return {
          id: parkingDetail.id,
          record_id: parkingDetail.record_id ?? '',
          parking_ticket_id: parkingDetail.uid,
          total_amount: parkingDetail.total_amount.toString(),
          plate_no: parkingDetail.plate_no,
          redeemed_at: parkingDetail?.redeemed_at
            ? parkingDetail.redeemed_at.toISOString()
            : '',
          status: parkingDetail.status,
          account_detail: {
            id: parkingDetail?.account_id || '',
            username: parkingDetail?.username || '',
            email: parkingDetail?.email || '',
            phone: parkingDetail?.phone || '',
          },
        };
      });

    const totalData = await ParkingDetailsRepository.count({
      where: where,
    });
    const pagination = this.paginationBuilder(
      totalData,
      query?.page_size || this.DEFAULT_PAGE_SIZE,
      query?.page_number || this.DEFAULT_PAGE_NUMBER
    ) as Pagination;

    return { data: formattedParkingDetails, pagination };
  }

  @Post('/add-parking-ticket')
  @OperationId('parking.add_parking_ticket')
  public async addParkingTicket(
    @Queries() query: AddParkingTicketQuery,
    @Header('x-account-id') xAccountId?: string
  ): Promise<AddParkingTicketResponse> {
    const { id, platform, id_type } = query;

    if (!xAccountId) {
      this.setStatus(400);
      throw new CustomError(OBError.PK_ACC_001);
    }

    const parkingDetailService = new ParkingDetailService();
    const parkingDetail = await parkingDetailService.addParkingTicket(
      id,
      platform,
      id_type,
      xAccountId
    );
    if (!parkingDetail || !parkingDetail.parkingDetailId) {
      throw new CustomError(OBError.PK_PKD_001);
    }

    this.setStatus(200);
    return { parkingDetailId: parkingDetail.parkingDetailId };
  }

  @Get('{id}')
  @OperationId('parking-details.get_parking_detail')
  public async getParkingDetail(
    @Path() id: string,
    @Queries() query: GetParkingDetaiQuery
  ): Promise<ResponseData<GetParkingDetailResponse>> {
    const { ..._query } = this.buildQuery<Prisma.ReceiptFindManyArgs>({
      ...query,
    });
    const parkingDetailService = new ParkingDetailService();
    const parkingDetail = await parkingDetailService.getParkingDetailById(
      id,
      _query,
      query.page_size || this.DEFAULT_PAGE_SIZE,
      query.page_number || this.DEFAULT_PAGE_NUMBER
    );

    this.setStatus(200);
    return {
      data: parkingDetail.data as GetParkingDetailResponse,
      pagination: parkingDetail.pagination,
    };
  }

  @Post('{log_id}/redeem')
  @OperationId('parking-details.redeem')
  public async redeemParkingDetai(
    @Path('log_id') logId: string,
    @Body() body: ParkingDetailRedeemBody
  ): Promise<RedeemParkingDetailResponse> {
    const { parking_detail_id, type } = body;
    const parkingDetailService = new ParkingDetailService();

    const redeemedData = await parkingDetailService.redeemParkingDetail(
      logId,
      type,
      parking_detail_id
    );

    this.setStatus(200);
    return redeemedData;
  }

  @Get("/uid/{uid}")
  @OperationId("parking-details.get_parking_detail.uid")
  public async getParkingDetailByUid(@Path("uid") uid: string) {
    const parkingDetailService = new ParkingDetailService();

    const parkingDetails =
      await parkingDetailService.getParkingDetailByUid(uid);
    this.setStatus(200);
    return parkingDetails;
  }
}
