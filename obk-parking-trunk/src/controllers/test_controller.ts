import { Controller, Get, OperationId, Route } from 'tsoa';

@Route('test')
export class TestController extends Controller {
  @Get('')
  @OperationId('test.test')
  public async test(): Promise<{ status: string }> {
    this.setStatus(200);
    return {
      status: 'ok',
    };
  }
}
