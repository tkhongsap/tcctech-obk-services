import React, {useState, useEffect} from 'react';
import {KeyboardAvoidingView, Platform, Keyboard} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Button, ButtonProps} from '~/components/molecules/Button';

export interface StickyButtonProps extends ButtonProps {}

const defaultProps: Omit<StickyButtonProps, 'title'> = {
  ...Button.defaultProps,
  color: 'navy',
  rightIconColor: '#EFEFEF',
  iconColor: '#EFEFEF',
  iconHeight: 28,
  iconWidth: 28,
};

export const StickyButton = (props: StickyButtonProps) => {
  const [bottomSafeArea, setBottomSafeArea] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setBottomSafeArea(insets.bottom);
  }, [insets.bottom]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardWillShow', () => {
      Platform.OS === 'ios' && setBottomSafeArea(0);
    });
    const didShowSubscription = Keyboard.addListener('keyboardDidShow', () => {
      Platform.OS === 'android' && setBottomSafeArea(0);
    });
    const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
      Platform.OS === 'ios' && setBottomSafeArea(insets.bottom);
    });
    const didHideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      Platform.OS === 'android' && setBottomSafeArea(insets.bottom);
    });

    return () => {
      showSubscription.remove();
      didShowSubscription.remove();
      hideSubscription.remove();
      didHideSubscription.remove();
    };
  }, [insets.bottom, setBottomSafeArea]);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="w-full">
        <Button {...props} rounded={false} safeArea={bottomSafeArea} />
      </KeyboardAvoidingView>
    </>
  );
};

StickyButton.defaultProps = defaultProps;
