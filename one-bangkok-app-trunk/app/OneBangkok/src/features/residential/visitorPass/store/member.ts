import { hookstate, useHookstate } from '@hookstate/core';
import {
  ParkingRedemptionRateResult,
  ParkingResidentialTicketsIndexTypeEnum,
  PassData,
  Tenant,
  TowerData,
  VisitorTokenData,
  WrappedResponseParkingTicketDataData,
} from 'ob-bms-sdk/dist/api';
import * as OB_BMS_SDK from 'ob-bms-sdk';
import * as OB_IAM_SDK from 'ob-iam-sdk';
import Config from 'react-native-config';
import { compact, first } from 'lodash';
import authenState from '~/states/authen/authenState';
import dayjs from 'dayjs';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';

OB_BMS_SDK.setBaseUrl(Config.OB_BMS_URL!);
OB_IAM_SDK.setBaseUrl(Config.OB_IAM_URL!);
interface Member {
  id: string;
  uid: string;
  default_floor?: string;
  towers?: TowerData[];
  passes?: PassData[];
  passed_turnstile: boolean;
  is_fs_member: boolean;
  redemption: boolean;
  tenant?: Tenant;
  can_preregister?: boolean;
}

const DEFAULT_STATE = {
  id: '',
  uid: '',
  default_floor: '',
  towers: [],
  passes: [],
  passed_turnstile: false,
  is_fs_member: false,
  redemption: false,
  tenant: undefined,
  can_preregister: false,
};

const memberState = hookstate<Member>({ ...DEFAULT_STATE });

const useMemberState = () => useHookstate(memberState);

const memberAction = {
  reset: () => {
    memberState.set({ ...DEFAULT_STATE });
  },
  findAndSetMemberData: async () => {
    try {
      OB_BMS_SDK.setAcessToken(`${authenState.token.value}` || '');
      const result = await OB_BMS_SDK.client.membersIndex();

      const resultData = compact(result.data.data);
      if (resultData && resultData.length > 0) {
        const _data = resultData[0];

        _data && memberState.id.set(_data.id);
        _data && memberState.uid.set(_data.uid);
        _data && memberState.default_floor.set(_data.default_floor);
        _data && memberState.is_fs_member.set(true);
        _data &&
          memberState.redemption.set(_data.redemption_authorized || false);
        _data && memberState.tenant.set(_data.tenant);
        _data && memberState.can_preregister.set(_data.can_preregister);
        console.log(_data.redemption_authorized);
        return true; // Indicates success
      }
      memberState.is_fs_member.set(false);
      return false; // Indicates failure
    } catch (error) {
      memberState.is_fs_member.set(false);
      return false;
    }
  },

  getMemberId: async () => {
    let result = false;

    try {
      result = await memberAction.findAndSetMemberData();
      return result;
    } catch (error) {
      console.error(JSON.stringify(error));
      return result;
    }
  },
  getMember: async (locationId?: string) => {
    try {
      const result = await OB_BMS_SDK.client.membersShow(
        memberState.id.value,
        locationId,
      );
      if (result.data) {
        memberState.towers.set(result?.data?.data?.towers);
        memberState.passes.set(result?.data?.data?.passes);
        memberState.default_floor.set(result?.data.data?.defaultFloor!);
        memberState.passed_turnstile.set(result?.data.data?.passed_turnstile!);
        return result?.data?.data;
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  },
  deleteVisitorPass: async (id: string) => {
    try {
      const result = await OB_BMS_SDK.client.visitorSchedulesUpdate(id, {
        deleted_at: dayjs().toISOString(),
      });
      if (result?.request.status === 200) {
        return result?.data;
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  },
  parkingLots: async () => {
    try {
      const result = await OB_BMS_SDK.client.parkingLotsIndex();
      if (result.data) {
        return result?.data?.data;
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  },
  changeDefaultFloor: async (defaultFloor: string) => {
    try {
      const result = await OB_BMS_SDK.client.membersUpdate(
        memberState.id.value,
        { default_floor: defaultFloor },
      );
      if (result.data) {
        return true;
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  },
  getTokenDetail: async (token: string) => {
    try {
      const result = await OB_IAM_SDK.client.tokensShow(token);
      console.log('result.data -> ', result.data);

      if (result.data.data?.token) {
        return result.data.data?.token;
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  },
  getPersonId: async (id: string) => {
    try {
      const result = await OB_BMS_SDK.client.membersIndex(undefined, id);
      if (result.data.data) {
        const data = result.data.data;
        const person = first(data);
        const personId = person?.id;
        return personId;
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  },
  getParkingDetail: async (
    id: string,
    type: ParkingResidentialTicketsIndexTypeEnum,
  ) => {
    try {
      const result = await OB_BMS_SDK.client.parkingResidentialTicketsIndex(
        type,
        id,
      );
      console.log('getParkingDetail:', result.data.data);
      if (result.data.data) {
        const data = result!.data
          .data as WrappedResponseParkingTicketDataData[];
        const detail = first(data);
        return detail;
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  },
  getRateDetail: async (
    inviteId: string,
    memberTypeId: number,
    departmentId: number,
    vehicleTypeId: number,
  ) => {
    try {
      const { data } = await OB_BMS_SDK.axiosInstance.get(
        `members/${inviteId}/parking_residential_redemption_rates?member_type_id=${memberTypeId}&department_id=${departmentId}&vehicle_type_id=${vehicleTypeId}&invite_id=${inviteId}`,
      );
      return data.data as ParkingRedemptionRateResult[];
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  },
  getRedemptionRateDetail: async (
    memberTypeId: number,
    departmentId: number,
    vehicleTypeId: number,
  ) => {
    try {
      const residenceId = await residentialTenantAction.getResidenceId()
      const { data } = await OB_BMS_SDK.axiosInstance.get(
        `members/${residenceId}/parking_residential_redemption_rates?member_type_id=${memberTypeId}&department_id=${departmentId}&vehicle_type_id=${vehicleTypeId}`,
      );
      return data.data as ParkingRedemptionRateResult[];
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  },
  redemption: async (logId: string, rate_code: string, remark: string) => {
    try {
      const [residence_id, residenceMember] = await Promise.all([
        residentialTenantAction.getResidenceId(),
        residentialTenantAction.getResidenceMember()
      ])
      const { status } = await OB_BMS_SDK.axiosInstance.post(
        `parking_tickets/${logId}/redeem-residential/v2`,
        {
          rate_code,
          remark,
          residence_id,
          user_id: residenceMember?.redemptionData?.userId
        },
      );
      return status === 200;
    } catch (error) {
      return false;
    }
  },
  getInviteDetail: async (id: string) => {
    try {
      const result = await OB_BMS_SDK.client.visitorTokensIndex(id);
      if (result.data.data) {
        const data = result!.data.data as VisitorTokenData[];
        const detail = first(data);
        return detail;
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  },
};

export { useMemberState, memberAction, memberState };

// get token -> iam.tokensShow
// get member -> bms.membersIndex
// get parking detail -> bms.parkingTicketsIndex
// get rate -> bms.parkingRedemptionRatesIndex
