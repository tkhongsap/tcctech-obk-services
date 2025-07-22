import {View} from 'react-native';
import {ScreenContainer, StickyButton} from '../components';
import {Header} from '../components/Header';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import InputTextWithClearButton from '../components/InputTextWithClearButton';
import {useEffect, useState} from 'react';
import {
  defaultCoolingCreationStepState,
  useCoolingCreationState,
} from '~/services/residentialService/NetamoScheduleService';
import t from '~/utils/text';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'CreateCoolingSchedule'
>;

const CreateCoolingSchedule = ({
  route: {
    params: {schedules},
  },
}: Props) => {
  const navigation = useNavigation();
  const scheduleCreateState = useCoolingCreationState();
  const [name, setName] = useState<string | undefined>(
    scheduleCreateState.name.get({noproxy: true}),
  );
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkNameIsExist = (name: any) => {
    if (schedules) {
      return schedules.some((schedule: any) => schedule.name === name);
    } else return false;
  };

  useEffect(() => {
    scheduleCreateState.set(
      JSON.parse(JSON.stringify(defaultCoolingCreationStepState)),
    );
  }, []);

  useEffect(() => {
    if (isError) {
      setIsError(false);
    }
  }, [name]);

  const onPressValidate = () => {
    try {
      setIsLoading(true);
      if (!name) return;

      const nameExist = checkNameIsExist(name);
      setIsError(nameExist);
      if (nameExist) return;
      scheduleCreateState.name.set(name);
      navigation.navigate('CreateCoolingScheduleWelcome');
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const onPressBack = () => {
    setName(undefined);
    scheduleCreateState.set(
      JSON.parse(JSON.stringify(defaultCoolingCreationStepState)),
    );
    navigation.goBack();
  };

  return (
    <>
      <ScreenContainer
        bgColor="#ffffff"
        barStyle="dark-content"
        isLoading={isLoading}>
        <Header
          leftAction="goBack"
          onPressLeftAction={onPressBack}
          title={t(
            'Residential__Home_Automation__New_Temperature_Schedule',
            'New Temperature Schedule',
          )}
          titleColor="dark-gray"
          bgColor="bg-white"
        />
        <View className="bg-[#ffffff] w-full flex-1 pt-10">
          <InputTextWithClearButton
            title={t('Residential__Home_Automation__Name', 'Name')}
            initialValue={name}
            onValueChange={setName}
            disabled={isLoading}
            error={isError}
            onPressIn={() => {
              setIsError(false);
            }}
          />
        </View>
      </ScreenContainer>
      {name && (
        <StickyButton
          title={t('Residential__Home_Automation__Validate', 'Validate')}
          onPress={onPressValidate}
          disabled={isLoading}
          rightIcon="next"
          iconWidth={20}
          color="dark-teal"
        />
      )}
    </>
  );
};

export default CreateCoolingSchedule;
