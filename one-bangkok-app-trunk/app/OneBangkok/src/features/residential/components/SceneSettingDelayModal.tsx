import {View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useModal} from './ResidentialModal';
import {Icon, Text} from '~/components/atoms';
import getTheme from '~/utils/themes/themeUtils';
import t from '~/utils/text';

const SceneSettingDelayModal = () => {
  const [_, modalAction] = useModal();
  const maxTimeInMinute = 5;
  const times: number[] = Array.from(
    {length: maxTimeInMinute},
    (_, i) => i + 1,
  );
  const [selectedTime, setSelectedTime] = useState<number>(0);

  return (
    <View className="bg-white py-6 px-4 w-full h-fit flex absolute bottom-0">
      <View className="flex-row w-full justify-between pb-4">
        <Text
          onPress={() => modalAction.hide()}
          color="primary"
          weight="medium">
          {t('General__Cancel', 'Cancel')}
        </Text>
        <Text weight="medium">Apply a timer</Text>
        <Text
          onPress={() => modalAction.hide()}
          color="primary"
          weight="medium">
          {t('General__Done', 'Done')}
        </Text>
      </View>

      <View className={'flex flex-row px-4 mt-4'}>
        <View
          className={
            'flex-1 flex-row justify-center py-3 border-b border-line'
          }>
          <Text className={getTheme('dark-gray')}>Delay</Text>
        </View>
      </View>
      <Text className={getTheme('text-[#000000] text-[16px] mt-3')}>
        2nd Shutter will be switched on in
      </Text>

      <View className="mt-6">
        {times.map(time => (
          <TouchableOpacity
            key={time}
            className={`px-4 border flex flex-col  w-full  mb-3 ${
              selectedTime === time
                ? 'bg-light-gray-light border-navy-light font-bold'
                : 'border-line-light '
            }`}
            onPress={() => setSelectedTime(time)}>
            <View className="py-4 flex flex-row justify-between items-center">
              <View className="flex-row items-center gap-2 justify-center">
                <Text
                  className={`text-dark-gray-light mt-2  m-0 ${
                    selectedTime === time
                      ? ' font-bold text-dark'
                      : ' font-medium'
                  }`}>
                  {`${time} ${time > 1 ? 'minutes' : 'minute'}`}
                </Text>
              </View>
              {selectedTime === time && (
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
      </View>
    </View>
  );
};

export default SceneSettingDelayModal;
