import React from 'react';
import {View} from 'react-native';
import {Spacing, Text} from '~/components/atoms';
import {Button, buttonColorVariant} from '~/components/molecules/Button';
import t from '~/utils/text';

interface ChangeConfirmationProps {
  confirmExit: () => void;
  onPressCancel: () => void;
  provider: 'email' | 'phone';
  confirmButtonColor?: keyof typeof buttonColorVariant;
}

export const ChangeConfirmation = (props: ChangeConfirmationProps) => {
  const {
    confirmExit,
    onPressCancel,
    provider,
    confirmButtonColor = 'navy',
  } = props;

  let title = '';
  let description = '';

  switch (provider) {
    case 'email':
      title = t(
        'Drawer__Warning_change_email__Header',
        'Confirm changing email?',
      );
      description = t(
        'General__Leave_description',
        'All previous information entered and consent will be lost.',
      );

      break;
    case 'phone':
      title = t(
        'Drawer__Warning_change_number__Header',
        'Confirm changing phone number?',
      );
      description = t(
        'General__Leave_description',
        'All previous information entered and consent will be lost.',
      );
      break;
    default:
      break;
  }

  return (
    <>
      <Text weight="medium">{title}</Text>
      <Text weight="regular" size="B1" color="subtitle-muted">
        {description}
      </Text>
      <Spacing height={16} />
      <View className="space-y-3">
        <Button
          title={t('General__Confirm', 'Confirm')}
          outlined={false}
          onPress={confirmExit}
          color={confirmButtonColor}
        />
        <Button
          title={t('General__Cancel', 'Cancel')}
          outlined={true}
          onPress={onPressCancel}
        />
      </View>
    </>
  );
};
