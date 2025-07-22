/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import t from '~/utils/text';

import {Pressable, ScrollView, View} from 'react-native';
import {Spacing} from '~/components/atoms';
import {
  useForm,
  FormProvider,
  SubmitHandler,
  FieldValues,
} from 'react-hook-form';
import {HeadText, StickyButton} from '~/components/molecules';
import {Dropdown} from '~/components/molecules/Dropdown';
import {DatePicker} from '~/components/molecules/DatePicker';
import getTheme from '~/utils/themes/themeUtils';
import {
  createVisitorPassAction,
  createVisitorPassState,
  useCreateVisitorPassState,
} from '../store';
import ListItemDescription from '~/components/molecules/buildingAccess/ListItemDescription';
import {SelectList} from '~/components/organisms/buildingAccess/SelectList';
import dayjs, {Dayjs} from 'dayjs';
import {useHookstate} from '@hookstate/core';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {memberState} from '../store/member';
import DateTime from '~/utils/datetime';
import {TimePicker} from '~/components/organisms/TimePicker';
import {DatePickerThemeEnum} from '~/components/molecules/TimePickerField';
import {find} from 'lodash';

const MAX_DAYS_IN_ADVANCE = 60;

const SpecitficTimeOfTheDay = ({
  value,
  onChange,
  startValue,
  endValue,
  methods,
  disable,
}: any) => {
  const validateUntilDate = (_value: string | any[]) => {
    const hourEndDigit = Number(_value.slice(0, 2));
    const minuteEndDigit = Number(_value.slice(3));
    const hourStartDigit = Number(methods.getValues('start').slice(0, 2));
    const minuteStartDigit = Number(methods.getValues('start').slice(3));

    if (!_value) {
      return;
    }
    if (hourEndDigit > 23 || minuteEndDigit > 59 || _value.length < 4) {
      return t(
        'General__Please_input_24_format',
        'Please, input in 24 hours time format',
      );
    }
    const isStartHrGreaterThanEndHr = hourStartDigit > hourEndDigit;

    const totalStart = hourStartDigit + minuteStartDigit;
    const totalEnd = hourEndDigit + minuteEndDigit;
    if (
      isStartHrGreaterThanEndHr ||
      (hourStartDigit === hourEndDigit && totalStart >= totalEnd)
    ) {
      return t('General__Input_24_format', 'input in 24 hours time format');
    }
  };
  const [startTime, setStartTime] = useState<Dayjs>(
    dayjs(
      `${DateTime.getCurrentDateTime().format('YYYY-MM-DD')} ${
        startValue ? startValue : '00:00'
      }`,
      'YYYY-MM-DD HH:mm',
    ),
  );
  const [endTime, setEndTime] = useState<Dayjs>(
    dayjs(
      `${DateTime.getCurrentDateTime().format('YYYY-MM-DD')} ${
        endValue ? endValue : '23:59'
      }`,
      'YYYY-MM-DD HH:mm',
    ),
  );
  return (
    <View className="flex flex-col">
      <ListItemDescription
        text={t(
          'Visitor_pass__Visitor_create_2__Specific_time_header',
          'Specific time of the day',
        )}
        description={t(
          'Visitor_pass__Visitor_create_2__Specific_time_body',
          "If you don't specify the time, visitors have access to the building the whole day",
        )}
        value={value}
        onValueChange={onChange}
        disabled={disable}
      />
      <Spacing height={16} />
      <>
        <Spacing height={16} />
        <View className={'flex flex-row gap-[16px]'}>
          <View className="flex-1">
            <TimePicker
              disabled={!value}
              themeColor={DatePickerThemeEnum.forest}
              defaultValue={startValue ?? '00:00'}
              labelText={t('General__Start', 'Start')}
              onFocus={() => methods.clearErrors('start')}
              maxTime={endTime}
              onTimeChange={(_value: string) => {
                setStartTime(
                  dayjs(
                    `${DateTime.getCurrentDateTime().format(
                      'YYYY-MM-DD',
                    )} ${_value}`,
                    'YYYY-MM-DD HH:mm',
                  ),
                );
              }}
              name={'start'}
              rules={{
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
                      'Please input in 24 hours time format',
                    );
                  }
                },
              }}
            />
          </View>
          <View className="flex-1">
            <TimePicker
              disabled={!value}
              onFocus={() => methods.clearErrors('end')}
              themeColor={DatePickerThemeEnum.forest}
              minTime={startTime?.add(1, 'minute')}
              labelText={t('General__End', 'End')}
              name={'end'}
              defaultValue={endValue ?? '23:59'}
              onTimeChange={(_value: string) => {
                setEndTime(
                  dayjs(
                    `${DateTime.getCurrentDateTime().format(
                      'YYYY-MM-DD',
                    )} ${_value}`,
                    'YYYY-MM-DD HH:mm',
                  ),
                );
              }}
              rules={{
                validate: _value => validateUntilDate(_value),
              }}
            />
          </View>
        </View>
      </>
    </View>
  );
};

