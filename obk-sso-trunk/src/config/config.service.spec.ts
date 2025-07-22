import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService as DefaultConfigService } from '@nestjs/config';
import { ConfigService } from './config.service';
import { ConfigType } from './configuration';

describe('ConfigService', () => {
  let service: ConfigService;
  let defaultConfigService: jest.Mocked<DefaultConfigService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        {
          provide: DefaultConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(ConfigService);
    defaultConfigService = module.get(DefaultConfigService);
  });

  it('should return a typed config value', () => {
    const mockValue: ConfigType['PORT'] = '3000';
    defaultConfigService.get.mockReturnValue(mockValue);

    const value = service.get('PORT');

    expect(value).toBe(mockValue);
  });
});
