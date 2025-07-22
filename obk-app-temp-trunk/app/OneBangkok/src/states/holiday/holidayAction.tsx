import bmsService from '~/services/bmsService';
import {holidayState, holidayStateAction} from './holidayState';
import {isEmpty} from 'lodash';
import {Dayjs} from 'dayjs';

const holidayAction = {
  getHolidays: async () => {
    const holidays = await bmsService.getHolidays();
    if (holidays) {
      holidayStateAction.setHolidays(holidays);
    }
  },
  checkHoliday: (dateToCheck: Dayjs) => {
    if (!isEmpty(holidayState.holidays.value)) {
      const dateStringToCheck = dateToCheck.format('YYYY-MM-DD');

      // Check if any object in the array has the same date
      return holidayState.holidays.value.some(
        item => item.date === dateStringToCheck,
      );
    }
  },
};

export default holidayAction;
