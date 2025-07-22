import { Controller, Route, Get, OperationId } from 'tsoa';

@Route('health')
export class HealthController extends Controller {
  @Get('')
  @OperationId('health')
  public async health(): Promise<string> {
    this.setStatus(200);
    return 'Ok';
  }
}
