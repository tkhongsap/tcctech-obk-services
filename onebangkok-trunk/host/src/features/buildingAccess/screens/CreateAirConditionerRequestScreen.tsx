import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Header} from '~/components/molecules/Header';
import {Screen} from '~/components/templates/Screen';
import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';
import {useNavigation} from '~/navigations/AppNavigation';
import DynamicStepContainers from '~/components/DynamicStepContainer';
import CreateACFirstPage from '../components/createACFirstPage';
import CreateACSecondPage from '../components/createACSecondPage';
import {useBackHandlerChangeState} from '~/utils/useBackHandler';
import {createAirConditionerRequestAction} from '../store/airConditionerRequest';
import CreateACThirdPage from '../components/createACThirdPage';
import {logScreenView} from '~/utils/logGA';

const CreateAirConditionerRequestScreen = () => {
  const [activeStep, setActiveStep] = useState(0);
  const previousStep = (step: number) => {
    // for testing
    const backToStep = activeStep - 1 >= steps.length ? 0 : activeStep - step;
    setActiveStep(backToStep);
  };
  const nextStep = () => {
    // for testing
    const step = activeStep + 1 >= steps.length ? 0 : activeStep + 1;
    setActiveStep(step);
  };
  useBackHandlerChangeState(() => {
    onPressLeftAction();
    return true;
  });
  const steps = [
    <CreateACFirstPage onNextStep={nextStep} />,
    <CreateACSecondPage onNextStep={nextStep} />,
    <CreateACThirdPage onPreviousStep={previousStep} />,
  ];
  const navigation = useNavigation();
  const onPressLeftAction = () => {
    if (activeStep === 0) {
      createAirConditionerRequestAction.reset();
      navigation.goBack();
    }
    setActiveStep(activeStep - 1);
  };
  useEffect(() => {
    logScreenView('CreateAirConditionerRequestScreen');
  }, []);
  return (
    <Screen>
      <Header
        leftAction="goBack"
        title={t('Otac__Create_1__Header', 'Create air conditioner request')}
        onPressLeftAction={onPressLeftAction}
      />
      <View className={getTheme('flex flex-row w-screen h-[40px] bg-default')}>
        <View className={'px-[16px] w-full'}>
          <DynamicStepContainers
            totalSteps={steps.length}
            currentStep={activeStep}
            handleStepPress={() => {}}
          />
        </View>
      </View>
      {steps[activeStep]}
    </Screen>
  );
};

export default CreateAirConditionerRequestScreen;
