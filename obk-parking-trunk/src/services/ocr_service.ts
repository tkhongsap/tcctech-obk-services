// ocr_service.ts
import { ReceiptStatus } from '../../db/client/';
import OCRClient, {
  ReceiptData,
  ReceiptDataErrorResponse,
} from '../libs/ocr_client';
import { CustomError } from '../middlewares/error';
import ReceiptRepository from '../repositories/receipts_repository';
import { OBError } from '../utils/error_spec';
import logging from '../utils/logging';
import ParkingDetailService from './parking_detail_service';
import errorMessages from '../config/ocr_error_message.json';
import errorTHMessages from '../config/ocr_error_message_th.json';
import { Decimal } from '../../db/client/runtime/library';
import { EventProducer } from '../utils/kafka';

interface EventReceiptApprovedPayload {
  account_id: string;
  receipt_id: string;
  total_spending: Decimal | null;
}

interface EventReceiptDeclinedPayload {
  account_id: string;
  receipt_id: string;
  total_spending: Decimal | null;
  reason_en: string;
  reason_th: string;
}

export class OcrService {
  private mapErrorMessage(errorMessage: string): string {
    return (
      (errorMessages as Record<string, string>)[errorMessage] ||
      errorMessages["default_error"]
    );
  }

  public mapErrorTHMessage(errorMessage: string): string {
    return (
      (errorTHMessages as Record<string, string>)[
        errorMessage.replace(" ", "_")
      ] || errorTHMessages["Contact_Staff"]
    );
  }

  public sendReceiptApprovedEvent(
    status: ReceiptStatus,
    payload: EventReceiptApprovedPayload
  ) {
    if (status === ReceiptStatus.SUCCESS) {
      EventProducer.send({
        name: "ob-parking.receipt.approved",
        payload: { ...payload },
      });
    }
  }

  public sendReceiptDeclinedEvent(
    status: ReceiptStatus,
    payload: EventReceiptDeclinedPayload
  ) {
    if (
      status === ReceiptStatus.DECLINED ||
      status === ReceiptStatus.DUPLICATED
    ) {
      EventProducer.send({
        name: "ob-parking.receipt.declined",
        payload: {
          ...payload,
        },
      });
    }
  }

