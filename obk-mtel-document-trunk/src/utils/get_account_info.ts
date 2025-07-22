import { isEmpty, isUndefined } from 'lodash';
import cache from '../libs/cache';
import AccountDataService from '../services/account_data_service';
import { ProfileData } from 'ob-iam-sdk/dist/api';

async function getAccountNameFromRedis(accountId?: string) {
  if (!accountId || isUndefined(accountId)) return '';
  const accountName = await cache.getSet(`profile_${accountId}`, false, async () => {
    const accountDataService = new AccountDataService();
    const accountName = await accountDataService.getProfile(accountId);
    if (!accountName) {
      return '';
    }
    return JSON.stringify(accountName);
  });

  if (isEmpty(accountName)) {
    return null;
  }
  let profileName: ProfileData;
  try {
    profileName = JSON.parse(accountName) as ProfileData;
  } catch (error) {
    console.log(error);
    return '';
  }

  return `${profileName.first_name} ${profileName.last_name}`;
}
export { getAccountNameFromRedis };
