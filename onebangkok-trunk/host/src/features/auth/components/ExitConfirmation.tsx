import React from 'react';
import {View} from 'react-native';
import {Spacing, Text} from '~/components/atoms';
import {Button, buttonColorVariant} from '~/components/molecules/Button';
import t from '~/utils/text';

interface ExitConfirmationProps {
  confirmExit: () => void;
  onPressCancel: () => void;
  textButton?: string;
  confirmButtonColor?: keyof typeof buttonColorVariant;
  textDescription?: string;
}

export const ExitConfirmation = (props: ExitConfirmationProps) => {
  const {
    confirmExit,
    onPressCancel,
    textButton = t('General__Back_to_sign_in', 'Back to sign in'),
    confirmButtonColor = 'navy',
    textDescription = t(
      'Drawer__Warning_leave_page__Body',
      'All previous information entered and consent will be lost.',
    ),
  } = props;

  return (
    <>
      <Text weight="medium">{t('General__Leave_now?', 'Leave now ?')}</Text>
      <Text weight="regular" size="B1" color="subtitle-muted">
        {textDescription}
      </Text>
      <Spacing height={16} />
      <View className="space-y-3">
        <Button
          title={textButton}
          color={confirmButtonColor}
          outlined={confirmButtonColor === 'danger'}
          onPress={confirmExit}
        />
        <Button
          title={t('General__Cancel', 'Cancel')}
          color="light-gray"
          outlined={true}
          onPress={onPressCancel}
        />
      </View>
    </>
  );
};