  public async validate(receiptId: string, url: string): Promise<void> {
    try {
      const encodeUrl = encodeURIComponent(url);
      logging.info(`validateReceipt encodeUrl ${encodeUrl}, receiptId ${receiptId}`);
      const result = await OCRClient.validateReceipt(encodeUrl);
      logging.info(`validateReceipt response: ${JSON.stringify(result.data)}`);

      if (!result) {
        logging.error('validateReceipt error result', result);
        throw new CustomError(OBError.PK_OCR_001);
      }

      const receiptData = result.data as ReceiptData;
      const targetReceipt = await ReceiptRepository.findUnique({
        where: {
          id: receiptId,
        },
      });
      const isExistingReceipt = await ReceiptRepository.findFirst({
        where: {
          uid: receiptData.hashed_receipt,
          parking_detail_id: targetReceipt?.parking_detail_id,
        },
      });
      const ocrReceiptStatus =
        receiptData.status === 'valid'
          ? ReceiptStatus.SUCCESS
          : ReceiptStatus.DECLINED;

      const receiptStatus = isExistingReceipt
        ? ReceiptStatus.DUPLICATED
        : ocrReceiptStatus;

      const messageOcr =
        ocrReceiptStatus === ReceiptStatus.SUCCESS
          ? receiptData.message
          : this.mapErrorMessage(receiptData.message);

      const message =
        receiptStatus === ReceiptStatus.DUPLICATED
          ? errorMessages['rv4']
          : messageOcr;
      
      const updatedReceipt = await ReceiptRepository.update({
        where: {
          id: receiptId,
        },
        data: {
          status: receiptStatus,
          uid: receiptData.hashed_receipt,
          message,
          total: receiptData.total?.toString().trim()
          ? new Decimal(receiptData.total.toString().replace(',', ''))
          : null,        
          merchant_name: receiptData.merchant_name,
          transaction_date: receiptData.transaction_date,
          transaction_time: receiptData.transaction_time,
          tax_id: receiptData.tax_id,
          receipt_no: receiptData.receipt_no,
          address: receiptData.address,
          unit_no: receiptData.unit_no,
          mall_name: receiptData.mall_name,
          items: {
            create: receiptData.items?.map((item) => ({
              description: item.description,
              ...(item.quantity && { quantity: item.quantity }),
              total_price: item.total_price?.toString().trim()
                ? new Decimal(item.total_price.toString().replace(',', ''))
                : null,
            })),
          },
          content: JSON.parse(JSON.stringify(receiptData)),
        },
        include: {
          items: true,
          parking_detail: true,
        },
      });

      if (
        updatedReceipt.parking_detail.account_id &&
        updatedReceipt.status === ReceiptStatus.SUCCESS
      ) {
        const payload = {
          account_id: updatedReceipt.parking_detail.account_id,
          receipt_id: updatedReceipt.receipt_no || '',
          total_spending: updatedReceipt.total,
        };
        this.sendReceiptApprovedEvent(updatedReceipt.status, payload);
      } else if (
        (updatedReceipt.parking_detail.account_id &&
          updatedReceipt.status === ReceiptStatus.DECLINED) ||
        (updatedReceipt.parking_detail.account_id &&
          updatedReceipt.status === ReceiptStatus.DUPLICATED)
      ) {
        const payload = {
          account_id: updatedReceipt.parking_detail.account_id,
          receipt_id: updatedReceipt.receipt_no || '',
          total_spending: updatedReceipt.total,
          reason_en: updatedReceipt.message || "",
          reason_th: this.mapErrorMessage(updatedReceipt.message as string),
        };
        this.sendReceiptDeclinedEvent(updatedReceipt.status, payload);
      }

      const parkingDetailService = new ParkingDetailService();
      await parkingDetailService.updateTotalAmount(
        updatedReceipt.parking_detail_id
      );
    } catch (error: any) {
      logging.error(`validateReceipt error: ${error}`);
      const errorStep =
        error?.response?.data?.detail?.step ||
        error?.message ||
        'Unknown error occurred';

      const errorData = error?.response?.data as ReceiptDataErrorResponse;
      logging.error(
        `validateReceipt error data: ${JSON.stringify(errorData, null, 1)}`
      );
      const errorReceiptData = errorData?.detail?.extracted_data;
      const message = this.mapErrorMessage(errorStep);
      const receiptUpdatedDeclined = await ReceiptRepository.update({
        where: {
          id: receiptId,
        },
        data: {
          status: ReceiptStatus.DECLINED,
          message,
          ...(errorReceiptData && {
            uid: errorReceiptData.hashed_receipt,
            total: errorReceiptData.total?.toString()?.trim()
              ? new Decimal(errorReceiptData.total.toString().replace(',', ''))
              : null,
            merchant_name: errorReceiptData.merchant_name,
            transaction_date: errorReceiptData.transaction_date,
            transaction_time: errorReceiptData.transaction_time,
            tax_id: errorReceiptData.tax_id,
            receipt_no: errorReceiptData.receipt_no,
            address: errorReceiptData.address,
            unit_no: errorReceiptData.unit_no,
            mall_name: errorReceiptData.mall_name,
            items: {
              create: errorReceiptData.items?.map((item) => ({
                description: item.description,
                ...(item.quantity && { quantity: item.quantity }),
                total_price: item.total_price?.toString().trim()
                ? new Decimal(item.total_price.toString().replace(',', ''))
                : null,              
              })),
            },
            content: JSON.parse(JSON.stringify(errorReceiptData)),
          }),
        },
        include: {
          items: true,
          parking_detail: true,
        },
      });
      if (receiptUpdatedDeclined.parking_detail.account_id) {
        const payload = {
          account_id: receiptUpdatedDeclined.parking_detail.account_id,
          receipt_id: receiptUpdatedDeclined.receipt_no || '',
          total_spending: receiptUpdatedDeclined.total,
          reason_en: message,
          reason_th: this.mapErrorTHMessage(message),
        };
        this.sendReceiptDeclinedEvent(receiptUpdatedDeclined.status, payload);
      }

      logging.info(
        `validateReceipt update status ${ReceiptStatus.DECLINED}, with error : ${JSON.stringify(errorData, null, 1)}`
      );
    }
  }
}
