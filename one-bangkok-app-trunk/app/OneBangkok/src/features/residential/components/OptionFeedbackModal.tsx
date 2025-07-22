import {View, TouchableOpacity, ScrollView} from 'react-native';
import React from 'react';
import {Text} from '~/components/atoms';
import {useModal} from '~/features/residential/components/ResidentialModal';
import {useNavigation} from '~/navigations/AppNavigation';
import t from '~/utils/text';
import SelectList, {
  ListSelect,
} from '~/features/residential/components/SelectList';

const OptionFeedbackModal = () => {
  const [_, modalAction] = useModal();
  const navigation = useNavigation();

  const mockServiceTypes: ListSelect[] = [
    {
      value: '1',
      name: 'Suggestion',
    },
    {
      value: '2',
      name: 'Compliment',
    },
    {
      value: '3',
      name: 'Complain',
    },
    {
      value: '4',
      name: 'Other',
    },
  ];

  return (
    <View
      className="bg-white py-6 px-4 w-full h-fit flex absolute bottom-0"
      style={{gap: 24}}>
      <View className="flex-row w-full justify-between pb-4">
        <TouchableOpacity onPress={() => modalAction.hide()}>
          <Text
            onPress={() => modalAction.hide()}
            color="primary"
            weight="medium">
            {t('Residential__Home_Automation__Cancel', 'Cancel')}
          </Text>
        </TouchableOpacity>

        <Text weight="medium">{t('Residential__Topic', 'Topic')}</Text>
        <TouchableOpacity onPress={() => modalAction.hide()}>
          <Text color="primary" weight="medium">
            {t('Residential__Home_Automation__Done', 'Done')}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        className="w-full bg-white mb-6 max-h-[80vh] overflow-y-scroll"
        style={{gap: 12}}>
        <ScrollView>
          <View>
            <SelectList data={mockServiceTypes} selected="" />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default OptionFeedbackModal;
