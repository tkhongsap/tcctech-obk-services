import { Get, Header, Middlewares, OperationId, Path, Route } from 'tsoa';
import { BaseController } from './base_controller';
import { WrappedResponse } from './base_controller.interfaces';
import { PaymentShowResponseData } from './payments_controller.interfaces';
import { paymentSerializer } from './payments_controller.serializer';
import { PaymentService } from '../services';
import { Authorizer } from '../middlewares/authorizer';

@Route('payments')
export class PaymentsController extends BaseController {
  @Get('{id}')
  @Middlewares(
    Authorizer({
      resource: 'payment',
      action: 'read',
    }),
  )
  @OperationId('payments.show')
  public async show(
    @Path() id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Header('x-permissions') header?: string,
  ): Promise<WrappedResponse<PaymentShowResponseData | null>> {
    const service = new PaymentService();
    const payment = await service.findByIdOrReferenceNumber(id);

    const data = paymentSerializer(payment);
    this.setStatus(200);
    return {
      data: data,
    };
  }
}
