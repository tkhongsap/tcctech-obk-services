/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import React, {useEffect, useState} from 'react';
import {StatusBar, View} from 'react-native';
import {Header} from '~/components/molecules/Header';
import {Screen} from '~/components/templates/Screen';
import t from '~/utils/text';
import getTheme from '~/utils/themes/themeUtils';
import {useNavigation} from '~/navigations/AppNavigation';
import {createVisitorPassAction} from '../store';
import DynamicStepContainers from '../../components/DynamicStepContainer';
import ResidentialCreateVPSecondPage from '../components/ResidentialCreateVPSecondPage';
import ResidentialCreateVPThirdPage from '../components/ResidentialCreateVPThirdPage';
import ResidentialCreateVPFirstPage from '../components/ResidentialCreateVPFirstPage';

type Props = {
  isRectivate?: boolean;
};

const ResidentialCreateVisitorPassScreen = (isRectivate: Props) => {
  const navigation = useNavigation();
  const [activeStep, setActiveStep] = useState(0);
  const [isEdit, setIsEdit] = useState(!isRectivate);

  const previousStep = (step: number) => {
    setIsEdit(true);
    const backToStep = activeStep - 1 >= steps.length ? 0 : activeStep - step;
    setActiveStep(backToStep);
  };

  const nextStep = () => {
    const step = activeStep + 1 >= steps.length ? 0 : activeStep + 1;
    setActiveStep(step);
  };

  const steps = [
    <ResidentialCreateVPFirstPage
      onNextStep={nextStep}
      key="0"
      isEdit={isEdit}
    />,
    <ResidentialCreateVPSecondPage
      onNextStep={nextStep}
      key="1"
      isEdit={isEdit}
    />,
    <ResidentialCreateVPThirdPage onPreviousStep={previousStep} key="2" />,
  ];

  const onPressLeftAction = () => {
    if (activeStep === 0) {
      createVisitorPassAction.reset();
      navigation.goBack();
    }
    setActiveStep(activeStep - 1);
  };

  return (
    <Screen>
      <StatusBar barStyle="dark-content" />
      <Header
        leftAction="goBack"
        title={t(
          'Residential__Visitor_management__Create_visitor_pass',
          'Create Guest Pass',
        )}
        onPressLeftAction={onPressLeftAction}
      />
      <View className={getTheme('flex flex-row w-screen h-[40px] bg-default')}>
        <View className="px-[16px] w-full">
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

export default ResidentialCreateVisitorPassScreen;
