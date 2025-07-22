import {View} from 'react-native';
import {ScreenContainer} from '../components';
import {Header} from '../components/Header';
import {Icon, Text, Spacing} from '~/components/atoms';
import {useNavigation} from '~/navigations/AppNavigation';
import {StickyButton} from '../components';
import t from '~/utils/text';

const CreateCoolingScheduleWelcome = () => {
  const navigation = useNavigation();
  return (
    <>
      <ScreenContainer bgColor="#ffffff" barStyle="dark-content">
        <Header
          leftAction="goBack"
          title={t(
            'Residential__Home_Automation__Create_A_Schedule',
            'Create a schedule',
          )}
          titleColor="dark-gray"
          bgColor="bg-white"
        />
        <View className="bg-[#ffffff] w-full flex-1 p-4 pt-10">
          <View className="flex flex-col justify-start items-start">
            <Icon
              type={'schedulePlus'}
              width={55}
              height={56}
              color={'#22973F'}
            />
            <Spacing height={28} />
            <Text size="H2" weight="medium" className="text-kelly-green-light">
              {t('Residential__Home_Automation__Welcome', 'Welcome')}
            </Text>
            <Spacing height={4} />
            <Text size="B1" weight="regular" color="dark-gray">
              {t(
                'Residential__Home_Automation__Create_A_Schedule_Welcome_Description',
                'You will now create a cooling schedule. We will improve it thanks to a few questions about your day-to-day habits.',
              )}
            </Text>
          </View>
        </View>
      </ScreenContainer>

      <StickyButton
        title={t('Residential__Home_Automation__Let_Us_Start', "Let's start")}
        onPress={() => navigation.navigate('CreateScheduleWeek')}
        rightIcon="next"
        iconWidth={20}
        color="dark-teal"
      />
    </>
  );
};

export default CreateCoolingScheduleWelcome;
