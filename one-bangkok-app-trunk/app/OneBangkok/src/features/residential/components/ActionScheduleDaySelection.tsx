import {ShortDay} from './FacilitiesList';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from '~/components/atoms';
import t from '~/utils/text';

export type SelectedDay = {
  key: ShortDay;
  value: string;
  selected: boolean;
};

type ActionScheduleDaysTabSelectionProps = {
  selectedDays: SelectedDay[];
  onSelect: (day: ShortDay) => void;
  disabled?: boolean;
};

const ActionScheduleDaysTabSelection = ({
  selectedDays,
  onSelect,
  disabled = false,
}: ActionScheduleDaysTabSelectionProps) => {
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
      {selectedDays.map(({key, value, selected}, index) => (
        <TouchableOpacity
          key={key}
          style={[styles.dayButton, selected && styles.selectedDayButton]}
          onPress={() => onSelect(key)}
          disabled={disabled}>
          <Text
            className="font-obMedium"
            style={[styles.dayText, selected && styles.selectedDayText]}>
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

export default ActionScheduleDaysTabSelection;
