import {View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Icon, IconType, Text} from '~/components/atoms';
import t from '~/utils/text';
import {useNavigation} from '~/navigations/AppNavigation';
import {useModal} from './ResidentialModal';
import netatmoService from '~/services/residentialService/NetatmoService';
import {CoolingSchedule} from '~/states/residentialSchedule/residentialScheduleState';

type Menu = {
  name: string;
  icon: IconType;
  onPress: () => void;
};
type Props = {
  schedules: CoolingSchedule[]
  schedule: CoolingSchedule;
  onEnabledSchedule: (enabledScheduleId: string) => void;
};

const OptionTemperatureModal = ({
  schedules,
  schedule,
  onEnabledSchedule,
}: Props) => {
  const [_, modalAction] = useModal();
  const navigation = useNavigation();
  const [isSending, setIsSending] = useState(false);

  const menus: Menu[] = [
    {
      name: t('Residential__Home_Automation__Rename', 'Rename'),
      icon: 'opRename',
      onPress: () => {
      navigation.navigate('TemperatureScheduleRename', {
          schedule,
          schedules,
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

  const enableCoolingSchedule = async () => {
    try {
      setIsSending(true);
      await netatmoService.activeSchedule(schedule.id, 'cooling');
      onEnabledSchedule(schedule.id);
      modalAction.hide();
    } catch (error) {
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View
      className="bg-white py-6 px-4 w-full h-fit flex absolute bottom-0"
      style={{gap: 24}}>
      <View className="flex-row w-full justify-between pb-4">
        <Text
          onPress={() => modalAction.hide()}
          disabled={isSending}
          color="primary"
          weight="medium">
          {t('Residential__Home_Automation__Cancel', 'Cancel')}
        </Text>
        <Text weight="medium">
          {t('Residential__Home_Automation__Options', 'Options')}
        </Text>
        <Text
          onPress={() => modalAction.hide()}
          disabled={isSending}
          color="primary"
          weight="medium">
          {t('Residential__Home_Automation__Done', 'Done')}
        </Text>
      </View>

      {!schedule.selected && (
        <TouchableOpacity disabled={isSending} onPress={enableCoolingSchedule}>
          <View className="min-h-[48px] px-5 py-4 flex flex-row justify-between items-center border-[1px] border-line-light">
            <View className="flex flex-row items-center" style={{gap: 12}}>
              <Icon color="#333333" type="opEnable" height={24} width={24} />
              <Text weight="regular" size="B1">
                {t(
                  'Residential__Home_Automation__Enable_This_Schedule',
                  'Enable this schedule',
                )}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      <View className="w-full bg-white mb-6" style={{gap: 12}}>
        <View style={{gap: 12}}>
          {menus.map(({name, icon, onPress}) => (
            <View key={name}>
              <TouchableOpacity key={name} onPress={onPress}>
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

export default OptionTemperatureModal;
