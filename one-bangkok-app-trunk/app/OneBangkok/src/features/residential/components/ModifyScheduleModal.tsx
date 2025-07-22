import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {useModal} from './ResidentialModal';
import t from '~/utils/text';
import {Text} from '~/components/atoms';
import DaysTabSelection from '../components/DaysTabSelection';

type Props = {
  onPressCancel?: () => void;
};

const ModifyScheduleModal: React.FC<Props> = ({
  onPressCancel,
}) => {
  const [_, modalAction] = useModal();

  return (
    <View
      className="bg-white py-6 px-4 w-full h-fit flex absolute bottom-0"
      style={{gap: 24}}>
        <View className="flex-row w-full justify-between">
        <Text
          onPress={() => modalAction.hide()}
          color="primary"
          weight="medium">
          {t('General__Cancel', 'Cancel')}
        </Text>
        <Text weight="medium">Modify</Text>
        <Text
          onPress={() => modalAction.hide()}
          color="primary"
          weight="medium">
          {t('General__Done', 'Done')}
        </Text>
      </View>
      <Text size="B1" weight="regular" color="mist-gray-700">
      Select the days on which you want to apply the modification
      </Text>
      <View className='px-4 pt-4'>
      <DaysTabSelection
              multiSelection={true}
              onDayChanged={dayIds => {
                // Alert.alert("", "dayId, " + dayId)
              }}
            />
        </View>
      <View style={{gap: 12}}>
        <TouchableOpacity
          onPress={() => {
            onPressCancel && onPressCancel();
            modalAction.hide();
          }}
          className="p-4 border border-dark-teal-light flex-row justify-center">
          <Text size="B1" weight="medium" color='dark-teal'>
            Validate
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ModifyScheduleModal;
