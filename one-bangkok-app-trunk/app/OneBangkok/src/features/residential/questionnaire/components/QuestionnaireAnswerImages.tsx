import React, {Fragment, useEffect, useState} from 'react';
import {Image, View} from 'react-native';
import {Spacing, Text} from '~/components/atoms';
import {
  TQuestionnaireImage,
  TQuestionnaireQuestion,
} from '../screens/QuestionnaireDetailScreen';

interface Props {
  question: TQuestionnaireQuestion;
}
const QuestionnaireAnswerImages = ({question}: Props) => {
  // question.question = '';
  return (
    <View className="px-4 pb-4">
      {question.question != '' && question.question && (
        <Text
          weight="medium"
          color="default"
          size="B1"
          numberOfLines={2}
          className="max-w-[310px]">
          {question.question}
        </Text>
      )}
      {question.images !== null &&
        question.images.map(image => (
          <Fragment key={image.id}>
            <Spacing height={12} />
            <QuestionnaireAnswerImage image={image} />
          </Fragment>
        ))}
    </View>
  );
};

export default QuestionnaireAnswerImages;

interface QuestionnaireAnswerImageProps {
  image: TQuestionnaireImage;
}
const QuestionnaireAnswerImage = ({image}: QuestionnaireAnswerImageProps) => {
  const [aspectRatio, setAspectRatio] = useState(1);
  const [loadImageError, setLoadImageError] = useState(false);

  useEffect(() => {
    if (image.url) {
      Image.getSize(
        image.url,
        (width, height) => {
          setAspectRatio(width / height);
        },
        _ => {
          setLoadImageError(true);
        },
      );
    }
  }, [image]);

  return (
    image.url &&
    !loadImageError && (
      <Image
        source={{uri: image.url}}
        style={{width: '100%', aspectRatio}}
        resizeMethod="scale"
        resizeMode="cover"
      />
    )
  );
};
