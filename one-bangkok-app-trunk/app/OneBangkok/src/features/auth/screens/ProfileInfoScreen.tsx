import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import DynamicStepContainers from '~/components/DynamicStepContainer';
import {CustomButton} from '~/components';
import {Screen} from '~/components/templates';
import EditGenderForm from '../components/EditGenderForm';
import EditFirstNameForm from '../components/EditFirstNameForm';
import {
  editInfoState,
  editInfoStateAction,
  useEditInfoState,
} from '../store/editInfoStore';
import EditMiddleNameForm from '../components/EditMiddleNameForm';
import EditLastNameForm from '../components/EditLastNameForm';
import EditDateOfBirthForm from '../components/EditDateOfBirthForm';
import t from '~/utils/text';
import {isEmpty} from 'lodash';
import {signUpStateAction} from '~/features/auth/store/signUpStore';
import authenAction from '~/states/authen/authenAction';
import {Button, Header, StickyButton, useModal} from '~/components/molecules';
import {Spacing, Text} from '~/components/atoms';
import accountAction from '~/states/account/accountAction';
import {useScreenHook} from '~/services/EventEmitter';
import {AnnouncementScreenEventNames} from '~/screens/AnnouncementScreenEvent';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StackActions} from '@react-navigation/native';
import {useBackHandler} from '~/utils/useBackHandler';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import {setHeaderSDK} from '~/helpers/api';
import {logScreenView} from '~/utils/logGA';
import residentialTenantAction from '~/states/residentialTenant/residentialTenantAction';

const ExitModalContent = ({onConfirm, onCancel}: any) => {
  return (
    <>
      <Text weight="medium">{t('General__Leave_now?', 'Leave now ?')}</Text>
      <Text>
        {t(
          'General__Leave_description',
          'All previous information entered and consent will be lost.',
        )}
      </Text>
      <Spacing height={16} />
      <View className="space-y-3">
        <Button
          color="navy"
          title={t('Drawer__Warning_leave_flow__Leave', 'Leave the signup')}
          onPress={onConfirm}
        />
        <Button
          title={t('General__Cancel', 'Cancel')}
          outlined={true}
          onPress={onCancel}
        />
      </View>
    </>
  );
};

type ProfileInfoScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ProfileInfoScreen'
>;

