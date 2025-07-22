import { Test } from '@nestjs/testing';
import { AccountModule } from './account.module';

describe('AccountModule', () => {
  it('should compile without error', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AccountModule],
    }).compile();

    expect(moduleRef).toBeDefined();
  });
});
