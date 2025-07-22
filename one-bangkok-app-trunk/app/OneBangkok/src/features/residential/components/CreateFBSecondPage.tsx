import {View, TouchableWithoutFeedback, Image, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import t from '~/utils/text';
import {AnnouncementResidentialScreenEventNames} from '~/screens/AnnouncementResidentialScreenEvent';
import {useScreenHook} from '~/services/EventEmitter';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '~/navigations/AppNavigation';
import {Spacing} from '~/components/atoms';
import DetailCard from './DetailCard';
import TextDetailCard from '../components/AddToMicro/TextDetailCard';

interface Props {
  topic: string;
  description?: string;
  picture?: string;
  onPressEditTopic: () => void;
  onPressEditPicture: () => void;
}

const CreateFBSecondPage = ({
  topic,
  description,
  picture,
  onPressEditPicture,
  onPressEditTopic,
}: Props) => {
  const navigation = useNavigation<StackNavigation>();
  const [imageHeight, setImageHeight] = useState(0);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (picture) {
      Image.getSize(picture, (width, height) => {
        const aspectRatio = height / width;
        setImageHeight(screenWidth * aspectRatio);
      });
    }
  }, [picture]);

  useScreenHook('CreateFeedback', async event => {
    const {name} = event;
    switch (name) {
      case AnnouncementResidentialScreenEventNames.CONTINUE:
        navigation.navigate('FeedbackScreen');
        break;
      default:
        break;
    }
  });

  return (
    <>
      <TouchableWithoutFeedback>
        <View className="flex w-full">
          <Spacing height={32} />
          <DetailCard
            header={t('Residential__Feedback_Detail', 'Feedback Detail')}
            headerRight={t('Residential__Edit', 'Edit')}
            headerRightAction={onPressEditTopic}>
            <>
              <TextDetailCard
                label={t('Residential__Topic', 'Topic')}
                text={topic}
              />
              <Spacing height={24} />
              <TextDetailCard
                label={t(
                  'Residential__Maintenance__Description',
                  'Description',
                )}
                text={description ?? '-'}
              />
            </>
          </DetailCard>

          <View>
            <Spacing height={24} />
            <DetailCard
              header={t('Residential__Picture', 'Picture')}
              headerRight={t('Residential__Edit', 'Edit')}
              headerRightAction={onPressEditPicture}>
              <View>
                {picture && (
                  <Image
                    source={{
                      uri: picture,
                    }}
                    style={{width: '100%', height: imageHeight}}
                    resizeMethod="scale"
                    resizeMode="cover"
                  />
                )}
              </View>
            </DetailCard>
          </View>
          <Spacing height={180} />
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

export default CreateFBSecondPage;
