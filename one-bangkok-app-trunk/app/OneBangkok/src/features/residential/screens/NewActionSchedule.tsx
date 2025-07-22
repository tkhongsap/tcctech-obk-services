import {View} from 'react-native';
import {ScreenContainer} from '../components';
import {Header} from '../components/Header';
import {Text} from '~/components/atoms';
import ToggleSwitch from '../components/ToggleSwitch';
import InputTextWithClearButton from '../components/InputTextWithClearButton';
import {useState} from 'react';
import {StickyButton} from '~/features/residential/components/StickyButton';
import t from '~/utils/text';
import netatmoService from '~/services/residentialService/NetatmoService';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import {
  actionScheduleSelectedId,
  useResidentialHomeState,
} from '~/states/residentialSchedule/residentialScheduleState';
import residentialScheduleAction from '~/states/residentialSchedule/residentialScheduleAction';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'NewActionSchedule'>;

type ScheduleModel = {
  name: string | undefined;
  enabled: boolean;
};

const NewActionSchedule = ({
  route: {
    params: {schedules},
  },
}: Props) => {
  const navigation = useNavigation();
  const homeAutomationState = useResidentialHomeState();
  const [scheduleModel, setScheduleModel] = useState<ScheduleModel>({
    name: '',
    enabled: true,
  });
  const [isError, setIsError] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState(false);

  const checkNameisExist = (name: any) => {
    if (schedules) {
      return schedules.some((schedule: any) => schedule.name === name);
    } else return false;
  };

  const onPressValidate = async () => {
    const {id: homeId} = homeAutomationState.get({noproxy: true});
    if (
      scheduleModel.name === undefined ||
      scheduleModel.name.trim() === '' ||
      homeId === undefined
    ) {
      return;
    }

    const nameExist = checkNameisExist(scheduleModel.name);
    setIsError(nameExist);
    if (nameExist) return;

    try {
      setIsValidating(true);
      const {status, data} = await netatmoService.createActionSchedule(
        scheduleModel.name,
      );
      if (status === 200) {
        const scheduleId = data.body.schedule_id;
        if (scheduleModel.enabled) {
          await Promise.all([
            netatmoService.switchHomeSchedule(
              'activate',
              scheduleId,
              'action',
              true,
            ),
            netatmoService.activeSchedule(scheduleId, 'event'),
            residentialScheduleAction.getHome(),
          ]);
        } else {
          await residentialScheduleAction.getHome();
        }

        actionScheduleSelectedId.set(data.body.schedule_id);
        navigation.goBack();
      } else {
        navigateToErrorScreen();
      }
    } catch (error) {
      navigateToErrorScreen();
    } finally {
      setIsValidating(false);
    }
  };

  const navigateToErrorScreen = () => {
    navigation.navigate('AnnouncementResidentialScreen', {
      type: 'error',
      title: t('Residential__Something_went_wrong', 'Something\nwent wrong'),
      message: t(
        'Residential__Announcement__Error_generic__Body',
        'Please wait a bit before trying again',
      ),
      buttonText: t('Residential__Back_to_explore', 'Back to explore'),
      screenHook: 'NewActionSchedule',
      buttonColor: 'dark-teal',
      onPressBack: () => navigation.navigate('NewActionSchedule', {schedules}),
    });
  };

  return (
    <>
      <ScreenContainer
        bgColor="#ffffff"
        barStyle="dark-content"
        isLoading={isValidating}>
        <Header
          leftAction="goBack"
          title={t(
            'Residential__Home_Automation__New_Actions_Schedule',
            'New Actions Schedule',
          )}
          titleColor="dark-gray"
          bgColor="bg-white"
        />
        <View className="bg-[#ffffff] flex-1 w-full pt-10">
          <InputTextWithClearButton
            title={t('Residential__Home_Automation__Name', 'Name')}
            persistentValue={false}
            initialValue={scheduleModel.name}
            disabled={isValidating}
            onValueChange={name => setScheduleModel(prev => ({...prev, name}))}
            error={isError}
          />
          <View className="w-full flex flex-row items-start justify-between p-8">
            <View className="flex-1 flex-col" style={{gap: 12}}>
              <Text size="B1" weight="medium" color="jet-black">
                {t(
                  'Residential__Home_Automation__Enable_The_Actions_Schedule',
                  'Enable the actions schedule',
                )}
              </Text>
              <Text size="B2" weight="regular" color="dark-gray">
                {t(
                  'Residential__Home_Automation__New_Actions_Schedule_Description',
                  'When the actions schedule is enabled, the events you will have configured will be triggered at the desired times',
                )}
              </Text>
            </View>
            <ToggleSwitch
              initialValue={scheduleModel.enabled}
              onToggle={enabled =>
                setScheduleModel(prev => ({...prev, enabled}))
              }
              disabled={isValidating}
            />
          </View>
        </View>
      </ScreenContainer>

      {scheduleModel.name && (
        // <TouchableOpacity
        //   onPress={onPressValidate}
        //   disabled={isValidating}
        //   className="flex flex-row items-center h-[48px] w-full bg-[#014541] px-4 justify-between absolute left-0 bottom-0">
        //   <Text size="B1" weight="medium" color="default-inverse">
        //     Validate
        //   </Text>
        //   <Icon type={'next'} width={20} height={20} color={'#fff'} />
        // </TouchableOpacity>
        <StickyButton
          title={t('Residential__Home_Automation__Validate', 'Validate')}
          rightIcon="next"
          iconHeight={20}
          color="dark-teal"
          onPress={onPressValidate}
          disabled={isValidating}
        />
      )}
    </>
  );
};

export default NewActionSchedule;
