import BaseRepository from '../../src/repositories/base_repository';
import {
  anything,
  deepEqual,
  instance,
  mock,
  spy,
  verify,
  when,
} from 'ts-mockito';
import { DateTime } from 'luxon';
import { OtpService } from '../../src/services';
import { OtpRepository } from '../../src/repositories';
import { CustomError } from '../../src/middlewares/error';
import { OBError } from '../../src/openapi/error_spec';
import { DateTimeUtils } from 'ob-common-lib/dist';
import { otp } from '../../db/client';

describe('OTP - verify', () => {
  let otpService: OtpService;
  let otpRepository: OtpRepository;
  let baseRepoMock: BaseRepository;
  beforeEach(() => {
    jest.resetModules();
    otpRepository = mock(OtpRepository);
    baseRepoMock = mock(BaseRepository);
    otpService = new OtpService(
      instance(otpRepository),
      instance(baseRepoMock),
    );
  });

  const luxonDateTime = DateTime.now();
  const jsDate = luxonDateTime.toJSDate();
  const expireDateTime = luxonDateTime.plus({ days: 1 }).toJSDate();

  it('should verify successful when code is 000000', async () => {
    when(otpRepository.findBy(deepEqual({ reference: 'abcd' }))).thenReturn(
      Promise.resolve({
        id: '1',
        reference: 'abcd',
        code: '000000',
        expired_at: jsDate,
        updated_at: jsDate,
        created_at: jsDate,
        identifier: 'rungwat.n@gmail.com',
      }),
    );

    const result = await otpService.verify('abcd', '000000');

    expect(result).toEqual({
      id: '1',
      reference: 'abcd',
      code: '000000',
      expired_at: jsDate,
      updated_at: jsDate,
      created_at: jsDate,
      identifier: 'rungwat.n@gmail.com',
    });
  });

  it('should verify unsuccessful when code is 000000', async () => {
    when(otpRepository.findBy(deepEqual({ reference: 'abcd ' }))).thenReturn(
      Promise.resolve(null),
    );

    try {
      await otpService.verify('abcd', '000000');
    } catch (error) {
      expect(error).toBeInstanceOf(CustomError);
    }
  });

  it('should verify successful when code is not 000000', async () => {
    when(
      otpRepository.findBy(deepEqual({ reference: 'abcd', code: '123456' })),
    ).thenReturn(
      Promise.resolve({
        id: '1',
        reference: 'abcd',
        code: '123456',
        expired_at: expireDateTime,
        updated_at: jsDate,
        created_at: jsDate,
        identifier: 'rungwat.n@gmail.com',
      }),
    );

    const result = await otpService.verify('abcd', '123456');

    expect(result).toEqual({
      id: '1',
      reference: 'abcd',
      code: '123456',
      expired_at: expireDateTime,
      updated_at: jsDate,
      created_at: jsDate,
      identifier: 'rungwat.n@gmail.com',
    });
  });
});

