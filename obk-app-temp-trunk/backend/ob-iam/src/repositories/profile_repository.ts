import { logging } from 'ob-common-lib/dist';
import { CustomError } from '../middlewares/error_middleware';
import { Prisma } from 'ob-iam/db/client';
import { DBClient } from '../utils/prisma/client';

export default class ProfileRepository extends DBClient {
  constructor() {
    super()
  }

  public async create(
    input: Prisma.profileCreateInput,
  ): Promise<typeof profile> {
    // Create a new user profile in the profile table
    logging.info('create user profile');

    const profile = await this.prisma.profile.create({
      data: input,
    });
    return profile;
  }

  public async find(accountId: string): Promise<typeof profile> {
    logging.info(`get user profile by account id : ${accountId}`);

    const profile = await this.prisma.profile.findFirst({
      where: {
        account_id: accountId,
      },
    });

    if (profile == null) {
      throw new CustomError(500, 'Profile was not exist');
    }
    return profile;
  }

  public async update(
    accountId: string,
    profileData: Prisma.profileUpdateInput,
  ): Promise<typeof profile> {
    logging.info(`update user profile by account id : ${accountId}`);
    const profile = await this.prisma.profile.update({
      where: {
        account_id: accountId,
      },
      data: {
        ...profileData,
      },
    });

    if (profile == null) {
      throw new CustomError(500, `Cannot update profile`);
    }
    return profile;
  }
}
