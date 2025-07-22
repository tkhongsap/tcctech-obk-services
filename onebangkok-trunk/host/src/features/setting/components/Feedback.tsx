import React from 'react';
import t from '~/utils/text';
import {Spacing, Text} from '~/components/atoms';
import {View} from 'react-native';
import getTheme from '~/utils/themes/themeUtils';
import {IconButton} from '~/components/molecules';

interface FeedbackProps {
  like: boolean | undefined;
  onPress: (value: boolean) => void;
}

const Feedback = ({like, onPress}: FeedbackProps) => {
  const onPressLike = () => {
    onPress(true);
  };
  const onPressDisLike = () => {
    onPress(false);
  };
  const noFeedback = like === undefined;
  return (
    <View className={getTheme('bg-muted-50 rounded px-2')}>
      <Spacing height={12} />
      <View className="flex flex-row justify-between items-center">
        <Text>{t('Settings__Faqs_answer__Body', 'Was this helpful?')}</Text>
        <View className="flex flex-row">
          <Spacing width={12} />
          <IconButton
            type={like ? 'likePressed' : 'like'}
            onPress={onPressLike}
          />
          <Spacing width={12} />
          <IconButton
            type={like || noFeedback ? 'dislike' : 'dislikePressed'}
            onPress={onPressDisLike}
          />
          <Spacing width={12} />
        </View>
      </View>

      <Spacing height={12} />
    </View>
  );
};

export default Feedback;
