import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';

type ParserReq = {
  language: string;
  timestamp: number;
};

dayjs.extend(buddhistEra);

const DatetimeParser = {
  toDMY: ({language, timestamp}: ParserReq) => {
    const datetimeLocale = dayjs(timestamp).locale(language);
    return datetimeLocale.format(
      `DD MMMM ${language === 'th' ? 'BBBB' : 'YYYY'}`,
    );
  },

  toHM: ({language, timestamp}: ParserReq) => {
    const datetimeLocale = dayjs(timestamp).locale(language);
    return datetimeLocale.format(`HH:mm`);
  },

  toHMS: ({language, timestamp}: ParserReq) => {
    const datetimeLocale = dayjs(timestamp).locale(language);
    return datetimeLocale.format(`HH:mm:ss`);
  },
};

export default DatetimeParser;
