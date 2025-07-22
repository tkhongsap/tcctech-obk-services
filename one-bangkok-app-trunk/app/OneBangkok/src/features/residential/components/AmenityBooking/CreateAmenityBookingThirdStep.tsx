import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Keyboard,
} from 'react-native';
import {Icon, Spacing, Text} from '~/components/atoms';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';
import React, {useCallback, useEffect, useState} from 'react';
import t from '~/utils/text';
import {FormProvider, useForm} from 'react-hook-form';
import {DatePicker} from '../../visitorPass/components/DatePicker';
import dayjs from 'dayjs';
import {
  Facility,
  TFacilityConditionQuota,
} from './CreateAmenityBookingFirstStep';
import {TAvailableTimeListSelect} from '../../screens/ResidentialAmenityBookingAvailableTimeScreen';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import {AmenityBooking} from '../../screens/AmenityBookingDetailScreen';
import appLanguageState from '~/states/appLanguage/appLanguageState';

interface Props {
  facility: Facility;
  allAvailableTimes: TAvailableTimeListSelect[];
  setAllAvailableTimes: (value: TAvailableTimeListSelect[]) => void;
  details?: string;
  onDetailsChanged: (value: string) => void;
  initialDate: string;
  onDateChanged: (date: string) => void;
  setIsLoading: (value: boolean) => void;
  disabled: boolean;
  hasError: boolean;
  setHasError: (value: boolean) => void;
  hasSelected: boolean;
  wordSelectTime: string;
}

const MAX_DAYS_IN_ADVANCE = 60;

export const generateHourlyTimeRanges = (
  start: string,
  end: string,
): TAvailableTimeListSelect[] => {
  let startTime = new Date();
  const endTime = new Date();
  const [startHours, startMinutes] = start.split(':').map(Number);
  const [endHours, endMinutes] = end.split(':').map(Number);
  startTime.setHours(startHours, startMinutes, 0, 0);
  endTime.setHours(endHours, endMinutes, 0, 0);

  const timeRanges: TAvailableTimeListSelect[] = [];
  let key = 1;
  while (startTime < endTime) {
    const rangeEnd = new Date(startTime);
    rangeEnd.setMinutes(startTime.getMinutes() + 30);

    const formattedStart = dayjs(startTime).format('HH:mm');
    const formattedEnd = dayjs(rangeEnd).format('HH:mm');
    const name = `${formattedStart} - ${formattedEnd}`;
    const value = `${startTime.toISOString()}|${rangeEnd.toISOString()}`;
    timeRanges.push({value, name, key, selected: false});
    startTime = new Date(rangeEnd.setMinutes(rangeEnd.getMinutes()));
    startTime.setMinutes(startTime.getMinutes());
    key += 1;
  }
  return timeRanges;
};

const months = [dayjs(), dayjs().add(1, 'month'), dayjs().add(2, 'month')].map(
  e => e.format('MM'),
);
const monthInQuota: Record<string, keyof TFacilityConditionQuota> = {
  [months[0]]: 'currentMonth',
  [months[1]]: 'nextMonth',
  [months[2]]: 'twoMonthsLater',
};

const getQuotaForMonth = (facility: Facility, selectedDate: string): number => {
  const selectedMonth = dayjs(selectedDate).format('MM');
  return facility.condition.quota[monthInQuota[selectedMonth]];
};

export const reachedOutOfQuota = async (
  facility: Facility,
  selectedDate: string,
): Promise<boolean> => {
  try {
    const quota = getQuotaForMonth(facility, selectedDate);
    return quota === 0 && quota !== undefined;
  } catch (error) {
    console.error('Error in reachedOutOfQuota:', error);
    return false;
  }
};

