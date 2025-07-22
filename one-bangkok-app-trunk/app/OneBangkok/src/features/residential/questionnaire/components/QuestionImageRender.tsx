import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import {TQuestionnaireInlineImage} from '../screens/QuestionnaireDetailScreen';
import {Spacing} from '~/components/atoms';

interface Props {
  inlineImage: TQuestionnaireInlineImage;
}
const QuestionImageRender = ({inlineImage}: Props) => {
  const [aspectRatio, setAspectRatio] = useState(1);
  const [loadImageError, setLoadImageError] = useState(false);

  useEffect(() => {
    if (inlineImage?.s3Url) {
      Image.getSize(
        inlineImage?.s3Url,
        (width, height) => {
          setAspectRatio(width / height);
        },
        _ => {
          setLoadImageError(true);
        },
      );
    }
  }, [inlineImage]);

  return (
    <>
      {inlineImage?.s3Url && !loadImageError && (
        <Image
          source={{uri: inlineImage?.s3Url}}
          style={{width: '100%', aspectRatio}}
          resizeMethod="scale"
          resizeMode="cover"
        />
      )}
      <Spacing height={24} />
    </>
  );
};

export default QuestionImageRender;