const ProfileInfoScreen = (props: ProfileInfoScreenProps) => {
  const {
    route: {params},
  } = props;

  const _currentStep = params?.step || 0;
  const {gender, firstName, middleName, lastName, dateOfBirth} =
    useEditInfoState();
  const [_modalState, modalActions] = useModal();
  const navigation = useNavigation();
  const {...methods} = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      gender: gender.value,
      firstName: firstName.value,
      middleName: middleName.value,
      lastName: lastName.value,
    },
  });
  useScreenHook('ProfileInfoScreen', async event => {
    const {name} = event;

    switch (name) {
      case AnnouncementScreenEventNames.CONTINUE:
        if (event.from.params.type === 'error') {
          await editInfoStateAction.clearValue();
          navigation.navigate('HomeScreen');
        }
        break;
      default:
        break;
    }
  });

  const [currentStep] = useState(_currentStep);
  const stepsArray = [
    <EditGenderForm />,
    <EditFirstNameForm currentStep={currentStep} />,
    <EditMiddleNameForm currentStep={currentStep} />,
    <EditLastNameForm currentStep={currentStep} />,
    <EditDateOfBirthForm />,
  ];
  const totalSteps = stepsArray.length;

  const goPrevStep = () => {
    navigation.goBack();
  };

  const goToStep = (step: number) => {
    const popCount = currentStep - step;
    popCount > 0 && navigation.dispatch(StackActions.pop(popCount));
  };

  const goNextStep = () => {
    navigation.dispatch(
      StackActions.push('ProfileInfoScreen', {step: currentStep + 1}),
    );
  };

  const nextStepSkip = async () => {
    methods.clearErrors();
    if (currentStep === 0) {
      methods.setValue('gender', 'prefernottosay');
      editInfoStateAction.updateSelectedGender('prefernottosay');
    } else if (currentStep === 2) {
      methods.setValue('middleName', '');
      editInfoStateAction.updateMiddleName('');
    }
    goNextStep();
  };
  const nextStep: SubmitHandler<FieldValues> = async data => {
    methods.clearErrors();
    let canGoNextStep = true;
    if (currentStep === 0) {
      if (isEmpty(data.gender)) {
        methods.setError('gender', {
          type: 'custom',
          message: t(
            'Signup__Personal_gender__Supporting_text',
            'Please select one option or click on “Skip” button to proceed.',
          ),
        });
        canGoNextStep = false;
        return;
      }
      editInfoStateAction.updateSelectedGender(data.gender);
    } else if (currentStep === 3) {
      editInfoState.dateOfBirtheError.set('');
      editInfoStateAction.updateDateOfBirth(null);
    } else if (currentStep === totalSteps - 1) {
      canGoNextStep = false;
      const validDateOfBirth = editInfoStateAction.validateDateOfBirthError();
      if (
        !isEmpty(firstName.value) &&
        validDateOfBirth &&
        !isEmpty(lastName.value) &&
        !isEmpty(gender.value)
      ) {
        try {
          const response = await signUpStateAction.createAccount({
            firstName: firstName.value as string,
            middleName: middleName.value as string,
            lastName: lastName.value as string,
            gender: gender.value,
            dob: dateOfBirth.value as Date,
          });

          const token = response?.token;
          const refreshToken = response?.refreshToken;

          if (token && refreshToken) {
            await Promise.all([
              authenAction.storeToken(token),
              authenAction.storeRefreshToken(token)
            ])
            setHeaderSDK(token);

            await Promise.all([
              accountAction.getProfile(),
              residentialTenantAction.getTenantId(true),
            ]);
            // TODO Change to 2fa
            editInfoStateAction.clearValue();
            signUpStateAction.resetRegisterData();

            navigation.navigate('SignUpCompleteScreen');
          } else {
            goToErrorAnnouncement();
          }
        } catch (err) {
          console.log(err);

          goToErrorAnnouncement();
        }
      }
    }

    canGoNextStep && goNextStep();
  };

  const goToErrorAnnouncement = () => {
    signUpStateAction.resetRegisterData();

    navigation.navigate('AnnouncementScreen', {
      type: 'error',
      title: t('General__Something_went_wrong', 'Something\nwent wrong'),
      message: t(
        'Announcement__Error_generic__Body',
        'Please wait and try again soon.',
      ),
      buttonText: t('General__Back_to_explore', 'Back to Explore'),
      screenHook: 'ProfileInfoScreen',
    });
  };

  const handleStepPress = (step: React.SetStateAction<number>) => {
    goToStep(step as number);
  };

  useBackHandler(() => {
    onPressBack();
    return true;
  });

  const onPressBack = () => {
    if (currentStep === 0) {
      modalActions.setContent(
        <ExitModalContent
          onConfirm={confirmExit}
          onCancel={() => modalActions.hide()}
        />,
      );
      modalActions.show();
    } else {
      if (currentStep === 4) {
        editInfoState.dateOfBirtheError.set('');
        editInfoStateAction.updateDateOfBirth(null);
      }
      goPrevStep();
    }
  };

  const canPressSkip = () => {
    return currentStep === 2 || currentStep === 0;
  };

  const confirmExit = () => {
    editInfoStateAction.clearValue();
    signUpStateAction.resetRegisterData();
    modalActions.hide();
    navigation.navigate('SignUpScreen');
  };

  useEffect(() => {
    logScreenView('ProfileInfoScreen');
  }, []);

  return (
    <Screen isTheme={true}>
      <Header
        title=""
        onPressLeftAction={onPressBack}
        iconHeight={25}
        iconWidth={25}
        leftAction={currentStep === 0 ? 'close' : 'goBack'}
      />
      <FormProvider {...methods}>
        <ScrollView className="px-[24px] w-full h-full">
          <DynamicStepContainers
            totalSteps={totalSteps}
            currentStep={currentStep}
            handleStepPress={handleStepPress}
          />
          {stepsArray[currentStep]}
        </ScrollView>
        {canPressSkip() ? (
          <View className="w-full h-[48px]">
            <CustomButton onPress={nextStepSkip}>
              <Text className="w-full h-full text-center" weight="medium">
                {t('General__Skip', 'Skip')}
              </Text>
            </CustomButton>
          </View>
        ) : null}
        <StickyButton
          title={t('General__Continue', 'Continue')}
          onPress={methods.handleSubmit(nextStep)}
          rightIcon="next"
        />
      </FormProvider>
    </Screen>
  );
};

export default ProfileInfoScreen;
