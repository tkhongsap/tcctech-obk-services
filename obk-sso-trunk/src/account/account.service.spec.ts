import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AccountService', () => {
  let service: AccountService;

  const mockPrisma = {
    account: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  it('should return an account if found', async () => {
    const mockAccount = {
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockPrisma.account.findUnique.mockResolvedValue(mockAccount);

    const result = await service.findById('1');
    expect(result).toEqual(mockAccount);
  });
});
