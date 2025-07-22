import {Platform} from 'react-native';
import React from 'react';
import RNModal from 'react-native-modal';
import {hookstate, useHookstate} from '@hookstate/core';
import {useNavigation} from '~/navigations/AppNavigation';

const BACKDROP_OPACITY = Platform.OS === 'ios' ? 0.7 : 0.3;

type ModalState = {
  isVisible: boolean;
  children: React.ReactNode;
  className?: string;
  animationIn?: typeof RNModal.defaultProps.animationIn;
  animationOut?: typeof RNModal.defaultProps.animationOut;
  onBackdropPress?: Function;
  backdropTransitionInTiming?: number;
  backdropTransitionOutTiming?: number;
  animationInTiming?: number;
  animationOutTiming?: number;
  backdropOpacity?: number;
};

const defaultModalState: ModalState = {
  isVisible: false,
  children: null,
  className: 'm-0 flex justify-end',
  animationIn: 'slideInUp',
  animationOut: 'slideOutDown',
  onBackdropPress: undefined,
  backdropTransitionInTiming: undefined,
  backdropTransitionOutTiming: 0,
  animationInTiming: undefined,
  animationOutTiming: undefined,
  backdropOpacity: BACKDROP_OPACITY,
};

const modalState = hookstate<ModalState>({...defaultModalState});

export const modalActions = {
  hide: () => {
    modalState.isVisible.set(false);
  },
  show: () => {
    modalState.isVisible.set(true);
  },
  setContent: (content: ModalState['children']) => {
    modalState.children.set(content);
  },
  setDefaultState: () => {
    modalState.set({...defaultModalState});
  },
  setStates: ({
    className = 'm-0 flex justify-end',
    animationIn = 'slideInUp',
    animationOut = 'slideOutDown',
    onBackdropPress = undefined,
    backdropTransitionInTiming = undefined,
    backdropTransitionOutTiming = 0,
    animationInTiming = undefined,
    animationOutTiming = undefined,
    backdropOpacity = BACKDROP_OPACITY,
  }: Omit<ModalState, 'isVisible' | 'children'>) => {
    modalState.className.set(className);
    modalState.animationIn.set(animationIn);
    modalState.animationOut.set(animationOut);
    modalState.onBackdropPress.set(onBackdropPress);
    modalState.backdropTransitionInTiming.set(backdropTransitionInTiming);
    modalState.backdropTransitionOutTiming.set(backdropTransitionOutTiming);
    modalState.animationInTiming.set(animationInTiming);
    modalState.animationOutTiming.set(animationOutTiming);
    modalState.backdropOpacity.set(backdropOpacity);
  },
};

export const useModal = (): [typeof state, typeof actions] => {
  const state = useHookstate(modalState).get({noproxy: true});
  const actions = React.useMemo(() => modalActions, []);
  return [state, actions];
};

const buildingAccessModal = () => {
  const navigation = useNavigation();
  const [state, actions] = useModal();
  const {
    isVisible,
    className,
    children,
    onBackdropPress,
    backdropTransitionInTiming,
    backdropTransitionOutTiming,
    animationInTiming,
    animationOutTiming,
    backdropOpacity,
  } = state;
  const animationIn =
    state.animationIn as typeof RNModal.defaultProps.animationIn;
  const animationOut =
    state.animationOut as typeof RNModal.defaultProps.animationOut;

  navigation.addListener('blur', () => {
    actions.hide();
  });

  const handleOnBackdropPress = () => {
    actions.hide();
    if (onBackdropPress !== undefined) {
      onBackdropPress();
    }
  };

  return (
    <RNModal
      isVisible={isVisible}
      className={className}
      animationIn={animationIn}
      animationOut={animationOut}
      onBackdropPress={handleOnBackdropPress}
      backdropOpacity={backdropOpacity}
      backdropTransitionInTiming={backdropTransitionInTiming}
      backdropTransitionOutTiming={backdropTransitionOutTiming}
      animationInTiming={animationInTiming}
      animationOutTiming={animationOutTiming}
      onModalHide={() => actions.setDefaultState()}>
      <>{children}</>
    </RNModal>
  );
};

export default buildingAccessModal;
