import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Text} from '~/components/atoms';
import t from '~/utils/text';
import {useModal} from '../../components/ResidentialModal';

type Props = {
  onPressConfirm?: () => void;
  onPressCancel?: () => void;
};

const QuestionnaireConfirmAnswerModal = ({
  onPressConfirm = () => {},
  onPressCancel = () => {},
}: Props) => {
  const [_, modalAction] = useModal();

  const onCancel = () => {
    onPressCancel();
    modalAction.hide();
  };

  return (
    <View
      className="bg-white py-8 px-4 w-full h-fit flex absolute bottom-0"
      style={{gap: 24}}>
      <View>
        <Text size="B1" weight="medium">
          {t(
            'Residential_Questionnaire_Confirm_title',
            'Confirm your questionnaire?',
          )}
        </Text>
        <Text size="B1" weight="regular" color="mist-gray-700">
          {t(
            'Residential_Questionnaire_Confirm_desc',
            'After click confirm your answers are not allowed to change.',
          )}
        </Text>
      </View>
      <View style={{gap: 12}}>
        <TouchableOpacity
          onPress={onPressConfirm}
          className="p-4 border border-dark-teal-light flex-row justify-center">
          <Text size="B1" weight="medium" className="text-dark-teal-light">
            {t('General__Confirm', 'Confirm')}
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

export default QuestionnaireConfirmAnswerModal;
