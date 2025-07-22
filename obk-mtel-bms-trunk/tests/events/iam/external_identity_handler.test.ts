import { MemberRepository } from '../../../src/repositories';
import { resetDB } from '../../helpers/db';
import { externalIdentityHandler } from '../../../src/events/iam';
import { Prisma } from '../../../db/client';
import FSParkingClient from '../../../src/libs/fs_parking_client';
import { updateTransactionParkingResponse } from '../../libs/tcc_client.test';

let member: {
  id: string;
  uid?: string;
  metadata?: Prisma.JsonValue;
  account_id?: string | null;
  created_at?: Date;
  updated_at?: Date;
  default_floor?: string | null;
};

beforeEach(async () => {
  await resetDB();

  member = await MemberRepository.create({
    data: {
      uid: 'test',
    },
  });
});

jest.useRealTimers();

describe('externalIdentityHandler', () => {
  describe('no matched events', () => {
    it('do nothing', async () => {
      const externalIdentityInstance = new externalIdentityHandler();
      await externalIdentityInstance.created({ name: '', payload: {} });
    });
  });

  describe('ob-iam.external_identity.created', () => {
    it('should update member account_id', async () => {
      const externalIdentityInstance = new externalIdentityHandler();

      await externalIdentityInstance.created({
        name: 'ob-iam.external_identity.created',
        payload: {
          external_identity: {
            uid: 'test',
            account_id: 'test-account-id',
            type: 'fs',
          },
        },
      });

      const updatedMember = await MemberRepository.findFirst({
        where: {
          id: member.id,
        },
      });
      jest.spyOn(FSParkingClient.httpClient, 'post').mockResolvedValue({ data: updateTransactionParkingResponse });

      // jest.spyOn(FSParkingClient.httpClient, 'post').mockResolvedValue({ data: updateTransactionParkingResponse });

      expect(updatedMember?.account_id).toEqual('test-account-id');
    });

    describe('type is not FS', () => {
      it('should not update account id', async () => {
        const externalIdentityInstance = new externalIdentityHandler();

        await externalIdentityInstance.created({
          name: 'ob-iam.external_identity.created',
          payload: {
            external_identity: {
              uid: 'test',
              account_id: 'test-account-id',
              type: 'xs',
            },
          },
        });

        const updatedMember = await MemberRepository.findFirst({
          where: {
            id: member.id,
          },
        });

        expect(updatedMember?.account_id).toBeNull;
      });
    });
  });
});
