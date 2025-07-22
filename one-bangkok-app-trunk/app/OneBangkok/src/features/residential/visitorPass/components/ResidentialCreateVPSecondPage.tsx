/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import t from '~/utils/text';
import {Pressable, ScrollView, View} from 'react-native';
import {Spacing, Text} from '~/components/atoms';
import {
  useForm,
  FormProvider,
  SubmitHandler,
  FieldValues,
} from 'react-hook-form';
import {HeadText, StickyButton} from '~/components/molecules';
import getTheme from '~/utils/themes/themeUtils';
import {
  createVisitorPassAction,
  RepeatConfigDay,
  RepetitionType,
  useCreateVisitorPassState,
} from '../store';
import dayjs from 'dayjs';
import {
  UnitDetail,
  useResidentialUnitSelectedState,
} from '~/states/residentialTenant/residentialTenantState';
import {Day, DaySelect, defaultDays} from '../components/SelectSpecificDay';
import serviceMindService from '~/services/residentialService/ServiceMindService';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {hideLoading, showLoading} from '~/states/loadingState';
import {DropdownItem} from './ControlledSelectList';
import {Dropdown} from './Dropdown';
import {DatePicker} from './DatePicker';
import RepeatVisitorPass from './RepeatVisitorPass';
import {useFocusEffect} from '@react-navigation/native';
import SelectTimePeriod from './SelectTimePeriod';

const MAX_DAYS_IN_ADVANCE = 60;
type DropDown = {
  label: string;
  value: string;
};

type Props = {
  onNextStep: Function;
  isEdit: boolean;
};

const dayToShortDay: {[key: string]: RepeatConfigDay} = {
  Monday: 'mon',
  Tuesday: 'tue',
  Wednesday: 'wed',
  Thursday: 'thu',
  Friday: 'fri',
  Saturday: 'sat',
  Sunday: 'sun',
};

const shortDayToDay: {[key: string]: Day} = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

