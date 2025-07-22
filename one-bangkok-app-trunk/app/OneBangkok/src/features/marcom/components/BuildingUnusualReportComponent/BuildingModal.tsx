import {View, TouchableOpacity, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {Text} from '~/components/atoms';
import {useModal} from '~/features/residential/components/ResidentialModal';
import t from '~/utils/text';
import SelectList, {ListSelect} from '~/components/molecules/SelectList';
import SelectMultipleList from '~/components/molecules/SelectMultipleList';

interface Props {
  options: ListSelect[];
  initialValue?: string;
  onValueChanged: (value: string) => void;
  title: string;
}

const BuildingModal = ({
  options,
  initialValue,
  onValueChanged,
  title,
}: Props) => {
  const [_, modalAction] = useModal();

  const [selected, setSelected] = useState<string>(initialValue ?? '');

  const toggleSelection = (value: string) => {
    setSelected(value);
  };

  const onPressDone = () => {
    onValueChanged(selected);
    modalAction.hide();
  };

  return (
    <View
      className="bg-white py-6 px-4 w-full h-fit flex absolute bottom-0"
      style={{gap: 24}}>
      <View className="flex-row w-full justify-between pb-4">
        <TouchableOpacity onPress={() => modalAction.hide()}>
          <Text color="primary" weight="medium">
            {t('General__Cancel', 'Cancel')}
          </Text>
        </TouchableOpacity>

        <Text weight="medium">{title}</Text>

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
              selected={selected as string}
              onPress={toggleSelection}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default BuildingModal;
