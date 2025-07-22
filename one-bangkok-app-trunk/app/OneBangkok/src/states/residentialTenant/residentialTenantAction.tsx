import serviceMindService from '~/services/residentialService/ServiceMindService';
import residentialTenantState, {
  contactConciergePhoneNumber,
  fsPersonId,
  liveChatAccessToken,
  liveChatConciergeAvatar,
  residenceMember,
  residentialHomeAutomationId,
  residentialPersonaActive,
  residentialTenantId,
  residentialUnitSelectedState,
  Tenant,
  UnitDetail,
} from './residentialTenantState';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {hookstate} from '@hookstate/core';
import {Buffer} from 'buffer';
import authenState from '../authen/authenState';
import authService from '~/services/authService/AuthService';
import {Service} from '~/features/residential/components/Services';
import dayjs from 'dayjs';
import {TResidenceMember} from '~/features/residential/types/residenceMemberTypes';

const pdpaAcceptedStatusKey = 'tenant.pdpa.accepted';
const liveChatSessionIdKey = 'resident.live.chat.session.id';

export const decodeJwt = (jwt: string) => {
  const tokenDecodablePart = jwt.split('.')[1];
  return JSON.parse(Buffer.from(tokenDecodablePart, 'base64').toString());
};

const residentialTenantAction = {
  getTenant: async (): Promise<Tenant> => {
    if (
      residentialTenantState.tenantId.value === null &&
      residentialTenantId.value
    ) {
      const {data} = await serviceMindService.tenant(residentialTenantId.value);
      residentialTenantState.set(data);
    }
    return residentialTenantState.get() as Tenant;
  },
  getResidentExternal: async () => {
    try {
      const jwtToken = authenState.token.get();
      if (jwtToken) {
        const decoded = decodeJwt(jwtToken);
        const accountId = decoded.sub;
        const externalIds = await authService.residentExternalId(accountId);
        return externalIds[0];
      }
      return null;
    } catch (error) {
      return null;
    }
  },
  getResidentPerson: async () => {
    try {
      const jwtToken = authenState.token.get();
      if (jwtToken) {
        const decoded = decodeJwt(jwtToken);
        const accountId = decoded.sub;
        const externalIds = await authService.residentExternalId(
          accountId,
          'fs',
        );
        return externalIds[0];
      }
      return null;
    } catch (error) {
      return null;
    }
  },
  getTenantId: async (refresh: boolean = false): Promise<number | null> => {
    try {
      if (!refresh && residentialTenantId.value) {
        return residentialTenantId.value;
      }

      // Decode JWT & get UID (Tenant ID)
      const jwtToken = authenState.token.get();
      if (jwtToken) {
        const decoded = decodeJwt(jwtToken);
        const accountId = decoded.sub;
        const externalIds = await authService.residentExternalId(accountId);
        if (externalIds.length === 0) return null;
        if (externalIds[0].type !== 'resident') return null;

        const residentExternalId = externalIds[0];
        const uid = parseInt(residentExternalId.meta.tenantId);

        // Get Tenant info
        const {data} = await serviceMindService.tenant(uid);
        const tenant = data as Tenant;
        residentialTenantState.set(tenant);
        residentialPersonaActive.set(tenant.isActive);
        residentialTenantId.set(uid);
        return uid;
      }
      return null;
    } catch (error) {
      return null;
    }
  },
  getHomeId: async () => {
    try {
      const {data} = await serviceMindService.properties();
      const properties = data.properties as UnitDetail[];
      const selectedUnit = residentialUnitSelectedState.selectedUnit.value;
      if (selectedUnit !== '') {
        const selectedProperty = properties.find(
          e => e.houseNumber === selectedUnit,
        );
        if (selectedProperty) {
          residentialHomeAutomationId.set(selectedProperty.homeId);
          return selectedProperty.homeId;
        }
      } else {
        const defaultProperty: UnitDetail =
          properties.find((property: UnitDetail) => property.isDefault) ??
          properties[0];

        if (defaultProperty) {
          residentialHomeAutomationId.set(defaultProperty.homeId);
          return defaultProperty.homeId;
        }
      }

      return null;
    } catch (error) {
      return null;
    }
  },
  updatePDPAAcceptedStatus: async (accepted: boolean) => {
    await AsyncStorage.setItem(pdpaAcceptedStatusKey, `${accepted}`);
  },
  getPDPAAcceptedStatus: async () => {
    const status = await AsyncStorage.getItem(pdpaAcceptedStatusKey);
    if (status) return status === 'true';
    return false;
  },
  pdpaState: hookstate('false'),
  clear: () => {
    residentialTenantId.set(null);
    residentialPersonaActive.set(false);
    residentialTenantAction.removeLiveChatSessionId();
    liveChatAccessToken.set(null);
    contactConciergePhoneNumber.set(null);
    fsPersonId.set(undefined);
    liveChatConciergeAvatar.set(undefined);
    residenceMember.set(null);
  },
  getLiveChatSessionId: async () => {
    return await AsyncStorage.getItem(liveChatSessionIdKey);
  },
  setLiveChatSessionId: async (value: string) => {
    await AsyncStorage.setItem(liveChatSessionIdKey, value);
  },
  removeLiveChatSessionId: async () => {
    await AsyncStorage.removeItem(liveChatSessionIdKey);
  },

  validLiveChatAccessToken: () => {
    if (liveChatAccessToken.value === null) return false;
    return liveChatAccessToken.value.tokenExpiryTime >= Date.now();
  },

  getContactConciergePhoneNumber: async () => {
    if (contactConciergePhoneNumber.value) {
      return contactConciergePhoneNumber.value;
    }

    const propertiesResp = await serviceMindService.properties();
    const properties = propertiesResp.data.properties as UnitDetail[];
    let projectId = '';
    if (residentialUnitSelectedState.selectedProjectId.value) {
      projectId = residentialUnitSelectedState.selectedProjectId.value;
    } else {
      const defaultProperty =
        properties.find(e => e.isDefault) ?? properties[0];
      projectId = defaultProperty.projectId;
    }

    const homeResp = await serviceMindService.home(projectId);
    const contactConciergeService = (homeResp.data.services as Service[]).find(
      e => e.type === 'concierge',
    );
    if (contactConciergeService) {
      const phoneNumber = contactConciergeService?.data?.phoneNumber ?? null;
      contactConciergePhoneNumber.set(phoneNumber);
      return phoneNumber;
    }
    return null;
  },

  getPersonID: async () => {
    if (fsPersonId.value !== undefined) return fsPersonId.value;
    const jwtToken = authenState.token.get();
    if (jwtToken) {
      const decoded = decodeJwt(jwtToken);
      const accountId = decoded.sub;
      const externalIds = await authService.residentExternalId(accountId, 'fs');
      console.log('externalIds ------->', externalIds);
      if (externalIds.length === 0) return null;
      if (externalIds[0].type !== 'fs') return null;
      return externalIds[0].meta.personID;
    }
    return null;
  },
  getUID: async () => {
    if (fsPersonId.value !== undefined) return fsPersonId.value;
    const jwtToken = authenState.token.get();
    if (jwtToken) {
      const decoded = decodeJwt(jwtToken);
      const accountId = decoded.sub;
      const externalIds = await authService.residentExternalId(accountId, 'fs');
      if (externalIds.length === 0) return null;
      if (externalIds[0].type !== 'fs') return null;
      return externalIds[0].uid;
    }
    return null;
  },

  getLiveChatAvatar: async () => {
    try {
      if (liveChatConciergeAvatar.value !== undefined) {
        return liveChatConciergeAvatar.value;
      }
      const projectId = await residentialTenantAction.getDefaultUnitProjectId();
      const {data} = await serviceMindService.home(projectId);
      const services = data.services as Service[];
      const chatService = services.find(service => service.type === 'chat');
      if (chatService) {
        liveChatConciergeAvatar.set(chatService.chatAvatar?.s3Url);
        return chatService.chatAvatar?.s3Url ?? '';
      }
      return '';
    } catch (error) {
      return '';
    }
  },

  getDefaultUnitProjectId: async () => {
    try {
      const {data} = await serviceMindService.properties();
      return (
        data.properties[0].projectId ??
        data.properties.find((e: UnitDetail) => e.isDefault).projectId
      );
    } catch (error) {
      return null;
    }
  },

  getDefaultUnit: async (): Promise<UnitDetail | null> => {
    try {
      const {data} = await serviceMindService.properties();
      const unitId = residentialUnitSelectedState.selectedUnit.value;
      if (unitId) {
        return (
          data.properties.find((e: UnitDetail) => e.houseNumber === unitId) ??
          data.properties[0]
        );
      }

      return (
        data.properties.find((e: UnitDetail) => e.isDefault) ??
        data.properties[0]
      );
    } catch (error) {
      return null;
    }
  },

  getResidenceId: async (): Promise<number | null> => {
    try {
      let unitId = residentialUnitSelectedState.unitId.value;
      if (unitId === '' || unitId === null || unitId === undefined) {
        const {data} = await serviceMindService.properties();
        const properties = data.properties as UnitDetail[];
        const property = properties.find(e => e.isDefault) ?? properties[0];
        unitId = property.propertyUnitId;
      }
      const {data} = await serviceMindService.propertyDetail(unitId);
      const propertyDetail = data.property as UnitDetail;
      return propertyDetail.bimData.residenceID;
    } catch (error) {
      return null;
    }
  },

  setQuestionnaireNotShowToday: async (unitId: string) => {
    await AsyncStorage.setItem(
      `QUESTIONNAIRE_DISABLED_${unitId}`,
      `${Date.now()}`,
    );
  },
  isQuestionnaireNotShowToday: async (unitId: string) => {
    const timestampString = await AsyncStorage.getItem(
      `QUESTIONNAIRE_DISABLED_${unitId}`,
    );
    if (!timestampString) return false;
    const disabledDay = dayjs(parseInt(timestampString));
    const today = dayjs();
    const isSameDay = disabledDay.isSame(today, 'day');
    return isSameDay;
  },
  removeQuestionnaireNotShowToday: async (unitId: string) => {
    await AsyncStorage.removeItem(`QUESTIONNAIRE_DISABLED_${unitId}`);
  },

  getResidenceMember: async (): Promise<TResidenceMember | null> => {
    try {
      if (residenceMember.value !== null) {
        return residenceMember.value as TResidenceMember;
      }
      const getPersonID = await residentialTenantAction.getUID();
      if (!getPersonID) return null;
      const {data} = await serviceMindService.getResidenceMember(getPersonID);
      residenceMember.set(data);
      return data;
    } catch (error) {
      return null;
    }
  },
};

export default residentialTenantAction;
