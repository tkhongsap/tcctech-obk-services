import {
  Body,
  Get,
  Header,
  OperationId,
  Patch,
  Post,
  Queries,
  Route,
} from 'tsoa';
import { BaseController } from './base_controller';
import {
  CreateReceiptBody,
  GetAllReceiptQuery,
  GetAllReceiptResponse,
  UpdateReceiptBody,
} from './receipts_controller_interface';
import ReceiptRepository from '../repositories/receipts_repository';
import { CustomError } from '../middlewares/error';
import { OBError } from '../utils/error_spec';
import { ReceiptsService } from '../services/receipts';

@Route('receipt')
export class ReceiptsController extends BaseController {
  @Post('/create-receipt')
  @OperationId('receipt.create-receipt')
  public async createReceipt(
    @Body() body: CreateReceiptBody,
    @Header('x-account-id') xAccountId?: string
  ): Promise<boolean> {
    if (!xAccountId) throw new CustomError(OBError.PK_ACC_001);

    const { parkingDetailId, imageUrl, email } = body;
    await ReceiptRepository.create({
      data: {
        parking_detail: {
          connect: {
            id: parkingDetailId,
          },
        },
        uid: '',
        image_url: imageUrl,
        status: 'PENDING',
        created_by: email ?? xAccountId,
        updated_by: email ?? xAccountId,
      },
    });

    this.setStatus(200);
    return true;
  }

  @Patch('/update-receipt')
  @OperationId('receipt.update-receipt')
  public async updateReceipt(
    @Body() body: UpdateReceiptBody
  ): Promise<boolean> {
    const { id } = body;

    const targetReceipt = await ReceiptRepository.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        parking_detail_id: true,
      },
    });
    if (!targetReceipt || !targetReceipt.id) {
      throw new CustomError(OBError.PK_RX_001);
    }
    const receiptService = new ReceiptsService();

    const updateReceipt = receiptService.updateReceipt(
      body,
      targetReceipt.id,
      targetReceipt.parking_detail_id
    );

    if (!updateReceipt) {
      throw new CustomError(OBError.PK_RX_002);
    }

    this.setStatus(200);
    return updateReceipt;
  }

  @Get('/all')
  @OperationId('receipt.all')
  public async getAllReceipt(
    @Queries() query: GetAllReceiptQuery
  ): Promise<GetAllReceiptResponse[]> {
    const receiptService = new ReceiptsService();
    const redemptionData = receiptService.getAllReceipt(query);

    this.setStatus(200);
    return redemptionData;
  }
}
