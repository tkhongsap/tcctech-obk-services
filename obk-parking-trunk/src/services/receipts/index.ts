import { Prisma, PrismaClient } from '../../../db/client';
import { Decimal } from '../../../db/client/runtime/library';
import {
  GetAllReceiptQuery,
  GetAllReceiptResponse,
  QueriesReceiptController,
  ReceiptStatus,
  UpdateReceiptBody,
} from '../../controllers/receipts_controller_interface';
import { CustomError } from '../../middlewares/error';
import ItemRepository from '../../repositories/items_repository';
import ParkingDetailsRepository from '../../repositories/parking_details_repository';
import ReceiptRepository from '../../repositories/receipts_repository';
import { OBError } from '../../utils/error_spec';
import logging from '../../utils/logging';
import { OcrService } from '../ocr_service';
import ParkingDetailService from '../parking_detail_service';

export class ReceiptsService extends QueriesReceiptController {
  private readonly parkingDetailService: ParkingDetailService;
  private readonly ocrService: OcrService;

  constructor() {
    super();
    this.parkingDetailService = new ParkingDetailService();
    this.ocrService = new OcrService();
  }

  public async updateReceipt(
    updateReceiptData: UpdateReceiptBody,
    receiptId: string,
    parkingDetailId: string
  ): Promise<boolean> {
    const {
      merchant_name,
      transaction_date,
      transaction_time,
      items,
      total,
      tax_id,
      receipt_no,
      address,
      unit_no,
      mall_name,
      hashed_receipt,
      status,
      message,
    } = updateReceiptData;

    try {
      await new PrismaClient().$transaction([
        ReceiptRepository.update({
          where: { id: receiptId },
          data: {
            merchant_name,
            transaction_date,
            transaction_time,
            total: new Decimal(total ?? 0),
            tax_id,
            receipt_no,
            address,
            unit_no,
            mall_name,
            status,
            message,
          },
        }),
        ItemRepository.deleteMany({ where: { receipt_id: receiptId } }),
        ItemRepository.createMany({
          data: items.map((item) => ({
            ...item,
            receipt_id: receiptId,
            quantity: item?.quantity ?? null,
            total_price: item?.total_price
              ? new Decimal(item.total_price)
              : null,
          })),
        }),
      ]);
      if (status === ReceiptStatus.SUCCESS) {
        const currentReceipt = await ReceiptRepository.findUnique({
          where: { id: receiptId },
          include: {
            parking_detail: true,
          },
        });
        if (currentReceipt?.parking_detail.account_id) {
          const payload = {
            account_id: currentReceipt.parking_detail.account_id,
            receipt_id: currentReceipt.receipt_no || '',
            total_spending: currentReceipt.total,
          };
          this.ocrService.sendReceiptApprovedEvent(
            currentReceipt.status,
            payload
          );
        }
      } else if (
        status === ReceiptStatus.DECLINED ||
        status === ReceiptStatus.DUPLICATED
      ) {
        const currentReceipt = await ReceiptRepository.findUnique({
          where: { id: receiptId },
          include: {
            parking_detail: true,
          },
        });
        if (currentReceipt?.parking_detail.account_id) {
          const payload = {
            account_id: currentReceipt.parking_detail.account_id,
            receipt_id: currentReceipt.receipt_no || '',
            total_spending: currentReceipt.total,
            reason_en: currentReceipt.message as string,
            reason_th: this.ocrService.mapErrorTHMessage(
              currentReceipt.message as string
            ),
          };
          this.ocrService.sendReceiptDeclinedEvent(
            currentReceipt.status,
            payload
          );
        }
      }
    } catch (error) {
      logging.error(`update receipt ${receiptId} error:`, error);
      throw new CustomError(OBError.PK_RX_002);
    }

    await this.parkingDetailService.updateTotalAmount(parkingDetailId);

    return true;
  }

  public async getAllReceipt({
    created_at,
    redeemed_at,
    receipt_hashed_id,
    parking_id,
    content,
    ...query
  }: GetAllReceiptQuery): Promise<GetAllReceiptResponse[]> {
    const { ..._query } = this.buildQuery<Prisma.ReceiptFindManyArgs>({
      ...query,
    });

    const convertedContent = content?.split('|').reduce(
      (acc, keywords) => {
        const [key, value] = keywords.split(':');
        if (key && value) {
          acc[key.trim()] = value.trim();
        }
        return acc;
      },
      {} as Record<string, string>
    );

    logging.info('Converted content:', convertedContent);
    const filterByUserId: Prisma.ParkingDetailWhereInput = {
      account_id: query.user_id,
    };

    const receiptContentFilter = Object.entries(convertedContent ?? {}).map(
      ([key, value]) => ({
        content: {
          path: [key],
          equals: value,
        },
      })
    );

    const where: Prisma.ReceiptWhereInput = {
      ..._query.where,
      ...(receipt_hashed_id && { uid: receipt_hashed_id }),
      parking_detail: filterByUserId ? { ...filterByUserId } : undefined,
    };

    if (created_at && !isNaN(Date.parse(created_at))) {
      where.created_at = { gte: new Date(created_at).toISOString() };
    }

    if (redeemed_at && !isNaN(Date.parse(redeemed_at))) {
      where.redeemed_at = { gte: new Date(redeemed_at).toISOString() };
    }

    if (parking_id) {
      where.parking_detail_id = parking_id;
    }

    const receipts = await ReceiptRepository.findMany({
      where: {
        ...where,
        AND: receiptContentFilter,
      },
      include: {
        parking_detail: true,
        items: true,
      },
    });
    logging.info(`getAllReceipt`, receipts);
    const redemptions: GetAllReceiptResponse[] = receipts.map((receipt) => {
      return {
        id: receipt.id,
        receipt_hashed_id: receipt.uid || '',
        user_id: receipt.parking_detail?.account_id ?? undefined,
        parking_id: receipt.parking_detail_id,
        total: receipt.total?.toString() ?? '0',
        redeemed_at: receipt?.redeemed_at?.toISOString() ?? undefined,
        created_at: receipt.created_at.toISOString(),
        content: JSON.parse(JSON.stringify(receipt.content)),
        status: receipt.status as ReceiptStatus,
      };
    });

    return redemptions;
  }
}
