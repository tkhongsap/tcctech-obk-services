import { DateTime } from 'luxon';
import { OtpService } from '../../src/services';
import * as utils from '../../src/utils/identifier';
import { otp } from '../../db/client';

import request from 'supertest';

import { createServer } from '../../src/utils/server';
import { Express } from 'express-serve-static-core';

jest.mock('../../src/services');
jest.mock('../../src/utils/identifier');
describe('Otp controller', () => {
  const luxonDateTime = DateTime.now();
  const jsDate = luxonDateTime.toJSDate();
  let app: Express;
  const mockOtp: otp = {
    id: '1',
    reference: 'abcd',
    code: '000000',
    expired_at: jsDate,
    updated_at: jsDate,
    created_at: jsDate,
    identifier: 'rungwat.n@gmail.com',
  };
  beforeAll(async () => {
    app = await createServer();
  });

  describe('POST /otp/request - request', () => {
    it('should call request controller and response otp reference', async () => {
      const otpGenerateMock = jest
        .spyOn(OtpService.prototype, 'generate')
        .mockImplementationOnce(() => {
          return Promise.resolve(mockOtp);
        });
      const otpSendCodeMock = jest
        .spyOn(OtpService.prototype, 'sendCode')
        .mockImplementationOnce(() => {
          return Promise.resolve();
        });
      const getIdentifierMock = jest
        .spyOn(utils, 'getIdentifier')
        .mockImplementationOnce(() => {
          return 'mockIdentifier';
        });
      const result = await request(app)
        .post('/otp/request')
        .set('X-Access-Token', 'test')
        .send({
          identity: {
            provider: 'email',
            identifier: 'test',
          },
        });
      const expectedResult = {
        otp: {
          reference: mockOtp.reference,
        },
      };
      expect(otpGenerateMock).toHaveBeenCalled();
      expect(getIdentifierMock).toHaveBeenCalled();
      expect(otpSendCodeMock).toHaveBeenCalled();
      expect(result.body.data).toStrictEqual(expectedResult);
    });
  });
  describe('POST /otp/verify - verify', () => {
    it('should call verify controller and response otp id', async () => {
      const otpVerifyeMock = jest
        .spyOn(OtpService.prototype, 'verify')
        .mockImplementationOnce(() => {
          return Promise.resolve(mockOtp);
        });

      const result = await request(app)
        .post('/otp/verify')
        .set('X-Access-Token', 'test')
        .send({
          otp: {
            reference: mockOtp.reference,
            code: mockOtp.code,
          },
        });
      const expectedResult = {
        otp: {
          id: mockOtp.id,
        },
      };
      expect(otpVerifyeMock).toHaveBeenCalled();
      expect(result.body.data).toStrictEqual(expectedResult);
    });
  });
});
