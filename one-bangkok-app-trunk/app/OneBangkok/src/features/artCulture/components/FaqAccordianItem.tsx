import React, {useState} from 'react';
import {Dimensions, Pressable, StyleSheet, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Icon, Text, textWeightVariantTextEditor} from '~/components/atoms';
import clsx from 'clsx';
import RenderHTML from 'react-native-render-html';
import {
  HTMLRenderTextClassStyles,
  HTMLRenderTextTagsStyles,
  replaceTextHtml,
} from '~/features/sustainability/components/HtmlRenderTextClassStyles';

export interface FaqItem {
  id: number;
  orderNo: number;
  isPublished: boolean;
  faqTranslation: FaqTranslation[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FaqTranslation {
  id: number;
  faqId: number;
  locale: string;
  question: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FaqDisplayItem {
  id: number;
  order: number;
  faqTranslation: FaqTranslation;
}

interface IFaqAccordionItem {
  item?: FaqDisplayItem;
}

const FaqAccordionItem = ({item}: IFaqAccordionItem) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const height = useSharedValue(0);
  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded) + 68, {
      duration: 50,
    }),
  );

  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  return (
    <Animated.View style={[styles.accItem, bodyStyle]}>
      <View
        className="w-full"
        onLayout={e => {
          height.value = e.nativeEvent.layout.height;
        }}>
        <Pressable
          className="flex flex-row w-full items-center justify-between"
          onPress={() => setIsExpanded(!isExpanded)}>
          <Text className="font-obMedium">
            {item?.faqTranslation.question || ''}
          </Text>

          <Icon
            type="arrowDownIcon"
            width={16}
            height={16}
            rotation={isExpanded ? 180 : 0}
            color="#000000"
          />
        </Pressable>

        <View className={clsx([isExpanded ? 'pt-6' : 'hidden'])}>
          <RenderHTML
            classesStyles={HTMLRenderTextClassStyles}
            tagsStyles={HTMLRenderTextTagsStyles}
            contentWidth={Dimensions.get('window').width - 48}
            source={{
              html:
                item && item.faqTranslation.answer
                  ? replaceTextHtml(item.faqTranslation.answer + '')
                  : '',
            }}
            systemFonts={Object.values(textWeightVariantTextEditor)}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  accItem: {
    backgroundColor: '#EFEFEF',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 8,
    borderRadius: 4,
  },
});

export default FaqAccordionItem;
