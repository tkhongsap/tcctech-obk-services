/* eslint-disable @typescript-eslint/no-explicit-any */
import { HealthRepository } from '../../src/repositories/health_repository';

describe('HealthRepository', () => {
  let HealthRepository: HealthRepository;
  let prismaMock: any;

  beforeEach(() => {
    // prismaMock = {
    //   account: {
    //     create: jest.fn(),
    //   },
    // };

    // HealthRepository = new HealthRepository(prismaMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should check health and return it', async () => {
    const createAccountData = {};

    prismaMock.account.create.mockResolvedValue(createAccountData);

    const account = await HealthRepository.checkHelth();

    expect(prismaMock.account.create).toHaveBeenCalled();
    expect(account).toEqual(createAccountData);
  });
});