const ResidentialCreateVPSecondPage = ({onNextStep, isEdit}: Props) => {
  const {...methods} = useForm({mode: 'onSubmit', reValidateMode: 'onChange'});
  const createState = useCreateVisitorPassState();
  const language =
    appLanguageState.currentLanguage.get() ||
    appLanguageState.defaultLanguage.get();
  const unitSelectedState = useResidentialUnitSelectedState();
  const selectedUnitId = unitSelectedState.unitId.value;
  const [isChangeDate, setIsChangeDate] = useState<boolean>(false);
  const [properties, setProperties] = useState<UnitDetail[]>([]);
  const [propertyDetail, setPropertyDetail] = useState<UnitDetail>();
  const [date, setDate] = useState<string>(createState.date.value);
  const [isSpecificTime, setIsSpecificTime] = useState(
    createState.timeConfig.isSpecific.value,
  );
  const [isRepeat, setIsRepeat] = useState(
    createState.repeatConfig.isRepeat.value,
  );
  const [repeatType, setRepeatType] = useState<string | undefined>(
    createState.repeatConfig.type.value
      ? String(createState.repeatConfig.type.value)
      : undefined,
  );
  const [specificDays, setSpecificDays] = useState<DaySelect[]>(
    defaultDays.map(e => ({
      ...e,
      selected:
        createState.repeatConfig.days.value?.some(
          day => shortDayToDay[day] === e.day,
        ) ?? false,
    })),
  );
  const [buildings, setBuildings] = useState<DropDown[]>([]);
  const [units, setUnits] = useState<DropDown[]>([]);
  const [floors, setFloors] = useState<DropDown[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<string>(
    createState.buildingId.value,
  );
  const [selectedUnit, setSelectedUnit] = useState<string>(
    createState.unitId.value,
  );
  const [selectedFloorCode, setSelectedFloorCode] = useState<string>(
    createState.floorCode.value,
  );
  const [selectedElevator, setSelectedElevator] = useState<string>(
    createState.elevatorId.value,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [specificStart, setSpecificStart] = useState(
    createState.timeConfig.start.value,
  );
  const [specificEnd, setSpecificEnd] = useState(
    createState.timeConfig.end.value,
  );
  const [repeatUtilDate, setRepeatUtilDate] = useState<string | undefined>(
    isRepeat ? createState.repeatConfig.endDate.value! : undefined,
  );
  const [requiredSpecificDayError, setRequiredSpecificDayError] =
    useState(false);

  const [specificTimeError, setSpecificTimeError] = useState<string | null>(
    null,
  );

  const clearTimeError = () => setSpecificTimeError(null);

  const [isPageEdit, setIsPageEdit] = useState(isEdit);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    properties.length >= 1 && initialDropdowns();
  }, [properties]);

  useEffect(() => {
    setIsChangeDate(true);
  }, [date]);

  useFocusEffect(
    useCallback(() => {
      try {
        const selectedDays = specificDays
          ? specificDays
              .filter(
                e => e.selected && e.day !== 'Weekday' && e.day !== 'Weekend',
              )
              .map(e => dayToShortDay[e.day])
          : null;

        const floorId = propertyDetail
          ? getFloorIdByFloorCode(propertyDetail, selectedFloorCode)
          : null;
        createVisitorPassAction.set({
          buildingId: selectedBuilding,
          buildingName: buildings.find(e => e.value === selectedBuilding)
            ?.label,
          unitId: selectedUnit,
          unitName: units.find(e => e.value === selectedUnit)?.label,
          floorCode: selectedFloorCode,
          floorId: floorId?.toString(),
          floorName: floors.find(e => e.value === selectedFloorCode)?.label,
          elevatorId: selectedElevator, // Bim ZoneID
          date: date ? formatDate(date) : null,
          timeConfig: {
            isSpecific: isSpecificTime,
            start: specificStart,
            end: specificEnd,
          },
          repeatConfig: {
            isRepeat,
            type: repeatType ? parseInt(repeatType) : null,
            date: date ? dayjs(date).get('date') : null,
            days: selectedDays,
            endDate: repeatUtilDate ? formatDate(repeatUtilDate) : '',
          },
        });
        if (createState.isEdit.value!) {
          const now = dayjs();
          const selectedDate = dayjs(date);
          const isToday = selectedDate.isSame(now, 'day');
          const isPastDate = selectedDate.isBefore(now.startOf('day'), 'day');
          const isFutureDate = selectedDate.isAfter(now.startOf('day'), 'day');

          if (isFutureDate) {
            setDate(formatDate(selectedDate.toString()));
            setSpecificStart(specificStart);
            setSpecificEnd(specificEnd);
          } else {
            if (isPastDate) {
              const chosenStart = dayjs(
                `${now.format('YYYY-MM-DD')} ${specificStart}`,
                'YYYY-MM-DD HH:mm',
              );
              if (chosenStart.isAfter(now)) {
                setDate(formatDate(now.toString()));
                setSpecificStart(specificStart);
                setSpecificEnd(specificEnd);
              } else {
                let minute = now.minute();
                let hour = now.hour();

                if (minute <= 30) {
                  minute = 30;
                } else {
                  minute = 0;
                  hour += 1;
                }

                const start = dayjs().hour(hour).minute(minute).second(0);
                const end = start.add(4, 'hour');

                setDate(formatDate(now.toString()));
                setSpecificStart(start.format('HH:mm'));
                setSpecificEnd(end.format('HH:mm'));
              }
            } else if (isToday) {
              const chosenStart = dayjs(
                `${now.format('YYYY-MM-DD')} ${specificStart}`,
                'YYYY-MM-DD HH:mm',
              );
              if (chosenStart.isAfter(now)) {
                setDate(formatDate(now.toString()));
                setSpecificStart(specificStart);
                setSpecificEnd(specificEnd);
              } else {
                let minute = now.minute();
                let hour = now.hour();

                if (minute <= 30) {
                  minute = 30;
                } else {
                  minute = 0;
                  hour += 1;
                }

                const start = dayjs().hour(hour).minute(minute).second(0);
                const end = start.add(4, 'hour');

                setDate(formatDate(now.toString()));
                setSpecificStart(start.format('HH:mm'));
                setSpecificEnd(end.format('HH:mm'));
              }
            }
          }
          setIsPageEdit(
            createState.isEdit.value! ? createState.isEdit.value : false,
          );
        }
      } catch (error) {
        console.log('save states error => ', error);
      }
    }, [
      date,
      isRepeat,
      repeatType,
      specificDays,
      repeatUtilDate,
      selectedBuilding,
      selectedUnit,
      selectedFloorCode,
      selectedElevator,
      isSpecificTime,
      specificStart,
      specificEnd,
      propertyDetail,
    ]),
  );

  useEffect(() => {
    if (requiredSpecificDayError) {
      setRequiredSpecificDayError(specificDays.some(e => e.selected));
    }
  }, [specificDays]);

  const fetchData = async () => {
    try {
      showLoading();
      setIsLoading(true);

      const initProperties = await getProperties();
      setProperties(initProperties);
      initialRepeatConfig();
    } catch (error) {
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };

  const initialRepeatConfig = () => {
    if (createState.repeatConfig.isRepeat.value) {
      const selectedRepeatType = createState.repeatConfig.type.value;
      selectedRepeatType && setRepeatType(selectedRepeatType.toString());
      const selectedDays = createState.repeatConfig.days.value;

      if (
        selectedRepeatType === RepetitionType.EVERY_SPECIFIC_DAY &&
        selectedDays
      ) {
        initialRepeatSpecificDay(selectedDays as string[]);
      }
    }
  };

  const initialRepeatSpecificDay = (selectedDays: string[]) => {
    const initSelectedDays = defaultDays.map(e => ({
      ...e,
      selected: selectedDays.some(day => day === dayToShortDay[e.day]),
    }));
    const _isSelectedWeekdayDays = isSelectedWeekdayDays(initSelectedDays);
    const _isSelectedWeekendDays = isSelectedWeekendDays(initSelectedDays);
    setSpecificDays(initSelectedDays);

    if (_isSelectedWeekdayDays && _isSelectedWeekendDays) return;
    if (_isSelectedWeekdayDays) {
      const index = initSelectedDays.findIndex(e => e.day === 'Weekday');
      if (index !== -1) {
        initSelectedDays[index].selected = true;
      }
    }

    if (_isSelectedWeekendDays) {
      const index = initSelectedDays.findIndex(e => e.day === 'Weekend');
      if (index !== -1) {
        initSelectedDays[index].selected = true;
      }
    }
    setSpecificDays(initSelectedDays);
  };

  const isSelectedWeekdayDays = (days: DaySelect[]) => {
    const weekdays = days.filter(e => isWeekdayDays(e.day));
    return !weekdays.filter(e => e.day !== 'Weekday').some(e => !e.selected);
  };

  const isSelectedWeekendDays = (days: DaySelect[]) => {
    const weekends = days.filter(e => isWeekendDays(e.day));
    return !weekends.filter(e => e.day !== 'Weekend').some(e => !e.selected);
  };

  const isWeekendDays = (day: Day) => {
    return (
      day !== 'Monday' &&
      day !== 'Tuesday' &&
      day !== 'Wednesday' &&
      day !== 'Thursday' &&
      day !== 'Friday' &&
      day !== 'Weekday'
    );
  };

  const isWeekdayDays = (day: Day) => {
    return (
      day !== 'Saturday' &&
      day !== 'Sunday' &&
      day !== 'Weekday' &&
      day !== 'Weekend'
    );
  };

  const initialDropdowns = async () => {
    try {
      // initial buildings & selected building
      const buildingId =
        properties.find(e => e.propertyUnitId === selectedUnitId)?.buildingId ??
        properties[0].buildingId;
      const dropdownBuildings = getDropdownBuildings(properties);
      setBuildings(dropdownBuildings);
      setSelectedBuilding(buildingId);

      // initial units & selected unit
      const dropdownUnits = getDropdownUnits(selectedUnitId, properties);
      setUnits(dropdownUnits);
      setSelectedUnit(selectedUnitId);

      // initial floors
      const initPropertyDetail = await getPropertyDetail(selectedUnitId);
      setPropertyDetail(initPropertyDetail);
      const dropdownFloors = getDropdownFloors(initPropertyDetail);
      setFloors(dropdownFloors);
      if (dropdownFloors.length === 1) {
        setSelectedFloorCode(dropdownFloors[0].value);
      }
    } catch (error) {
      console.log('initialDropdowns error => ', error);
    }
  };

  const getProperties = async (): Promise<UnitDetail[]> => {
    const {data} = await serviceMindService.properties();
    return data.properties;
  };

  const getDropdownBuildings = (properties: UnitDetail[]) => {
    return properties.map(e => ({
      label: language === 'th' ? e.projectsNameThai : e.projectsName,
      value: e.buildingId,
    }));
  };

  const getDropdownUnits = (
    selectedBuildingId: string,
    properties: UnitDetail[],
  ) => {
    const filteredUnits = properties.filter(
      e => e.propertyUnitId === selectedBuildingId,
    );
    return filteredUnits.map(e => ({
      value: e.propertyUnitId,
      label: e.houseNumber,
    }));
  };

  const getDropdownFloors = (propertyDetail: UnitDetail) => {
    return propertyDetail.floors
      .map(e => ({
        value: e.floorZoneCode,
        label: e.floorZoneCode,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  };

  const getPropertyDetail = async (buildingId: string) => {
    const {data} = await serviceMindService.propertyDetail(buildingId);
    return data.property;
  };

  const formatDate = (date: string) => {
    return dayjs(date).format('YYYY-MM-DD').toString();
  };

  const validate = () => {
    let isValid = true;

    const isRequiredSpecificDayError =
      isRepeat &&
      repeatType !== undefined &&
      parseInt(repeatType) === RepetitionType.EVERY_SPECIFIC_DAY &&
      !specificDays.some(e => e.selected);

    setRequiredSpecificDayError(isRequiredSpecificDayError);
    if (isRequiredSpecificDayError) {
      isValid = false;
    }

    let errorMessage: string | null = null;
    const today = dayjs().format('YYYY-MM-DD');
    let start = dayjs(`${today} ${specificStart}`, 'YYYY-MM-DD HH:mm');
    let end = dayjs(`${today} ${specificEnd}`, 'YYYY-MM-DD HH:mm');

    if (!start.isValid() || !end.isValid()) {
      errorMessage = 'Invalid time format';
      isValid = false;
    } else if (start.isSame(end)) {
      errorMessage = t(
        'Residential__Visitor_management__Visitor_create_2__Error_same_time',
        'Invalid time slot. Please adjust your selection',
      );
      isValid = false;
    } else {
      if (end.isBefore(start)) {
        end = end.add(1, 'day');
      }

      const diffHours = end.diff(start, 'minute') / 60;
      if (diffHours > 4) {
        errorMessage = 'End time must be within 4 hours from start time';
        isValid = false;
      }
    }

    setSpecificTimeError(errorMessage);

    return isValid;
  };

  const handleOnPress: SubmitHandler<FieldValues> = async data => {
    try {
      const valid = validate();
      if (!valid) return;

      const selectedDays = specificDays
        ? specificDays
            .filter(
              e => e.selected && e.day !== 'Weekday' && e.day !== 'Weekend',
            )
            .map(e => dayToShortDay[e.day])
        : null;
      const companyId =
        properties.find(e => e.propertyUnitId === selectedUnit)?.companyId ??
        properties[0].companyId;
      const floorId = propertyDetail
        ? getFloorIdByFloorCode(propertyDetail, selectedFloorCode)
        : null;
      createVisitorPassAction.set({
        companyId,
        buildingId: selectedBuilding,
        buildingName: buildings.find(e => e.value === selectedBuilding)?.label,
        unitId: selectedUnit,
        unitName: units.find(e => e.value === selectedUnit)?.label,
        floorCode: selectedFloorCode,
        floorId: floorId?.toString(),
        floorName: floors.find(e => e.value === selectedFloorCode)?.label,
        elevatorId: selectedElevator, // Bim ZoneID
        date: formatDate(data.date),
        timeConfig: {
          isSpecific: isSpecificTime,
          start: specificStart,
          end: specificEnd,
        },
        repeatConfig: {
          isRepeat,
          type: repeatType ? parseInt(repeatType) : null,
          date: dayjs(date).get('date'),
          days: selectedDays,
          endDate: formatDate(data.repeatUntil),
        },
      });
      onNextStep();
    } catch (error) {}
  };

  const textToggleClassName = getTheme('p-4 border border-brown-400');

  const onSelectBuilding = async (selected: string) => {
    if (selected !== selectedBuilding) {
      setSelectedBuilding(selected);

      // update units
      const dropdownUnits = getDropdownUnits(selected, properties);
      setUnits(dropdownUnits);
      const selectedProperties = properties.filter(
        e => e.buildingId === selected,
      );
      const defaultProperty =
        selectedProperties.find(e => e.isDefault) ?? selectedProperties[0];
      setSelectedBuilding(defaultProperty.propertyUnitId);

      // update floors
      const initPropertyDetail = await getPropertyDetail(
        defaultProperty.propertyUnitId,
      );
      setPropertyDetail(initPropertyDetail);
      const dropdownFloors = getDropdownFloors(initPropertyDetail);
      setFloors(dropdownFloors);
      const initFloorCode = dropdownFloors[0].value;
      setSelectedFloorCode(initFloorCode);

      // update elevators
      if (initPropertyDetail) {
        const zoneId = getZoneIdBySelectedFloor(
          initPropertyDetail,
          initFloorCode,
        );
        zoneId && setSelectedElevator(zoneId.toString());
      }
    }
  };

  const onSelectUnit = async (selected: string) => {
    if (selected !== selectedUnit) {
      setSelectedUnit(selected);
      // update floors
      const initPropertyDetail = await getPropertyDetail(selected);
      setPropertyDetail(initPropertyDetail);
      const dropdownFloors = getDropdownFloors(initPropertyDetail);
      setFloors(dropdownFloors);
      const initFloorCode = dropdownFloors[0].value;
      setSelectedFloorCode(initFloorCode);

      // update elevators
      if (initPropertyDetail) {
        const zoneId = getZoneIdBySelectedFloor(
          initPropertyDetail,
          initFloorCode,
        );
        zoneId && setSelectedElevator(zoneId.toString());
      }
    }
  };

  const onSelectFloor = (selected: string) => {
    try {
      if (selected !== selectedFloorCode) {
        setSelectedFloorCode(selected);
        // update elevators
        if (propertyDetail) {
          const zoneId = getZoneIdBySelectedFloor(propertyDetail, selected);
          zoneId && setSelectedElevator(zoneId.toString());
        }
      }
    } catch (error) {
      console.log('onSelectFloor error => ', error);
    }
  };

  const onIsRepeatChange = (value: boolean) => {
    setIsRepeat(value);
  };

  const getZoneIdBySelectedFloor = (
    propertyDetail: UnitDetail,
    selectedFloorCode: string,
  ) => {
    try {
      const residenceAuthFloor = propertyDetail.bimData.residenceAuthFloor.find(
        e => e.floorName === selectedFloorCode,
      );
      if (!residenceAuthFloor) return null;
      return residenceAuthFloor.locations[0].zoneID;
    } catch (error) {
      return null;
    }
  };

  const getFloorIdByFloorCode = (
    propertyDetail: UnitDetail,
    selectedFloorCode: string,
  ) => {
    try {
      const floor = propertyDetail.floors.find(
        floor => floor.floorZoneCode === selectedFloorCode,
      );
      if (floor) return floor.floorId;
      return null;
    } catch (error) {
      return null;
    }
  };

  return (
    <>
      <ScrollView className="w-screen px-4 py-8">
        <Pressable>
          <Text className="text-muted-light text-sm font-semibold">
            {t('Residential__Access_detail', 'Access Details')}
          </Text>
          {!isLoading && propertyDetail && (
            <FormProvider {...methods}>
              <Spacing height={24} />
              <View style={{zIndex: 20}}>
                <DropdownBuilding
                  items={buildings}
                  defaultValue={selectedBuilding}
                  onSelect={onSelectBuilding}
                />
              </View>

              <Spacing height={24} />
              <View style={{zIndex: 10}}>
                <DropdownUnit
                  items={units}
                  defaultValue={selectedUnit}
                  onSelect={onSelectUnit}
                />
              </View>
              <Spacing height={24} />

              <View style={{zIndex: 10}}>
                <DropdownFloor
                  items={floors}
                  defaultValue={selectedFloorCode}
                  onSelect={onSelectFloor}
                />
              </View>
              <Spacing height={24} />

              <DatePicker
                minDate={dayjs().toDate()}
                maxDate={dayjs().add(MAX_DAYS_IN_ADVANCE, 'days').toDate()}
                labelText={t('Residential__Date', 'Access Date')}
                placeholder={t('Residential__Date', 'Access Date')}
                defaultValue={date}
                onFocus={() => methods.clearErrors('date')}
                onDateChange={setDate}
                name="date"
                rules={{
                  required: t(
                    'Residential__Visitor_management__Visitor_create_2__Error_date',
                    'Please Select Date',
                  ),
                }}
              />
              <Spacing height={24} />
              <SelectTimePeriod
                disabled={!date}
                selectedDate={dayjs(date).toDate()}
                specificStart={specificStart}
                setSpecificStart={setSpecificStart}
                specificEnd={specificEnd}
                setSpecificEnd={setSpecificEnd}
                specificTimeError={specificTimeError}
                clearTimeError={clearTimeError}
                isEdit={isPageEdit}
                isChangeDate={isChangeDate}
              />
            </FormProvider>
          )}
          <Spacing height={80} />
        </Pressable>
      </ScrollView>
      {!isLoading && (
        <StickyButton
          title={t('Residential__Next', 'Next')}
          onPress={methods.handleSubmit(handleOnPress, validate)}
          rightIcon="next"
          color="dark-teal"
        />
      )}
    </>
  );
};
export default ResidentialCreateVPSecondPage;

type DropdownProps = {
  defaultValue?: string;
  onSelect: (id: string) => void;
  items: DropdownItem[];
};
const DropdownBuilding = React.memo(
  ({defaultValue, onSelect, items}: DropdownProps) => {
    return (
      <Dropdown
        onSelect={onSelect}
        defaultValue={defaultValue}
        items={items}
        labelText={t('Residential__Building', 'Building')}
        placeholder={t('Residential__Building', 'Building')}
        name="building"
        rules={{
          required: t(
            'Residential__Visitor_management__Visitor_create_2__Error_building',
            'Please select the building',
          ),
        }}
        disabled
      />
    );
  },
);

const DropdownUnit = React.memo(
  ({defaultValue, onSelect, items}: DropdownProps) => {
    return (
      <Dropdown
        onSelect={onSelect}
        defaultValue={defaultValue}
        items={items}
        labelText={t('Residential__Guest_Management_Unit', 'Unit')}
        placeholder={t('Residential__Guest_Management_Unit', 'Unit')}
        rules={{
          required: t(
            'Residential__Visitor_management__Visitor_create_2__Error_unit',
            'Please Select Unit',
          ),
        }}
        name="unit"
        disabled
      />
    );
  },
);

const DropdownFloor = React.memo(
  ({defaultValue, onSelect, items}: DropdownProps) => {
    const isSingleItem = items.length === 1;
    const disabled = isSingleItem;
    const selectedValue = isSingleItem ? items[0] : defaultValue || '';

    return (
      <Dropdown
        onSelect={onSelect}
        defaultValue={
          typeof selectedValue === 'string'
            ? selectedValue
            : selectedValue.value
        }
        items={items}
        labelText={t('Residential__Floor', 'Floor')}
        placeholder={t('Residential__Floor', 'Floor')}
        rules={{
          required: t(
            'Residential__Visitor_management__Visitor_create_2__Error_floor',
            'Please Select Floor',
          ),
        }}
        name="floor"
        disabled={disabled}
      />
    );
  },
);

const DropdownElevator = React.memo(
  ({defaultValue, onSelect, items}: DropdownProps) => {
    return (
      <Dropdown
        onSelect={onSelect}
        defaultValue={defaultValue}
        items={items}
        labelText={t('General__Elevator', 'Elevator')}
        placeholder={t('General__Elevator', 'Elevator')}
        rules={{
          required: t(
            'Residential__Visitor_management__Visitor_create_2__Error_elevator',
            'Please select the Elevator',
          ),
        }}
        name="elevator"
      />
    );
  },
);
