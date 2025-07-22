import { filter, isEmpty, isNumber } from 'lodash';
import FSParkingClient, {
  GetParkingDetailByPersonIDDataResponse,
} from '../../libs/fs_parking_client';
import {
  AddParkingTicketIdType,
  AddParkingTicketResponse,
  AddParkingTicketType,
  GetParkingDetailResponse,
  ParkingAccountDetail,
  ParkingDetailByUidResponse,
  RedeemParkingDetailResponse,
} from '../../controllers/parking_detail_controller.interfaces';
import ParkingDetailsRepository from '../../repositories/parking_details_repository';
import ReceiptRepository from '../../repositories/receipts_repository';
import { CustomError } from '../../middlewares/error';
import { OBError } from '../../utils/error_spec';
import { Prisma } from '../../../db/client';
import { BaseController, Pagination } from '../../controllers/base_controller';
import { WrappedResponse } from '../../controllers/base_controller.interfaces';
import logging from '../../utils/logging';
import TCCClient from '../../libs/tcc_client';
import cache from '../../libs/cache';
import {
  Receipt,
  ReceiptStatus,
} from '../../controllers/receipts_controller_interface';
import { CampaignService } from '../campaign';
import RedeemRepository from '../../repositories/redeem_repository';
import ReceiptRedeemRepository from '../../repositories/receipt_redeem_repository';
import {
  MembersShowResponse,
  WrappedResponseParkingTicketDataData,
} from 'ob-bms-sdk/dist/api';
import BMSClient from '../../libs/bms_client';
import IAMClient from '../../libs/iam_client';
import { RedeemType } from '../../../db/client/index';
import { Decimal } from '../../../db/client/runtime/library';
export default class ParkingDetailService extends BaseController {
  private readonly campaignService: CampaignService;

  constructor() {
    super();
    this.campaignService = new CampaignService();
  }

