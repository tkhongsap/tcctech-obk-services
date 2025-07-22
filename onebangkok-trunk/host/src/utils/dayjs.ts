import dayjs, {Dayjs} from 'dayjs';
import localeData from 'dayjs/plugin/localeData';

dayjs.extend(localeData);

const DateTimeFormat = {
  default: 'DD MMMM YYYY',
};

export {dayjs, Dayjs, DateTimeFormat};
