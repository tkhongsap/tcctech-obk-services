import {instanceServiceMind} from '~/helpers/api';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';
import authenState from '~/states/authen/authenState';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import axios from 'axios';
import {TQuestionnaireSubmit} from '~/features/residential/questionnaire/screens/QuestionnaireCreateScreen';

type TPresignedUploadUrlReq = {
  filename: string;
  mimeType: string;
  type: string;
};

class ServiceMindService {
  serviceName = 'ServiceMindService';
  public eventEmitter = new EventEmitter();

  constructor() {
    instanceServiceMind.interceptors.request.use(
      async config => {
        const token = authenState.token.get();
        const language = appLanguageState.currentLanguage.get() ?? 'en';
        config.headers['Authorization'] = `Bearer ${token}`;
        config.headers['lang'] = language;
        return config;
      },
      error => Promise.reject(new Error(error)),
    );
  }

  public tenant = async (tenantId: number) => {
    try {
      return await instanceServiceMind.get(
        `obk/api/v1/resident/tenant/${tenantId}`,
      );
    } catch (error) {
      console.log(`${this.serviceName}_tenant_error : `, error);
      throw error;
    }
  };

  public properties = async () => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.get(
        `obk/api/v1/resident/tenant/${tenantId}/properties`,
      );
    } catch (error) {
      console.log(`${this.serviceName}_properties_error : `, error);
      throw error;
    }
  };

  public propertyDetail = async (id: string) => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.get(
        `obk/api/v1/resident/tenant/${tenantId}/properties/${id}`,
      );
    } catch (error) {
      console.log(`${this.serviceName}_propertyDetail_error : `, error);
      throw error;
    }
  };

  public defaultProperty = async () => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.get(
        `obk/api/v1/resident/default-property?tenantId=${tenantId}`,
      );
    } catch (error) {
      console.log(`${this.serviceName}_defaultProperty_error : `, error);
      throw error;
    }
  };

  public updateDefaultProperty = async (propertyUnitId: string) => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.post(
        `/obk/api/v1/resident/update-default-property`,
        {
          tenantId: tenantId?.toString(),
          propertyUnitId,
        },
      );
    } catch (error) {
      console.log(`${this.serviceName}_updateDefaultProperty_error : `, error);
      throw error;
    }
  };

  public home = async (projectId: string) => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.get(
        `/obk/api/v1/resident/home?tenantId=${tenantId}&projectId=${projectId}`,
      );
    } catch (error: any) {
      console.log(`${this.serviceName}_home_error : `, error);
      throw error;
    }
  };

  public announcements = async (projectId: string) => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.get(
        `obk/api/v1/resident/announcements?projectIds=${projectId}&tenantId=${tenantId}`,
      );
    } catch (error) {
      console.log(`${this.serviceName}_announcements_error : `, error);
      throw error;
    }
  };

  public announcementDetail = async (id: string) => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.get(
        `obk/api/v1/resident/announcements/${id}?tenantId=${tenantId}`,
      );
    } catch (error) {
      console.log(`${this.serviceName}_announcementDetail_error : `, error);
      throw error;
    }
  };

  public directoryContract = async () => {
    try {
      return await instanceServiceMind.get(
        'obk/api/v1/resident/directory-contacts',
      );
    } catch (error) {
      console.log(`${this.serviceName}_directoryContract_error : `, error);
      throw error;
    }
  };

  public houseRulesCategories = async (projectId: string) => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.get(
        `obk/api/v1/resident/house-rules/categories?projectId=${projectId}&tenantId=${tenantId}`,
      );
    } catch (error) {
      console.log(`${this.serviceName}_houseRulesCategories_error : `, error);
      throw error;
    }
  };

  public houseRulesByCategory = async (categoryId: string) => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.get(
        `obk/api/v1/resident/house-rules?categoryId=${categoryId}&tenantId=${tenantId}`,
      );
    } catch (error) {
      console.log(`${this.serviceName}_houseRulesByCategory_error : `, error);
      throw error;
    }
  };

  public parcelStatusList = async (projectId: string, unitId: string) => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.get(
        `obk/api/v1/resident/get-parcel-status-list?tenantId=${tenantId}&projectId=${projectId}&unitId=${unitId}`,
      );
    } catch (error) {
      console.log(`${this.serviceName}_parcelStatusList_error : `, error);
      throw error;
    }
  };

  public parcels = async (
    projectId: string,
    unitId: string,
    parcelStatus: number,
    page: number,
    limit: number,
  ) => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.get(
        `obk/api/v1/resident/tenant/${tenantId}/parcels?projectId=${projectId}&parcelStatus=${parcelStatus}&unitId=${unitId}&limit=${limit}&page=${page}`,
      );
    } catch (error) {
      console.log(`${this.serviceName}_parcels_error : `, error);
      throw error;
    }
  };

  public parcelDetail = async (parcelId: string) => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.get(
        `obk/api/v1/resident/tenant/${tenantId}/parcel/${parcelId}`,
      );
    } catch (error) {
      console.log(`${this.serviceName}_parcelDetail_error : `, error);
      throw error;
    }
  };

  public parcelUpdateReadStatus = async (parcelId: string) => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.patch(
        `obk/api/v1/resident/update-parcel-read-status`,
        {tenantId: tenantId?.toString(), parcelId},
      );
    } catch (error) {
      console.log(`${this.serviceName}_parcelDetail_error : `, error);
      throw error;
    }
  };

  public liveChatToken = async () => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.post(
        `obk/api/v1/resident/authorize-tenant`,
        {tenantId: tenantId?.toString()},
      );
    } catch (error) {
      console.log(`${this.serviceName}_liveChatToken_error : `, error);
      throw error;
    }
  };

  public presignedUploadUrl = async (req: TPresignedUploadUrlReq) => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.post(
        `obk/api/v1/resident/generate-new-presigned-url`,
        {tenantId: tenantId?.toString(), ...req},
      );
    } catch (error) {
      console.log(`${this.serviceName}_presignedUploadUrl_error : `, error);
      throw error;
    }
  };

  public uploadImageUrl = async (data: FormData) => {
    try {
      return await instanceServiceMind.post(
        `obk/api/v1/resident/upload-image-url`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
    } catch (error) {
      console.log(`${this.serviceName}_uploadImageUrl_error : `, error);
      throw error;
    }
  };

  public getMessageImageBase64 = async (url: string) => {
    try {
      return await axios.get(url);
    } catch (error) {
      console.log(`${this.serviceName}_getMessageImageBase64_error : `, error);
      throw error;
    }
  };

  public carParkingQuotaUnitWise = async () => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.get(
        `obk/api/v1/resident/tenant/${tenantId}/car-parking/get-car-parking-quota-unit-wise`,
      );
    } catch (error) {
      console.log(
        `${this.serviceName}_carParkingQuotaUnitWise_error : `,
        error,
      );
      throw error;
    }
  };

  public visitorPasses = async ({
    limit,
    page,
    type,
    unitId,
  }: {
    limit: number;
    page: number;
    type: number;
    unitId: string;
  }) => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.get(
        `obk/api/v1/resident/tenant/${tenantId}/visitors?unitId=${unitId}&type=${type}&limit=${limit}&page=${page}`,
      );
    } catch (error) {
      console.log(`${this.serviceName}_visitorPasses_error : `, error);
      throw error;
    }
  };

  public visitorPassDetail = async (id: string) => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.get(
        `obk/api/v1/resident/tenant/${tenantId}/visitor/${id}`,
      );
    } catch (error) {
      console.log(`${this.serviceName}_visitorPassDetail_error : `, error);
      throw error;
    }
  };

  public createVisitorPass = async (data: object) => {
    try {
      return await instanceServiceMind.post(
        `obk/api/v1/resident/tenant/add-visitor`,
        data,
      );
    } catch (error) {
      console.log(`${this.serviceName}_createVisitorPass_error : `, error);
      throw error;
    }
  };

  public deleteVisitorPass = async (visitorId: string) => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.post(
        `obk/api/v1/resident/tenant/visitor/update-status`,
        {
          tenantId: tenantId?.toString(),
          visitorId,
          isActive: false,
        },
      );
    } catch (error) {
      console.log(`${this.serviceName}_deleteVisitorPass_error : `, error);
      throw error;
    }
  };

  public saveLog = async (logType: string) => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.post(`obk/api/v1/resident/save-logs`, {
        tenantId: tenantId?.toString(),
        logType,
        logData: {
          timestamp: Date.now(),
        },
      });
    } catch (error) {
      console.log(`${this.serviceName}_saveLog_error : `, error);
      throw error;
    }
  };

  public getQueueCallLift = async (payload: {
    personID: string;
    locationID: number;
  }) => {
    try {
      return await instanceServiceMind.post(
        `obk/api/v1/fineday/authorizefloor/getQueueCallLift`,
        payload,
      );
    } catch (error) {
      console.log(`${this.serviceName}_getQueueCallLift_error : `, error);
      throw error;
    }
  };

  public checkQueueCallLift = async (payload: {
    personID: string;
    locationID: number;
  }) => {
    try {
      return await instanceServiceMind.post(
        `obk/api/v1/fineday/authorizefloor/checkQueueLift`,
        payload,
      );
    } catch (error) {
      console.log(`${this.serviceName}_checkQueueCallLift_error : `, error);
      throw error;
    }
  };

  public notifyLiftArrival = async () => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      console.log('tenantId ---------->', tenantId);
      return await instanceServiceMind.get(
        `obk/api/v1/resident/notifications/notify-lift-arrival/${tenantId}`,
      );
    } catch (error) {
      console.log(`${this.serviceName}_notifyLiftArrival_error : `, error);
      // throw error;
    }
  };

  public getAmenityBookingsCount = async ({
    start,
    end,
    history,
    facility,
    status,
    page,
    perpage,
  }: {
    start: string;
    end: string;
    history: boolean;
    facility?: string;
    status?: string;
    page: number;
    perpage: number;
  }) => {
    try {
      const personId = await residentialTenantAction.getUID();
      const residenceId = await residentialTenantAction.getResidenceId();

      let url = `obk/api/v1/fineday/booking/reservation/search/facilities/count?start=${start}&end=${end}&history=${history}&page=${page}&perpage=${perpage}&residenceId=${residenceId}`;
      if (facility) {
        url = url + `&facilities=${facility}`;
      } else {
        url = url + `&organizer=${personId}`;
      }
      if (status) {
        url = url + `&status=${status}`;
      }
      return await instanceServiceMind.get(url);
    } catch (error) {
      console.log(`${this.serviceName}_getAmenityBookings_error : `, error);
      throw error;
    }
  };

  public getAmenityBookings = async ({
    start,
    end,
    history,
    facility,
    status,
    page,
    perpage,
  }: {
    start: string;
    end: string;
    history: boolean;
    facility?: string;
    status?: string;
    page: number;
    perpage: number;
  }) => {
    try {
      const personId = await residentialTenantAction.getUID();
      const residenceId = await residentialTenantAction.getResidenceId();
      let url = `obk/api/v1/fineday/booking/reservation/search/facilities?start=${start}&end=${end}&history=${history}&page=${page}&perpage=${perpage}&residenceId=${residenceId}`;
      if (facility) {
        url = url + `&facilities=${facility}`;
      } else {
        url = url + `&organizer=${personId}`;
      }
      if (status) {
        url = url + `&status=${status}`;
      }
      return await instanceServiceMind.get(url);
    } catch (error) {
      console.log(`${this.serviceName}_getAmenityBookings_error : `, error);
      throw error;
    }
  };

  public getAmenityBookingsInit = async ({
    start,
    end,
    history,
    facility,
  }: {
    start: string;
    end: string;
    history: boolean;
    facility?: string;
  }) => {
    try {
      const personId = await residentialTenantAction.getUID();
      const residenceId = await residentialTenantAction.getResidenceId();
      let url = `obk/api/v1/fineday/booking/reservation/search/query?start=${start}&end=${end}&status=initialized&history=${history}`;
      if (facility) {
        url = url + `&facilities=${facility}`;
      } else {
        url = url + `&organizer=${personId}&residenceId=${residenceId}`;
      }
      return await instanceServiceMind.get(url);
    } catch (error) {
      console.log(`${this.serviceName}_getAmenityBookings_error : `, error);
      throw error;
    }
  };

  public getMyAmenityBookings = async ({
    start,
    end,
    history,
    facility,
  }: {
    start: string;
    end: string;
    history: boolean;
    facility: string;
  }) => {
    try {
      const personId = await residentialTenantAction.getUID();
      return await instanceServiceMind.get(
        `obk/api/v1/fineday/booking/reservation/search/query?start=${start}&end=${end}&history=${history}&organizer=${personId}&facilities=${facility}`,
      );
    } catch (error) {
      console.log(`${this.serviceName}_getMyAmenityBookings_error : `, error);
      throw error;
    }
  };

  public getAmenityBooking = async (id: string) => {
    try {
      return await instanceServiceMind.get(
        `obk/api/v1/fineday/booking/reservation/getReservationByID/${id}`,
      );
    } catch (error) {
      console.log(`${this.serviceName}_getAmenityBooking_error : `, error);
      throw error;
    }
  };

  public getAmenityBookingFacilitiesId = async (id: string) => {
    try {
      return await instanceServiceMind.get(
        `obk/api/v1/fineday/booking/reservation/facilities/${id}`,
      );
    } catch (error) {
      console.log(
        `${this.serviceName}_getAmenityBookingFacilities_error : `,
        error,
      );
      throw error;
    }
  };

  public getAmenityBookingFacilities = async ({
    tower,
    page = 1,
    limit = 10,
    types = 'room',
  }: {
    tower?: string;
    page?: number;
    limit?: number;
    types?: string;
  }) => {
    try {
      const residenceId = await residentialTenantAction.getResidenceId();
      return await instanceServiceMind.get(
        `obk/api/v1/fineday/booking/reservation/facilities?page=${page}&limit=${limit}&types=${types}&tower=${tower}&residenceId=${residenceId}`,
      );
    } catch (error) {
      console.log(
        `${this.serviceName}_getAmenityBookingFacilities_error : `,
        error,
      );
      throw error;
    }
  };

  public createAmenityBooking = async (data: any) => {
    try {
      return await instanceServiceMind.post(
        'obk/api/v1/fineday/booking/reservation/facilities/create',
        data,
      );
    } catch (error) {
      console.log(`${this.serviceName}_createAmenityBooking_error : `, error);
      throw error;
    }
  };

  public updateAmenityBooking = async (data: any) => {
    try {
      return await instanceServiceMind.patch(
        'obk/api/v1/fineday/booking/reservation/facilities/update',
        data,
      );
    } catch (error) {
      console.log(`${this.serviceName}_updateAmenityBooking_error : `, error);
      throw error;
    }
  };

  public feedbackList = async (payload: {
    currentPage: number;
    perPage: number;
  }) => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.post(
        'obk/api/v1/resident/feedback/get-list',
        {
          tenantId: String(tenantId),
          ...payload,
        },
      );
    } catch (error) {
      console.log(`${this.serviceName}_feedbackList_error : `, error);
      throw error;
    }
  };

  public feedbackTypes = async () => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.post(
        'obk/api/v1/resident/feedback/get-event-types',
        {
          tenantId: String(tenantId),
        },
      );
    } catch (error) {
      console.log(`${this.serviceName}_feedbackTypes_error : `, error);
      throw error;
    }
  };

  public createFeedback = async (payload: any) => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.post(
        'obk/api/v1/resident/feedback/create-case',
        {
          tenantId: String(tenantId),
          ...payload,
        },
      );
    } catch (error) {
      console.log(`${this.serviceName}_createFeedback_error : `, error);
      throw error;
    }
  };

  public feedbackStatusCodes = async () => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.get(
        `obk/api/v1/resident/feedback/get-status-codes?tenantId=${tenantId}`,
      );
    } catch (error) {
      console.log(`${this.serviceName}_feedbackStatusCodes_error : `, error);
      throw error;
    }
  };

  public serviceRequestTypes = async () => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.post(
        'obk/api/v1/resident/service-request/get-event-types',
        {
          tenantId: String(tenantId),
        },
      );
    } catch (error) {
      console.log(`${this.serviceName}_serviceRequestTypes_error : `, error);
      throw error;
    }
  };

  public createServiceRequest = async (payload: any) => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.post(
        'obk/api/v1/resident/service-request/create-case',
        {
          tenantId: String(tenantId),
          ...payload,
        },
      );
    } catch (error) {
      console.log(`${this.serviceName}_createServiceRequest_error : `, error);
      throw error;
    }
  };

  public serviceRequestList = async (payload: {
    currentPage: number;
    perPage: number;
  }) => {
    try {
      const [tenantId, project] = await Promise.all([
        residentialTenantAction.getTenantId(),
        residentialTenantAction.getDefaultUnit(),
      ]);
      return await instanceServiceMind.post(
        'obk/api/v1/resident/service-request/get-list',
        {
          tenantId: String(tenantId),
          ...payload,
          filter: {
            unitId: project?.propertyUnitId
              ? Number(project.propertyUnitId)
              : null,
          },
        },
      );
    } catch (error) {
      console.log(`${this.serviceName}_serviceRequestList_error : `, error);
      throw error;
    }
  };

  public serviceRequestStatusCodes = async () => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.get(
        `obk/api/v1/resident/service-request/get-status-codes?tenantId=${tenantId}`,
      );
    } catch (error) {
      console.log(
        `${this.serviceName}_serviceRequestStatusCodes_error : `,
        error,
      );
      throw error;
    }
  };

  public maintenanceRepairTypes = async (locationType?: number) => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      let data: any = {
        tenantId: String(tenantId),
      };
      if (locationType) {
        data = {...data, filter: {locationType}};
      }
      return await instanceServiceMind.post(
        'obk/api/v1/resident/maintenance-repair/get-event-types',
        data,
      );
    } catch (error) {
      console.log(`${this.serviceName}_maintenanceRepairTypes_error : `, error);
      throw error;
    }
  };

  public createMaintenanceRepair = async (payload: any) => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.post(
        'obk/api/v1/resident/maintenance-repair/create-case',
        {
          tenantId: String(tenantId),
          ...payload,
        },
      );
    } catch (error) {
      console.log(
        `${this.serviceName}_createMaintenanceRepair_error : `,
        error,
      );
      throw error;
    }
  };

  public maintenanceRepairList = async (payload: {
    currentPage: number;
    perPage: number;
  }) => {
    try {
      const [tenantId, project] = await Promise.all([
        residentialTenantAction.getTenantId(),
        residentialTenantAction.getDefaultUnit(),
      ]);
      return await instanceServiceMind.post(
        'obk/api/v1/resident/maintenance-repair/get-maintainance-repair-list',
        {
          tenantId: String(tenantId),
          ...payload,
          filter: {
            unitId: project?.propertyUnitId
              ? Number(project.propertyUnitId)
              : null,
          },
        },
      );
    } catch (error) {
      console.log(`${this.serviceName}_maintenanceRepairList_error : `, error);
      throw error;
    }
  };

  public commonAreas = async () => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.get(
        `obk/api/v1/resident/get-common-areas?tenantId=${tenantId}`,
      );
    } catch (error) {
      console.log(`${this.serviceName}_commonAreas_error : `, error);
      throw error;
    }
  };

  public termCondition = async (projectId: string) => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.get(
        `obk/api/v1/resident/tenant/${tenantId}/car-parking/${projectId}/terms-and-conditions`,
      );
    } catch (error) {
      console.log(`${this.serviceName}_termCondition_error : `, error);
      throw error;
    }
  };

  public questionnaires = async ({
    page,
    limit,
    projectId,
  }: {
    page: number;
    limit: number;
    projectId?: string;
  }) => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.get(
        `obk/api/v1/resident/tenants/${tenantId}/questionnaires?page=${page}&limit=${limit}&projectId=${projectId}`,
      );
    } catch (error) {
      console.log(`${this.serviceName}_questionnaires_error : `, error);
      throw error;
    }
  };

  public questionnairesHistory = async ({
    page,
    limit,
    projectId,
  }: {
    page: number;
    limit: number;
    projectId?: string;
  }) => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      return await instanceServiceMind.get(
        `obk/api/v1/resident/tenants/${tenantId}/questionnaires/history?page=${page}&limit=${limit}&projectId=${projectId}`,
      );
    } catch (error) {
      console.log(`${this.serviceName}_questionnairesHistory_error : `, error);
      throw error;
    }
  };

  public questionnaireDetail = async (id: string) => {
    try {
      const tenantId = await residentialTenantAction.getTenantId();
      const language = appLanguageState.currentLanguage.get() ?? 'en';
      return await instanceServiceMind.get(
        `obk/api/v1/resident/tenants/${tenantId}/questionnaires/detail/${id}`,
        {
          headers: {
            lang: language,
          },
        },
      );
    } catch (error) {
      console.log(`${this.serviceName}_questionnaireDetail_error : `, error);
      throw error;
    }
  };

  public questionnaireSubmit = async (data: TQuestionnaireSubmit) => {
    try {
      return await instanceServiceMind.post(
        `obk/api/v1/resident/submit-questionnaire`,
        data,
      );
    } catch (error) {
      console.log(`${this.serviceName}_questionnaireSubmit_error : `, error);
      throw error;
    }
  };

  public getResidenceMember = async (personID: string) => {
    try {
      return await instanceServiceMind.post(
        `obk/api/v1/resident/GetDetailResidenceMemberByPersonID`,
        {personID},
      );
    } catch (error) {
      console.log(`${this.serviceName}_getResidenceMember_error : `, error);
      throw error;
    }
  };
} // end class

const serviceMindService = new ServiceMindService();
export default serviceMindService;
