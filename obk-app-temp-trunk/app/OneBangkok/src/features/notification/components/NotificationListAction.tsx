import React, {TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Text} from '~/components/atoms';

export interface NotificationActionProps {
  leftActionTitle: string;
  rightActionTitle: string;
  leftAction: Function;
  rightAction: Function;
}

const NotificationListAction = (props: NotificationActionProps) => {
  const {leftActionTitle, rightActionTitle, leftAction, rightAction} = props;
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute bottom-0 left-0 right-0 bg-white flex flex-row justify-between"
      style={{paddingBottom: insets.bottom}}>
      <TouchableOpacity
        className="p-4 items-center"
        onPress={() => {
          if (leftAction) {
            leftAction();
          }
        }}>
        <Text weight="regular" size="B2" color="error">
          {leftActionTitle}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="p-4 items-center"
        onPress={() => {
          if (rightAction) {
            rightAction();
          }
        }}>
        <Text weight="regular" size="B2" color="primary">
          {rightActionTitle}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotificationListAction;
