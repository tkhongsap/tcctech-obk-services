import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Spacing, Text} from '~/components/atoms';
import {Button, buttonColorVariant} from '~/components/molecules';
import t from '~/utils/text';

interface ConfirmationProps {
  title: string;
  description: string;
  textConfirmButton?: string;
  textCancelButton?: string;
  onContinue: any;
  onCancel: any;
  ConfirmButtonOutlined?: boolean;
  CancelButtonOutlined?: boolean;
  ConfirmButtonColor?: keyof typeof buttonColorVariant;
  CancelButtonColor?: keyof typeof buttonColorVariant;
}

export const CarParkConfirmationModal = (props: ConfirmationProps) => {
  const {
    title,
    description,
    textConfirmButton = t('General__Confirm', 'Confirm'),
    textCancelButton = t('General__Cancel', 'Cancel'),
    onContinue,
    onCancel,
    ConfirmButtonOutlined,
    CancelButtonOutlined = true,
    ConfirmButtonColor = 'navy',
    CancelButtonColor = 'light-gray',
  } = props;
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-white rounded"
      style={[
        {
          paddingBottom: insets.bottom,
          //   maxHeight: maxHeight,
        },
      ]}>
      <View className="px-7 py-6 ">
        <Text size="B1" weight="medium">
          {title}
        </Text>
        <Text color="subtitle-muted" size="B2">
          {description}
        </Text>
        <Spacing height={16} />
        <View>
          {textConfirmButton && (
            <>
              <Button
                title={textConfirmButton}
                color={ConfirmButtonColor}
                outlined={ConfirmButtonOutlined}
                onPress={onContinue}
              />
              <Spacing height={10} />
            </>
          )}
          <Button
            title={textCancelButton}
            color={CancelButtonColor}
            outlined={CancelButtonOutlined}
            onPress={onCancel}
          />
          <Spacing height={16} />
        </View>
      </View>
    </View>
  );
};