const CreateAmenityBookingThirdStep = ({
  facility,
  allAvailableTimes,
  details,
  onDetailsChanged,
  initialDate,
  onDateChanged,
  setIsLoading,
  disabled,
  hasError,
  setHasError,
  hasSelected,
  wordSelectTime,
}: Props) => {
  const {...methods} = useForm({mode: 'onSubmit', reValidateMode: 'onChange'});
  const navigation = useNavigation<StackNavigation>();
  const [remark, setRemark] = useState<string | undefined>(details);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [quota, setQuota] = useState<number>(0);
  const [date, setDate] = useState<string>(
    dayjs(initialDate).format('YYYY-MM-DD'),
  );
  const [filteredAvailableTimes, setFilteredAvailableTimes] =
    useState<TAvailableTimeListSelect[]>(allAvailableTimes);
  const language =
    appLanguageState.currentLanguage.get() ||
    appLanguageState.defaultLanguage.get();
  const [isReachedOutOfQuota, setIsReachedOutOfQuota] = useState(false);
  const [minDaysInAdvance, setMinDaysInAdvance] = useState(dayjs().toDate());
  useEffect(() => {
    setMinDaysInAdvance(
      dayjs().add(facility.condition.condition.advanceBooking, 'day').toDate(),
    );
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  // useFocusEffect(
  //   useCallback(() => {
  //     setDate(initialDate);
  //   }, [initialDate]),
  // );

  useEffect(() => {
    if (date) updateAvailableTimes(allAvailableTimes, date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allAvailableTimes, date]);

  useEffect(() => {
    const load = async () => {
      const isReachedOutOfQuota = await reachedOutOfQuota(facility, date);
      const selectedMonth = dayjs(date).format('MM');
      const monthInQuota: Record<string, keyof TFacilityConditionQuota> = {
        [months[0]]: 'currentMonth',
        [months[1]]: 'nextMonth',
        [months[2]]: 'twoMonthsLater',
      };
      setQuota(facility.condition.quota[monthInQuota[selectedMonth]]);
      setIsReachedOutOfQuota(isReachedOutOfQuota);
      setHasError(isReachedOutOfQuota);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, facility]);

  const onSetRemark = (value: string) => {
    setRemark(value);
    onDetailsChanged(value);
  };

  const getOpenTime = () => {
    try {
      const {start, end} = facility.condition.reserve.period;
      return `${start} - ${end}`;
    } catch (error) {
      return '-';
    }
  };

  const getAreaName = (facility: Facility) => {
    try {
      const area = language === 'th' ? facility.area.th : facility.area.en;
      const areaName = area.includes('|') ? area.split('|')[1] : area;
      const {start, end} = facility.condition.reserve.period;
      return `${areaName.trim()} | ${start} - ${end}`;
    } catch {
      return '-';
    }
  };

  const getName = (facility: Facility) => {
    try {
      return language == 'th' ? facility.nameTh : facility.nameEn;
    } catch (error) {
      return '-';
    }
  };

  const dateToTimeString = (date: string) => {
    return dayjs(date).format('HH:mm');
  };

  const updateAvailableTimes = async (
    allAvailableTimes: TAvailableTimeListSelect[],
    date: string,
  ) => {
    try {
      setIsLoading(true);
      const bookedList = await getBookedList(date);
      const bookedTimeList = bookedList.map(e => ({
        start: dateToTimeString(e.start),
        end: dateToTimeString(e.end),
      }));
      const bookedTimeListSplitted = bookedTimeList
        .map(e => generateHourlyTimeRanges(e.start, e.end))
        .flatMap(e => e)
        .map(e => e.value);
      const filteredAvailableTimeList = allAvailableTimes.filter(
        e => !bookedTimeListSplitted.some(booked => booked === e.value),
      );
      setFilteredAvailableTimes(filteredAvailableTimeList);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const getBookedList = async (date: string) => {
    try {
      const start = dayjs(date).format('YYYY-MM-DDTHH:mm:ss');
      const end = dayjs(date).endOf('day').format('YYYY-MM-DDTHH:mm:ss');
      const {data} = await serviceMindService.getAmenityBookingsInit({
        start,
        end,
        history: false,
        facility: facility.id,
      });
      return data as AmenityBooking[];
    } catch (error) {
      return [];
    }
  };

  const onSelectDate = (value: string) => {
    setDate(value);
    onDateChanged(value);
  };

  return (
    <View className="px-4 pb-10 flex flex-col" style={{gap: 32}}>
      <Text size="B2" color="subtitle-muted">
        {t('Residential__Amenity_Booking__Available_time', 'Available time')}
      </Text>
      <View className="w-full border-[1px] border-[#DCDCDC] flex flex-col items-start px-[16px] py-[20px]">
        <Text weight="bold">{getName(facility)}</Text>
        <Text>{getAreaName(facility)}</Text>
        {/* <Text>Open {getOpenTime()}</Text> */}
        <Text>
          {t('Residential__quota__text', 'Quota')} : {quota ?? 0}
        </Text>
      </View>
      <FormProvider {...methods}>
        <View className="item flex flex-col space-y-1">
          <DatePicker
            minDate={minDaysInAdvance}
            maxDate={dayjs().add(MAX_DAYS_IN_ADVANCE, 'days').toDate()}
            labelText={t(
              'Residential__Amenity_Booking__Available_date',
              'Date',
            )}
            placeholder={t(
              'Residential__Amenity_Booking__Available_date',
              'Date',
            )}
            defaultValue={date}
            value={date}
            onDateChange={onSelectDate}
            name="date"
            disabled={disabled}
          />
        </View>

        {isReachedOutOfQuota && (
          <Text color="fire-engine-red" size="B1" weight="regular">
            {t(
              'Residential__Amenity_Reached__the__monthly',
              'Your booking has reached the monthly limit.',
            )}
          </Text>
        )}

        {!isReachedOutOfQuota && (
          <TouchableOpacity
            className={`flex flex-row justify-between items-center px-4 py-3 bg-[#EFEFEF]`}
            onPress={() =>
              navigation.navigate(
                'ResidentialAmenityBookingAvailableTimeScreen',
                {
                  availableTimeList: filteredAvailableTimes,
                  minPeriod: facility?.condition?.condition?.minPeriod ?? 0,
                  maxPeriod: facility?.condition?.condition?.maxPeriod ?? 0,
                },
              )
            }
            disabled={!date || disabled}>
            <View className="flex flex-row gap-2 justify-center items-center">
              <View>
                <Icon
                  type="scTimeIcon"
                  width={20}
                  height={20}
                  color="#014541"
                />
              </View>
              <Text weight="medium" color="dark-teal">
                {wordSelectTime}
              </Text>
            </View>
            <Icon
              type="arrowRightIcon"
              width={20}
              height={20}
              color="#014541"
            />
          </TouchableOpacity>
        )}
      </FormProvider>

      {hasError && !filteredAvailableTimes.some(e => e.selected) && (
        <Text color="fire-engine-red" size="B1" weight="regular">
          {t(
            'Residential__Amenity_Please__select__available__time',
            'Please select available time',
          )}
        </Text>
      )}

      {/* TODO: Validation time slot is unavailable (waiting for API)  */}
      {/* {hasSelected && (
        <Text color="fire-engine-red" size="B1" weight="regular">
          {t(
            'Residential__Amenity_Booking__The_selected_time_slot_is_unavailable',
            'The selected time slot is unavailable. Please choose another time',
          )}
        </Text>
      )} */}

      <View className="item flex flex-col space-y-1">
        <Text color="dark-gray" size="B1" weight="regular">
          {t('Residential__Amenity_Booking__Remark_des', 'Remark')}
        </Text>
        <TextInput
          style={[styles.input, remark ? styles.normalText : styles.input]}
          placeholder={t(
            'ResidentialAmenity_BookingRemark_placeholder',
            'Please specific your special requirement',
          )}
          value={remark}
          onChangeText={onSetRemark}
          multiline={true}
          editable={!disabled}
        />
      </View>
      {isKeyboardVisible && <Spacing height={300} />}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 205,
    borderColor: '#DCDCDC',
    borderWidth: 1,
    fontSize: 16,
    padding: 16,
    fontFamily: 'OneBangkok-Italic',
    textAlignVertical: 'top',
  },
  normalText: {
    fontFamily: 'OneBangkok-Regular',
  },
});

export default CreateAmenityBookingThirdStep;
