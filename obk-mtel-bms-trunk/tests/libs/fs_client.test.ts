import FSClient from '../../src/libs/fs_client';

// Assuming FSClient is your class instance
(FSClient as any).fsUsername = 'mockUsername';
(FSClient as any).fsPassword = 'mockPassword';

let spy: any;

afterEach(() => {
  spy && spy.mockRestore();
});

const MOCK_LOGIN_RESPONSE = {
  data: {
    message: 'Successfully!',
    status: 0,
    data: {
      user_ID: 10000,
      user_Name: 'mtel',
      firstName: 'Mtel',
      lastName: 'SYSTEM',
      department: null,
      position: null,
      note: null,
      active: true,
      isLogIn: true,
      token: 'mockToken',
      role_ID: 2,
    },
  },
};

const MOCK_GET_CALL_LIFT_RESPONSE = {
  data: {
    message: 'Successfully!',
    status: 0,
    data: {
      personID: '7c0426af-ee20-4d8f-a7ad-305a5cac65ed',
      liftName: 'D',
      floorID: 17,
      floorName: 'L17',
    },
  },
};

const MOCK_INVITE_PRE_REGISTER_RESPONSE = {
  data: {
    message: 'Successfully!',
    status: 0,
    data: {
      inviteID: '27a449a8-7ea2-4934-26ae-08dba4b3d0e9',
    },
  },
};

describe('FS Client Service', () => {
  describe('fetchToken', () => {
    it('should throw error on failed login', async () => {
      FSClient.token = undefined;
      spy = jest.spyOn(FSClient.httpClient, 'post').mockResolvedValueOnce({}).mockResolvedValueOnce({});

      await expect(FSClient.fetchToken()).rejects.toThrow('FS_AUTHENTICATION_FAILED');
    });

    it('should return token', async () => {
      spy = jest.spyOn(FSClient.httpClient, 'post').mockResolvedValueOnce({}).mockResolvedValue(MOCK_LOGIN_RESPONSE);

      const token = await FSClient.fetchToken();

      expect(token).toBe('mockToken');
    });
  });

  describe('liftCall', () => {
    it('should return valid response', async () => {
      spy = jest.spyOn(FSClient.httpClient, 'post').mockResolvedValue(MOCK_GET_CALL_LIFT_RESPONSE);

      const res = await FSClient.liftCall({
        personID: '7C0426AF-EE20-4D8F-A7AD-305A5CAC65ED',
        locationID: '1',
        destinationFloorID: '17',
      });

      expect(res.data.status).toBe(0);
    });
  });

  describe('invitePreRegister', () => {
    it('should return valid response', async () => {
      spy = jest.spyOn(FSClient.httpClient, 'post').mockResolvedValue(MOCK_INVITE_PRE_REGISTER_RESPONSE);

      const res = await FSClient.invitePreRegister({
        guestInviteDocNo: '11111111111111111',
        guestInviteName: 'John Doe',
        tenantID: '1',
        locationID: '3',
        personID: '14342eb6-6690-40b4-bc74-f68cbac5e70a',
        inviteSchedule: [
          {
            endDate: '2024-10-17T17:32:38.257Z',
            startDate: '2024-10-17T07:32:38.257Z',
          },
        ],
      });

      expect(res.data.status).toBe(0);
    });
  });
});
