import {View, TouchableOpacity, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {Text} from '~/components/atoms';
import {useModal} from '~/features/residential/components/ResidentialModal';
import t from '~/utils/text';
import SelectList, { ListSelect } from './SelectList';

interface Props {
  options: ListSelect[];
  initialValue?: string;
  onValueChanged: (value: string) => void;
}

const ServiceRequestModal = ({
  options,
  initialValue,
  onValueChanged,
}: Props) => {
  const [_, modalAction] = useModal();
  const [selected, setSelected] = useState<string | undefined>(initialValue);

  const onPressDone = () => {
    selected && onValueChanged(selected);
    modalAction.hide();
  };
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
            {t('General__Cancel', 'Cancel')}
          </Text>
        </TouchableOpacity>

        <Text weight="medium">
          {t('Residential__Service_request__Service_type', 'Service type')}
        </Text>
        <TouchableOpacity onPress={onPressDone}>
          <Text color="primary" weight="medium">
            {t('Residential__Service_request__Done', 'Done')}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        className="w-full bg-white mb-6 max-h-[80vh] overflow-y-scroll"
        style={{gap: 12}}>
        <ScrollView>
          <View>
            <SelectList
              data={options}
              selected={selected ?? ''}
              onPress={setSelected}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ServiceRequestModal;
