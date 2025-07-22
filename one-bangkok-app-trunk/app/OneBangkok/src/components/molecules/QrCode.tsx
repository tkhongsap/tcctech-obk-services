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
  onChangeRemainingTime?: (value: number) => void;
}

const Countdown = (props: CountdownProps) => {
  const {
    initialCountdown,
    generateTime,
    onCountdownEnd,
    onChangeRemainingTime,
  } = props;
  const TIME_INTERVAL = 1000;
  const [countdown, setCountdown] = useState(initialCountdown);
  const intervalIdRef = useRef<number | null>(null);

  const handleCountdown = useCallback(() => {
    const now = dayjs().unix();
    const remainingTime = initialCountdown - (now - generateTime);
    setCountdown(remainingTime);
    onChangeRemainingTime && onChangeRemainingTime(remainingTime);

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
    <View className="flex flex-row items-center" style={{gap: 8}}>
      <Text size="C1" color={countdown > 0 ? 'dark-gray' : 'default'}>
        {t('General__Refresh', 'Refresh')}
      </Text>
      <Text
        size="C1"
        weight="bold"
        color={countdown > 0 ? 'dark-gray' : 'default'}>
        {DateTime.formatSeconds(countdown > 0 ? countdown : 0).toString()}
      </Text>
    </View>
  );
};

const QRCodeWidget = (props: QRCodeWidgetProps) => {
  const {
    description,
    value,
    onRegenerate,
    initialCountdown = 0,
    generateTime = 0,
  } = props;
  const showBottom = onRegenerate || initialCountdown;
  const [remainingTime, setRemainingTime] = useState(
    initialCountdown - (dayjs().unix() - generateTime),
  );
  return (
    <View className="flex items-center">
      {description && (
        <>
          <Text size="B1" color="dark-gray" className="text-center w-[90%]">
            {description}
          </Text>
          <Spacing height={20} />
        </>
      )}
      <QRCode size={250} value={value} />
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

            <Countdown
              initialCountdown={initialCountdown}
              generateTime={generateTime}
              onCountdownEnd={onRegenerate}
              onChangeRemainingTime={setRemainingTime}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default QRCodeWidget;
