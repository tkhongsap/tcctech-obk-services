import {View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Icon, IconType, Text} from '~/components/atoms';
import t from '~/utils/text';
import {useNavigation} from '~/navigations/AppNavigation';
import {useModal} from './ResidentialModal';
import {EventSchedule} from '~/states/residentialSchedule/residentialScheduleState';
import netatmoService from '~/services/residentialService/NetatmoService';

type Menu = {
  name: string;
  icon: IconType;
  onPress: () => void;
};
type Props = {
  schedules: EventSchedule[];
  schedule: EventSchedule;
  onUpdateScheduleStatus: (id: string, selected: boolean) => void;
  isLoading: boolean;
  onSetIsLoading: (value: boolean) => void;
};
const OptionModal = ({
  schedules,
  schedule,
  onUpdateScheduleStatus,
  isLoading,
  onSetIsLoading,
}: Props) => {
  const [_, modalAction] = useModal();
  const navigation = useNavigation();

  const menus: Menu[] = [
    {
      name: schedule.selected
        ? t(
            'Residential__Home_Automation__Disable_This_Schedule',
            'Disable this schedule',
          )
        : t(
            'Residential__Home_Automation__Enable_This_Schedule',
            'Enable this schedule',
          ),
      icon: schedule.selected ? 'opDisable' : 'opEnable',
      onPress: async () => {
        try {
          onSetIsLoading(true);

          if (schedule.selected) {
            await netatmoService.deactivateEventSchedule();
          } else {
            await netatmoService.activeSchedule(schedule.id, 'event');
          }
          onUpdateScheduleStatus(schedule.id, !schedule.selected);
        } catch (error) {
        } finally {
          onSetIsLoading(false);
          modalAction.hide();
        }
      },
    },
    {
      name: t('Residential__Home_Automation__Rename', 'Rename'),
      icon: 'opRename',
      onPress: () => {
        navigation.navigate('ActionScheduleRename', {
          schedules,
          schedule,
        });
        modalAction.hide();
      },
    },
    // {
    //   name: 'Duplicate schedule',
    //   icon: 'opDuplicate',
    //   onPress: () => {},
    // },
    // {
    //   name: 'Delete',
    //   icon: 'opDelete',
    //   onPress: () => {
    //     modalActions.setContent(
    //       <ConfirmDeleteModal
    //         title="Schedule deletion"
    //         description="Are you sure you want to Delete this schedule?"
    //       />,
    //     );
    //     modalActions.show();
    //   },
    // },
  ];

  return (
    <View
      className="bg-white py-6 px-4 w-full h-fit flex absolute bottom-0"
      style={{gap: 24}}>
      <View className="flex-row w-full justify-between pb-4">
        <Text
          onPress={() => modalAction.hide()}
          disabled={isLoading}
          color="primary"
          weight="medium">
          {t('Residential__Home_Automation__Cancel', 'Cancel')}
        </Text>
        <Text weight="medium">
          {t('Residential__Home_Automation__Options', 'Options')}
        </Text>
        <Text
          onPress={() => modalAction.hide()}
          disabled={isLoading}
          color="primary"
          weight="medium">
          {t('Residential__Home_Automation__Done', 'Done')}
        </Text>
      </View>

      <View className="w-full bg-white mb-6" style={{gap: 12}}>
        <View style={{gap: 12}}>
          {menus.map(({name, icon, onPress}) => (
            <View key={name}>
              <TouchableOpacity
                key={name}
                onPress={onPress}
                disabled={isLoading}>
                <View className="min-h-[48px] px-5 py-4 flex flex-row justify-between items-center border-[1px] border-line-light">
                  <View
                    className="flex flex-row items-center"
                    style={{gap: 12}}>
                    <Icon color="#333333" type={icon} height={24} width={24} />
                    <Text weight="regular" size="B1">
                      {name}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default OptionModal;
