import {hookstate, useHookstate} from '@hookstate/core';
import {compact, join} from 'lodash';
import {ProfileResultProfile} from 'ob-iam-sdk/dist/api';
import DateTime from '~/utils/datetime';
import {
  IdentitiesData,
  ProviderType,
} from '~/utils/ob_sdk/services/ob_iam/index.interface';
import {components as OBIAMComponents} from '~/utils/ob_sdk/services/ob_iam/openapi_interfaces';

interface Account {
  profile: ProfileResultProfile | null;
  identifiers: IdentitiesData | null;
}

export const accountState = hookstate<Account>({
  profile: null,
  identifiers: null,
});

export const useAccountState = () => useHookstate(accountState);

export const accountStateAction = {
  updateProfile: (profile: ProfileResultProfile | null) =>
    accountState.profile.set(profile),
  updateIdentifier: (
    identifier: OBIAMComponents['schemas']['IdentitiesData'] | null,
  ) => accountState.identifiers.set(identifier),
  getFullName: () => {
    const {profile} = accountState;
    const firstName = profile.value?.first_name;
    const middleName = profile.value?.middle_name;
    const lastName = profile.value?.last_name;
    const name: string[] = compact([firstName, middleName, lastName]);
    return join(name, ' ');
  },
  getDobInString: () => {
    const {profile} = accountState;
    const dob = profile.value?.dob!;
    return DateTime.formatDate(dob);
  },
  getIdentifiers: (provider: ProviderType) =>
    accountState.identifiers?.value?.filter(obj => obj.provider === provider),
  setProviderToDefault: (provider: ProviderType, id: string) => {
    //TODO: clone array and new adress
    const identities = JSON.stringify([
      ...(accountState.identifiers.value as IdentitiesData),
    ]);
    const identifiers = JSON.parse(identities).map(obj => {
      return obj.provider !== provider ? obj : {...obj, default: obj.id === id};
    });

    return accountState.identifiers.set(identifiers);
  },
};
