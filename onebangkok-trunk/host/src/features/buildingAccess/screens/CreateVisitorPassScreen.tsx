import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Header} from '~/components/molecules/Header';
import {Screen} from '~/components/templates/Screen';
import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';
import CreateVPFirstPage from '../components/createVPFirstPage';
import CreateVPSecondPage from '../components/createVPSecondPage';
import {useNavigation} from '~/navigations/AppNavigation';
import {createVisitorPassAction} from '../store';
import CreateVPThirdPage from '../components/createVPThirdPage';
import DynamicStepContainers from '~/components/DynamicStepContainer';
import {logScreenView} from '~/utils/logGA';

const CreateVisitorPassScreen = () => {
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
  const steps = [
    <CreateVPFirstPage onNextStep={nextStep} />,
    <CreateVPSecondPage onNextStep={nextStep} />,
    <CreateVPThirdPage onPreviousStep={previousStep} />,
  ];
  const navigation = useNavigation();
  const onPressLeftAction = () => {
    if (activeStep === 0) {
      createVisitorPassAction.reset();
      navigation.goBack();
    }
    setActiveStep(activeStep - 1);
  };
  useEffect(() => {
    logScreenView('CreateVisitorPassScreen');
  }, []);
  return (
    <Screen>
      <Header
        leftAction="goBack"
        title={t('General__Create_visitor_pass', 'Create visitor pass')}
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

export default CreateVisitorPassScreen;
