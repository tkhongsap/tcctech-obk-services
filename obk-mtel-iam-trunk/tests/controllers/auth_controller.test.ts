import AuthService from '../../src/services/auth_service';
import { IdentityProvider, ProfileGender } from '../../db/client/index';
import app from '../../src/app';
import request from 'supertest';

jest.mock('../../src/services/auth_service');

describe('Auth controller', () => {
  const mockAuth = {
    profile: {
      first_name: 'test',
      middle_name: '',
      last_name: 'test',
      dob: '1994/11/09',
      gender: ProfileGender.male,
    },
    identities: {
      identifier: 'testk@mtel.co.th',
      provider: IdentityProvider.sso,
    },
    password: 'password',
    device: {
      device_id: '1123',
      os: 'ios',
    },
    push_token: {
      value: 'xx',
      type: 'FCM',
    },
  };
  const mockLoginResult = {
    token: {
      value: 'test',
    },
    identity: mockAuth.identities,
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('POST /auth/login - login', () => {
    it('should call login controller and response login result', async () => {
      const settingFindMock = jest.spyOn(AuthService.prototype, 'login').mockImplementationOnce(() => {
        return Promise.resolve(mockLoginResult);
      });
      const result = await request(app)
        .post('/auth/login')
        .send({
          identity: {
            identifier: 'testk@mtel.co.th',
            provider: 'email',
          },
          password: 'password',
        });

      expect(settingFindMock).toHaveBeenCalled();
      expect(result.status).toStrictEqual(200);
      expect(result.body.data).toStrictEqual(mockLoginResult);
    });
  });
});
