import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

describe('AccountController', () => {
  let controller: AccountController;

  const mockAccount = {
    id: '123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAccountService = {
    findById: jest.fn().mockResolvedValue(mockAccount),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useValue: mockAccountService,
        },
      ],
    }).compile();

    controller = module.get(AccountController);
  });

  it('should return account data by id', async () => {
    const result = await controller.show('123');
    expect(result).toEqual({ data: mockAccount });
  });
});
