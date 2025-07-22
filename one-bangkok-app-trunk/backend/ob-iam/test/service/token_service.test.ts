import { anything, instance, mock, when } from 'ts-mockito';
import { TokenRepository } from '../../src/repositories';
import TokenService from '../../src/services/token_service';
import { account } from '../../db/client';
import { DateTimeUtils } from 'ob-common-lib/dist';
describe('token - find', () => {
  let tokenService: TokenService;
  let tokenRepository: TokenRepository;

  beforeEach(() => {
    tokenRepository = mock(TokenRepository);
    tokenService = mock(TokenService);
    tokenService = new TokenService(instance(tokenRepository));
  });

  it('should return token', async () => {
    const type = 'qr';
    const mockAccount: account = {
      id: '12345678',
      password: '2343564yhrfbvdfew345t4',
      created_at: DateTimeUtils.getCurrentDateTime().toDate(),
      updated_at: DateTimeUtils.getCurrentDateTime().toDate(),
      deleted_at: null,
    };
    const mockToken = {
      id: '45789',
      value:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYjA5ZDJjNC1lYTQ4LTQwMjEtOWQ4ZC1mMGRhODg5OWY1OTQiLCJpYXQiOjE2OTkzNzIxMDMsImV4cCI6MTcwMTk2NDEwMywicGVybWlzc2lvbiI6W3siaWQiOiIzYmY5ZjUzYy1hY2Y3LTQ0NjUtODg5ZS1lYWRiNGEyMGU1ZGUiLCJwZXJtaXR0ZWVfdHlwZSI6ImFjY291bnQiLCJ2YWx1ZSI6eyJuYW1lIjoib2ItYm1zOmZzIiwic2VydmljZSI6Im9iLWJtcyIsImFjdGlvbnMiOlsiKiJdLCJyZXNvdXJjZV90eXBlIjoiZnMiLCJyZXNvdXJjZSI6eyJpZCI6InNlbGYifX0sImNyZWF0ZWRfYXQiOiIyMDIzLTExLTA2VDE4OjM5OjAwLjg4NVoiLCJ1cGRhdGVkX2F0IjoiMjAyMy0xMS0wNlQxODozOTowMC44ODVaIiwiZGVsZXRlZF9hdCI6bnVsbCwiYWNjb3VudF9pZCI6ImJiMDlkMmM0LWVhNDgtNDAyMS05ZDhkLWYwZGE4ODk5ZjU5NCIsImFjY291bnRfZ3JvdXBfaWQiOm51bGx9XX0.UluiPuR9Dah4KB6vmLGB84DeL2_mqZFaDBUDFzBgIn0',
      account_id: mockAccount.id,
      expired_date: DateTimeUtils.getCurrentDateTime().toDate(),
      type: 'long live',
      active: true,
      created_at: DateTimeUtils.getCurrentDateTime().toDate(),
      updated_at: DateTimeUtils.getCurrentDateTime().toDate(),
      account: mockAccount,
    };

    when(tokenRepository.findBy(anything())).thenResolve(mockToken);

    const result = await tokenService.find(mockAccount.id, type);

    expect(result).toEqual(mockToken);
  });
});
