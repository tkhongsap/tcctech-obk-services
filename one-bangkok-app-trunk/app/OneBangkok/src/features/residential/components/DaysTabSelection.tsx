import getTheme from '~/utils/themes/themeUtils';
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Icon} from '~/components/atoms';
import t from '~/utils/text';

export type DayTabType = {
  number: number;
  display: string;
  id: string;
  title: string;
  key: string;
  offset: number;
  active: boolean;
};
export const DayTabList: DayTabType[] = [
  {
    number: 7,
    id: 'S1',
    title: t('Residential__Home_Automation__Short_Sunday', 'S'),
    key: 'Sun',
    display: 'Sunday',
    offset: 1440 * 6,
    active: false,
  }, // 8640, 9240 = SUN 10:00
  {
    number: 1,
    id: 'M2',
    title: t('Residential__Home_Automation__Short_Monday', 'M'),
    key: 'Mon',
    display: 'Monday',
    offset: 0,
    active: false,
  },
  {
    number: 2,
    id: 'T3',
    title: t('Residential__Home_Automation__Short_Tuesday', 'T'),
    key: 'Tue',
    display: 'Tuesday',
    offset: 1440,
    active: false,
  },
  {
    number: 3,
    id: 'W4',
    title: t('Residential__Home_Automation__Short_Wednesday', 'W'),
    key: 'Wed',
    display: 'Wednesday',
    offset: 1440 * 2,
    active: false,
  }, // 2880
  {
    number: 4,
    id: 'T5',
    title: t('Residential__Home_Automation__Short_Thursday', 'T'),
    key: 'Thu',
    display: 'Thursday',
    offset: 1440 * 3,
    active: false,
  }, // 4320
  {
    number: 5,
    id: 'F6',
    title: t('Residential__Home_Automation__Short_Friday', 'F'),
    key: 'Fri',
    display: 'Friday',
    offset: 1440 * 4,
    active: false,
  }, // 5760
  {
    number: 6,
    id: 'S7',
    title: t('Residential__Home_Automation__Short_Saturday', 'S'),
    key: 'Sat',
    display: 'Saturday',
    offset: 1440 * 5,
    active: false,
  }, // 7200
];

type DaysTabSelectionModule = {
  multiSelection: boolean;
  initialValue: DayTabType[];
  selectAll: boolean;
  moveTo: DayTabType | null;
  onDayChanged: (
    days: DayTabType[],
    pressedDay: DayTabType | null,
    allDaySelected: boolean,
  ) => void;
};

export const DaysTabSelection: React.FC<DaysTabSelectionModule> = ({
  moveTo,
  initialValue = [],
  selectAll,
  onDayChanged,
  multiSelection,
}) => {
  const [selectedDays, setSelectedDays] = useState<DayTabType[]>([]);

  /** Trigger methods */
  const _onDayChanged = (pressedDay: DayTabType, moveTo) => {
    let updatedSelectedDays;
    if (selectedDays.includes(pressedDay)) {
      updatedSelectedDays = selectedDays.filter(id => id !== pressedDay);
      pressedDay['active'] = false;
    } else {
      updatedSelectedDays = multiSelection
        ? [...selectedDays, pressedDay]
        : [pressedDay];
      pressedDay['active'] = true;
    }
    if (moveTo) {
      pressedDay['active'] = true;
      updatedSelectedDays = multiSelection
        ? [...selectedDays, pressedDay]
        : [pressedDay];
    }
    setSelectedDays(updatedSelectedDays);
    onDayChanged(updatedSelectedDays, pressedDay, false);
  };

  /** Feature methods */
  const isActive = ({day}: {day: DayTabType}) => {
    for (let a = 0; a < selectedDays.length; a++) {
      if (day.id === selectedDays[a].id) return true;
    }

    return false;
  };

  /** Trigger when the selectAll has changhed */
  useEffect(() => {
    //--> this will effect the day buttons
    // highlight
    for (let a = 0; a < DayTabList.length; a++) {
      DayTabList[a]['active'] = selectAll;
    }

    //--> return [DayTabList[0]] when
    // user has pressed "Select All" and current state is "false"
    // otherwise "true"
    const selectedDaysList = selectAll ? DayTabList : [];
    onDayChanged(selectedDaysList, null, true);
    setSelectedDays(selectedDaysList);
  }, [selectAll]);

  useEffect(() => {
    if (!moveTo) return;
    moveTo.active = true;
    _onDayChanged(moveTo, true);
  }, [moveTo]);

  // Initial state
  useEffect(() => {
    if (!(initialValue.length > 0)) DayTabList[0].active = true;
    else {
      initialValue.map(item => (item.active = true));
      setSelectedDays(initialValue);
    }
  }, []);

  const mappingDayLanguage = (index: number) => {
    switch (index) {
      case 0:
        return t('Residential__Home_Automation__Short_Sunday', 'S');
      case 1:
        return t('Residential__Home_Automation__Short_Monday', 'M');
      case 2:
        return t('Residential__Home_Automation__Short_Tuesday', 'T');
      case 3:
        return t('Residential__Home_Automation__Short_Wednesday', 'W');
      case 4:
        return t('Residential__Home_Automation__Short_Thursday', 'T');
      case 5:
        return t('Residential__Home_Automation__Short_Friday', 'F');
      case 6:
        return t('Residential__Home_Automation__Short_Saturday', 'S');

      default:
        break;
    }
  };

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      {DayTabList.map((value: DayTabType, index) => (
        <TouchableOpacity
          key={index + ''}
          style={[
            styles.dayButton,
            isActive({day: value}) && styles.selectedDayButton,
          ]}
          onPress={() => {
            _onDayChanged(value, false);
          }}>
          <Text
            className="font-obMedium"
            style={[
              styles.dayText,
              isActive({day: value}) && styles.selectedDayText,
            ]}>
            {mappingDayLanguage(index)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  // Day Buttons
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  dayButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDayButton: {
    backgroundColor: '#014541',
  },
  dayText: {
    color: '#000',
    fontSize: 18,
  },
  selectedDayText: {
    color: '#fff',
  },
});

export {DaysTabSelection as default};
