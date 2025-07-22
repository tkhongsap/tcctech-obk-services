import React, {useEffect} from 'react';
import {DimensionValue, Platform, View} from 'react-native';
import RNModal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {hookstate, useHookstate} from '@hookstate/core';
import {useNavigation} from '~/navigations/AppNavigation';

const BLACKDROP_OPACITY = Platform.OS === 'ios' ? 0.7 : 0.3;

export interface ModalProps {
  isVisible: boolean;
  children: React.ReactNode;
  maxHeight?: DimensionValue | undefined;
  onBackdropPress?: () => void | undefined;
}

const defaultModalProps: ModalProps = {
  isVisible: false,
  children: null,
  onBackdropPress: undefined,
};

const modalState = hookstate<ModalProps>(defaultModalProps);

export const modalActions = {
  set: (props: ModalProps) => {
    modalState.set(p => {
      p.isVisible = props.isVisible;
      p.children = props.children;
      p.onBackdropPress = props.onBackdropPress;
      return p;
    });
  },
  show: (): void => {
    modalState.isVisible.set(true);
  },
  hide: (): void => {
    modalState.isVisible.set(false);
  },
  setContent: (content: ModalProps['children']) => {
    modalState.children.set(content);
  },
  setOnBackdropPress: (onBackdropPress: ModalProps['onBackdropPress']) => {
    modalState.onBackdropPress.set(onBackdropPress);
  },
  setMaxHeight: (maxHeight: DimensionValue | undefined) => {
    modalState.maxHeight.set(maxHeight);
  },
};

export const useModal = (): [typeof modalHooks, typeof modalActions] => {
  const modalHooks = useHookstate(modalState).get({noproxy: true});
  const memorizedModalActions = React.useMemo(() => modalActions, []);
  return [modalHooks, memorizedModalActions];
};

export const Modal = (props: ModalProps) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [state, actions] = useModal();

  useEffect(() => {
    actions.set(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  navigation.addListener('blur', () => {
    actions.hide();
  });

  const {isVisible, children, onBackdropPress, maxHeight} = state;

  const handleOnBackdropPress = () => {
    actions.hide();
    onBackdropPress && onBackdropPress();
  };

  return (
    <RNModal
      isVisible={isVisible}
      animationIn={'slideInUp'}
      animationOut={'fadeOutDown'}
      className="m-0 flex justify-end"
      backdropOpacity={BLACKDROP_OPACITY}
      backdropTransitionOutTiming={0}
      onBackdropPress={handleOnBackdropPress}>
      <View
        className="bg-white rounded"
        style={[
          {
            paddingBottom: insets.bottom,
            maxHeight: maxHeight,
          },
        ]}>
        <View className="px-7 py-6 ">{children}</View>
      </View>
    </RNModal>
  );
};

Modal.defaultProps = defaultModalProps;
