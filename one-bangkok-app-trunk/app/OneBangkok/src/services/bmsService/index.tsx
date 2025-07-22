import authenState from '~/states/authen/authenState';
import {hideLoading, showLoading} from '~/states/loadingState';

import * as OB_BMS_SDK from 'ob-bms-sdk';
import {
  issueTypeAction,
  issueTypeState,
} from '~/features/buildingAccess/store/issueTypes';
import {isEmpty} from 'lodash';
import {
  ACRequestBody,
  ServiceRequestBody,
  ServiceRequestStatus,
} from 'ob-bms-sdk/dist/api';
import {memberState} from '~/features/buildingAccess/store/member';

class BMSService {
  public getIssueTypes = async () => {
    if (isEmpty(issueTypeState.issueType.value)) {
      showLoading();
      try {
        const res = await OB_BMS_SDK.client.issueTypesIndex();
        hideLoading();
        if (res.status !== 200) {
          return null;
        }
        if (res.data?.data) {
          issueTypeAction.setIssueType(res.data?.data);
        }
      } catch (error) {
        hideLoading();
      }
    }
  };
  public createRequestService = async (serviceRequest: ServiceRequestBody) => {
    showLoading();
    try {
      const res = await OB_BMS_SDK.client.serviceRequestsCreate(serviceRequest);
      hideLoading();
      if (res.status !== 200) {
        return null;
      }
      return res;
    } catch (error) {
      hideLoading();
    }
  };
  public getRequestService = async (
    pageNumber: number,
    pageSize: number,
    status?: ServiceRequestStatus,
  ) => {
    try {
      const res = await OB_BMS_SDK.client.serviceRequestsIndex(
        memberState.id.value,
        undefined,
        'desc',
        pageNumber,
        pageSize,
        status,
      );
      if (res.status !== 200) {
        return null;
      }
      return res.data?.data;
    } catch (error) {
      console.log(error);
    }
  };
  public getRequestServiceDetail = async (id: string) => {
    showLoading();
    try {
      const res = await OB_BMS_SDK.client.serviceRequestsShow(id);
      hideLoading();
      if (res.status !== 200) {
        return null;
      }
      return res.data?.data;
    } catch (error) {
      hideLoading();
    }
  };
  public getSensor = async (towerId: string, currentLanguage: string) => {
    showLoading();
    try {
      const res = await OB_BMS_SDK.client.sensorsIndex(
        towerId,
        currentLanguage,
        memberState.id.value,
      );
      hideLoading();
      if (res.status !== 200) {
        return null;
      }
      return res.data?.data;
    } catch (error) {
      hideLoading();
    }
  };

  public getSensorOutdoor = async (zone: string, currentLanguage: string) => {
    showLoading();
    try {
      const res = await OB_BMS_SDK.client.sensorsIndexoutdoor(
        zone,
        currentLanguage,
      );
      hideLoading();
      if (res.status !== 200) {
        return null;
      }
      return res.data?.data;
    } catch (error) {
      hideLoading();
    }
  };

  public getACZones = async (floorId: string) => {
    showLoading();
    try {
      const res = await OB_BMS_SDK.client.acZonesShow(floorId);
      hideLoading();
      if (res.status !== 200) {
        return null;
      }
      return res.data?.data;
    } catch (error) {
      hideLoading();
    }
  };
  public createAirConditionerRequest = async (acRequest: ACRequestBody) => {
    showLoading();
    try {
      const res = await OB_BMS_SDK.client.acRequestCreate(acRequest);
      hideLoading();
      if (res.status !== 200) {
        return null;
      }
      return res;
    } catch (error) {
      hideLoading();
    }
  };
  public getAirConditionerRequest = async (
    pageNumber: number,
    pageSize: number,
    toGte?: string,
    toLte?: string,
  ) => {
    try {
      const res = await OB_BMS_SDK.client.acRequestIndex(
        undefined,
        'desc',
        pageNumber,
        pageSize,
        toGte,
        toLte,
        undefined,
        memberState.id.value,
      );
      if (res.status !== 200) {
        return null;
      }
      return res.data?.data;
    } catch (error) {
      console.log(error);
    }
  };
  public getAirConditionerRequestDetail = async (id: string) => {
    showLoading();
    try {
      const res = await OB_BMS_SDK.client.acRequestShow(id);
      hideLoading();
      if (res.status !== 200) {
        return null;
      }
      return res.data?.data;
    } catch (error) {
      hideLoading();
    }
  };
  public getHolidays = async () => {
    showLoading();
    try {
      const res = await OB_BMS_SDK.client.holidaysIndex();
      hideLoading();
      if (res.status !== 200) {
        return null;
      }
      return res.data?.data;
    } catch (error) {
      hideLoading();
    }
  };
}
const bmsService = new BMSService();
export default bmsService;
