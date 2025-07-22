import { DateTime } from 'luxon';
import BaseRepository from '../../src/repositories/base_repository';
import { AuthService } from '../../src/services';

beforeAll(() => {
  process.env.JWT_SECRET_KEY = '1234567890';
});

describe('Auth service', () => {
  const luxonDateTime = DateTime.now();
  const jsDate = luxonDateTime.toJSDate();
  describe('generateQRToken', () => {
    it('return qr token', async () => {
      const authService = new AuthService();

      const mockExternalIdentityRepository = {
        find: jest.fn().mockResolvedValue({
          uid: 'FS01',
          account_id: 'OB01',
        }),
      };

      const mockTokenRepository = {
        createToken: jest.fn().mockResolvedValue({
          id: 'QRTOKEN01',
        }),
        updateMany: jest.fn().mockResolvedValue({}),
      };

      jest.spyOn(BaseRepository.prototype, 'transaction').mockResolvedValue({
        id: 'QRTOKEN01',
        value: 'xxx',
        account_id: '1111',
        expired_date: jsDate,
        type: 'long live',
        created_at: jsDate,
        updated_at: jsDate,
        active: true,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (authService as any).externalIdentityRepository =
        mockExternalIdentityRepository;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (authService as any).tokenRepository = mockTokenRepository;

      const token = await authService.generateQRToken('IAM01');

      expect(token.id).toEqual('QRTOKEN01');
    });
  });
});
