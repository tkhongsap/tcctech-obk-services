import {useEffect, useState} from 'react';
import {ShortDay} from './FacilitiesList';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from '~/components/atoms';
import t from '~/utils/text';

type DaySelectionProps = {
  initialDay: ShortDay;
  onSelect: (day: ShortDay) => void;
  disabled?: boolean;
};
const DaySelection = ({
  initialDay,
  onSelect,
  disabled = false,
}: DaySelectionProps) => {
  type DaySelectionItem = {
    key: ShortDay;
    value: string;
    selected: boolean;
  };
  const days: DaySelectionItem[] = [
    {
      key: 'Sun',
      value: t('Residential__Home_Automation__Short_Sunday', 'S'),
      selected: false,
    },
    {
      key: 'Mon',
      value: t('Residential__Home_Automation__Short_Monday', 'M'),
      selected: false,
    },
    {
      key: 'Tue',
      value: t('Residential__Home_Automation__Short_Tuesday', 'T'),
      selected: false,
    },
    {
      key: 'Wed',
      value: t('Residential__Home_Automation__Short_Wednesday', 'W'),
      selected: false,
    },
    {
      key: 'Thu',
      value: t('Residential__Home_Automation__Short_Thursday', 'T'),
      selected: false,
    },
    {
      key: 'Fri',
      value: t('Residential__Home_Automation__Short_Friday', 'F'),
      selected: false,
    },
    {
      key: 'Sat',
      value: t('Residential__Home_Automation__Short_Saturday', 'S'),
      selected: false,
    },
  ];

  const [daySelection, setDaySelection] = useState<DaySelectionItem[]>(days);

  useEffect(() => {
    setDaySelection(prev => {
      const update = [...prev];
      return update.map(e => ({...e, selected: e.key === initialDay}));
    });
  }, [initialDay]);

  const onPress = (key: ShortDay) => {
    onSelect(key);
  };

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      {daySelection.map(({key, value, selected}) => (
        <TouchableOpacity
          key={key}
          style={[styles.dayButton, selected && styles.selectedDayButton]}
          onPress={() => onPress(key)}
          disabled={disabled}>
          <Text
            className="font-obMedium"
            style={[styles.dayText, selected && styles.selectedDayText]}>
            {value}
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

export default DaySelection;
