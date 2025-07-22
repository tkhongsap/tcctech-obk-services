import {View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useModal} from './ResidentialModal';
import {Icon, Text} from '~/components/atoms';
import t from '~/utils/text';
import {ScrollView} from 'react-native-gesture-handler';

type Item = {
  value: string;
  label: string;
};
type Props = {
  selected: string;
  items: Item[];
  onPressDone: (selected: string) => void;
};

const ConfirmChangeUnitOnHouseRulesModal = ({
  selected,
  items,
  onPressDone,
}: Props) => {
  const [_, modalAction] = useModal();
  const [selectedValue, setSelectedValue] = useState<string>(selected);

  const handleOnPressDone = () => {
    onPressDone(selectedValue);
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
        <Text weight="medium">{t('General_Project', 'Project')}</Text>
        <Text onPress={handleOnPressDone} color="primary" weight="medium">
          {t('Residential__Home_Automation__Done', 'Done')}
        </Text>
      </View>

      <View
        className="w-full bg-white mb-6 max-h-[80vh] overflow-y-scroll"
        style={{gap: 12}}>
        <ScrollView>
          <View>
            {/* <Text size='B1' weight='medium'>Life Scenes</Text> */}

            {items.map(({value, label}) => (
              <TouchableOpacity
                key={value}
                className={`px-4 border flex flex-col w-full mb-3 ${
                  value === selectedValue
                    ? 'bg-light-gray-light border-dark-teal-light'
                    : 'border-line-light '
                }`}
                onPress={() => setSelectedValue(value)}>
                <View className="py-4 flex flex-row justify-between items-center">
                  <View className="flex-row items-center gap-2 justify-center">
                    <Text
                      className={`${
                        value === selectedValue
                          ? 'text-dark-teal-light'
                          : 'text-dark-gray-light'
                      } mt-2  m-0`}
                      weight={value === selectedValue ? 'medium' : 'regular'}>
                      {label}
                    </Text>
                  </View>
                  {value === selectedValue && (
                    <View>
                      <Icon
                        type="checkedIcon"
                        width={16}
                        height={16}
                        color="#014541"
                      />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ConfirmChangeUnitOnHouseRulesModal;
