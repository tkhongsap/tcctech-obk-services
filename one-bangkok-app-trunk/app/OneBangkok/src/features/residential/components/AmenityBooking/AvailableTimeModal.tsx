import {View, TouchableOpacity, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {Text} from '~/components/atoms';
import {useModal} from '~/features/residential/components/ResidentialModal';
import t from '~/utils/text';
import SelectList, {
  ListSelect,
} from '~/features/residential/components/AmenityBooking/SelectList';

interface Props {
  options: ListSelect[];
  initial?: string;
  onValueChanged: (value: string) => void;
}
const AvailableTimeModal = ({options, initial, onValueChanged}: Props) => {
  const [_, modalAction] = useModal();
  const [selected, setSelected] = useState<string | undefined>(initial);

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
          <Text onPress={() => modalAction.hide()} color="primary">
            {t('General__Cancel', 'Cancel')}
          </Text>
        </TouchableOpacity>

        <Text weight="medium">
          {t('Residential__Amenity_Booking__Available_time', 'Available Time')}
        </Text>
        <TouchableOpacity onPress={onPressDone}>
          <Text color="primary">
            {t('Residential__Amenity_Booking__Create_done', 'Done')}
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

export default AvailableTimeModal;
