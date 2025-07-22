import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Text} from '~/components/atoms';
import {useModal} from '~/features/residential/components/ResidentialModal';
import t from '~/utils/text';

type Props = {
  onConfirm: () => void;
  onCancel?: () => void;
};

const ConfirmChangingDefaultModal = ({onConfirm, onCancel}: Props) => {
  const [_, modalAction] = useModal();

  const onPressConfirm = () => {
    onConfirm();
    modalAction.hide();
  };

  const onPressCancel = () => {
    onCancel && onCancel();
    modalAction.hide();
  };

  return (
    <View
      className="bg-white py-6 px-4 w-full h-fit flex absolute bottom-0"
      style={{gap: 24}}>
      <View
        className="w-full bg-white mb-6 max-h-[80vh] overflow-y-scroll"
        style={{gap: 12}}>
        <View className="mb-[12px]">
          <Text weight="medium">
            {t(
              'Residential__Change_default_unit__Confirm_title',
              'Confirm changing your default residence?',
            )}
          </Text>
          <Text color="subtitle-muted">
            {t(
              'Residential__Change_default_unit__Confirm_content',
              'Your default residence will be changed to “Building Name, Unit Number',
            )}
          </Text>
        </View>
        <TouchableOpacity
          className="p-[16px] flex justify-center items-center bg-navy-light border-[1px]"
          onPress={onPressConfirm}>
          <Text weight="medium" color="white">
            {t('General__Confirm', 'Confirm')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-[16px] flex flex-row items-center justify-center border-navy-light border-[1px]"
          onPress={onPressCancel}>
          <Text weight="medium" color="navy">
            {t('General__Cancel', 'Cancel')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConfirmChangingDefaultModal;
