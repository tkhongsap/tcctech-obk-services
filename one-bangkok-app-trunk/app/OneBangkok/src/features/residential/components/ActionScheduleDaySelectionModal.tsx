import {ScrollView, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {Text} from '~/components/atoms';
import t from '~/utils/text';
import ActionScheduleDaysTabSelection, {
  SelectedDay,
} from './ActionScheduleDaySelection';
import getTheme from '~/utils/themes/themeUtils';
import {ShortDay} from './FacilitiesList';
import {useModal} from './ResidentialModal';

type Props = {
  selectedDays: SelectedDay[];
  onSelect: (day: ShortDay) => void;
  onConfirm?: (days: string[]) => void;
  onCancel?: () => void;
};
const days: {[key: string]: string} = {
  Sun: 'Sunday',
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
};
const ActionScheduleDaySelectionModal = ({
  selectedDays,
  onSelect,
  onConfirm,
  onCancel,
}: Props) => {
  const [_, modalAction] = useModal();
  const [selected, setSelected] = useState(selectedDays);

  const onSetSelected = (key: ShortDay) => {
    onSelect(key);
    setSelected(prev =>
      prev.map(e => ({
        ...e,
        selected: e.key === key ? !e.selected : e.selected,
      })),
    );
  };

  const onPressValidate = () => {
    onConfirm &&
      onConfirm(selected.filter(e => e.selected).map(e => days[e.key]));
    modalAction.hide();
  };
  
  const onPressCancel = () => {
    onCancel && onCancel();
    modalAction.hide();
  };

  return (
    <View
      className="bg-white py-6 px-4 w-full h-fit flex absolute bottom-0"
      style={{gap: 16}}>
      <View className="flex-row w-full justify-between pb-4">
        <Text onPress={onPressCancel} color="primary" weight="medium">
          {t('Residential__Home_Automation__Cancel', 'Cancel')}
        </Text>
        <Text weight="medium">
          {t('Residential__Home_Automation__Modify', 'Modify')}
        </Text>
        {/* <Text onPress={onCancel} color="primary" weight="medium">
          {t('Residential__Home_Automation__Done', 'Done')}
        </Text> */}
        <Text color="white" weight="medium">
          {t('Residential__Home_Automation__Done', 'Done')}
        </Text>
      </View>

      <ScrollView
        className="w-full bg-white mb-6 max-h-[80vh]"
        style={{gap: 12}}>
        <View>
          {/* Message */}
          <Text
            className="font-obRegular flex flex-col "
            style={{color: 'grey'}}>
            {t(
              'Residential__Home_Automation__Apply_The_Modification',
              'Apply the modification',
            )}
          </Text>

          {/* Margin */}
          <View className="mb-8" />

          {/** Days Tab Section */}
          <View className="px-2">
            <ActionScheduleDaysTabSelection
              onSelect={onSetSelected}
              selectedDays={selected}
            />
          </View>

          {/* Margin */}
          <View className="mb-8" />

          <TouchableOpacity onPress={onPressValidate}>
            <View
              className="min-h-[48px] px-5 py-4 flex flex-row  items-center border-[1px] border-teal-900"
              style={{gap: 12, justifyContent: 'center'}}>
              <View>
                <Text
                  style={{alignSelf: 'center'}}
                  className={getTheme('font-obMedium text-dark-teal')}>
                  {t('Residential__Home_Automation__Validate', 'Validate')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ActionScheduleDaySelectionModal;
