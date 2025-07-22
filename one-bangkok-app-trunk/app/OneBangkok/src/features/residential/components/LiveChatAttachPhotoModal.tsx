import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {useModal} from './ResidentialModal';
import {Text} from '~/components/atoms';
import t from '~/utils/text';

type Props = {
  onPressCancel?: () => void;
  onPressTakePhoto: () => void;
  onPressChooseFromLibrary: () => void;
};

const LiveChatAttachPhotoModal: React.FC<Props> = ({
  onPressCancel,
  onPressTakePhoto,
  onPressChooseFromLibrary,
}) => {
  const [_, modalAction] = useModal();

  const onCancel = () => {
    onPressCancel && onPressCancel();
    modalAction.hide();
  };

  const onTakePhoto = () => {
    onPressTakePhoto && onPressTakePhoto();
    modalAction.hide();
  };

  const onChooseFromLibrary = () => {
    onPressChooseFromLibrary && onPressChooseFromLibrary();
    modalAction.hide();
  };

  return (
    <View
      className="bg-white py-12 px-4 w-full h-fit flex absolute bottom-0"
      style={{gap: 24}}>
      <View style={{gap: 12}}>
        <TouchableOpacity
          onPress={onTakePhoto}
          className="p-4 border border-navy-dark flex-row justify-center">
          <Text size="B1" weight="medium" className="text-dark-teal-dark">
            {t('Residential__LiveChat__Take_a_photo', 'Take a photo')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onChooseFromLibrary}
          className="p-4 border border-navy-dark flex-row justify-center">
          <Text size="B1" weight="medium" className="text-dark-teal-dark">
            {t(
              'Residential__LiveChat__Choose_from_library',
              'Choose from library',
            )}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-4 border border-fire-engine-red-dark flex-row justify-center"
          onPress={onCancel}>
          <Text size="B1" weight="medium" color="fire-engine-red">
            {t('General__Cancel', 'Cancel')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LiveChatAttachPhotoModal;
