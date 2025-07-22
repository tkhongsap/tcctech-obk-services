import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {useModal} from './ResidentialModal';
import {Text} from '~/components/atoms';
import t from '~/utils/text';

type Props = {
  title: string;
  description: string;
  onPressDelete?: () => void;
  onPressCancel?: () => void;
};

const ConfirmDeleteModal: React.FC<Props> = ({
  title,
  description,
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
      <View>
        <Text size="B1" weight="medium">
          {title}
        </Text>
        <Text size="B1" weight="regular" color="mist-gray-700">
          {description}
        </Text>
      </View>
      <View style={{gap: 12}}>
        <TouchableOpacity
          className="p-4 border border-fire-engine-red-dark flex-row justify-center"
          onPress={onDelete}>
          <Text size="B1" weight="medium" color="fire-engine-red">
            {t('Residential__Home_Automation__Delete', 'Delete')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onPressCancel && onPressCancel();
            modalAction.hide();
          }}
          className="p-4 border border-navy-dark flex-row justify-center">
          <Text size="B1" weight="medium" className="text-navy-dark">
            {t('Residential__Home_Automation__Cancel', 'Cancel')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConfirmDeleteModal;
