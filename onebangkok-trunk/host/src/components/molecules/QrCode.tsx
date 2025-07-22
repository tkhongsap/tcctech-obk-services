import React, {useEffect, useState, useRef, useCallback} from 'react';
import {View, AppState} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {Text} from '../atoms/Text';
import {Spacing} from '../atoms';
import {IconButton} from './IconButton';
import DateTime from '~/utils/datetime';
import dayjs from 'dayjs';
import t from '~/utils/text';

interface QRCodeWidgetProps {
  description?: string;
  value: string;
  onRegenerate?: Function;
  initialCountdown?: number;
  generateTime?: number;
}

interface CountdownProps {
  initialCountdown: number;
  generateTime: number;
  onCountdownEnd?: Function;
}

const Countdown = (props: CountdownProps) => {
  const {initialCountdown, generateTime, onCountdownEnd} = props;
  const TIME_INTERVAL = 1000;
  const [countdown, setCountdown] = useState(initialCountdown);
  const intervalIdRef = useRef<number | null>(null);

  const handleCountdown = useCallback(() => {
    const now = dayjs().unix();
    const remainingTime = initialCountdown - (now - generateTime);
    setCountdown(remainingTime);

    if (remainingTime <= 0 && onCountdownEnd) {
      onCountdownEnd();
      clearInterval(intervalIdRef.current!);
    }
  }, [generateTime, initialCountdown, onCountdownEnd]);

  useEffect(() => {
    handleCountdown();
    intervalIdRef.current = setInterval(handleCountdown, TIME_INTERVAL);

    const appState = {
      current: AppState.currentState,
    };

    const appStateVisible = (nextAppState: string) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        handleCountdown();
        intervalIdRef.current = setInterval(handleCountdown, TIME_INTERVAL);
      } else {
        clearInterval(intervalIdRef.current!);
      }

      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', appStateVisible);

    return () => {
      subscription.remove();
      clearInterval(intervalIdRef.current!);
    };
  }, [initialCountdown, generateTime, onCountdownEnd, handleCountdown]);

  return (
    <>
      {countdown > 0 && (
        <Text size="B2" color="muted">
          {t('General__Refresh', 'Refresh')}
          {DateTime.formatSeconds(countdown).toString()}
        </Text>
      )}
    </>
  );
};

const QRCodeWidget = (props: QRCodeWidgetProps) => {
  const {description, value, onRegenerate, initialCountdown, generateTime} =
    props;
  const showBottom = onRegenerate || initialCountdown;
  return (
    <>
      <View className="flex items-center">
        {description && (
          <>
            <Text size="B2" color="muted">
              {description}
            </Text>
            <Spacing height={20} />
          </>
        )}
        <QRCode size={200} value={value} />
        {showBottom && (
          <>
            <Spacing height={20} />
            <View className="bg-transparent flex flex-row justify-between items-center mb-10">
              {onRegenerate && (
                <IconButton
                  type="refreshIcon"
                  onPress={() => {
                    onRegenerate();
                  }}
                  color="white"
                />
              )}
              {initialCountdown && generateTime && (
                <Countdown
                  initialCountdown={initialCountdown}
                  generateTime={generateTime}
                  onCountdownEnd={onRegenerate}
                />
              )}
            </View>
          </>
        )}
      </View>
    </>
  );
};

export default QRCodeWidget;