const Repeat = ({
  value,
  onChange,
  disable,
  date,
  defaultValue,
  methods,
  dateUntil,
}: any) => {
  return (
    <View>
      <ListItemDescription
        text={t('General__Repeat', 'Repeat')}
        description={t(
          'Visitor_pass__Visitor_create_2__Repeat_body',
          'Select if visitors should have access to the building  for more than one day',
        )}
        value={value}
        onValueChange={onChange}
        disabled={disable}
      />
      <Spacing height={24} />
      <SelectList
        rules={{
          required:
            value &&
            t(
              'General__Please_select_repeat_date',
              'Please Select Repeat Date',
            ),
        }}
        disabled={!value}
        data={[
          {
            value: 'EVERYDAY',
            name: t('Visitor_pass__Visitor_create_2__Everyday', 'EveryDay'),
          },
          {
            value: 'WEEKDAY',
            name: date
              ? t(
                  'Visitor_pass__Visitor_create_2__Every_day',
                  'Every {{day}}',
                ).replace(
                  '{{day}}',
                  dayjs.weekdays()[dayjs(date as string).get('day')],
                )
              : t('Visitor_pass__Visitor_create_2__Every_day_pre', 'Every ...'),
          },
          {
            value: 'DAY_IN_MONTH',
            name: date
              ? t(
                  'Visitor_pass__Visitor_create_2__Every_date',
                  'Every {{day}} of the month',
                ).replace(
                  '{{day}}',
                  dayjs(date as string)
                    .get('date')
                    .toString(),
                )
              : t(
                  'Visitor_pass__Visitor_create_2__Every_date_pre',
                  'Every ... of the month',
                ),
          },
        ]}
        defaultValue={defaultValue}
        name={'repeatType'}
      />
      <Spacing height={24} />
      <DatePicker
        disabled={!value}
        minDate={dayjs(date).toDate()}
        maxDate={dayjs().add(MAX_DAYS_IN_ADVANCE, 'days').toDate()}
        labelText={t('General__Until', 'Until')}
        placeholder={t('General__Until', 'Until')}
        defaultValue={dateUntil.value}
        name={'until'}
        onFocus={() => methods.clearErrors('until')}
        rules={{
          required: value
            ? t('General__Please_select_until_date', 'Please Select Until Date')
            : '',
          validate: _value => {
            if (value) {
              // limit 90 days
              if (
                dayjs(_value).diff(DateTime.getCurrentDateTime(), 'day') > 90
              ) {
                return t('General__Limit_90_days', 'Limit date is 90 days');
              }
              if (dayjs(_value).isBefore(methods.getValues('date'))) {
                return t(
                  'General__Until_date_grater_end_date',
                  'Until date must be greater than date',
                );
              }
            }
          },
        }}
      />
    </View>
  );
};

interface DropDown {
  label: string;
  value: string;
}

interface CreateVPFirstPageProps {
  onNextStep: Function;
}
const CreateVPSecondPage = ({onNextStep}: CreateVPFirstPageProps) => {
  const {...methods} = useForm({mode: 'onSubmit', reValidateMode: 'onChange'});
  const {
    towerId,
    floorId,
    repetition,
    date,
    from,
    to,
    dateUntil,
    enableSpecificTime,
  } = useCreateVisitorPassState();
  const [enableRepeat, setEnableRepeat] = useState(
    repetition.value !== undefined,
  );
  const [dateData, setDateData] = useState(date.value);
  const [towerList, setTowerList] = useState<DropDown[]>([]);
  const [locationList, setLocationList] = useState<DropDown[]>([]);
  const [selectedTower, setSelectedTower] = useState(
    createVisitorPassState.towerId.value ?? '',
  );
  const [isEnableSpecificTime, setIsEnableSpecificTime] = useState(
    enableSpecificTime.value,
  );
  const handleOnPress: SubmitHandler<FieldValues> = async data => {
    createVisitorPassAction.setTowerId(data.building);
    createVisitorPassAction.setFloorId(data.floor);
    createVisitorPassAction.setDate(data.date);
    createVisitorPassAction.setDateUntil(data.until);
    createVisitorPassAction.setEnableSpecificTime(isEnableSpecificTime);
    if (isEnableSpecificTime && data.start && data.end) {
      const fromDate = `${dayjs(data.date).format('YYYY-MM-DD').toString()} ${
        data.start
      }`;
      const toDate = `${dayjs(data.date).format('YYYY-MM-DD').toString()} ${
        data.end
      }`;
      createVisitorPassAction.setFrom(
        dayjs(fromDate, 'YYYY-MM-DD HH:mm').format().toString(),
      );
      createVisitorPassAction.setTo(
        dayjs(toDate, 'YYYY-MM-DD HH:mm').format().toString(),
      );
    }

    if (enableRepeat && data.repeatType) {
      let value;
      switch (data.repeatType) {
        case 'EVERYDAY':
          break;
        case 'WEEKDAY':
          value = dayjs(data.date as string).get('day');
          break;
        case 'DAY_IN_MONTH':
          value = dayjs(data.date as string).get('date');
          break;
        default:
          break;
      }
      const until = `${dayjs(data.until).format('YYYY-MM-DD').toString()} ${
        data.end
      }`;
      const untilDate = dayjs(until, 'YYYY-MM-DD HH:mm').format().toString();
      createVisitorPassAction.setUntil(untilDate);
      createVisitorPassAction.setRepetition(data.repeatType, value);
    } else {
      createVisitorPassAction.setRepetitionDefault();
    }

    onNextStep && onNextStep();
  };
  const textToggleClassName = getTheme('p-4 border border-brown-400');

  const onSelectBuilding = (_value: string) => {
    setSelectedTower(_value);
  };

  const onSelectFloor = (_value: string) => {
    // do something
  };

  useEffect(() => {
    if (dateData && !from.value && !to.value) {
      const dateFormat = dayjs(dateData).format('YYYY-MM-DD').toString();
      const startDateStr = dayjs(`${dateFormat} 00:00`, 'YYYY-MM-DD HH:mm')
        .format()
        .toString();
      const endDateStr = dayjs(`${dateFormat} 23:59`, 'YYYY-MM-DD HH:mm')
        .format()
        .toString();
      createVisitorPassAction.setFrom(startDateStr);
      createVisitorPassAction.setTo(endDateStr);
    }

    if (!isEnableSpecificTime) {
      const dateFormat = dayjs(dateData).format('YYYY-MM-DD').toString();
      const startDateStr = dayjs(`${dateFormat} 00:00`, 'YYYY-MM-DD HH:mm')
        .format()
        .toString();
      const endDateStr = dayjs(`${dateFormat} 23:59`, 'YYYY-MM-DD HH:mm')
        .format()
        .toString();
      createVisitorPassAction.setFrom(startDateStr);
      createVisitorPassAction.setTo(endDateStr);
    }
  }, [dateData, from, to, isEnableSpecificTime]);

  const handleOnChangeSpecificTime = useCallback(() => {
    setIsEnableSpecificTime(!isEnableSpecificTime);
  }, [isEnableSpecificTime]);

  const handleOnChangeRepeat = useCallback(() => {
    setEnableRepeat(!enableRepeat);
    methods.setValue('repeatType', '');
    methods.clearErrors('repeatType');
    methods.clearErrors('until');
  }, [enableRepeat]);

  const state = useHookstate(appLanguageState);
  const defaultSelected =
    state.currentLanguage.get() !== ''
      ? state.currentLanguage.get()
      : state.defaultLanguage.get();

  const mapTower = useCallback(() => {
    const towers: DropDown[] = [];
    const _towerList = memberState.towers.value ?? [];
    _towerList.map(tower => {
      const towerNameFallback = tower.display_name
        ? tower.display_name.en
        : tower.name;
      towers.push({
        label: tower.display_name[defaultSelected] ?? towerNameFallback,
        value: tower.id,
      });
    });
    setTowerList(towers);
    mapLocation();
  }, [defaultSelected]);

  useEffect(() => {
    mapTower();
  }, []);

  const mapLocation = useCallback(() => {
    const locations: DropDown[] = [];
    const _towerList = memberState.towers.value ?? [];
    const index = _towerList.map(e => e.id).indexOf(selectedTower);
    if (index >= 0) {
      _towerList[index].locations.map(location => {
        const floor = find(_towerList[index].floors, {id: location.floor_id});
        if (floor) {
          const floorFallback = floor.display_name
            ? floor.display_name.en
            : floor.name;
          locations.push({
            label: floor.display_name[defaultSelected] ?? floorFallback,
            value: location.id,
          });
        }
      });

      setLocationList(locations);
    }
  }, [defaultSelected, selectedTower]);

  useEffect(() => {
    if (selectedTower && selectedTower !== floorId.value) {
      // methods.setValue('floor', '');
      mapLocation();
    }
  }, [floorId.value, mapLocation, selectedTower]);
  return (
    <>
      <ScrollView className="w-screen px-4 py-8">
        <Pressable>
          <HeadText
            tagline={t('General__Access_detail', 'Access details')}
            title={t(
              'Visitor_pass__Visitor_create_2__Header',
              'Specify where and when your visitor should have access',
            )}
            titleSize="H3"
            titleClamps="leading-[26.4]"
          />
          <Spacing height={32} />
          <FormProvider {...methods}>
            <Spacing height={24} />
            <View style={{zIndex: 20}}>
              <Dropdown
                onSelect={onSelectBuilding}
                defaultValue={towerId.value}
                items={towerList}
                labelText={t('General__Building', 'Building')}
                placeholder={t('General__Building', 'Building')}
                name={'building'}
                rules={{
                  required: t(
                    'Visitor_pass__Visitor_create_2__Error_building',
                    'Please select the building',
                  ),
                }}
              />
            </View>

            <Spacing height={24} />
            <View style={{zIndex: 10}}>
              <Dropdown
                onSelect={onSelectFloor}
                defaultValue={floorId.value}
                items={locationList}
                labelText={t('General__Floor', 'Floor')}
                placeholder={t('General__Floor', 'Floor')}
                rules={{
                  required: t(
                    'Visitor_pass__Visitor_create_2__Error_floor',
                    'Please Select Floor',
                  ),
                }}
                name={'floor'}
              />
            </View>
            <Spacing height={24} />
            <DatePicker
              minDate={dayjs().toDate()}
              maxDate={dayjs().add(MAX_DAYS_IN_ADVANCE, 'days').toDate()}
              labelText={t('General__Date', 'Date')}
              placeholder={t('General__Date', 'Date')}
              defaultValue={date.value}
              onFocus={() => methods.clearErrors('date')}
              onDateChange={(value: React.SetStateAction<string>) => {
                setDateData(value);
              }}
              name={'date'}
              rules={{
                required: t(
                  'General__Please_select_date',
                  'Please Select Date',
                ),
              }}
            />

            <Spacing height={24} />
            <View className={textToggleClassName}>
              <SpecitficTimeOfTheDay
                value={isEnableSpecificTime}
                onChange={handleOnChangeSpecificTime}
                methods={methods}
                disable={!dateData}
                startValue={
                  from.value
                    ? dayjs(from.value).format('HH:mm').toString()
                    : undefined
                }
                endValue={
                  to.value
                    ? dayjs(to.value).format('HH:mm').toString()
                    : undefined
                }
              />
            </View>
            <Spacing height={24} />
            <View className={textToggleClassName}>
              <Repeat
                value={enableRepeat}
                disable={!dateData}
                onChange={handleOnChangeRepeat}
                defaultValue={repetition.value?.type}
                date={dateData}
                methods={methods}
                dateUntil={dateUntil}
              />
            </View>
          </FormProvider>
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
export default CreateVPSecondPage;
