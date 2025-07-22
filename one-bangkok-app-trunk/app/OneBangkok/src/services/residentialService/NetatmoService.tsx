import {instanceNetatmoService} from '~/helpers/api';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import authenState from '~/states/authen/authenState';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';

type operation =
  | 'set max temp'
  | 'set manual temp'
  | 'set frostguard'
  | 'set home mode'
  | 'set light'
  | 'set launch state'
  | 'set brightness'
  | 'set staircase light'
  | 'set air fan'
  | 'set roller shutter';

type syncOperation = 'action' | 'cooling' | 'event';

type validateTimeTable = {
  isHome: false;
  startTime: string;
  endTime: string;
};

class NetatmoService {
  serviceName = 'NetatmoService';
  public eventEmitter = new EventEmitter();

  constructor() {
    instanceNetatmoService.interceptors.request.use(
      async config => {
        const token = authenState.token.get();
        config.headers['Authorization'] = `Bearer ${token}`;
        return config;
      },
      error => Promise.reject(new Error(error)),
    );

    instanceNetatmoService.interceptors.response.use(
      async response => {
        console.log('[RESPONSE] status => ', response.status);
        return response;
      },
      async (error: any): Promise<any> => {
        return Promise.reject(error?.response?.data ?? error);
      },
    );
  }

  public getHomeData = async () => {
    try {
      const id = await residentialTenantAction.getHomeId();
      const result = await instanceNetatmoService.get(
        `obk/api/v1/netatmo/homes/data/all/${id}`,
      );

      return result;
    } catch (error) {
      console.log(`${this.serviceName}_getHomeData_error : `, error);
      throw error;
    }
  };

  public getScenario = async () => {
    try {
      const id = await residentialTenantAction.getHomeId();
      const result = await instanceNetatmoService.get(
        `obk/api/v1/netatmo/scenarios/${id}`,
      );

      return result;
    } catch (error) {
      console.log(`${this.serviceName}_getScenario_error : `, error);
      throw error;
    }
  };

  public getHomeSchedule = async (scheduleId: string) => {
    try {
      const id = await residentialTenantAction.getHomeId();
      const result = await instanceNetatmoService.get(
        `obk/api/v1/netatmo/home/${id}/schedule/${scheduleId}`,
      );

      return result;
    } catch (error) {
      console.log(`${this.serviceName}_getHomeSchedule_error : `, error);
      throw error;
    }
  };

  public getHomeStatus = async () => {
    try {
      const id = await residentialTenantAction.getHomeId();
      const result = await instanceNetatmoService.get(
        `obk/api/v1/netatmo/home/status/${id}`,
      );

      return result;
    } catch (error) {
      console.log(`${this.serviceName}_getHomeStatus_error : `, error);
      throw error;
    }
  };

  public setStateRoomsDevice = async (operation: operation, rooms: [any]) => {
    try {
      const id = await residentialTenantAction.getHomeId();
      const result = await instanceNetatmoService.post(
        `obk/api/v1/netatmo/home/setstate`,
        {
          id,
          operation,
          rooms,
        },
      );
      return result;
    } catch (error) {
      console.log(`${this.serviceName}_getScenario_error : `, error);
      throw error;
    }
  };

  public setStateModulesDevice = async (
    operation: operation,
    modules: [any],
  ) => {
    try {
      const id = await residentialTenantAction.getHomeId();
      const result = await instanceNetatmoService.post(
        `obk/api/v1/netatmo/home/setstate`,
        {
          id,
          operation,
          modules,
        },
      );
      return result;
    } catch (error) {
      console.log(`${this.serviceName}_getScenario_error : `, error);
      throw error;
    }
  };

  public createHomeSchedule = async (payload: any) => {
    try {
      const id = await residentialTenantAction.getHomeId();
      const result = await instanceNetatmoService.post(
        `obk/api/v1/netatmo/home/schedule/create`,
        {
          id,
          ...payload,
        },
      );
      return result;
    } catch (error) {
      console.log(`${this.serviceName}_createHomeSchedule_error : `, error);
      throw error;
    }
  };

  public validateCrateSchedule = async (template: any) => {
    try {
      const result = await instanceNetatmoService.post(
        `obk/api/v1/netatmo/home/schedule/validate`,
        {
          template,
        },
      );
      return result;
    } catch (error) {
      console.log(`${this.serviceName}_getScenario_error : `, error);
      throw error;
    }
  };

  public switchHomeSchedule = async (
    operation: string,
    scheduleid: string,
    scheduletype: string,
    selected: boolean,
  ) => {
    try {
      const id = await residentialTenantAction.getHomeId();
      const result = await instanceNetatmoService.post(
        `obk/api/v1/netatmo/home/schedule/switch`,
        {
          operation,
          homeid: id,
          scheduleid,
          scheduletype,
          selected,
        },
      );
      return result;
    } catch (error) {
      console.log(`${this.serviceName}_switchHomeSchedule_error : `, error);
      throw error;
    }
  };

  public disableHomeSchedule = async (
    operation: string,
    scheduletype: string,
  ) => {
    try {
      const id = await residentialTenantAction.getHomeId();
      const result = await instanceNetatmoService.post(
        `obk/api/v1/netatmo/home/schedule/switch`,
        {
          operation,
          homeid: id,
          scheduletype,
        },
      );
      return result;
    } catch (error) {
      console.log(`${this.serviceName}_disableHomeSchedule_error : `, error);
      throw error;
    }
  };

  public syncHomeSchedule = async (payload: any) => {
    try {
      const result = await instanceNetatmoService.post(
        `obk/api/v1/netatmo/synchomeschedule`,
        payload,
      );
      return result;
    } catch (error) {
      console.log(`${this.serviceName}_syncHomeSchedule_error : `, error);
      throw error;
    }
  };

  public createActionSchedule = async (name: string) => {
    try {
      const id = await residentialTenantAction.getHomeId();
      const result = await instanceNetatmoService.post(
        `obk/api/v1/netatmo/home/schedule/create`,
        {
          id,
          name,
          operation: 'action',
          schedule_type: 'event',
          zones: [],
          timetable: [],
          timetable_sunrise: [],
          timetable_sunset: [],
        },
      );
      return result;
    } catch (error) {
      console.log(`${this.serviceName}_createActionSchedule_error : `, error);
      throw error;
    }
  };

  public deactivateEventSchedule = async () => {
    try {
      const id = await residentialTenantAction.getHomeId();
      const result = await instanceNetatmoService.post(
        `obk/api/v1/netatmo/home/schedule/switch`,
        {
          homeid: id,
          operation: 'deactivate',
          scheduletype: 'event',
        },
      );
      return result;
    } catch (error) {
      console.log(
        `${this.serviceName}_deactivateEventSchedule_error : `,
        error,
      );
      throw error;
    }
  };

  public activeSchedule = async (
    scheduleid: string,
    scheduletype: 'event' | 'cooling',
  ) => {
    try {
      const id = await residentialTenantAction.getHomeId();
      const result = await instanceNetatmoService.post(
        `obk/api/v1/netatmo/home/schedule/switch`,
        {
          homeid: id,
          scheduleid,
          operation: 'activate',
          scheduletype,
          selected: true,
        },
      );
      return result;
    } catch (error) {
      console.log(`${this.serviceName}_activeSchedule_error : `, error);
      throw error;
    }
  };
} // end class

const netatmoService = new NetatmoService();
export default netatmoService;
