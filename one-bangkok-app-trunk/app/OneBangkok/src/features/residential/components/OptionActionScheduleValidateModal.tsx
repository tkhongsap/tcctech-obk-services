import {View, TouchableOpacity, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useModal} from './ResidentialModal';
import {Icon, Text} from '~/components/atoms';
import getTheme from '~/utils/themes/themeUtils';
import t from '~/utils/text';
import {useNavigation} from '~/navigations/AppNavigation';
import DaysTabSelection, {DayTabType} from './DaysTabSelection';

export enum ModalEvent {
  CANCEL = 1,
  DONE = 0,
}

const OptionActionScheduleModal = ({
  onModalEvent,
  selectedDays,
  onDayChanged,
  onValidatePressed,
}: {
  selectedDays: DayTabType[];
  onModalEvent: (event: ModalEvent) => void;
  onValidatePressed: () => void;
  onDayChanged: (
    days: DayTabType[],
    pressedDay: DayTabType | null,
    allDaySelected: boolean,
  ) => void;
}) => {
  const [_, modalAction] = useModal();
  useEffect(() => {}, []);
  return (
    <View
      className="bg-white py-6 px-4 w-full h-fit flex absolute bottom-0"
      style={{gap: 16}}>
      <View className="flex-row w-full justify-between pb-4">
        <Text
          onPress={() => {
            modalAction.hide();
            onModalEvent(ModalEvent.CANCEL);
          }}
          color="primary"
          weight="medium">
          {t('Residential__Home_Automation__Cancel', 'Cancel')}
        </Text>
        <Text weight="medium">{t('Residential__Home_Automation__Modify', 'Modify')}</Text>
        <Text
          onPress={() => {
            modalAction.hide();
            onModalEvent(ModalEvent.CANCEL);
          }}
          color="primary"
          weight="medium">
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
            {t('Residential__Home_Automation__Apply_The_Modification', 'Apply the modification')}
          </Text>

          {/* Margin */}
          <View className="mb-8" />

          {/** Days Tab Section */}
          <View className="px-2">
            <DaysTabSelection
              initialValue={selectedDays}
              onDayChanged={onDayChanged}
              multiSelection={true}
              selectAll={false}
            />
          </View>

          {/* Margin */}
          <View className="mb-8" />

          <TouchableOpacity onPress={() => onValidatePressed()}>
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

export default OptionActionScheduleModal;
