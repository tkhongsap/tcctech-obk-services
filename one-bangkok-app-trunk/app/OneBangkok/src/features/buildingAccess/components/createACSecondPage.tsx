import React, {useCallback, useState} from 'react';
import t from '~/utils/text';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Spacing, Text} from '~/components/atoms';
import {TextInput} from '~/components/molecules/TextInput';
import {Colors} from '~/constants/Colors';
import {
  useForm,
  FormProvider,
  SubmitHandler,
  FieldValues,
} from 'react-hook-form';
import {HeadText, StickyButton, useModal} from '~/components/molecules';
import {DatePicker} from '~/components/molecules/DatePicker';
import dayjs from 'dayjs';
import DateTime from '~/utils/datetime';
import {
  createAirConditionerRequestState,
  createAirConditionerRequestAction,
  useCreateAirConditionerRequestState,
} from '../store/airConditionerRequest';
import {TimePicker} from '~/components/organisms/TimePicker';
import {DatePickerThemeEnum} from '~/components/molecules/TimePickerField';
import {activeOpacity} from '~/constants';
import {SelectHours} from '~/components/organisms/GenericModal';
import {
  AC_RATE,
  MINIMUM_ESTIMATED_COST,
} from '../constants/airConditionerRequest';
import {buildingAccessState} from '../store/buildingAccess';
import {find, isEmpty} from 'lodash';
import holidayAction from '~/states/holiday/holidayAction';

const MAX_DAYS_IN_ADVANCE = 30;
const DATE_TIME_WORK_DAY = dayjs().set('hour', 17).set('minute', 0);
const IS_WEEKEND =
  dayjs().day() === 6 ||
  dayjs().day() === 0 ||
  (dayjs().day() === 5 &&
    DateTime.isBefore(DATE_TIME_WORK_DAY.toString(), dayjs().toString()));

interface CreateACSecondPageProps {
  onNextStep: Function;
}

export const calculateEstimatedCost = (hour: string, area: number) => {
  if (hour) {
    const estimatedCost = Math.ceil(Number(hour) * AC_RATE * area * 100) / 100;
    if (estimatedCost < MINIMUM_ESTIMATED_COST) {
      return MINIMUM_ESTIMATED_COST.toLocaleString();
    }
    return estimatedCost.toLocaleString();
  }
  return 0.0;
};

