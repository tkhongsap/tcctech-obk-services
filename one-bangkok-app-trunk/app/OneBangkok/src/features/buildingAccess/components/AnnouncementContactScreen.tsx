import React from 'react';
import {Screen} from '~/components/templates';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '~/navigations/AppNavigation';
import AnnouncementContact from '~/components/AnnouncementContact';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AnnouncementContactScreen'
>;

const AnnouncementContactScreen = (props: Props) => {
  const {
    route: {
      params: {
        titleHeadText,
        titleHead,
        tagline,
        titleContent,
        messageContent,
        type,
      },
    },
  } = props;

  return (
    <Screen>
      <AnnouncementContact
        title={titleContent}
        message={messageContent}
        type={type}
        titleHeadText={titleHeadText}
        titleHead={titleHead}
        tagline={tagline}
      />
    </Screen>
  );
};

export default AnnouncementContactScreen;
