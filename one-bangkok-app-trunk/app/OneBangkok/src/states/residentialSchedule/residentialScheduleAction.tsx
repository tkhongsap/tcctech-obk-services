import netatmoService from '~/services/residentialService/NetatmoService';
import {
  CoolingSchedule,
  EventSchedule,
  Home,
  residentialHomeState,
} from './residentialScheduleState';

const residentialScheduleAction = {
  getHome: async () => {
    const {data} = await netatmoService.getHomeData();
    const home = data.body.homes[0] as Home;
    residentialHomeState.set(home);
    return home;
  },
  getSchedules: async () => {
    const {id, schedules} = residentialHomeState.get({noproxy: true});
    if (id) {
      return schedules;
    }
    const home = await residentialScheduleAction.getHome();
    return home.schedules;
  },
  getCoolingSchedules: async () => {
    const {id, schedules} = residentialHomeState.get({noproxy: true});
    if (id) {
      return schedules.filter(e => e.type === 'cooling') as CoolingSchedule[];
    }
    const home = await residentialScheduleAction.getHome();
    return home.schedules.filter(
      e => e.type === 'cooling',
    ) as CoolingSchedule[];
  },
  getEventSchedules: async () => {
    const {id, schedules} = residentialHomeState.get({noproxy: true});
    if (id) {
      return schedules.filter(e => e.type === 'event') as EventSchedule[];
    }
    const home = await residentialScheduleAction.getHome();
    return home.schedules.filter(e => e.type === 'event') as EventSchedule[];
  },
};

export default residentialScheduleAction;
