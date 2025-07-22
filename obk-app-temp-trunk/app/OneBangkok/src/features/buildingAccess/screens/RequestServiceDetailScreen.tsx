import {View, ScrollView, TouchableWithoutFeedback, Image} from 'react-native';
import React, {useState} from 'react';
import {Screen} from '~/components/templates';
import {Button, HeadText, Header, useModal} from '~/components/molecules';
import t from '~/utils/text';
import {RootStackParamList, useNavigation} from '~/navigations/AppNavigation';
import {Spacing, Text} from '~/components/atoms';
import DetailCard from '../components/DetailCard';
import TextDetailCard from '../components/TextDetailCard';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {classNameStatus, statusText} from '../constants/buildingAccess';
import {useHookstate} from '@hookstate/core';
import appLanguageState from '~/states/appLanguage/appLanguageState';
import {ModalContactOurSupport} from '~/components/organisms/GenericModal';
import {isEmpty} from 'lodash';
import FastImage from 'react-native-fast-image';
import { ServiceRequestStatus } from 'ob-bms-sdk/dist/api';

const ContactOurSupportus = ({
  status,
  onPressButton,
}: {
  status: string;
  onPressButton: () => void;
}) => {
  if (status !== 'done') {
    return (
      <>
        <DetailCard
          header={t(
            'Service__Ticket_detail__Change_title',
            'Changed your mind?',
          )}>
          <>
            <TextDetailCard
              text={t(
                'Service__Ticket_detail__Change_description',
                'Please get in touch with the operations team in order to cancel your request.',
              )}
            />
            <Spacing height={24} />
            <Button
              title={t('General__Contact_our_support', 'Contact our support')}
              onPress={() => onPressButton()}
            />
          </>
        </DetailCard>
      </>
    );
  }
  return <View />;
};
const RenderImage = ({
  imageUrl,
  isGetImageError,
  setIsGetImageError,
}: {
  imageUrl: string;
  isGetImageError: boolean;
  setIsGetImageError: any;
}) => {
  if (!isEmpty(imageUrl) && !isGetImageError) {
    return (
      <>
        <Spacing height={32} />
        <FastImage
          source={{
            uri: imageUrl,
            priority: FastImage.priority.normal,
          }}
          className="h-[262px] items-end pr-1 pt-2"
          style={{backgroundColor: '#EFEFEF'}}
          resizeMode={FastImage.resizeMode.contain}
          onError={() => setIsGetImageError(true)}
        />
      </>
    );
  }
  return <View />;
};
type Props = NativeStackScreenProps<
  RootStackParamList,
  'RequestServiceDetailScreen'
>;

const RequestServiceDetailScreen = ({
  route: {
    params: {data},
  },
}: Props) => {
  const navigation = useNavigation();
  const state = useHookstate(appLanguageState);
  const languageSelected =
    state.currentLanguage.get() !== '' ? state.currentLanguage.get() : 'en';
  const [_modalState, modalActions] = useModal();

  const ModalActionContactOurSupport = () => {
    modalActions.setContent(
      <ModalContactOurSupport onPressCancel={() => modalActions.hide()} />,
    );
    modalActions.show();
  };

  const [isGetImageError, setIsGetImageError] = useState(false);
  const mapStatusText = () => {
    switch (data.status) {
      case ServiceRequestStatus.Submitted:
        return t('General__Submitted', 'Submitted');
      case ServiceRequestStatus.InProgress:
        return t('General__In_progress', 'In progress');
      case ServiceRequestStatus.Done:
        return t('General__Done', 'Done');
    }
  };
  return (
    <Screen>
      <Header
        leftAction="goBack"
        onPressLeftAction={() => navigation.goBack()}
        title={t('General__Ticket_details', 'Ticket Details')}
      />
      <ScrollView className="w-screen px-4 py-8">
        <TouchableWithoutFeedback>
          <View>
            <View className="flex-row justify-between items-start">
              <View className="w-9/12">
                <HeadText
                  tagline={t('General__Ticket', 'Ticket')}
                  title={data.references}
                  titleSize="H3"
                  titleClamps="leading-[26.4]"
                />
              </View>
              <View className={`p-[8px] ${classNameStatus[data.status]}`}>
                <Text size="C1">{mapStatusText()}</Text>
              </View>
            </View>
            <RenderImage
              imageUrl={data?.image_url[0]}
              isGetImageError={isGetImageError}
              setIsGetImageError={setIsGetImageError}
            />
            <Spacing height={32} />
            <DetailCard header={t('General__Location', 'Location')}>
              <>
                <Spacing height={12} />
                <TextDetailCard
                  label={t('General__Building', 'Building')}
                  text={data.tower.display_name[languageSelected]}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Floor', 'Floor')}
                  text={
                    data.floor.display_name[languageSelected] ?? data.floor.name
                  }
                />
              </>
            </DetailCard>
            <Spacing height={24} />
            <DetailCard header={t('General__Issue', 'Issue')}>
              <>
                <TextDetailCard
                  label={t('General__Issue_type', 'Issue type')}
                  text={
                    data.issue_type.display_name[languageSelected] ??
                    data.issue_type.name
                  }
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Title', 'Title')}
                  text={data.title}
                />
                <Spacing height={24} />
                <TextDetailCard
                  label={t('General__Description', 'Description')}
                  text={data.description}
                />
              </>
            </DetailCard>
            <Spacing height={24} />
            <ContactOurSupportus
              status={data.status}
              onPressButton={ModalActionContactOurSupport}
            />
            <Spacing height={80} />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </Screen>
  );
};

export default RequestServiceDetailScreen;
