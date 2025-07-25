const holidays = [
  {
    HolidayWeekDay: 'Monday',
    HolidayWeekDayThai: 'วันจันทร์',
    Date: '2024-01-01',
    DateThai: '01/01/2567',
    HolidayDescription: 'New Year’s Day',
    HolidayDescriptionThai: 'วันขึ้นปีใหม่',
  },
  {
    HolidayWeekDay: 'Monday',
    HolidayWeekDayThai: 'วันจันทร์',
    Date: '2024-02-26',
    DateThai: '26/02/2567',
    HolidayDescription: 'Substitution for Makha Bucha Day (Saturday 24th February 2024)',
    HolidayDescriptionThai: 'ชดเชยวันมาฆบูชา (วันเสาร์ที่ 24 กุมภาพันธ์ 2567)',
  },
  {
    HolidayWeekDay: 'Monday',
    HolidayWeekDayThai: 'วันจันทร์',
    Date: '2024-04-08',
    DateThai: '08/04/2567',
    HolidayDescription: 'Substitution for Chakri Memorial Day (Saturday 6th April 2024)',
    HolidayDescriptionThai:
      'ชดเชยวันพระบาทสมเด็จพระพุทธยอดฟ้าจุฬาโลกมหาราช และวันที่ระลึกมหาจักรีบรมราชวงศ์ (วันเสาร์ที่ 6 เมษายน 2567)',
  },
  {
    HolidayWeekDay: 'Friday',
    HolidayWeekDayThai: 'วันศุกร์',
    Date: '2024-04-12',
    DateThai: '12/04/2567',
    HolidayDescription: 'Additional special holiday (added)',
    HolidayDescriptionThai: 'วันหยุดพิเศษ',
  },
  {
    HolidayWeekDay: 'Monday',
    HolidayWeekDayThai: 'วันจันทร์',
    Date: '2024-04-15',
    DateThai: '15/04/2567',
    HolidayDescription: 'Songkran Festival',
    HolidayDescriptionThai: 'วันสงกรานต์',
  },
  {
    HolidayWeekDay: 'Tuesday',
    HolidayWeekDayThai: 'วันอังคาร',
    Date: '2024-04-16',
    DateThai: '16/04/2567',
    HolidayDescription: 'Substitution for Songkran Festival (Saturday 13th April 2024 and Sunday 14th April 2024)',
    HolidayDescriptionThai: 'ชดเชยวันสงกรานต์ (วันเสาร์ที่ 13 เมษายน 2567 และ วันอาทิตย์ที่ 14 เมษายน 2567)',
  },
  {
    HolidayWeekDay: 'Wednesday',
    HolidayWeekDayThai: 'วันพุธ',
    Date: '2024-05-01',
    DateThai: '01/05/2567',
    HolidayDescription: 'National Labour Day',
    HolidayDescriptionThai: 'วันแรงงานแห่งชาติ',
  },
  {
    HolidayWeekDay: 'Monday',
    HolidayWeekDayThai: 'วันจันทร์',
    Date: '2024-05-06',
    DateThai: '06/05/2567',
    HolidayDescription: 'Substitution for Coronation Day (Saturday 4th May 2024)',
    HolidayDescriptionThai: 'ชดเชยวันฉัตรมงคล (วันเสาร์ที่ 4 พฤษภาคม 2567)',
  },
  {
    HolidayWeekDay: 'Wednesday',
    HolidayWeekDayThai: 'วันพุธ',
    Date: '2024-05-22',
    DateThai: '22/05/2567',
    HolidayDescription: 'Visakha Bucha Day',
    HolidayDescriptionThai: 'วันวิสาขบูชา',
  },
  {
    HolidayWeekDay: 'Monday',
    HolidayWeekDayThai: 'วันจันทร์',
    Date: '2024-06-03',
    DateThai: '03/06/2567',
    HolidayDescription: 'H.M. Queen Suthida Bajrasudhabimalalakshana’s Birthday',
    HolidayDescriptionThai: 'วันเฉลิมพระชนมพรรษาสมเด็จพระนางเจ้าสุทิดา พัชรสุธาพิมลลักษณ พระบรมราชินี',
  },
  {
    HolidayWeekDay: 'Monday',
    HolidayWeekDayThai: 'วันจันทร์',
    Date: '2024-07-22',
    DateThai: '22/07/2567',
    HolidayDescription: 'Substitution for Asarnha Bucha Day (Saturday 20th July 2024)',
    HolidayDescriptionThai: 'ชดเชยวันอาสาฬหบูชา (วันเสาร์ที่ 20 กรกฎาคม 2567)',
  },
  {
    HolidayWeekDay: 'Monday',
    HolidayWeekDayThai: 'วันจันทร์',
    Date: '2024-07-29',
    DateThai: '29/07/2567',
    HolidayDescription:
      'Substitution for H.M. King Maha Vajiralongkorn Phra Vajiraklaochaoyuhua’s Birthday (Sunday 28th July 2024)',
    HolidayDescriptionThai: 'ชดเชยวันเฉลิมพระชนมพรรษาพระบาทสมเด็จพระเจ้าอยู่หัว (วันอาทิตย์ที่ 28 กรกฎาคม 2567)',
  },
  {
    HolidayWeekDay: 'Monday',
    HolidayWeekDayThai: 'วันจันทร์',
    Date: '2024-08-12',
    DateThai: '12/08/2567',
    HolidayDescription: 'H.M. Queen Sirikit The Queen Mother’s Birthday / Mother’s Day',
    HolidayDescriptionThai:
      'วันเฉลิมพระชนมพรรษาสมเด็จพระนางเจ้าสิริกิติ์ พระบรมราชินีนาถ พระบรมราชชนนีพันปีหลวง และวันแม่แห่งชาติ',
  },
  {
    HolidayWeekDay: 'Monday',
    HolidayWeekDayThai: 'วันจันทร์',
    Date: '2024-10-14',
    DateThai: '14/10/2567',
    HolidayDescription:
      'Substitution for H.M. King Bhumibol Adulyadej The Great Memorial Day (Sunday 13th October 2024)',
    HolidayDescriptionThai: 'ชดเชยวันนวมินทรมหาราช (วันอาทิตย์ที่ 13 ตุลาคม 2567)',
  },
  {
    HolidayWeekDay: 'Wednesday',
    HolidayWeekDayThai: 'วันพุธ',
    Date: '2024-10-23',
    DateThai: '23/10/2567',
    HolidayDescription: 'Chulalongkorn Day',
    HolidayDescriptionThai: 'วันปิยมหาราช',
  },
  {
    HolidayWeekDay: 'Thursday',
    HolidayWeekDayThai: 'วันพฤหัสบดี',
    Date: '2024-12-05',
    DateThai: '05/12/2567',
    HolidayDescription: 'H.M. King Bhumibol Adulyadej The Great’s Birthday / National Day / Father’s Day',
    HolidayDescriptionThai:
      'วันคล้ายวันพระบรมราชสมภพพระบาทสมเด็จพระบรมชนกาธิเบศร มหาภูมิพลอดุลยเดชมหาราช บรมนาถบพิตร วันชาติ และวันพ่อแห่งชาติ',
  },
  {
    HolidayWeekDay: 'Tuesday',
    HolidayWeekDayThai: 'วันอังคาร',
    Date: '2024-12-10',
    DateThai: '10/12/2567',
    HolidayDescription: 'Constitution Day',
    HolidayDescriptionThai: 'วันรัฐธรรมนูญ',
  },
  {
    HolidayWeekDay: 'Tuesday',
    HolidayWeekDayThai: 'วันอังคาร',
    Date: '2024-12-31',
    DateThai: '31/12/2567',
    HolidayDescription: 'New Year’s Eve',
    HolidayDescriptionThai: 'วันสิ้นปี',
  },
];
