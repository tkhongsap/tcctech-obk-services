import { ReceiptStatus } from '../../src/controllers/receipts_controller_interface';
import ParkingDetailsRepository from '../../src/repositories/parking_details_repository';
import ReceiptRepository from '../../src/repositories/receipts_repository';
import { resetDB } from '../helpers/db';
import OCRClient from '../../src/libs/ocr_client';
import { OcrService } from '../../src/services/ocr_service';
import { AxiosHeaders } from 'axios';
import { MOCK_OCR_RECEIPT } from '../fixtures/receipt';
import { Decimal } from '../../db/client/runtime/library';

beforeEach(async () => {
  await resetDB();
});

afterEach(async () => {
  await resetDB();
});

describe('OCR Service', () => {
  it('should update receipt success', async () => {
    const parkingDetail = await ParkingDetailsRepository.create({
      data: {
        id: '1',
        uid: '123456789',
        status: 'ACTIVE',
        plate_no: '1ก1234',
      },
    });

    const receipt = await ReceiptRepository.create({
      data: {
        id: '1',
        parking_detail: {
          connect: {
            id: parkingDetail.id,
          },
        },
        uid: '',
        image_url: 'https://ik.imagekit.io/abp2wccrz/Yamazaki_T-Off_01_2.jpg',
        status: ReceiptStatus.PENDING,
        created_by: 'test@gmail.com',
        updated_by: 'test@gmail.com',
      },
    });

    const ocrService = new OcrService();
    jest.spyOn(OCRClient, 'validateReceipt').mockResolvedValueOnce({
      status: 1,
      statusText: '',
      headers: {},
      config: {
        headers: new AxiosHeaders(),
      },
      data: { ...MOCK_OCR_RECEIPT[0] },
    });
    await ocrService.validate(receipt.id, receipt.image_url);

    const updatedReceipt = await ReceiptRepository.findUnique({
      where: {
        id: receipt.id,
      },
      include: {
        items: true,
      },
    });

    const updatedParkingDetail = await ParkingDetailsRepository.findUnique({
      where: {
        id: parkingDetail.id,
      },
    });

    expect(updatedReceipt?.total).toEqual(
      new Decimal(MOCK_OCR_RECEIPT[0].total.replace(',', ''))
    );
    expect(updatedReceipt?.content).toEqual(
      JSON.parse(JSON.stringify(MOCK_OCR_RECEIPT[0]))
    );
    expect(updatedParkingDetail?.total_amount).toEqual(
      new Decimal(MOCK_OCR_RECEIPT[0].total.replace(',', ''))
    );
  });
  it('should update receipt success with null value', async () => {
    const parkingDetail = await ParkingDetailsRepository.create({
      data: {
        id: '1',
        uid: '123456789',
        status: 'ACTIVE',
        plate_no: '1ก1234',
      },
    });

    const receipt = await ReceiptRepository.create({
      data: {
        id: '1',
        parking_detail: {
          connect: {
            id: parkingDetail.id,
          },
        },
        uid: '',
        image_url: 'https://ik.imagekit.io/abp2wccrz/Yamazaki_T-Off_01_2.jpg',
        status: ReceiptStatus.PENDING,
        created_by: 'test@gmail.com',
        updated_by: 'test@gmail.com',
      },
    });

    const ocrService = new OcrService();
    jest.spyOn(OCRClient, 'validateReceipt').mockResolvedValueOnce({
      status: 1,
      statusText: '',
      headers: {},
      config: {
        headers: new AxiosHeaders(),
      },
      data: { ...MOCK_OCR_RECEIPT[1] },
    });
    await ocrService.validate(receipt.id, receipt.image_url);

    const updatedReceipt = await ReceiptRepository.findUnique({
      where: {
        id: receipt.id,
      },
      include: {
        items: true,
      },
    });

    const updatedParkingDetail = await ParkingDetailsRepository.findUnique({
      where: {
        id: parkingDetail.id,
      },
    });

    expect(updatedReceipt?.total).toEqual(
      new Decimal(MOCK_OCR_RECEIPT[1].total.replace(',', ''))
    );
    expect(updatedReceipt?.content).toEqual(
      JSON.parse(JSON.stringify(MOCK_OCR_RECEIPT[1]))
    );
    expect(updatedParkingDetail?.total_amount).toEqual(
      new Decimal(MOCK_OCR_RECEIPT[1].total.replace(',', ''))
    );
  });
});