describe('OTP - generate ', () => {
  let otpService: OtpService;
  let otpRepository: OtpRepository;
  let baseRepoMock: BaseRepository;
  const identifier = 'test@mail.com';
  const mockOtp = {
    id: '1234',
    reference: 'efgh',
    code: '78910',
    expired_at: DateTimeUtils.addTime(new Date(), 1, 'hours').toDate(),
    updated_at: DateTimeUtils.getCurrentDateTime().toDate(),
    created_at: DateTimeUtils.getCurrentDateTime().toDate(),
    identifier: identifier,
  };
  const mockOtps: otp[] = [...Array(2)].map((_, i) => {
    return {
      id: i.toString(),
      reference: 'abcd',
      code: '123456',
      expired_at: DateTimeUtils.addTime(new Date(), 1, 'hours').toDate(),
      updated_at: DateTimeUtils.getCurrentDateTime().toDate(),
      created_at: DateTimeUtils.getCurrentDateTime().toDate(),
      identifier: identifier,
    };
  });

  beforeEach(() => {
    otpRepository = mock(OtpRepository);
    baseRepoMock = mock(BaseRepository);
    otpService = new OtpService(
      instance(otpRepository),
      instance(baseRepoMock),
    );
  });

  it('should return otp', async () => {
    when(otpRepository.UpdateMany(anything())).thenReturn(Promise.resolve());
    when(otpRepository.create(anything())).thenReturn(Promise.resolve(mockOtp));
    when(otpRepository.findMany(anything())).thenReturn(
      Promise.resolve(mockOtps),
    );
    when(baseRepoMock.transaction(anything(), anything())).thenResolve(
      mockOtp as unknown,
    );
    const result = await otpService.generate(identifier);

    expect(result).toBe(mockOtp);
  });

  it('should throw IAM_OTP_001 when request OTP more than 10 ', async () => {
    let result;
    try {
      const exceedMockOtps: otp[] = [...Array(10)].map((_, i) => {
        return {
          id: i.toString(),
          reference: 'abcd',
          code: '123456',
          expired_at: DateTimeUtils.addTime(new Date(), 1, 'hours').toDate(),
          updated_at: DateTimeUtils.getCurrentDateTime().toDate(),
          created_at: DateTimeUtils.getCurrentDateTime().toDate(),
          identifier: identifier,
        };
      });
      when(otpRepository.findMany(anything())).thenReturn(
        Promise.resolve(exceedMockOtps),
      );
      expect(await otpService.generate(identifier)).toThrowError();
    } catch (error) {
      result = error;
    }
    const expectError = new CustomError(OBError.IAM_OTP_001);
    expect(result).toStrictEqual(expectError);
  });

  it('should throw OBError.IAM_OTP_002 when transaction failed', async () => {
    try {
      when(otpRepository.findMany(anything())).thenReturn(
        Promise.resolve(mockOtps),
      );
      when(baseRepoMock.transaction(anything(), anything())).thenResolve(
        undefined as unknown,
      );
      expect(await otpService.generate(identifier)).toThrowError();
    } catch (error) {
      const expectError = new CustomError(OBError.IAM_OTP_002);
      expect(error).toStrictEqual(expectError);
    }
  });
});

describe('OTP - sendCode ', () => {
  let otpService: OtpService;
  let otpRepository: OtpRepository;
  let baseRepoMock: BaseRepository;

  beforeEach(() => {
    otpRepository = mock(OtpRepository);
    baseRepoMock = mock(BaseRepository);
    otpService = new OtpService(
      instance(otpRepository),
      instance(baseRepoMock),
    );
  });

  it('should correctly call sendSms function when provider is phone', async () => {
    const code = '78910';
    const reference = 'ascb';
    const phoneNumber = '0812345678';

    const spyOTP = spy(otpService);
    await otpService.sendCode(code, reference, {
      identifier: phoneNumber,
      provider: 'phone',
    });
    verify(spyOTP.sendSms(code, reference, phoneNumber)).once();
  });
  it('should correctly call sendEmail function when provider is email', async () => {
    const code = '78910';
    const reference = 'ascb';
    const email = 'test@email.com';

    const spyOTP = spy(otpService);
    await otpService.sendCode(code, reference, {
      identifier: email,
      provider: 'email',
    });
    verify(spyOTP.sendEmail(code, reference, email)).once();
  });
});

describe('OTP - bulkDelete ', () => {
  let otpService: OtpService;
  let otpRepository: OtpRepository;
  let baseRepoMock: BaseRepository;

  beforeEach(() => {
    otpRepository = mock(OtpRepository);
    baseRepoMock = mock(BaseRepository);
    otpService = new OtpService(
      instance(otpRepository),
      instance(baseRepoMock),
    );
  });

  it('should return true when completely call db operation', async () => {
    const phoneNumber = '0812345678';

    const where = {
      identifier: phoneNumber,
    };
    const spyOTP = spy(otpService);
    when(spyOTP.bulkDelete(where)).thenResolve(true);
    const result = await otpService.bulkDelete(where);

    verify(spyOTP.bulkDelete(where)).once();
    expect(result).toBe(true);
  });
});
