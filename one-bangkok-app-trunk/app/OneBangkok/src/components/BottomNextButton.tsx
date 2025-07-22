import IconButton from './IconButton';
import {Colors} from '../constants/Colors';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CustomButton from './CustomButton';
import s from '../constants/Styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import t from '../utils/text';
import getTheme from '~/utils/themes/themeUtils';
export enum BottomNextButtonSize {
  Small,
  Big,
}

type Props = {
  size: BottomNextButtonSize;
  enabled: boolean;
  onPress: Function;
  withSkipButton?: boolean;
  onPressSkip?: Function;
  text?: String;
  centerText?: String;
};

export const BottomNextButton = ({
  size,
  enabled,
  onPress,
  withSkipButton,
  onPressSkip,
  text,
  centerText,
}: Props) => {
  const paddingTop = size == BottomNextButtonSize.Small ? 0 : 26.5;
  const insets = useSafeAreaInsets();
  const paddingBottom =
    size == BottomNextButtonSize.Small
      ? 0
      : insets.bottom > 0
      ? insets.bottom + 15
      : 26.5;
  const height =
    size == BottomNextButtonSize.Small ? 44 : paddingTop + paddingBottom + 19;

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={height + (withSkipButton ? 63 : 0)}
      style={[styles.container, {height: height + (withSkipButton ? 63 : 0)}]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {withSkipButton ? (
        <CustomButton onPress={onPressSkip} style={styles.skipButton}>
          <Text
            className={getTheme(
              'flex-shrink-1 font-OneBangkokBETA font-normal text-base text-primary',
            )}>
            {t('General__skip', 'Skip')}
          </Text>
        </CustomButton>
      ) : null}
      <CustomButton
        onPress={() => {
          if (enabled) {
            onPress();
          }
        }}
        disabled={!enabled}>
        <View
          style={[
            styles.view,
            {
              backgroundColor: enabled ? Colors.blue : Colors.black40,
              height: height,
              paddingBottom: paddingBottom,
              paddingTop: paddingTop,
            },
          ]}>
          {centerText != null ? (
            <Text
              style={[
                s.textB1Medium,
                {
                  color: enabled ? Colors.white100 : Colors.black20,
                  flex: 1,
                  textAlign: 'center',
                },
              ]}>
              {centerText}
            </Text>
          ) : (
            <View style={{flexDirection: 'row'}}>
              <Text
                style={[
                  s.textB1Medium,
                  {color: enabled ? Colors.white100 : Colors.black20},
                ]}>
                {text ?? t('General__next', 'Next')}
              </Text>
              <View style={{flex: 1}} />
              <IconButton
                imageSource={require('../../assets/images/icon_next.png')}
                width={20}
                height={20}
                color={enabled ? Colors.white100 : Colors.black20}
              />
            </View>
          )}
        </View>
      </CustomButton>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  view: {
    width: '100%',
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  skipButton: {
    width: 332,
    height: 39,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
});
