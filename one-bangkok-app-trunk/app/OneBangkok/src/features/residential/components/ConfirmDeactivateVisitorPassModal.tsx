import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {useModal} from './ResidentialModal';
import {Text} from '~/components/atoms';
import t from '~/utils/text';

type Props = {
  onPressDelete?: () => void;
  onPressCancel?: () => void;
};

const ConfirmDeactivateVisitorPassModal: React.FC<Props> = ({
  onPressDelete,
  onPressCancel,
}) => {
  const [_, modalAction] = useModal();

  const onDelete = () => {
    onPressDelete && onPressDelete();
    modalAction.hide();
  };

  return (
    <View
      className="bg-white py-6 px-4 w-full h-fit flex absolute bottom-0"
      style={{gap: 24}}>
      <View style={{gap: 12}}>
        <TouchableOpacity
          className="p-4 border border-fire-engine-red-dark flex-row justify-center"
          onPress={onDelete}>
          <Text size="B1" weight="medium" color="fire-engine-red">
            {t('Residential__Delete_visitor_pass_modal', 'Confirm Deactivation')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onPressCancel && onPressCancel();
            modalAction.hide();
          }}
          className="p-4 border border-dark-teal-light flex-row justify-center">
          <Text size="B1" weight="medium" className="text-dark-teal-light">
            {t('Residential__Home_Automation__Cancel', 'Cancel')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConfirmDeactivateVisitorPassModal;
