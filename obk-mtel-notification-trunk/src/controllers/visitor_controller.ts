import { Controller, Post, OperationId, Route, Body } from 'tsoa';
import { WrappedResponse } from './base_controller.interfaces';
import { MessageService } from '../services/message_service';
import { VisitorVehicleCheckoutBody, VisitorVehicleCheckoutResult } from './visitor_controller.interfaces';
import { ResidentVisitorPassPayload } from '../services/interfaces/message_interface';

@Route('visitor')
export class VisitorController extends Controller {
  @Post('/vehicle-checkout')
  @OperationId('visitor.vehicle.checkout.create')
  public async vehicleCheckout(
    @Body() body: VisitorVehicleCheckoutBody,
  ): Promise<WrappedResponse<VisitorVehicleCheckoutResult>> {
    const { checkout_time, account_id, visitor_email } = body;
    const messageService = new MessageService();

    const visitorPassPayload: ResidentVisitorPassPayload = {
      account_id: account_id || '',
      visitor_email: visitor_email,
      valueMessage: {
        checkout_time: checkout_time || '',
      },
      invite_name: '',
      invite_house_number: '',
    };

    await messageService.sendEmailToResidentVisitor({
      name: 'ob-bms.visitor_resident_vehicle_checkout.created',
      payload: visitorPassPayload,
    });
    this.setStatus(200);

    return { data: { result: true } };
  }
}
