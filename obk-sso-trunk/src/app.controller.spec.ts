import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('GET /healh', () => {
    it('should return successfully', async () => {
      const result = await appController.health();
      expect(result).toHaveProperty('appVersion');
    });
  });
});
