import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import {Icon, IconType, Text} from '~/components/atoms';
import {Scenario} from '~/states/residentialSchedule/residentialScheduleState';

export type SelectScenario = Scenario & {selected: boolean};

const icons: {[key: string]: IconType} = {
  home: 'scHomeIcon',
  away: 'scAwayIcon',
  'wake up': 'scWakeupIcon',
  sleep: 'scSleepIcon',
  bedtime: 'scSleepIcon',
  'light Off': 'scLightoffIcon',
  exhibition: 'scOtherIcon',
  'training room': 'scOtherIcon',
  off: 'scOtherIcon',
  reading: 'scReadIcon',
  Show: 'scOtherIcon',
  'Open all shutters': 'scShutterIcon',
  'Close all shutters': 'scShutterIcon',
  'Scenario 1p': 'scOtherIcon',
  other: 'scOtherIcon',
  ventilation: 'scVentilationIcon',
};
interface Props {
  data: SelectScenario[];
  onSelected: (id: string) => void;
  disabled: boolean;
}

const ActionScheduleScenarioSelection = React.memo(
  ({data, onSelected, disabled}: Props) => {
    const nameFormat = (name: string) => {
      return capitalizeFirstLetter(replaceUnderScoreWithSpacing(name));
    };

    const capitalizeFirstLetter = (value: string) => {
      return value.charAt(0).toUpperCase() + value.slice(1);
    };

    const replaceUnderScoreWithSpacing = (value: string) => {
      return value.replace('_', ' ');
    };

    const renderSceneItem: ListRenderItem<SelectScenario> = ({item}) => {
      return (
        <TouchableOpacity
          onPress={() => onSelected(item.id)}
          style={styles.itemContainer}
          disabled={disabled}>
          {item.selected && (
            <View style={styles.checkmarkContainer}>
              <View style={styles.checkmark}>
                <Icon
                  className="flex items-start "
                  type="scCheckedIcon"
                  height={20}
                  width={20}
                  color="#B0F0D5"
                />
              </View>
            </View>
          )}
          <View style={styles.iconContainer}>
            <View style={styles.icon}>
              <Icon
                className="flex-1 items-start justify-end"
                type={icons[item.type ?? 'other']}
                height={16}
                width={16}
                color="#FDFDFD"
              />
            </View>
          </View>
          <Text style={styles.text}>{nameFormat(item.name ?? item.type)}</Text>
        </TouchableOpacity>
      );
    };

    return (
      <View>
        <FlatList
          data={data}
          renderItem={renderSceneItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  itemContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#0A4A42',
    justifyContent: 'flex-end',
    marginRight: 8,
    padding: 10,
    Radius: 10,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 10,
    left: 8,
    borderRadius: 20,
    padding: 5,
  },
  checkmark: {
    width: 20,
    height: 20,
  },
  iconContainer: {
    marginBottom: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  text: {
    color: '#FDFDFD',
    fontSize: 16,
  },
});

export default ActionScheduleScenarioSelection;
