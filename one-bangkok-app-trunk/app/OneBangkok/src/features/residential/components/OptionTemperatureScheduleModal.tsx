import {View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useModal} from './ResidentialModal';
import {Icon, Text} from '~/components/atoms';
import t from '~/utils/text';
import {useNavigation} from '~/navigations/AppNavigation';
import {ScrollView} from 'react-native-gesture-handler';
import {CoolingSchedule} from '~/states/residentialSchedule/residentialScheduleState';

type Props = {
  initialSelectedSchedule: CoolingSchedule;
  schedules: CoolingSchedule[];
  onChanged?: (schedule: CoolingSchedule) => void;
};

const OptionTemperatureScheduleModal = ({
  initialSelectedSchedule,
  schedules,
  onChanged,
}: Props) => {
  const [_, modalAction] = useModal();
  const navigation = useNavigation();
  const [selected, setSelected] = useState<CoolingSchedule>(
    initialSelectedSchedule,
  );
  schedules.sort((a, b) => {
    const getLanguagePriority = (text: string) => {
      const thaiRegex = /[\u0E00-\u0E7F]/;
      const numberRegex = /^\d/;

      if (numberRegex.test(text)) return 0;
      if (/[a-zA-Z]/.test(text)) return 1;
      if (thaiRegex.test(text)) return 2;
      return 3;
    };
    const languagePriorityDiff =
      getLanguagePriority(a.name) - getLanguagePriority(b.name);
    if (languagePriorityDiff !== 0) {
      return languagePriorityDiff;
    }
    return a.name.localeCompare(b.name);
  });
  const onPressDone = () => {
    onChanged && onChanged(selected);
    modalAction.hide();
  };

  const onPressCreate = () => {
    navigation.navigate('CreateCoolingSchedule', {
      schedules,
    });
    modalAction.hide();
  };

  return (
    <View
      className="bg-white py-6 px-4 w-full  h-fit flex absolute bottom-0 "
      style={{gap: 24}}>
      <View className="flex-row w-full justify-between pb-4">
        <Text
          onPress={() => modalAction.hide()}
          color="primary"
          weight="medium">
          {t('Residential__Home_Automation__Cancel', 'Cancel')}
        </Text>
        <Text weight="medium">
          {t('Residential__Home_Automation__Options', 'Options')}
        </Text>
        <Text onPress={onPressDone} color="primary" weight="medium">
          {t('Residential__Home_Automation__Done', 'Done')}
        </Text>
      </View>

      <View
        className="w-full bg-white mb-6 max-h-[80vh] overflow-y-scroll"
        style={{gap: 12}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {schedules.map(schedule => (
              <TouchableOpacity
                key={schedule.id}
                className={`px-4 border flex flex-col w-full mb-3 ${
                  selected.id === schedule.id
                    ? 'bg-light-gray-light border-navy-light'
                    : 'border-line-light '
                }`}
                onPress={() => setSelected(schedule)}>
                <View className="py-4 flex flex-row justify-between items-center">
                  <View className="flex-row items-center gap-2 justify-center">
                    <View className="flex flex-col items-start">
                      <Text
                        className={`text-dark-gray-light ${
                          selected.id === schedule.id
                            ? ' text-dark'
                            : ' font-medium'
                        }`}>
                        {schedule.name}
                      </Text>
                      <Text color="subtitle-muted" size="B1" weight="regular">
                        {schedule.selected
                          ? t('Residential__Home_Automation__Active', 'Active')
                          : t(
                              'Residential__Home_Automation__Disabled',
                              'Disabled',
                            )}
                      </Text>
                    </View>
                  </View>
                  {selected.id === schedule.id && (
                    <View className="">
                      <Icon
                        type={'checkedIcon'}
                        width={16}
                        height={16}
                        color={'#292929'}
                      />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
            {schedules.length < 10 && (
              <TouchableOpacity onPress={onPressCreate}>
                <View
                  className="min-h-[48px] px-5 py-4 flex flex-row  items-center border-[1px] border-line-light"
                  style={{gap: 12}}>
                  <Icon
                    type="plusIcon"
                    height={14}
                    width={14}
                    color={'#1C1B1F'}
                  />
                  <View className="flex-row " style={{gap: 12}}>
                    <Text weight="regular" size="B1" color="dark-gray">
                      {t(
                        'Residential__Home_Automation__Create_A_Cooling_Schedule',
                        'Create a cooling schedule',
                      )}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default OptionTemperatureScheduleModal;
