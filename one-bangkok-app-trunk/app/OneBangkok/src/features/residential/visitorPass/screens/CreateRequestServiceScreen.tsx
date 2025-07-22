import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Header} from '~/components/molecules/Header';
import {Screen} from '~/components/templates/Screen';
import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';
import {useNavigation} from '~/navigations/AppNavigation';
import DynamicStepContainers from '~/components/DynamicStepContainer';
import CreateRSFirstPage from '../components/createRSFirstPage';
import {createRequestServiceAction} from '../store/requestService';
import CreateRSSecondPage from '../components/createRSSecondPage';
import CreateRSThirdPage from '../components/createRSThirdPage';
import {useBackHandlerChangeState} from '~/utils/useBackHandler';
import CreateRSFourthPage from '../components/createRSFourthPage';
import {logScreenView} from '~/utils/logGA';

const CreateRequestServiceScreen = () => {
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
    <CreateRSFirstPage onNextStep={nextStep} />,
    <CreateRSSecondPage onNextStep={nextStep} />,
    <CreateRSThirdPage onNextStep={nextStep} />,
    <CreateRSFourthPage onPreviousStep={previousStep} />,
  ];
  const navigation = useNavigation();
  const onPressLeftAction = () => {
    if (activeStep === 0) {
      createRequestServiceAction.reset();
      navigation.goBack();
    }
    setActiveStep(activeStep - 1);
  };
  useEffect(() => {
    logScreenView('CreateRequestServiceScreen');
  }, []);
  return (
    <Screen>
      <Header
        leftAction="goBack"
        title={t(
          'Residential__Create_service_request',
          'Create a service request',
        )}
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

export default CreateRequestServiceScreen;