const createACSecondPage = ({onNextStep}: CreateACSecondPageProps) => {
  const {date, duration, dateTimeStart} = useCreateAirConditionerRequestState();
  const [isDisableTime, setIsDisableTime] = useState(date.value === '');
  const [selectedHour, setSelectedHour] = useState(duration.value ?? 1);
  const [_modalState, modalActions] = useModal();
  const [minTime, setMinTime] = useState(
    dayjs().set('hour', 18).set('minute', 0),
  );
  const [maxHours, setMaxHours] = useState('24');

  const {...methods} = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      date: date.value,
      start: dateTimeStart.value
        ? dayjs(dateTimeStart.value).format('HH:mm').toString()
        : undefined,
      duration: duration.value ?? 1,
    },
  });

  const handleOnPress: SubmitHandler<FieldValues> = async data => {
    if (
      dayjs().isSame(dayjs(data.date), 'day') &&
      DateTime.isBefore(DATE_TIME_WORK_DAY.toString(), dayjs().toString())
    ) {
      methods.setError('date', {
        type: 'custom',
        message: t('no_key', 'Same-day request must be submitted before 17:00'),
      });
      checkStartDate();
      return;
    }
    const dateTimeStart = `${dayjs(data.date)
      .format('YYYY-MM-DD')
      .toString()} ${data.start}`;

    const start = dayjs(dateTimeStart, 'YYYY-MM-DD HH:mm').format().toString();

    createAirConditionerRequestAction.setValueACSecondPage(
      start,
      data.duration,
      data.date,
    );
    onNextStep && onNextStep();
  };

  const checkStartDate = () => {
    let date = dayjs().toDate();
    if (!IS_WEEKEND) {
      if (
        DateTime.isBefore(DATE_TIME_WORK_DAY.toString(), dayjs().toString())
      ) {
        date = dayjs().add(1, 'day').toDate();
      }
    } else {
      //set to sunday and add 1 day to monday
      date = dayjs(DateTime.getWeekday(7)).add(1, 'day').toDate();
    }

    const isHoliday = holidayAction.checkHoliday(dayjs(date));

    if (isHoliday) {
      date = dayjs(date).add(1, 'day').toDate();
    }

    return date;
  };

  const onSelectHour = (_value: string) => {
    const value = _value.replace(t('General__Hours', 'hours'), '');
    setSelectedHour(value);
    methods.setValue('duration', value);
    modalActions.hide();
  };

  const ModalSelectHours = () => {
    methods.clearErrors('duration');
    modalActions.setContent(
      <SelectHours
        maxHours={maxHours}
        value={selectedHour}
        onPressCancel={() => modalActions.hide()}
        onPressDone={onSelectHour}
      />,
    );
    modalActions.show();
  };
  const getHourText = () => {
    if (selectedHour) {
      return t('General__Hour_hours', '{{hours}} hours', {hours: selectedHour});
    }
  };

  const getArea = useCallback(() => {
    let zoneArea: number = 0;

    createAirConditionerRequestState.acZoneId.value?.forEach(selected => {
      const existingZone = find(buildingAccessState.acZone.value, {
        id: selected,
      });

      if (existingZone) {
        zoneArea += existingZone?.area_size;
      }
    });

    return zoneArea || 0;
  }, [buildingAccessState.acZone.value]);

  const defaultTime = useCallback(() => {
    if (methods.getValues('date')) {
      methods.setValue('start', '');
      methods.setValue('duration', '');
      methods.clearErrors();
      setSelectedHour('');
      const dataValue = dayjs(methods.getValues('date'));
      const checkWeekend = dataValue.day() === 0 || dataValue.day() === 6;
      const isHoliday = holidayAction.checkHoliday(dataValue);
      if (checkWeekend || isHoliday) {
        setMinTime(dayjs().startOf('date'));
      } else {
        setMinTime(dayjs().set('hour', 18).set('minute', 0));
      }
    }
  }, [methods.getValues('date')]);

  const maxDuration = useCallback(() => {
    methods.setValue('duration', '');
    methods.clearErrors();
    setSelectedHour('');
    const startTime = methods.getValues('start')?.split(':');
    const dataValue = dayjs(methods.getValues('date'));

    const isHoliday = holidayAction.checkHoliday(dataValue);
    const checkWeekend = dataValue.day() === 0 || dataValue.day() === 6;

    const totalHour = 24;
    if (startTime) {
      const startDate = dayjs().set('hour', +startTime[0]).set('minute', 0);
      const endDate = dayjs().add(1, 'day').set('hour', 8).set('minute', 0);

      const diffHours =
        isHoliday || checkWeekend
          ? totalHour - parseInt(startTime[0])
          : endDate.diff(startDate, 'hour');
      setMaxHours(diffHours.toString());
    }
  }, [methods.getValues('start')]);

  return (
    <>
      <ScrollView className="w-screen px-4 py-8">
        <Pressable>
          <HeadText
            tagline={t('General__Date_and_time', 'Date and time')}
            title={t(
              'Otac__Create_2__Select_date',
              'When is the date and time required for the service?',
            )}
            titleSize="H3"
            titleClamps="leading-[26.4]"
          />
          <FormProvider {...methods}>
            <Spacing height={24} />

            <DatePicker
              minDate={checkStartDate()}
              maxDate={dayjs().add(MAX_DAYS_IN_ADVANCE, 'days').toDate()}
              labelText={t('General__Date', 'Date')}
              placeholder={t('General__Date_format', 'DD/MM/YYYY')}
              defaultValue={date.value}
              name={'date'}
              onDateChange={() => {
                defaultTime();
                setIsDisableTime(false);
              }}
              onPress={() => methods.clearErrors('date')}
              onFocus={() => methods.clearErrors('date')}
              rules={{
                required: t(
                  'Otac__Create_2__Select_date_error',
                  'Please select the service date',
                ),
              }}
            />
            <Spacing height={24} />
            <TimePicker
              themeColor={DatePickerThemeEnum.primary}
              labelText={t('General__Start_time', 'Start time')}
              placeholder={t('General__Time_format', 'HH:MM')}
              onFocus={() => methods.clearErrors('start')}
              fixMinute={'00'}
              disabled={isDisableTime}
              name={'start'}
              onPress={() => methods.clearErrors('start')}
              onTimeChange={() => {
                maxDuration();
              }}
              minTime={minTime}
              rules={{
                required:
                  !isDisableTime &&
                  t(
                    'General__Start_time_error',
                    'Please select the start time',
                  ),
                validate: _value => {
                  if (!_value) {
                    return;
                  }
                  if (
                    _value.length < 4 ||
                    Number(_value.slice(0, 2)) > 23 ||
                    Number(_value.slice(3)) > 59
                  ) {
                    return t(
                      'General__Please_input_24_format',
                      'Please, input in 24 hours time format',
                    );
                  }
                },
              }}
            />
            <Spacing height={24} />
            <View className={'flex flex-row gap-[16px]'}>
              <TouchableOpacity
                className="flex-1"
                onPress={() => {
                  ModalSelectHours();
                }}
                activeOpacity={activeOpacity}
                disabled={isEmpty(methods.getValues('start'))}
                style={{minHeight: 105}}>
                <View pointerEvents="none">
                  <TextInput
                    name={'duration'}
                    defaultValue={getHourText()}
                    value={getHourText()}
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholderTextColor={Colors.black40}
                    placeholder={t('General__Select', 'Select')}
                    labelText={t('General__Duration', 'Duration')}
                    rules={{
                      required:
                        !isEmpty(methods.getValues('start')) &&
                        t(
                          'Otac__Create_2__Select_duration',
                          'Please select the duration',
                        ),
                    }}
                    disabled={isEmpty(methods.getValues('start'))}
                  />
                </View>
              </TouchableOpacity>
              <View
                className="flex-1"
                pointerEvents="none"
                style={{minHeight: 105}}>
                <TextInput
                  name={'area'}
                  value={t('General__Sq.m', '{{area}} Sq.m', {
                    area: getArea().toLocaleString(),
                  })}
                  autoCorrect={false}
                  autoCapitalize="none"
                  placeholderTextColor={Colors.black40}
                  labelText={t('General__Area', 'Area')}
                  disabled
                />
              </View>
            </View>
            <Spacing height={24} />
            <View className="flex-1" pointerEvents="none">
              <TextInput
                name={'estimatedCost'}
                value={t('General__Bath_value', '{{value}} Bath', {
                  value: calculateEstimatedCost(selectedHour, getArea()),
                })}
                autoCorrect={false}
                autoCapitalize="none"
                placeholderTextColor={Colors.black40}
                labelText={t('General__Estimated_cost', 'Estimated Cost')}
                disabled
              />
            </View>
          </FormProvider>
          <Spacing height={6} />
          <Text size="B2" weight="medium" color="subtitle-muted">
            {t('General__Conditions', 'Conditions')}
          </Text>
          <Text size="B2" color="subtitle-muted">
            {t(
              'Otac__Create_2__Hourly_rate',
              'Working Day: {{rate}} Baht/Sq.m/Hour',
              {
                rate: AC_RATE.toString(),
              },
            )}
          </Text>
          <Text size="B2" color="subtitle-muted">
            {t(
              'Otac__Create_2__Min_rate',
              'Minimum Charge: {{minimum}} Baht/Hour',
              {
                minimum: MINIMUM_ESTIMATED_COST,
              },
            )}
          </Text>
          <Text size="B2" color="subtitle-muted">
            {t(
              'Otac__Create_2__Before_5pm',
              'Same-day requests must be submitted before 17:00',
            )}
          </Text>
          <Spacing height={80} />
        </Pressable>
      </ScrollView>

      <StickyButton
        title={t('General__Next', 'Next')}
        onPress={methods.handleSubmit(handleOnPress)}
        rightIcon="next"
      />
    </>
  );
};
export default createACSecondPage;

const styles = StyleSheet.create({
  disable: {
    borderColor: '#EFEFEF',
    borderWidth: 1,
    backgroundColor: '#EFEFEF',
    borderRadius: 0,
    height: 48,
    textAlign: 'left',
  },
});