  public async addParkingTicket(
    id: string,
    platform: AddParkingTicketType,
    id_type: AddParkingTicketIdType,
    accountId: string
  ): Promise<AddParkingTicketResponse> {
    let parkingDetailsResponse: GetParkingDetailByPersonIDDataResponse[] = [];

    if (id_type === 'member_id') {
      // if id_type = member_id this id will equal member_id
      let personId: string;
      logging.info(`membersShow body: ${id}`);
      try {
        // membersShow will find the macthed member_id's data
        const res = await BMSClient.membersShow(id);
        if (res.data) {
          const member = res.data as MembersShowResponse;
          personId = member.uid;
        } else if (process.env.ENABLE_SHOPPER === 'true') {
          personId = accountId;
        } else {
          logging.error('membersShow error:', res);
          throw new CustomError(OBError.PK_BMS_002);
        }
      } catch (error: any) {
        if (process.env.ENABLE_SHOPPER === 'true') {
          personId = accountId;
        } else {
          logging.error('membersShow error:', error.response);
          throw new CustomError(OBError.PK_BMS_002);
        }
      }

      logging.info(`getParkingDetailByPersonID body ${personId}`);
      await cache.getSet('TCC_ACCESS_TOKEN', async () => {
        const response = await TCCClient.getOauth2Token();
        return response.data.access_token;
      });

      const res = await TCCClient.getParkingDetailByPersonID(personId).catch(
        (err) => {
          logging.error('getParkingDetailByPersonID error:', err);
          throw new CustomError(OBError.PK_FS_001);
        }
      );

      parkingDetailsResponse = res.data.data;
    } else if (id_type === 'log_id') {
      const res = await FSParkingClient.getParkingDetailByQRCode(id).catch(
        (err) => {
          logging.error('getParkingDetailByQRCode error:', err);
          throw new CustomError(OBError.PK_FS_001);
        }
      );
      logging.info('getParkingDetailByQRCode data', { ...res.data.data });

      parkingDetailsResponse = res.data.data;
    }

    const parkingDetails = filter(parkingDetailsResponse, {
      exitStatus: 0,
    });

    logging.info(
      'getParkingDetailByQRCode active ticket data',
      parkingDetailsResponse
    );

    if (parkingDetails.length === 0) {
      logging.error(
        'addParkingTicket error: no active parking ticket found',
        parkingDetails
      );
      throw new CustomError(OBError.PK_FS_001);
    }

    const existedParkingDetail = await ParkingDetailsRepository.findUnique({
      where: {
        uid: parkingDetails[0].logId,
      },
    });

    if (existedParkingDetail) {
      logging.error(
        `addParkingTicket error: duplicate parking logId, ${existedParkingDetail.uid}`
      );
      throw new CustomError(OBError.PK_PKD_004);
    }
    let accountDetail: ParkingAccountDetail | undefined;
    if (platform === 'APP') {
      try {
        const accountShowResponse = await IAMClient.accountShow(accountId);
        const accountData = accountShowResponse.data;
        logging.info('get account detail', accountData);

        if (
          accountData &&
          accountData.account &&
          accountData.account.identity &&
          accountData.account.identity.length > 0 &&
          accountData.account.profile
        ) {
          const identity = accountData.account.identity[0];
          const isPhone = identity.provider === 'phone';
          const identifier = identity.identifier;
          const profile = accountData.account.profile;

          const usernameParts = [
            profile.first_name,
            profile.middle_name,
            profile.last_name,
          ].filter(Boolean);

          accountDetail = {
            id: accountId,
            username: usernameParts.join(' '),
            phone: isPhone ? identifier : '',
            email: isPhone ? '' : identifier,
          };
        }
      } catch (error) {
        logging.error('accountShow error:', error);
        throw new CustomError(OBError.PK_IAM_001);
      }
    }

    logging.info('accountDetail', { ...accountDetail });
    const createdParkingDetail = await ParkingDetailsRepository.create({
      data: {
        uid: parkingDetails[0].logId,
        meta: JSON.stringify(parkingDetails),
        account_id: accountDetail?.id ?? null,
        email: accountDetail?.email ?? null,
        phone: accountDetail?.phone ?? null,
        username: accountDetail?.username ?? null,
        status: 'ACTIVE',
        plate_no: parkingDetails[0].plateNo,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return { parkingDetailId: createdParkingDetail.id };
  }

  public async getParkingDetailById(
    id: string,
    query: Prisma.ReceiptFindManyArgs,
    pageSize: number,
    pageNumber: number
  ): Promise<WrappedResponse<GetParkingDetailResponse>> {
    let formattedParkingDetail: GetParkingDetailResponse | undefined =
      undefined;
    const parkingDetail = await ParkingDetailsRepository.findUnique({
      where: {
        id,
      },
    });

    if (!parkingDetail) {
      logging.error(`parkingDetail ${id} not found:`);
      throw new CustomError(OBError.PK_PKD_002);
    }

    const accountDetail: ParkingAccountDetail = {
      id: parkingDetail?.account_id || '',
      email: parkingDetail?.email || '',
      phone: parkingDetail?.phone || '',
      username: parkingDetail?.username || '',
    };
    logging.info('accountDetail:', accountDetail);

    const receipts = await ReceiptRepository.findMany({
      ...query,
      where: {
        parking_detail_id: parkingDetail.id,
      },
      orderBy: query.orderBy
        ? query.orderBy
        : {
            created_at: 'desc',
          },
      include: {
        items: true,
      },
    });

    const formattedReceipts: Receipt[] = receipts?.map((receipt) => ({
      id: receipt.id,
      hashed_receipt: receipt?.uid ?? undefined,
      total: receipt?.total?.toString() ?? '',
      status: receipt.status as ReceiptStatus,
      message: receipt?.message ?? undefined,
      image_url: receipt.image_url,
      created_at: receipt.created_at.toISOString(),
      updated_at: receipt.updated_at.toISOString(),
      redeemed_at: parkingDetail.redeemed_at?.toISOString(),
      mall_name: receipt?.mall_name ?? undefined,
      merchant_name: receipt?.merchant_name ?? undefined,
      transaction_date: receipt?.transaction_date ?? undefined,
      transaction_time: receipt?.transaction_time ?? undefined,
      tax_id: receipt?.tax_id ?? undefined,
      receipt_no: receipt?.receipt_no ?? undefined,
      address: receipt?.address ?? undefined,
      unit_no: receipt?.unit_no ?? undefined,
      items: receipt.items.map((item) => ({
        id: item.id,
        description: item.description,
        ...(item.quantity && { quantity: item.quantity }),
        ...(item.total_price && { total_price: item.total_price.toString() }),
      })),
    }));

    const rateDetails =
      (parkingDetail?.rate_details as { en?: string; th?: string }) ?? {};

    formattedParkingDetail = {
      id: parkingDetail.id,
      record_id: parkingDetail.record_id || '',
      license_plate: parkingDetail.plate_no,
      parking_ticket: parkingDetail.uid,
      account_detail: accountDetail,
      total_amount: parkingDetail.total_amount.toString(),
      receipts: formattedReceipts,
      redeemed_at: parkingDetail.redeemed_at?.toISOString() || '',
      rate_detail: {
        en: rateDetails.en || '',
        th: rateDetails.th || '',
      },
    };

    const totalData = await ReceiptRepository.count({
      where: {
        parking_detail_id: parkingDetail.id,
      },
    });

    const pagination = this.paginationBuilder(
      totalData,
      pageSize,
      pageNumber
    ) as Pagination;

    return { data: formattedParkingDetail, pagination };
  }

  public async updateTotalAmount(parkingDetailId: string) {
    const receipts = await ReceiptRepository.findMany({
      where: {
        parking_detail_id: parkingDetailId,
        status: {
          in: ['SUCCESS', 'REDEEMED'],
        },
      },
      select: {
        total: true,
      },
    });

    const totalAmount = receipts.reduce((sum, receipt) => {
      return sum.plus(receipt.total ?? 0);
    }, new Decimal(0));

    await ParkingDetailsRepository.update({
      where: {
        id: parkingDetailId,
      },
      data: {
        total_amount: totalAmount.toString(),
      },
    });
  }

  public async redeemParkingDetail(
    logId: string,
    type: RedeemType,
    parkingId: string
  ): Promise<RedeemParkingDetailResponse> {
    const redeemerId = process.env.REDEEMER_ID;
    logging.info('redeemParkingDetail data:', {
      logId: logId,
      redeemerId,
    });
    if (!redeemerId) {
      throw new CustomError(OBError.PK_PKD_005);
    }

    const parkingData = await ParkingDetailsRepository.findUnique({
      where: {
        id: parkingId,
      },
    });

    if (!parkingData) {
      logging.error(`redeemParkingDetail error: ${parkingData}`);

      throw new CustomError(OBError.PK_PKD_002);
    }

    const rateCode = await this.campaignService.getRateCode(
      parkingData.total_amount.toDecimalPlaces(2).toNumber()
    );

    if (!rateCode) {
      logging.error(`getRateCode error: ${rateCode}`);
      throw new CustomError(OBError.CF_CP_003);
    }
    logging.info(`redeemerId ${redeemerId}`);

    // list of target parking detail's receipt with SUCCESS status
    const redeemableReceipts = await ReceiptRepository.findMany({
      where: {
        parking_detail_id: parkingId,
        status: 'SUCCESS',
      },
    });

    if (!redeemableReceipts.length) {
      logging.error(
        'redeemParkingDetail error: No redeemable receipts found.',
        { receiptCount: redeemableReceipts.length, data: redeemableReceipts }
      );
      throw new CustomError(OBError.PK_RX_003);
    }

    let redeemedData: WrappedResponseParkingTicketDataData | null = null;
    if (type === RedeemType.REDEEM) {
      const res = await BMSClient.parkingTicketsRedeem(
        logId,
        rateCode,
        redeemerId,
        ''
      ).catch((error) => {
        logging.error(`parkingTicketsRedeem error, ${error}`);
        throw new CustomError(OBError.PK_BMS_001);
      });
      redeemedData = res.data;
    }

    logging.info(`parkingTicketsRedeem response data:`, { ...redeemedData });

    if (!redeemedData) {
      logging.error('parkingTicketsRedeem data empty:', redeemedData);
      throw new CustomError(OBError.PK_PKD_003);
    }

    const createdRedeem = await RedeemRepository.create({
      data: {
        type: type,
        uid: logId,
        parking_detail_id: parkingId,
      },
    });

    await ReceiptRepository.updateMany({
      where: {
        parking_detail_id: parkingId,
        status: 'SUCCESS',
      },
      data: {
        status: 'REDEEMED',
        redeemed_at: new Date().toISOString(),
      },
    });

    const uidList = redeemableReceipts
      .map((receipt) => receipt.uid)
      .filter((uid): uid is string => uid !== null);

    // find list of receipts with the same uid but different parking_detail_id
    const duplicateReceipt = await ReceiptRepository.findMany({
      where: {
        uid: {
          in: uidList,
        },
        parking_detail_id: {
          not: parkingId,
        },
      },
      include: {
        parking_detail: true,
      },
    });

    for (const receipt of duplicateReceipt) {
      const total = receipt.parking_detail.total_amount;
      const updateTotal = total.minus(receipt.total ?? 0);
      await ReceiptRepository.update({
        where: {
          id: receipt.id,
        },
        data: {
          status: ReceiptStatus.DUPLICATED,
          parking_detail: {
            update: {
              total_amount: updateTotal,
            },
          },
        },
      });
    }
    await ParkingDetailsRepository.update({
      where: {
        id: parkingId,
      },
      data: {
        redeemed_at: new Date().toISOString(),
        rate_details: {
          en: redeemedData.rate_detail?.en,
          th: redeemedData.rate_detail?.th,
        },
      },
    });

    const receipts = await ReceiptRepository.findMany({
      where: {
        parking_detail_id: parkingId,
        status: 'REDEEMED',
      },
    });

    await ReceiptRedeemRepository.createMany({
      data: receipts.map((receipt) => ({
        redeem_id: createdRedeem.id,
        receipt_id: receipt.id,
      })),
    });

    return redeemedData;
  }

    public async getParkingDetailByUid(
    uid: string
  ): Promise<ParkingDetailByUidResponse> {
    const parkingDetail = await ParkingDetailsRepository.findUnique({
      where: {
        uid,
      },
    });

    if (!parkingDetail) {
      logging.error(`parkingDetail by uid ${uid} not found:`);
      throw new CustomError(OBError.PK_PKD_002);
    }
    logging.info("ParkingDetail by uid:", parkingDetail);

    return parkingDetail;
  }
}
