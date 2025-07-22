import * as OB_IAM_SDK from 'ob-iam-sdk';

import AcRequestService from '../../src/services/ac_request_service'; // Adjust the path as necessary
import { ACRequestRepository } from '../../src/repositories';

jest.mock('ob-iam-sdk', () => ({
  client: {
    accountShow: jest.fn(),
  },
}));

jest.mock('../../src/repositories', () => ({
    ACRequestRepository: {
    update: jest.fn(),
  },
}));

describe('ServiceRequestService', () => {
  let acRequestService: AcRequestService;

  beforeEach(() => {
    acRequestService = new AcRequestService();
    jest.clearAllMocks();
  });

  it('should log and return null when OB_IAM_SDK.client.accountShow returns falsy value', async () => {
    const serviceRequestId = '123';
    const accountId = '456';

    // Mock OB_IAM_SDK.client.accountShow to return a falsy value
    (OB_IAM_SDK.client.accountShow as jest.Mock).mockReturnValue(Promise.resolve(null));

    const result = await acRequestService.updateRequestName(serviceRequestId, accountId);

    // Verify that ServiceRequestRepository.update was not called
    expect(ACRequestRepository.update).not.toHaveBeenCalled();

    // Verify the method returns null
    expect(result).toBeNull();
  });
});
